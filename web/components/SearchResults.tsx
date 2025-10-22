"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Grid3X3,
  List
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import FilterPanel from './FilterPanel'

interface Course {
  id: string
  title: string
  subtitle?: string
  price: number
  discount_price?: number
  thumbnail_url?: string
  created_at: string
  view_count: number
  purchase_count: number
  category?: {
    id: string
    name: string
    slug: string
  }
  tags: Array<{
    id: string
    name: string
    slug: string
    color: string
  }>
}

interface SearchFilters {
  category?: string
  tags?: string[]
  minPrice?: number
  maxPrice?: number
  sortBy?: string
}

interface SearchResultsProps {
  initialQuery?: string
  initialFilters?: SearchFilters
}

export default function SearchResults({ 
  initialQuery = '', 
  initialFilters = {} 
}: SearchResultsProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState(initialQuery)
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })

  useEffect(() => {
    searchCourses()
  }, [query, filters, pagination.page])

  const searchCourses = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      
      if (query.trim()) {
        params.set('q', query.trim())
      }
      
      params.set('page', pagination.page.toString())
      params.set('limit', pagination.limit.toString())
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              params.set(key, value.join(','))
            }
          } else {
            params.set(key, value.toString())
          }
        }
      })

      const response = await fetch(`/api/courses/search?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to search courses')
      }
      
      const data = await response.json()
      setCourses(data.courses || [])
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const CourseCard = ({ course }: { course: Course }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {course.thumbnail_url && (
        <div className="aspect-video relative">
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
            {course.subtitle && (
              <CardDescription className="mt-1 line-clamp-2">
                {course.subtitle}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category and Tags */}
        <div className="flex flex-wrap gap-1">
          {course.category && (
            <Badge variant="secondary" className="text-xs">
              {course.category.name}
            </Badge>
          )}
          {course.tags.slice(0, 2).map((tag) => (
            <Badge 
              key={tag.id} 
              variant="outline" 
              className="text-xs"
              style={{ borderColor: tag.color }}
            >
              {tag.name}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {course.purchase_count} students
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(course.created_at).toLocaleDateString()}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {course.discount_price && course.discount_price < course.price ? (
              <>
                <span className="text-lg font-bold text-green-600">
                  {formatPrice(course.discount_price)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(course.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold">
                {formatPrice(course.price)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/course/${course.id}`}>
              View Details
            </Link>
          </Button>
          <Button variant="outline" size="icon">
            <Star className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const CourseListItem = ({ course }: { course: Course }) => (
    <Card className="overflow-hidden">
      <div className="flex">
        {course.thumbnail_url && (
          <div className="w-48 aspect-video relative flex-shrink-0">
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{course.title}</h3>
              {course.subtitle && (
                <p className="text-muted-foreground mt-1">{course.subtitle}</p>
              )}
            </div>
            <div className="text-right ml-4">
              {course.discount_price && course.discount_price < course.price ? (
                <>
                  <div className="text-lg font-bold text-green-600">
                    {formatPrice(course.discount_price)}
                  </div>
                  <div className="text-sm text-muted-foreground line-through">
                    {formatPrice(course.price)}
                  </div>
                </>
              ) : (
                <div className="text-lg font-bold">
                  {formatPrice(course.price)}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            {course.category && (
              <Badge variant="secondary" className="text-xs">
                {course.category.name}
              </Badge>
            )}
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {course.purchase_count} students
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(course.created_at).toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {course.tags.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag.id} 
                  variant="outline" 
                  className="text-xs"
                  style={{ borderColor: tag.color }}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href={`/course/${course.id}`}>
                  View Details
                </Link>
              </Button>
              <Button variant="outline" size="icon">
                <Star className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Search Courses</h1>
            <p className="text-muted-foreground">
              {pagination.total > 0 
                ? `Found ${pagination.total} courses`
                : 'No courses found'
              }
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div className="w-80 flex-shrink-0">
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        {/* Results */}
        <div className="flex-1 space-y-6">
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
                  <p className="text-muted-foreground">{error}</p>
                  <Button onClick={searchCourses} className="mt-4">
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && !error && courses.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or browse all courses.
                </p>
                <Button asChild>
                  <Link href="/">Browse All Courses</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {!loading && !error && courses.length > 0 && (
            <>
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {courses.map((course) => (
                  viewMode === 'grid' ? (
                    <CourseCard key={course.id} course={course} />
                  ) : (
                    <CourseListItem key={course.id} course={course} />
                  )
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, pagination.page - 2) + i
                      if (pageNum > pagination.totalPages) return null
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === pagination.page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
