"use client"

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import SearchResults from '@/components/SearchResults'

function SearchPageContent() {
  const searchParams = useSearchParams()
  
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || undefined
  const tags = searchParams.get('tags')?.split(',').filter(Boolean) || []
  const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined
  const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined
  const sortBy = searchParams.get('sortBy') || undefined

  const initialFilters = {
    category,
    tags: tags.length > 0 ? tags : undefined,
    minPrice,
    maxPrice,
    sortBy
  }

  return (
    <SearchResults 
      initialQuery={query}
      initialFilters={initialFilters}
    />
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}
