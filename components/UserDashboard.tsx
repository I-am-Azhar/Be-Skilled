"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Clock, Trophy, TrendingUp, Play, Calendar } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Course {
  id: string
  course: {
    id: string
    title: string
    subtitle?: string
    thumbnail_url?: string
    price: number
    discount_price?: number
  }
  progress: {
    progress_percentage: number
    last_accessed?: string
    completed_at?: string
  }
  purchase_date: string
}

interface Analytics {
  total_courses: number
  completed_courses: number
  total_time_spent: number
  streak_days: number
  last_activity_date?: string
}

interface DashboardData {
  user: {
    id: string
    email: string
  }
  courses: Course[]
  analytics: Analytics
  preferences: {
    theme: string
    notifications: Record<string, boolean>
    language: string
    timezone: string
  }
  recentActivity: Course[]
}

export default function UserDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/user/dashboard')
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      const data = await response.json()
      setDashboardData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updateProgress = async (courseId: string, progress: number) => {
    try {
      const response = await fetch('/api/user/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          progressPercentage: progress,
          completed: progress === 100
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update progress')
      }

      // Refresh dashboard data
      fetchDashboardData()
    } catch (err) {
      console.error('Error updating progress:', err)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
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
              <Button onClick={fetchDashboardData} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!dashboardData) return null

  const { courses, analytics, recentActivity } = dashboardData

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-gray-600">Track your learning progress and achievements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BookOpen className="w-4 h-4 mr-2" />
            Browse Courses
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.total_courses}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.completed_courses} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.total_courses > 0 
                ? Math.round((analytics.completed_courses / analytics.total_courses) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Course completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.streak_days}</div>
            <p className="text-xs text-muted-foreground">
              Days in a row
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(analytics.total_time_spent / 60)}h
            </div>
            <p className="text-xs text-muted-foreground">
              Total learning time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                {course.course.thumbnail_url && (
                  <div className="aspect-video relative">
                    <Image
                      src={course.course.thumbnail_url}
                      alt={course.course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{course.course.title}</CardTitle>
                  {course.course.subtitle && (
                    <CardDescription>{course.course.subtitle}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress.progress_percentage}%</span>
                    </div>
                    <Progress value={course.progress.progress_percentage} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant={course.progress.completed_at ? "success" : "secondary"}>
                      {course.progress.completed_at ? "Completed" : "In Progress"}
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Play className="w-3 h-3 mr-1" />
                        Continue
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => updateProgress(course.course.id, Math.min(100, course.progress.progress_percentage + 10))}
                      >
                        +10%
                      </Button>
                    </div>
                  </div>

                  {course.progress.last_accessed && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
                      Last accessed: {new Date(course.progress.last_accessed).toLocaleDateString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {courses.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your learning journey by purchasing your first course!
                </p>
                <Button asChild>
                  <Link href="/">Browse Courses</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentActivity.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                {course.course.thumbnail_url && (
                  <div className="aspect-video relative">
                    <Image
                      src={course.course.thumbnail_url}
                      alt={course.course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{course.course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress.progress_percentage}%</span>
                    </div>
                    <Progress value={course.progress.progress_percentage} />
                  </div>
                  <Button size="sm" className="w-full mt-4">
                    <Play className="w-3 h-3 mr-1" />
                    Continue Learning
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {recentActivity.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No recent activity</h3>
                <p className="text-muted-foreground">
                  Start learning to see your recent activity here!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>Your overall learning statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Courses Completed</span>
                    <span>{analytics.completed_courses} / {analytics.total_courses}</span>
                  </div>
                  <Progress 
                    value={analytics.total_courses > 0 ? (analytics.completed_courses / analytics.total_courses) * 100 : 0} 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Learning Streak</span>
                    <span>{analytics.streak_days} days</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Keep it up! Learning consistently is key to success.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time Investment</CardTitle>
                <CardDescription>Your learning time breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Time Spent</span>
                    <span>{Math.round(analytics.total_time_spent / 60)} hours</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average: {analytics.total_courses > 0 ? Math.round((analytics.total_time_spent / 60) / analytics.total_courses) : 0} hours per course
                  </div>
                </div>
                {analytics.last_activity_date && (
                  <div className="text-sm text-muted-foreground">
                    Last activity: {new Date(analytics.last_activity_date).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
