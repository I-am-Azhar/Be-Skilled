"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  course_count: number
}

interface Tag {
  id: string
  name: string
  slug: string
  color: string
}

interface FilterPanelProps {
  filters: {
    category?: string
    tags?: string[]
    minPrice?: number
    maxPrice?: number
    sortBy?: string
  }
  onFiltersChange: (filters: any) => void
  onClose?: () => void
  className?: string
}

export default function FilterPanel({ 
  filters, 
  onFiltersChange, 
  onClose,
  className 
}: FilterPanelProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedCategory, setSelectedCategory] = useState(filters.category || '')
  const [selectedTags, setSelectedTags] = useState<string[]>(filters.tags || [])
  const [sortBy, setSortBy] = useState(filters.sortBy || 'relevance')

  useEffect(() => {
    fetchCategories()
    fetchTags()
  }, [])

  useEffect(() => {
    // Initialize price range from filters
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      setPriceRange([
        filters.minPrice || 0,
        filters.maxPrice || 10000
      ])
    }
  }, [filters.minPrice, filters.maxPrice])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/courses/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.flat || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchTags = async () => {
    try {
      // This would need a separate API endpoint for tags
      // For now, we'll use a mock list
      const mockTags: Tag[] = [
        { id: '1', name: 'Beginner', slug: 'beginner', color: '#10B981' },
        { id: '2', name: 'Intermediate', slug: 'intermediate', color: '#F59E0B' },
        { id: '3', name: 'Advanced', slug: 'advanced', color: '#EF4444' },
        { id: '4', name: 'JavaScript', slug: 'javascript', color: '#F7DF1E' },
        { id: '5', name: 'React', slug: 'react', color: '#61DAFB' },
        { id: '6', name: 'Python', slug: 'python', color: '#3776AB' },
        { id: '7', name: 'UI/UX', slug: 'ui-ux', color: '#8B5CF6' },
        { id: '8', name: 'Project-based', slug: 'project-based', color: '#06B6D4' }
      ]
      setTags(mockTags)
    } catch (error) {
      console.error('Error fetching tags:', error)
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    const newCategory = selectedCategory === categoryId ? '' : categoryId
    setSelectedCategory(newCategory)
    applyFilters({
      ...filters,
      category: newCategory || undefined
    })
  }

  const handleTagToggle = (tagSlug: string) => {
    const newTags = selectedTags.includes(tagSlug)
      ? selectedTags.filter(t => t !== tagSlug)
      : [...selectedTags, tagSlug]
    
    setSelectedTags(newTags)
    applyFilters({
      ...filters,
      tags: newTags.length > 0 ? newTags : undefined
    })
  }

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
  }

  const handlePriceCommit = (values: number[]) => {
    applyFilters({
      ...filters,
      minPrice: values[0] > 0 ? values[0] : undefined,
      maxPrice: values[1] < 10000 ? values[1] : undefined
    })
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    applyFilters({
      ...filters,
      sortBy: value
    })
  }

  const applyFilters = (newFilters: any) => {
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    setSelectedCategory('')
    setSelectedTags([])
    setPriceRange([0, 10000])
    setSortBy('relevance')
    onFiltersChange({})
  }

  const hasActiveFilters = selectedCategory || selectedTags.length > 0 || 
    (priceRange[0] > 0 || priceRange[1] < 10000) || sortBy !== 'relevance'

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            )}
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Sort By */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Sort By</h4>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="views">Most Viewed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Categories</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategory === category.id}
                  onCheckedChange={() => handleCategoryChange(category.id)}
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-between w-full cursor-pointer"
                >
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {category.course_count}
                  </Badge>
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Tags */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Tags</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag.id}`}
                  checked={selectedTags.includes(tag.slug)}
                  onCheckedChange={() => handleTagToggle(tag.slug)}
                />
                <label
                  htmlFor={`tag-${tag.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: tag.color }}
                  />
                  <span>{tag.name}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Price Range</h4>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              onValueCommit={handlePriceCommit}
              max={10000}
              min={0}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₹{priceRange[0].toLocaleString()}</span>
              <span>₹{priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
