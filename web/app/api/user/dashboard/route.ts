import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's purchased courses with progress
    const { data: userCourses, error: coursesError } = await supabase
      .from('user_courses')
      .select(`
        id,
        purchase_date,
        course:course_id (
          id,
          title,
          subtitle,
          thumbnail_url,
          price,
          discount_price
        )
      `)
      .eq('user_id', user.id)
      .order('purchase_date', { ascending: false })

    if (coursesError) {
      console.error('Error fetching user courses:', coursesError)
      return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
    }

    // Get user's course progress
    const { data: progressData, error: progressError } = await supabase
      .from('user_course_progress')
      .select('course_id, progress_percentage, last_accessed, completed_at')
      .eq('user_id', user.id)

    if (progressError) {
      console.error('Error fetching progress:', progressError)
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
    }

    // Get learning analytics
    const { data: analytics, error: analyticsError } = await supabase
      .from('learning_analytics')
      .select('total_courses, completed_courses, total_time_spent, streak_days, last_activity_date')
      .eq('user_id', user.id)
      .single()

    if (analyticsError && analyticsError.code !== 'PGRST116') {
      console.error('Error fetching analytics:', analyticsError)
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
    }

    // Get user preferences
    const { data: preferences, error: preferencesError } = await supabase
      .from('user_preferences')
      .select('theme, notifications, language, timezone')
      .eq('user_id', user.id)
      .single()

    if (preferencesError && preferencesError.code !== 'PGRST116') {
      console.error('Error fetching preferences:', preferencesError)
    }

    // Combine courses with progress data
    const coursesWithProgress = userCourses?.map((course: any) => {
      const progress = progressData?.find((p: any) => p.course_id === course.course.id)
      return {
        ...course,
        progress: progress || {
          progress_percentage: 0,
          last_accessed: null,
          completed_at: null
        }
      }
    }) || []

    // Calculate recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentActivity = coursesWithProgress
      .filter((course: any) => course.progress.last_accessed && new Date(course.progress.last_accessed) >= sevenDaysAgo)
      .sort((a: any, b: any) => new Date(b.progress.last_accessed!).getTime() - new Date(a.progress.last_accessed!).getTime())
      .slice(0, 5)

    const dashboardData = {
      user: {
        id: user.id,
        email: user.email
      },
      courses: coursesWithProgress,
      analytics: analytics || {
        total_courses: 0,
        completed_courses: 0,
        total_time_spent: 0,
        streak_days: 0,
        last_activity_date: null
      },
      preferences: preferences || {
        theme: 'light',
        notifications: { email: true, push: true, course_updates: true },
        language: 'en',
        timezone: 'UTC'
      },
      recentActivity
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Dashboard API error:', error)
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

    const body = await request.json()
    const { preferences } = body

    if (preferences) {
      // Update user preferences
      const { error: updateError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          theme: preferences.theme,
          notifications: preferences.notifications,
          language: preferences.language,
          timezone: preferences.timezone
        })

      if (updateError) {
        console.error('Error updating preferences:', updateError)
        return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Dashboard update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
