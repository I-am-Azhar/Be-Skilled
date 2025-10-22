import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category')
    const tags = searchParams.get('tags')?.split(',') || []
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'relevance'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    let coursesQuery = supabase
      .from('courses')
      .select(`
        id,
        title,
        subtitle,
        price,
        discount_price,
        thumbnail_url,
        created_at,
        view_count,
        purchase_count,
        category:category_id (
          id,
          name,
          slug
        ),
        tags:course_tag_assignments (
          tag:course_tags (
            id,
            name,
            slug,
            color
          )
        )
      `)
      .eq('is_active', true)

    // Apply search query
    if (query.trim()) {
      // Use full-text search
      coursesQuery = coursesQuery.textSearch('search_vector', query, {
        type: 'websearch',
        config: 'english'
      })
    }

    // Apply category filter
    if (category) {
      coursesQuery = coursesQuery.eq('category_id', category)
    }

    // Apply price filters
    if (minPrice) {
      coursesQuery = coursesQuery.gte('price', parseInt(minPrice))
    }
    if (maxPrice) {
      coursesQuery = coursesQuery.lte('price', parseInt(maxPrice))
    }

    // Apply tag filters
    if (tags.length > 0 && tags[0] !== '') {
      coursesQuery = coursesQuery.contains('tags', tags.map(tag => ({ tag: { slug: tag } })))
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        coursesQuery = coursesQuery.order('price', { ascending: true })
        break
      case 'price_desc':
        coursesQuery = coursesQuery.order('price', { ascending: false })
        break
      case 'newest':
        coursesQuery = coursesQuery.order('created_at', { ascending: false })
        break
      case 'oldest':
        coursesQuery = coursesQuery.order('created_at', { ascending: true })
        break
      case 'popular':
        coursesQuery = coursesQuery.order('purchase_count', { ascending: false })
        break
      case 'views':
        coursesQuery = coursesQuery.order('view_count', { ascending: false })
        break
      default: // relevance
        if (query.trim()) {
          // Keep the text search ranking
        } else {
          coursesQuery = coursesQuery.order('created_at', { ascending: false })
        }
    }

    // Get total count for pagination
    const { count, error: countError } = await coursesQuery
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('Error counting courses:', countError)
      return NextResponse.json({ error: 'Failed to count courses' }, { status: 500 })
    }

    // Apply pagination
    coursesQuery = coursesQuery.range(offset, offset + limit - 1)

    const { data: courses, error: coursesError } = await coursesQuery

    if (coursesError) {
      console.error('Error fetching courses:', coursesError)
      return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
    }

    // Transform the data to include tags properly
    const transformedCourses = courses?.map(course => ({
      ...course,
      tags: course.tags?.map((t: any) => t.tag) || []
    })) || []

    // Track search analytics
    if (query.trim()) {
      const { error: analyticsError } = await supabase
        .rpc('track_analytics_event', {
          event_type_param: 'search',
          event_name_param: 'course_search',
          event_data_param: {
            query,
            category,
            tags,
            min_price: minPrice,
            max_price: maxPrice,
            sort_by: sortBy,
            results_count: transformedCourses.length
          }
        })

      if (analyticsError) {
        console.error('Error tracking search:', analyticsError)
      }
    }

    const response = {
      courses: transformedCourses,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: page * limit < (count || 0),
        hasPrev: page > 1
      },
      filters: {
        query,
        category,
        tags,
        minPrice,
        maxPrice,
        sortBy
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
