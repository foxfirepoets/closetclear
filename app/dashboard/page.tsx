'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, TrendingUp, Shirt, Calendar, Eye, Star, ArrowRight, Sparkles } from 'lucide-react'
import { pb } from '@/lib/pocketbase'
import Navbar from '@/components/Navbar'
import ClothingCard from '@/components/ClothingCard'
import OutfitSuggestion from '@/components/OutfitSuggestion'

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
}

interface DashboardStats {
  totalItems: number
  recentlyAdded: number
  mostWorn: ClothingItem | null
  needsAttention: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [recentItems, setRecentItems] = useState<ClothingItem[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    recentlyAdded: 0,
    mostWorn: null,
    needsAttention: 0
  })

  useEffect(() => {
    // Check authentication
    if (!pb.authStore.isValid) {
      router.push('/login')
      return
    }

    setUser(pb.authStore.model)
    loadDashboardData()
  }, [router])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)

      // Load recent clothing items
      const items = await pb.collection('clothing_items').getList(1, 6, {
        sort: '-created',
        filter: `user = "${pb.authStore.model?.id}"`,
      })

      const clothingItems: ClothingItem[] = items.items.map((item: any) => ({
        id: item.id,
        name: item.name || 'Unnamed Item',
        category: item.category || 'Other',
        color: item.color || 'Unknown',
        brand: item.brand,
        image: item.image,
        created: item.created,
        last_worn: item.last_worn,
        wear_count: item.wear_count || 0
      }))

      setRecentItems(clothingItems)

      // Calculate stats
      const totalItems = await pb.collection('clothing_items').getList(1, 1, {
        filter: `user = "${pb.authStore.model?.id}"`,
      })

      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

      const recentlyAdded = await pb.collection('clothing_items').getList(1, 1, {
        filter: `user = "${pb.authStore.model?.id}" && created >= "${oneWeekAgo.toISOString()}"`,
      })

      // Find most worn item
      let mostWorn = null
      if (clothingItems.length > 0) {
        mostWorn = clothingItems.reduce((prev, current) =>
          (prev.wear_count > current.wear_count) ? prev : current
        )
      }

      // Calculate items needing attention (not worn in 30+ days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const needsAttention = await pb.collection('clothing_items').getList(1, 1, {
        filter: `user = "${pb.authStore.model?.id}" && (last_worn = "" || last_worn < "${thirtyDaysAgo.toISOString()}")`,
      })

      setStats({
        totalItems: totalItems.totalItems,
        recentlyAdded: recentlyAdded.totalItems,
        mostWorn: mostWorn,
        needsAttention: needsAttention.totalItems
      })

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your closet...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening in your closet today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shirt className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalItems}</h3>
            <p className="text-gray-600">Total Items</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.recentlyAdded}</h3>
            <p className="text-gray-600">Added This Week</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.mostWorn?.wear_count || 0}
            </h3>
            <p className="text-gray-600">Most Worn</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.needsAttention}</h3>
            <p className="text-gray-600">Need Attention</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/add-item" className="card hover:shadow-lg transition-shadow duration-300 group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors duration-300">
                <Plus className="h-6 w-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Add New Item</h3>
                <p className="text-gray-600 text-sm">Add clothing to your closet</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors duration-300" />
            </div>
          </Link>

          <Link href="/closet" className="card hover:shadow-lg transition-shadow duration-300 group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center group-hover:bg-secondary-200 transition-colors duration-300">
                <Eye className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">View All Items</h3>
                <p className="text-gray-600 text-sm">Browse your complete closet</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-secondary-600 transition-colors duration-300" />
            </div>
          </Link>

          <Link href="/insights" className="card hover:shadow-lg transition-shadow duration-300 group bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">AI Insights</h3>
                <p className="text-gray-600 text-sm">Keep, donate, or sell</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors duration-300" />
            </div>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Items */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-semibold text-gray-900">
                  Recently Added
                </h2>
                <Link
                  href="/closet"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 h-40 rounded-lg mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : recentItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {recentItems.map((item) => (
                    <ClothingCard key={item.id} item={item} showActions={false} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Shirt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
                  <p className="text-gray-600 mb-4">Start building your digital closet</p>
                  <Link href="/add-item" className="btn-primary inline-flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Your First Item</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Outfit Suggestions */}
          <div className="lg:col-span-1">
            <OutfitSuggestion />

            {/* Weather Widget */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Weather</h3>
              <div className="text-center">
                <div className="text-4xl mb-2">☀️</div>
                <div className="text-2xl font-bold text-gray-900">72°F</div>
                <p className="text-gray-600">Sunny and clear</p>
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Perfect weather for light layers and comfortable fabrics!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}