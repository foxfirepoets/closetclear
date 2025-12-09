'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Filter, Grid, List, Plus, SortAsc } from 'lucide-react'
import { pb } from '@/lib/pocketbase'
import Navbar from '@/components/Navbar'
import ClothingCard from '@/components/ClothingCard'

interface ClothingItem {
  id: string
  name: string
  category: string
  color: string
  brand?: string
  image?: string
  created: string
  last_worn?: string
  wear_count: number
  season?: string
  size?: string
  purchase_price?: number
}

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Underwear', 'Sleepwear']
const COLORS = ['All', 'Black', 'White', 'Gray', 'Brown', 'Red', 'Pink', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple']
const SEASONS = ['All', 'Spring', 'Summer', 'Fall', 'Winter']
const SORT_OPTIONS = [
  { value: '-created', label: 'Newest First' },
  { value: 'created', label: 'Oldest First' },
  { value: 'name', label: 'Name A-Z' },
  { value: '-name', label: 'Name Z-A' },
  { value: '-wear_count', label: 'Most Worn' },
  { value: 'wear_count', label: 'Least Worn' },
]

export default function ClosetPage() {
  const router = useRouter()
  const [items, setItems] = useState<ClothingItem[]>([])
  const [filteredItems, setFilteredItems] = useState<ClothingItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedColor, setSelectedColor] = useState('All')
  const [selectedSeason, setSelectedSeason] = useState('All')
  const [sortBy, setSortBy] = useState('-created')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Check authentication
    if (!pb.authStore.isValid) {
      router.push('/login')
      return
    }

    loadClothingItems()
  }, [router, sortBy])

  useEffect(() => {
    filterItems()
  }, [items, searchTerm, selectedCategory, selectedColor, selectedSeason])

  const loadClothingItems = async () => {
    try {
      setIsLoading(true)

      const records = await pb.collection('clothing_items').getList(1, 200, {
        sort: sortBy,
        filter: `user = "${pb.authStore.model?.id}"`,
      })

      const clothingItems: ClothingItem[] = records.items.map((item: any) => ({
        id: item.id,
        name: item.name || 'Unnamed Item',
        category: item.category || 'Other',
        color: item.color || 'Unknown',
        brand: item.brand,
        image: item.image,
        created: item.created,
        last_worn: item.last_worn,
        wear_count: item.wear_count || 0,
        season: item.season,
        size: item.size,
        purchase_price: item.purchase_price
      }))

      setItems(clothingItems)
    } catch (error) {
      console.error('Error loading clothing items:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterItems = () => {
    let filtered = items

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.color.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    // Color filter
    if (selectedColor !== 'All') {
      filtered = filtered.filter(item => item.color === selectedColor)
    }

    // Season filter
    if (selectedSeason !== 'All') {
      filtered = filtered.filter(item => item.season === selectedSeason)
    }

    setFilteredItems(filtered)
  }

  const handleItemUpdate = (updatedItem: ClothingItem) => {
    setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item))
  }

  const handleItemDelete = (deletedItemId: string) => {
    setItems(prev => prev.filter(item => item.id !== deletedItemId))
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedCategory('All')
    setSelectedColor('All')
    setSelectedSeason('All')
    setSortBy('-created')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              My Closet
            </h1>
            <p className="text-gray-600">
              {isLoading ? 'Loading items...' : `${filteredItems.length} of ${items.length} items`}
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Link
              href="/add-item"
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Item</span>
            </Link>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2 lg:hidden"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Search & Filter</h3>

              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 input-field"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field"
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Color Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="input-field"
                >
                  {COLORS.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              {/* Season Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Season
                </label>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="input-field"
                >
                  {SEASONS.map(season => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearAllFilters}
                className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort and View Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <SortAsc className="h-4 w-4 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    {SORT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Items Display */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length > 0 ? (
              <div className={`${
                viewMode === 'grid'
                  ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                  : 'space-y-4'
              }`}>
                {filteredItems.map((item) => (
                  <ClothingCard
                    key={item.id}
                    item={item}
                    showActions={true}
                    viewMode={viewMode}
                    onUpdate={handleItemUpdate}
                    onDelete={handleItemDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-12 w-12 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600 mb-4">
                  {items.length === 0
                    ? "You haven't added any clothing items yet"
                    : "Try adjusting your search or filters"
                  }
                </p>
                {items.length === 0 ? (
                  <Link href="/add-item" className="btn-primary inline-flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Your First Item</span>
                  </Link>
                ) : (
                  <button
                    onClick={clearAllFilters}
                    className="btn-secondary"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}