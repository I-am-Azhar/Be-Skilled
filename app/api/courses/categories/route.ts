import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get all active categories with course counts
    const { data: categories, error } = await supabase
      .from('course_categories')
      .select(`
        id,
        name,
        slug,
        description,
        parent_id,
        sort_order,
        is_active
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }

    // Get course counts for each category
    const categoriesWithCounts = await Promise.all(
      categories?.map(async (category) => {
        const { count, error: countError } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id)
          .eq('is_active', true)

        if (countError) {
          console.error('Error counting courses for category:', countError)
        }

        return {
          ...category,
          course_count: count || 0
        }
      }) || []
    )

    // Organize into hierarchical structure
    const categoryMap = new Map()
    const rootCategories: any[] = []

    categoriesWithCounts.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] })
    })

    categoriesWithCounts.forEach(category => {
      const categoryWithChildren = categoryMap.get(category.id)
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id)
        if (parent) {
          parent.children.push(categoryWithChildren)
        }
      } else {
        rootCategories.push(categoryWithChildren)
      }
    })

    return NextResponse.json({
      categories: rootCategories,
      flat: categoriesWithCounts
    })
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { name, slug, description, parent_id, sort_order } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    // Check if slug already exists
    const { data: existingCategory, error: checkError } = await supabase
      .from('course_categories')
      .select('id')
      .eq('slug', slug)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking slug:', checkError)
      return NextResponse.json({ error: 'Failed to check slug' }, { status: 500 })
    }

    if (existingCategory) {
      return NextResponse.json({ error: 'Category with this slug already exists' }, { status: 409 })
    }

    // Create category
    const { data: newCategory, error: createError } = await supabase
      .from('course_categories')
      .insert({
        name,
        slug,
        description,
        parent_id,
        sort_order: sort_order || 0
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating category:', createError)
      return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
    }

    return NextResponse.json({ category: newCategory })
  } catch (error) {
    console.error('Category creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
