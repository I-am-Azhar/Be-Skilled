import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { courseId, progressPercentage, completed } = body

    if (!courseId || progressPercentage === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify user has access to this course
    const { data: userCourse, error: accessError } = await supabase
      .from('user_courses')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single()

    if (accessError || !userCourse) {
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 404 })
    }

    // Update or create progress record
    const progressData: any = {
      user_id: user.id,
      course_id: courseId,
      progress_percentage: Math.min(100, Math.max(0, progressPercentage)),
      last_accessed: new Date().toISOString()
    }

    if (completed) {
      progressData.completed_at = new Date().toISOString()
    }

    const { error: progressError } = await supabase
      .from('user_course_progress')
      .upsert(progressData)

    if (progressError) {
      console.error('Error updating progress:', progressError)
      return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
    }

    // Update learning analytics
    const { error: analyticsError } = await supabase
      .rpc('update_learning_analytics', { user_uuid: user.id })

    if (analyticsError) {
      console.error('Error updating analytics:', analyticsError)
    }

    // Track analytics event
    const { error: eventError } = await supabase
      .rpc('track_analytics_event', {
        event_type_param: 'course_progress',
        event_name_param: 'progress_updated',
        event_data_param: {
          course_id: courseId,
          progress_percentage: progressData.progress_percentage,
          completed: completed
        }
      })

    if (eventError) {
      console.error('Error tracking event:', eventError)
    }

    return NextResponse.json({ 
      success: true, 
      progress: progressData.progress_percentage,
      completed: completed 
    })
  } catch (error) {
    console.error('Progress update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    let query = supabase
      .from('user_course_progress')
      .select(`
        course_id,
        progress_percentage,
        last_accessed,
        completed_at,
        course:course_id (
          id,
          title
        )
      `)
      .eq('user_id', user.id)

    if (courseId) {
      query = query.eq('course_id', courseId)
    }

    const { data: progress, error } = await query

    if (error) {
      console.error('Error fetching progress:', error)
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
    }

    return NextResponse.json({ progress: courseId ? progress?.[0] : progress })
  } catch (error) {
    console.error('Progress fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
