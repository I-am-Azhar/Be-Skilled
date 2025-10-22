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

    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'
    const type = searchParams.get('type') || 'overview' // overview, revenue, users, courses

    // Calculate date range
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

    let analyticsData: any = {}

    switch (type) {
      case 'overview':
        analyticsData = await getOverviewAnalytics(supabase, startDate, now)
        break
      case 'revenue':
        analyticsData = await getRevenueAnalytics(supabase, startDate, now)
        break
      case 'users':
        analyticsData = await getUserAnalytics(supabase, startDate, now)
        break
      case 'courses':
        analyticsData = await getCourseAnalytics(supabase, startDate, now)
        break
      default:
        analyticsData = await getOverviewAnalytics(supabase, startDate, now)
    }

    return NextResponse.json({
      ...analyticsData,
      period,
      startDate: startDate.toISOString(),
      endDate: now.toISOString()
    })
  } catch (error) {
    console.error('Admin analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getOverviewAnalytics(supabase: any, startDate: Date, endDate: Date) {
  // Get total users
  const { count: totalUsers, error: usersError } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  // Get total courses
  const { count: totalCourses, error: coursesError } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  // Get total purchases
  const { count: totalPurchases, error: purchasesError } = await supabase
    .from('user_courses')
    .select('*', { count: 'exact', head: true })
    .gte('purchase_date', startDate.toISOString())

  // Get new users in period
  const { count: newUsers, error: newUsersError } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startDate.toISOString())

  // Get total revenue (simplified - would need actual payment data)
  const { data: revenueData, error: revenueError } = await supabase
    .from('user_courses')
    .select(`
      id,
      purchase_date,
      course:course_id (
        price,
        discount_price
      )
    `)
    .gte('purchase_date', startDate.toISOString())

  let totalRevenue = 0
  if (revenueData) {
    totalRevenue = revenueData.reduce((sum, purchase) => {
      const price = purchase.course.discount_price || purchase.course.price
      return sum + (price || 0)
    }, 0)
  }

  // Get daily metrics for chart
  const dailyMetrics = await getDailyMetrics(supabase, startDate, endDate)

  return {
    overview: {
      totalUsers: totalUsers || 0,
      totalCourses: totalCourses || 0,
      totalPurchases: totalPurchases || 0,
      newUsers: newUsers || 0,
      totalRevenue,
      dailyMetrics
    }
  }
}

async function getRevenueAnalytics(supabase: any, startDate: Date, endDate: Date) {
  // Get revenue by day
  const { data: dailyRevenue, error: dailyError } = await supabase
    .from('user_courses')
    .select(`
      purchase_date,
      course:course_id (
        price,
        discount_price
      )
    `)
    .gte('purchase_date', startDate.toISOString())
    .order('purchase_date', { ascending: true })

  // Process daily revenue
  const revenueByDay = dailyRevenue?.reduce((acc: any, purchase) => {
    const date = purchase.purchase_date.split('T')[0]
    const amount = purchase.course.discount_price || purchase.course.price || 0
    
    if (!acc[date]) {
      acc[date] = { date, revenue: 0, count: 0 }
    }
    acc[date].revenue += amount
    acc[date].count += 1
    
    return acc
  }, {}) || {}

  // Get top selling courses
  const { data: topCourses, error: topCoursesError } = await supabase
    .from('user_courses')
    .select(`
      course:course_id (
        id,
        title,
        price,
        discount_price
      )
    `)
    .gte('purchase_date', startDate.toISOString())

  const courseSales = topCourses?.reduce((acc: any, purchase) => {
    const courseId = purchase.course.id
    const price = purchase.course.discount_price || purchase.course.price || 0
    
    if (!acc[courseId]) {
      acc[courseId] = {
        id: courseId,
        title: purchase.course.title,
        sales: 0,
        revenue: 0
      }
    }
    acc[courseId].sales += 1
    acc[courseId].revenue += price
    
    return acc
  }, {}) || {}

  return {
    revenue: {
      dailyRevenue: Object.values(revenueByDay),
      topCourses: Object.values(courseSales)
        .sort((a: any, b: any) => b.revenue - a.revenue)
        .slice(0, 10)
    }
  }
}

async function getUserAnalytics(supabase: any, startDate: Date, endDate: Date) {
  // Get user registration trends
  const { data: userRegistrations, error: regError } = await supabase
    .from('users')
    .select('created_at')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true })

  // Process registration by day
  const registrationsByDay = userRegistrations?.reduce((acc: any, user) => {
    const date = user.created_at.split('T')[0]
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {}) || {}

  // Get user engagement metrics
  const { data: engagementData, error: engagementError } = await supabase
    .from('learning_analytics')
    .select('*')
    .order('created_at', { ascending: false })

  // Get active users (users with activity in period)
  const { data: activeUsers, error: activeError } = await supabase
    .from('analytics_events')
    .select('user_id')
    .gte('created_at', startDate.toISOString())
    .not('user_id', 'is', null)

  const uniqueActiveUsers = new Set(activeUsers?.map(u => u.user_id) || []).size

  return {
    users: {
      registrationsByDay: Object.entries(registrationsByDay).map(([date, count]) => ({
        date,
        count
      })),
      engagementMetrics: engagementData || [],
      activeUsers: uniqueActiveUsers
    }
  }
}

async function getCourseAnalytics(supabase: any, startDate: Date, endDate: Date) {
  // Get course performance
  const { data: coursePerformance, error: perfError } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      price,
      view_count,
      purchase_count,
      created_at
    `)
    .eq('is_active', true)
    .order('purchase_count', { ascending: false })

  // Get course completion rates
  const { data: completionData, error: completionError } = await supabase
    .from('user_course_progress')
    .select(`
      course_id,
      progress_percentage,
      completed_at,
      course:course_id (
        title
      )
    `)

  // Calculate completion rates
  const completionRates = completionData?.reduce((acc: any, progress) => {
    const courseId = progress.course_id
    if (!acc[courseId]) {
      acc[courseId] = {
        course_id: courseId,
        title: progress.course.title,
        total_students: 0,
        completed_students: 0,
        average_progress: 0,
        total_progress: 0
      }
    }
    
    acc[courseId].total_students += 1
    acc[courseId].total_progress += progress.progress_percentage
    
    if (progress.completed_at) {
      acc[courseId].completed_students += 1
    }
    
    return acc
  }, {}) || {}

  // Calculate averages and rates
  Object.values(completionRates).forEach((course: any) => {
    course.average_progress = Math.round(course.total_progress / course.total_students)
    course.completion_rate = Math.round((course.completed_students / course.total_students) * 100)
  })

  return {
    courses: {
      performance: coursePerformance || [],
      completionRates: Object.values(completionRates)
    }
  }
}

async function getDailyMetrics(supabase: any, startDate: Date, endDate: Date) {
  const metrics = []
  const currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0]
    
    // Get users registered on this day
    const { count: newUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', dateStr)
      .lt('created_at', new Date(currentDate.getTime() + 24 * 60 * 60 * 1000).toISOString())

    // Get purchases on this day
    const { count: purchases } = await supabase
      .from('user_courses')
      .select('*', { count: 'exact', head: true })
      .gte('purchase_date', dateStr)
      .lt('purchase_date', new Date(currentDate.getTime() + 24 * 60 * 60 * 1000).toISOString())

    metrics.push({
      date: dateStr,
      newUsers: newUsers || 0,
      purchases: purchases || 0
    })
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return metrics
}
