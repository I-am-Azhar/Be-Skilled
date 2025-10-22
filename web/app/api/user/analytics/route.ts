import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d' // 7d, 30d, 90d, 1y

    // Calculate date range based on period
    const now = new Date()
    const startDate = new Date()
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Get learning analytics
    const { data: analytics, error: analyticsError } = await supabase
      .from('learning_analytics')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (analyticsError && analyticsError.code !== 'PGRST116') {
      console.error('Error fetching analytics:', analyticsError)
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
    }

    // Get activity events for the period
    const { data: events, error: eventsError } = await supabase
      .from('analytics_events')
      .select('event_type, event_name, created_at, event_data')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    if (eventsError) {
      console.error('Error fetching events:', eventsError)
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
    }

    // Get course progress over time
    const { data: progressHistory, error: progressError } = await supabase
      .from('user_course_progress')
      .select(`
        course_id,
        progress_percentage,
        last_accessed,
        completed_at,
        course:course_id (
          title
        )
      `)
      .eq('user_id', user.id)
      .gte('last_accessed', startDate.toISOString())
      .order('last_accessed', { ascending: false })

    if (progressError) {
      console.error('Error fetching progress history:', progressError)
      return NextResponse.json({ error: 'Failed to fetch progress history' }, { status: 500 })
    }

    // Process events into daily/weekly/monthly summaries
    const eventSummary = processEventsSummary(events || [], period)
    
    // Process progress data
    const progressSummary = processProgressSummary(progressHistory || [], period)

    const analyticsData = {
      summary: analytics || {
        total_courses: 0,
        completed_courses: 0,
        total_time_spent: 0,
        streak_days: 0,
        last_activity_date: null
      },
      period,
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
      events: eventSummary,
      progress: progressSummary,
      activityTimeline: events?.slice(0, 20) || [] // Recent 20 activities
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function processEventsSummary(events: any[], period: string) {
  const summary = {
    totalEvents: events.length,
    eventTypes: {} as Record<string, number>,
    dailyActivity: [] as any[],
    topActivities: [] as any[]
  }

  // Count event types
  events.forEach(event => {
    summary.eventTypes[event.event_type] = (summary.eventTypes[event.event_type] || 0) + 1
  })

  // Get top activities
  summary.topActivities = Object.entries(summary.eventTypes)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([type, count]) => ({ type, count }))

  // Group by day/week/month based on period
  const groupBy = period === '1y' ? 'month' : period === '90d' ? 'week' : 'day'
  
  const grouped = events.reduce((acc, event) => {
    const date = new Date(event.created_at)
    let key: string
    
    switch (groupBy) {
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        break
      case 'week':
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = weekStart.toISOString().split('T')[0]
        break
      default:
        key = date.toISOString().split('T')[0]
    }
    
    if (!acc[key]) {
      acc[key] = { date: key, count: 0, events: [] }
    }
    acc[key].count++
    acc[key].events.push(event)
    
    return acc
  }, {} as Record<string, any>)

  summary.dailyActivity = Object.values(grouped).sort((a: any, b: any) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return summary
}

function processProgressSummary(progressHistory: any[], period: string) {
  const summary = {
    totalCourses: new Set(progressHistory.map(p => p.course_id)).size,
    completedCourses: progressHistory.filter(p => p.completed_at).length,
    averageProgress: 0,
    progressByCourse: [] as any[]
  }

  // Calculate average progress
  if (progressHistory.length > 0) {
    const totalProgress = progressHistory.reduce((sum, p) => sum + p.progress_percentage, 0)
    summary.averageProgress = Math.round(totalProgress / progressHistory.length)
  }

  // Group by course
  const courseProgress = progressHistory.reduce((acc, progress) => {
    const courseId = progress.course_id
    if (!acc[courseId]) {
      acc[courseId] = {
        course_id: courseId,
        course_title: progress.course.title,
        progress_percentage: progress.progress_percentage,
        completed_at: progress.completed_at,
        last_accessed: progress.last_accessed
      }
    } else {
      // Keep the most recent progress
      if (new Date(progress.last_accessed) > new Date(acc[courseId].last_accessed)) {
        acc[courseId] = {
          ...acc[courseId],
          progress_percentage: progress.progress_percentage,
          completed_at: progress.completed_at,
          last_accessed: progress.last_accessed
        }
      }
    }
    return acc
  }, {} as Record<string, any>)

  summary.progressByCourse = Object.values(courseProgress)

  return summary
}
