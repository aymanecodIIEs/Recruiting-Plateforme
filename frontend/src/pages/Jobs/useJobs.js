import { useMemo, useState, useCallback } from 'react'
import { JOBS } from './data'

export function useJobs() {
  const allJobs = useMemo(() => JOBS, [])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  const categories = useMemo(() => [...new Set(allJobs.map(j => j.category))], [allJobs])
  const levels = useMemo(() => [...new Set(allJobs.map(j => j.level))], [allJobs])
  const types = useMemo(() => [...new Set(allJobs.map(j => j.type))], [allJobs])
  const locations = useMemo(() => [...new Set(allJobs.map(j => j.location))], [allJobs])

  const filteredJobs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return allJobs.filter(job => {
      const matchesSearch = !query
        || job.title.toLowerCase().includes(query)
        || job.company.toLowerCase().includes(query)
        || job.tags.some(tag => tag.toLowerCase().includes(query))

      const matchesCategory = !selectedCategory || job.category === selectedCategory
      const matchesLevel = !selectedLevel || job.level === selectedLevel
      const matchesType = !selectedType || job.type === selectedType
      const matchesLocation = !selectedLocation || job.location === selectedLocation

      return matchesSearch && matchesCategory && matchesLevel && matchesType && matchesLocation
    })
  }, [allJobs, searchQuery, selectedCategory, selectedLevel, selectedType, selectedLocation])

  const resetFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedLevel('')
    setSelectedType('')
    setSelectedLocation('')
  }, [])

  return {
    allJobs,
    filteredJobs,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedLevel,
    setSelectedLevel,
    selectedType,
    setSelectedType,
    selectedLocation,
    setSelectedLocation,
    categories,
    levels,
    types,
    locations,
    resetFilters,
  }
}


