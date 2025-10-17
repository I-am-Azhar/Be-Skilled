"use client"

import { useState, useEffect, useRef } from 'react'
import { Search, X, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

interface SearchSuggestion {
  id: string
  title: string
  type: 'course' | 'category' | 'tag'
}

interface SearchFilters {
  category?: string
  tags?: string[]
  minPrice?: number
  maxPrice?: number
  sortBy?: string
}

interface SearchBarProps {
  onFiltersChange?: (filters: SearchFilters) => void
  showFilters?: boolean
  placeholder?: string
  className?: string
}

export default function SearchBar({ 
  onFiltersChange, 
  showFilters = true, 
  placeholder = "Search courses...",
  className 
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({})
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get('category') || undefined
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || []
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined
    const sortBy = searchParams.get('sortBy') || undefined
    
    setFilters({ category, tags, minPrice, maxPrice, sortBy })
    setQuery(searchParams.get('q') || '')
  }, [searchParams])

  // Debounced search suggestions
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/courses/search?q=${encodeURIComponent(query)}&limit=5`)
        if (response.ok) {
          const data = await response.json()
          const searchSuggestions: SearchSuggestion[] = data.courses.map((course: any) => ({
            id: course.id,
            title: course.title,
            type: 'course' as const
          }))
          setSuggestions(searchSuggestions)
          setShowSuggestions(true)
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    
    if (query.trim()) {
      params.set('q', query.trim())
    }
    
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

    const queryString = params.toString()
    router.push(queryString ? `/search?${queryString}` : '/search')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title)
    setShowSuggestions(false)
    handleSearch()
  }

  const clearFilters = () => {
    const newFilters: SearchFilters = {}
    setFilters(newFilters)
    if (onFiltersChange) {
      onFiltersChange(newFilters)
    }
    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    params.delete('category')
    params.delete('tags')
    params.delete('minPrice')
    params.delete('maxPrice')
    params.delete('sortBy')
    router.push(params.toString() ? `/search?${params.toString()}` : '/search')
  }

  const removeFilter = (key: keyof SearchFilters, value?: string) => {
    const newFilters = { ...filters }
    
    if (Array.isArray(newFilters[key])) {
      if (value) {
        (newFilters[key] as string[]) = (newFilters[key] as string[]).filter(v => v !== value)
      } else {
        delete newFilters[key]
      }
    } else {
      delete newFilters[key]
    }
    
    setFilters(newFilters)
    if (onFiltersChange) {
      onFiltersChange(newFilters)
    }
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && 
    (Array.isArray(value) ? value.length > 0 : true)
  )

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
            className="pl-10 pr-20"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setQuery('')}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
        
        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex gap-1">
          {showFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={cn(
                "h-8 px-2",
                hasActiveFilters && "bg-primary text-primary-foreground"
              )}
            >
              <Filter className="w-3 h-3 mr-1" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                  {Object.values(filters).filter(v => v !== undefined && v !== null && (Array.isArray(v) ? v.length > 0 : true)).length}
                </Badge>
              )}
            </Button>
          )}
          <Button size="sm" onClick={handleSearch} className="h-8 px-3">
            Search
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {filters.category}
              <Button
                variant="ghost"
                size="sm"
                className="h-3 w-3 p-0 hover:bg-transparent"
                onClick={() => removeFilter('category')}
              >
                <X className="w-2 h-2" />
              </Button>
            </Badge>
          )}
          {filters.tags && filters.tags.length > 0 && (
            filters.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-3 w-3 p-0 hover:bg-transparent"
                  onClick={() => removeFilter('tags', tag)}
                >
                  <X className="w-2 h-2" />
                </Button>
              </Badge>
            ))
          )}
          {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Price: ₹{filters.minPrice || 0} - ₹{filters.maxPrice || '∞'}
              <Button
                variant="ghost"
                size="sm"
                className="h-3 w-3 p-0 hover:bg-transparent"
                onClick={() => {
                  removeFilter('minPrice')
                  removeFilter('maxPrice')
                }}
              >
                <X className="w-2 h-2" />
              </Button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-5 px-2 text-xs"
            onClick={clearFilters}
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <Card ref={suggestionsRef} className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto">
          <CardContent className="p-0">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="px-4 py-2 hover:bg-muted cursor-pointer border-b last:border-b-0"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm">{suggestion.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {suggestion.type}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 text-center text-sm text-muted-foreground">
          Searching...
        </div>
      )}
    </div>
  )
}
