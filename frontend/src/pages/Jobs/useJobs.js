import { useMemo, useState, useCallback } from 'react'

export function useJobs() {
  const allJobs = useMemo(() => [
    { id: 1, title: 'Designer UX/UI Senior', company: 'TechFlow', location: 'Paris, France', type: 'CDI', salary: '50-65k', tags: ['Design', 'Figma', 'User Research'], logo: 'TF', category: 'Design', level: 'Senior' },
    { id: 2, title: 'Développeur Full Stack', company: 'StartupX', location: 'Télétravail', type: 'CDI', salary: '45-60k', tags: ['React', 'Node.js', 'PostgreSQL'], logo: 'SX', category: 'Développement', level: 'Mid' },
    { id: 3, title: 'Product Manager', company: 'DataCore', location: 'Lyon, France', type: 'CDI', salary: '48-62k', tags: ['Product', 'Analytics', 'Leadership'], logo: 'DC', category: 'Gestion de Produit', level: 'Senior' },
    { id: 4, title: 'Développeur Backend Python', company: 'CloudSync', location: 'Toulouse, France', type: 'CDI', salary: '42-55k', tags: ['Python', 'AWS', 'Docker'], logo: 'CS', category: 'Développement', level: 'Mid' },
    { id: 5, title: 'Développeur Frontend React', company: 'WebStudio', location: 'Paris, France', type: 'CDI', salary: '40-52k', tags: ['React', 'TypeScript', 'Tailwind'], logo: 'WS', category: 'Développement', level: 'Junior' },
    { id: 6, title: 'Data Scientist', company: 'AICore', location: 'Télétravail', type: 'CDI', salary: '55-70k', tags: ['Python', 'Machine Learning', 'SQL'], logo: 'AC', category: 'Data', level: 'Senior' },
    { id: 7, title: 'Chef de Projet IT', company: 'ConsultTech', location: 'Bordeaux, France', type: 'CDI', salary: '45-55k', tags: ['Agile', 'Leadership', 'Budget'], logo: 'CT', category: 'Gestion de Projet', level: 'Senior' },
    { id: 8, title: 'DevOps Engineer', company: 'CloudInfra', location: 'Télétravail', type: 'CDI', salary: '50-65k', tags: ['Kubernetes', 'AWS', 'Docker'], logo: 'CI', category: 'Infrastructure', level: 'Mid' },
  ], [])

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


