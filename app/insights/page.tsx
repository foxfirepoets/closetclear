'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Loader2, Package, DollarSign, Heart, Trash2, AlertCircle, RefreshCw, TrendingUp, Palette, Calendar, ShoppingBag } from 'lucide-react'
import { pb } from '@/lib/pocketbase'
import Navbar from '@/components/Navbar'

interface ClothingItem {
  id: string
  name: string
  category: string
  color: string
  season: string
  wear_count: number
  purchase_price?: number
  created: string
  last_worn?: string
  tags?: string[]
}

interface ItemRecommendation {
  item_id: string
  item_name: string
  decision: 'keep' | 'donate' | 'sell'
  reason: string
  estimated_resale_value?: number
  urgency: 'high' | 'medium' | 'low'
}

interface WardrobeInsights {
  total_items: number
  items_to_keep: number
  items_to_donate: number
  items_to_sell: number
  estimated_total_resale: number
  category_breakdown: Record<string, number>
  color_analysis: {
    dominant_colors: string[]
    missing_basics: string[]
  }
  seasonal_gaps: string[]
  recommendations: ItemRecommendation[]
  general_advice: string[]
}

export default function InsightsPage() {
  const [items, setItems] = useState<ClothingItem[]>([])
  const [insights, setInsights] = useState<WardrobeInsights | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'keep' | 'donate' | 'sell'>('all')

  useEffect(() => {
    loadWardrobe()
  }, [])

  const loadWardrobe = async () => {
    try {
      const userId = pb.authStore.model?.id
      if (!userId) {
        setError('Please log in to view insights')
        setIsLoading(false)
        return
      }

      const records = await pb.collection('clothing_items').getFullList({
        filter: `user = "${userId}"`,
        sort: '-created'
      })

      setItems(records as unknown as ClothingItem[])
    } catch (err) {
      console.error('Error loading wardrobe:', err)
      setError('Failed to load wardrobe items')
    } finally {
      setIsLoading(false)
    }
  }

  const analyzeWardrobe = async () => {
    if (items.length === 0) {
      setError('Add some items to your wardrobe first')
      return
    }

    setIsAnalyzing(true)
    setError('')

    try {
      const response = await fetch('/api/wardrobe-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wardrobeItems: items })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze wardrobe')
      }

      setInsights(data.insights)
    } catch (err: any) {
      console.error('Error analyzing wardrobe:', err)
      setError(err.message || 'Failed to analyze wardrobe')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const filteredRecommendations = insights?.recommendations.filter(rec => {
    if (activeFilter === 'all') return true
    return rec.decision === activeFilter
  }) || []

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'keep': return <Heart className="h-4 w-4 text-green-600" />
      case 'donate': return <Package className="h-4 w-4 text-blue-600" />
      case 'sell': return <DollarSign className="h-4 w-4 text-yellow-600" />
      default: return null
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span>Back</span>
            </Link>
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">Wardrobe Insights</h1>
              <p className="text-gray-600">AI-powered recommendations for your closet</p>
            </div>
          </div>
          <button
            onClick={analyzeWardrobe}
            disabled={isAnalyzing || items.length === 0}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze Wardrobe
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3 mb-6">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {items.length === 0 ? (
          <div className="card text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wardrobe is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to get AI-powered insights</p>
            <Link href="/add-item" className="btn-primary">
              Add Your First Item
            </Link>
          </div>
        ) : !insights ? (
          <div className="card text-center py-12">
            <Sparkles className="h-16 w-16 text-purple-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Ready to analyze {items.length} items</h2>
            <p className="text-gray-600 mb-6">Get personalized keep, donate, or sell recommendations</p>
            <button
              onClick={analyzeWardrobe}
              disabled={isAnalyzing}
              className="btn-primary inline-flex items-center"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Analysis
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card bg-green-50 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Keep</p>
                    <p className="text-2xl font-bold text-green-900">{insights.items_to_keep}</p>
                  </div>
                  <Heart className="h-8 w-8 text-green-400" />
                </div>
              </div>
              <div className="card bg-blue-50 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Donate</p>
                    <p className="text-2xl font-bold text-blue-900">{insights.items_to_donate}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-400" />
                </div>
              </div>
              <div className="card bg-yellow-50 border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600 font-medium">Sell</p>
                    <p className="text-2xl font-bold text-yellow-900">{insights.items_to_sell}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-yellow-400" />
                </div>
              </div>
              <div className="card bg-purple-50 border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Resale Value</p>
                    <p className="text-2xl font-bold text-purple-900">${insights.estimated_total_resale}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Insights Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Color Analysis */}
              <div className="card">
                <div className="flex items-center space-x-2 mb-4">
                  <Palette className="h-5 w-5 text-primary-600" />
                  <h3 className="font-semibold text-gray-900">Color Analysis</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Dominant Colors:</p>
                    <div className="flex flex-wrap gap-2">
                      {insights.color_analysis.dominant_colors.map((color, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm">
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                  {insights.color_analysis.missing_basics.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Consider Adding:</p>
                      <div className="flex flex-wrap gap-2">
                        {insights.color_analysis.missing_basics.map((color, i) => (
                          <span key={i} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Seasonal Gaps */}
              <div className="card">
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="h-5 w-5 text-primary-600" />
                  <h3 className="font-semibold text-gray-900">Seasonal Balance</h3>
                </div>
                {insights.seasonal_gaps.length > 0 ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">You could use more items for:</p>
                    <div className="flex flex-wrap gap-2">
                      {insights.seasonal_gaps.map((season, i) => (
                        <span key={i} className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm">
                          {season}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-green-600">Your wardrobe is well-balanced across seasons!</p>
                )}
              </div>
            </div>

            {/* General Advice */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Expert Advice</h3>
              </div>
              <ul className="space-y-2">
                {insights.general_advice.map((advice, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span className="text-gray-700">{advice}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Item Recommendations */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Item Recommendations</h3>
                <div className="flex space-x-2">
                  {(['all', 'keep', 'donate', 'sell'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        activeFilter === filter
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredRecommendations.map((rec, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg border ${
                      rec.decision === 'keep'
                        ? 'bg-green-50 border-green-200'
                        : rec.decision === 'donate'
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getDecisionIcon(rec.decision)}
                        <div>
                          <p className="font-medium text-gray-900">{rec.item_name}</p>
                          <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(rec.urgency)}`}>
                          {rec.urgency} priority
                        </span>
                        {rec.estimated_resale_value && (
                          <span className="text-sm font-medium text-green-600">
                            ~${rec.estimated_resale_value}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Refresh Button */}
            <div className="text-center">
              <button
                onClick={analyzeWardrobe}
                disabled={isAnalyzing}
                className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
                Re-analyze wardrobe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
