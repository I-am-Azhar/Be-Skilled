"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, 
  BookOpen, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalUsers: number
    totalCourses: number
    totalPurchases: number
    newUsers: number
    totalRevenue: number
    dailyMetrics: Array<{
      date: string
      newUsers: number
      purchases: number
    }>
  }
  revenue: {
    dailyRevenue: Array<{
      date: string
      revenue: number
      count: number
    }>
    topCourses: Array<{
      id: string
      title: string
      sales: number
      revenue: number
    }>
  }
  users: {
    registrationsByDay: Array<{
      date: string
      count: number
    }>
    activeUsers: number
  }
  courses: {
    performance: Array<{
      id: string
      title: string
      view_count: number
      purchase_count: number
    }>
    completionRates: Array<{
      course_id: string
      title: string
      total_students: number
      completed_students: number
      average_progress: number
      completion_rate: number
    }>
  }
  period: string
  startDate: string
  endDate: string
}

export default function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchAnalytics()
  }, [selectedPeriod])

  const fetchAnalytics = async (type: string = 'overview') => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/analytics?period=${selectedPeriod}&type=${type}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }
      
      const data = await response.json()
      
      if (type === 'overview') {
        setAnalyticsData(data)
      } else {
        // Update specific section of analytics data
        setAnalyticsData(prev => ({
          ...prev!,
          [type]: data[type]
        }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value !== 'overview' && analyticsData) {
      fetchAnalytics(value)
    }
  }

  const exportData = () => {
    if (!analyticsData) return
    
    const csvData = generateCSV(analyticsData)
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const generateCSV = (data: AnalyticsData) => {
    let csv = 'Metric,Value,Date\n'
    
    // Overview metrics
    csv += `Total Users,${data.overview.totalUsers},\n`
    csv += `Total Courses,${data.overview.totalCourses},\n`
    csv += `Total Purchases,${data.overview.totalPurchases},\n`
    csv += `New Users,${data.overview.newUsers},\n`
    csv += `Total Revenue,${data.overview.totalRevenue},\n`
    
    // Daily metrics
    csv += '\nDaily Metrics\n'
    csv += 'Date,New Users,Purchases\n'
    data.overview.dailyMetrics.forEach(metric => {
      csv += `${metric.date},${metric.newUsers},${metric.purchases}\n`
    })
    
    return csv
  }

  if (loading && !analyticsData) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
              <p className="text-gray-600">{error}</p>
              <Button onClick={() => fetchAnalytics()} className="mt-4">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!analyticsData) return null

  const { overview } = analyticsData

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">Platform performance and user insights</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => fetchAnalytics(activeTab)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{overview.newUsers} this period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              Active courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalPurchases}</div>
            <p className="text-xs text-muted-foreground">
              This period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{overview.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview.totalUsers > 0 ? Math.round((overview.newUsers / overview.totalUsers) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              User growth
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity</CardTitle>
                <CardDescription>New users and purchases over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {overview.dailyMetrics.slice(-7).map((metric, index) => (
                    <div key={metric.date} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(metric.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <Badge variant="secondary">
                          {metric.newUsers} users
                        </Badge>
                        <Badge variant="outline">
                          {metric.purchases} sales
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Conversion Rate</span>
                  <span className="text-sm">
                    {overview.totalUsers > 0 
                      ? Math.round((overview.totalPurchases / overview.totalUsers) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Average Revenue per User</span>
                  <span className="text-sm">
                    ₹{overview.totalUsers > 0 
                      ? Math.round(overview.totalRevenue / overview.totalUsers)
                      : 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Courses per User</span>
                  <span className="text-sm">
                    {overview.totalUsers > 0 
                      ? Math.round((overview.totalPurchases / overview.totalUsers) * 10) / 10
                      : 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Courses</CardTitle>
                  <CardDescription>Best performing courses by revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.revenue?.topCourses?.slice(0, 5).map((course, index) => (
                      <div key={course.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                            {index + 1}
                          </Badge>
                          <div>
                            <p className="text-sm font-medium">{course.title}</p>
                            <p className="text-xs text-muted-foreground">{course.sales} sales</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium">₹{course.revenue.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>Daily revenue breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.revenue?.dailyRevenue?.slice(-7).map((day) => (
                      <div key={day.date} className="flex items-center justify-between">
                        <span className="text-sm">
                          {new Date(day.date).toLocaleDateString()}
                        </span>
                        <div className="flex gap-4 text-sm">
                          <span>₹{day.revenue.toLocaleString()}</span>
                          <Badge variant="secondary" className="text-xs">
                            {day.count} sales
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Registration Trends</CardTitle>
                  <CardDescription>New user registrations over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.users?.registrationsByDay?.slice(-7).map((day) => (
                      <div key={day.date} className="flex items-center justify-between">
                        <span className="text-sm">
                          {new Date(day.date).toLocaleDateString()}
                        </span>
                        <Badge variant="secondary">
                          {day.count} new users
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Engagement</CardTitle>
                  <CardDescription>Active users and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Active Users</span>
                    <span className="text-sm">{analyticsData.users?.activeUsers || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Engagement Rate</span>
                    <span className="text-sm">
                      {overview.totalUsers > 0 
                        ? Math.round(((analyticsData.users?.activeUsers || 0) / overview.totalUsers) * 100)
                        : 0}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Performance</CardTitle>
                  <CardDescription>Most popular courses by views and purchases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.courses?.performance?.slice(0, 5).map((course, index) => (
                      <div key={course.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                            {index + 1}
                          </Badge>
                          <div>
                            <p className="text-sm font-medium">{course.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {course.view_count} views, {course.purchase_count} purchases
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {course.view_count > 0 
                              ? Math.round((course.purchase_count / course.view_count) * 100)
                              : 0}%
                          </p>
                          <p className="text-xs text-muted-foreground">conversion</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Completion Rates</CardTitle>
                  <CardDescription>Course completion statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.courses?.completionRates?.slice(0, 5).map((course) => (
                      <div key={course.course_id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{course.title}</span>
                          <span className="text-sm">{course.completion_rate}%</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{course.completed_students} / {course.total_students} completed</span>
                          <span>Avg: {course.average_progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
