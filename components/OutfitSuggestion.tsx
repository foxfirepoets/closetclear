'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Sparkles,
  RefreshCw,
  Heart,
  Share2,
  Calendar,
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  ArrowRight,
  Shuffle
} from 'lucide-react'
import { pb, utils } from '@/lib/pocketbase'

interface ClothingItem {
  id: string
  name: string
  category: string
  color: string
  image?: string
}

interface OutfitSuggestion {
  id: string
  title: string
  description: string
  occasion: string
  weather: string
  items: ClothingItem[]
  confidence_score: number
}

interface OutfitSuggestionProps {
  className?: string
}

export default function OutfitSuggestion({ className = '' }: OutfitSuggestionProps) {
  const [currentOutfit, setCurrentOutfit] = useState<OutfitSuggestion | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [savedOutfits, setSavedOutfits] = useState<string[]>([])

  // Mock weather data (in production, this would come from a weather API)
  const mockWeather = {
    temperature: 72,
    condition: 'sunny',
    description: 'Sunny and clear',
    icon: Sun
  }

  // Mock outfit suggestions (in production, this would be AI-generated)
  const mockOutfits: OutfitSuggestion[] = [
    {
      id: '1',
      title: 'Casual Chic',
      description: 'Perfect for a casual day out with friends or running errands',
      occasion: 'Casual',
      weather: 'sunny',
      items: [
        { id: '1', name: 'White Cotton T-Shirt', category: 'Tops', color: 'White' },
        { id: '2', name: 'Blue Denim Jeans', category: 'Bottoms', color: 'Blue' },
        { id: '3', name: 'White Sneakers', category: 'Shoes', color: 'White' },
        { id: '4', name: 'Brown Leather Crossbody', category: 'Accessories', color: 'Brown' }
      ],
      confidence_score: 0.92
    },
    {
      id: '2',
      title: 'Business Professional',
      description: 'Sharp and sophisticated for office meetings or presentations',
      occasion: 'Work',
      weather: 'any',
      items: [
        { id: '5', name: 'Navy Blazer', category: 'Outerwear', color: 'Navy' },
        { id: '6', name: 'White Button Shirt', category: 'Tops', color: 'White' },
        { id: '7', name: 'Gray Trousers', category: 'Bottoms', color: 'Gray' },
        { id: '8', name: 'Black Oxford Shoes', category: 'Shoes', color: 'Black' }
      ],
      confidence_score: 0.88
    },
    {
      id: '3',
      title: 'Weekend Comfort',
      description: 'Cozy and relaxed outfit for staying in or light activities',
      occasion: 'Lounging',
      weather: 'cool',
      items: [
        { id: '9', name: 'Gray Hoodie', category: 'Tops', color: 'Gray' },
        { id: '10', name: 'Black Joggers', category: 'Bottoms', color: 'Black' },
        { id: '11', name: 'White Athletic Shoes', category: 'Shoes', color: 'White' }
      ],
      confidence_score: 0.95
    },
    {
      id: '4',
      title: 'Date Night Elegance',
      description: 'Elegant and romantic for special dinner dates',
      occasion: 'Date',
      weather: 'evening',
      items: [
        { id: '12', name: 'Black Midi Dress', category: 'Dresses', color: 'Black' },
        { id: '13', name: 'Red Heels', category: 'Shoes', color: 'Red' },
        { id: '14', name: 'Gold Statement Necklace', category: 'Accessories', color: 'Gold' },
        { id: '15', name: 'Black Clutch', category: 'Accessories', color: 'Black' }
      ],
      confidence_score: 0.90
    }
  ]

  useEffect(() => {
    generateOutfitSuggestion()
  }, [])

  const generateOutfitSuggestion = async () => {
    setIsLoading(true)
    setError('')

    try {
      // In production, this would call an AI service or smart algorithm
      // For now, we'll randomly select from mock data
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call

      const randomOutfit = mockOutfits[Math.floor(Math.random() * mockOutfits.length)]
      setCurrentOutfit(randomOutfit)
    } catch (err) {
      console.error('Error generating outfit suggestion:', err)
      setError('Failed to generate outfit suggestion. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const saveOutfit = async () => {
    if (!currentOutfit) return

    try {
      // In production, save to database
      setSavedOutfits(prev => [...prev, currentOutfit.id])

      // TODO: Implement actual save to PocketBase outfits collection
      console.log('Outfit saved:', currentOutfit.title)
    } catch (error) {
      console.error('Error saving outfit:', error)
    }
  }

  const shareOutfit = async () => {
    if (!currentOutfit) return

    try {
      if (navigator.share) {
        await navigator.share({
          title: `ClosetClear Outfit: ${currentOutfit.title}`,
          text: currentOutfit.description,
          url: window.location.href
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(
          `Check out this outfit suggestion: ${currentOutfit.title} - ${currentOutfit.description}`
        )
        // TODO: Show toast notification
      }
    } catch (error) {
      console.error('Error sharing outfit:', error)
    }
  }

  const getWeatherIcon = () => {
    const IconComponent = mockWeather.icon
    return <IconComponent className="h-5 w-5 text-yellow-500" />
  }

  const getOccasionColor = (occasion: string) => {
    const colors: { [key: string]: string } = {
      'Casual': 'bg-blue-100 text-blue-800',
      'Work': 'bg-purple-100 text-purple-800',
      'Date': 'bg-pink-100 text-pink-800',
      'Lounging': 'bg-green-100 text-green-800',
      'Sport': 'bg-orange-100 text-orange-800',
      'Formal': 'bg-gray-100 text-gray-800'
    }
    return colors[occasion] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className={`card ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Outfit Suggestion</h3>
        </div>
        <button
          onClick={generateOutfitSuggestion}
          disabled={isLoading}
          className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
          title="Generate new suggestion"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Weather Info */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getWeatherIcon()}
            <span className="text-sm font-medium text-gray-900">
              {mockWeather.temperature}°F
            </span>
            <span className="text-sm text-gray-600">
              {mockWeather.description}
            </span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2">
            <Shuffle className="h-5 w-5 animate-spin text-primary-600" />
            <span className="text-gray-600">Generating perfect outfit...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={generateOutfitSuggestion}
            className="btn-primary text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Outfit Suggestion */}
      {currentOutfit && !isLoading && (
        <div className="space-y-4">
          {/* Outfit Header */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-medium text-gray-900">{currentOutfit.title}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOccasionColor(currentOutfit.occasion)}`}>
                {currentOutfit.occasion}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {currentOutfit.description}
            </p>

            {/* Confidence Score */}
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xs text-gray-500">AI Confidence:</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-20">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${currentOutfit.confidence_score * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700">
                {Math.round(currentOutfit.confidence_score * 100)}%
              </span>
            </div>
          </div>

          {/* Outfit Items */}
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-900">Items in this outfit:</h5>
            <div className="space-y-2">
              {currentOutfit.items.map((item, index) => (
                <div key={item.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    {item.image ? (
                      <Image
                        src={utils.getFileUrl(item, item.image, '100x100')}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover rounded-lg"
                        unoptimized
                      />
                    ) : (
                      <div
                        className="w-6 h-6 rounded-full border border-gray-400"
                        style={{ backgroundColor: item.color.toLowerCase() }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.category} • {item.color}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-4">
            <button
              onClick={saveOutfit}
              className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors duration-200 text-sm font-medium"
            >
              <Heart className={`h-4 w-4 ${savedOutfits.includes(currentOutfit.id) ? 'fill-current' : ''}`} />
              <span>{savedOutfits.includes(currentOutfit.id) ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={shareOutfit}
              className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>

          {/* Generate Another */}
          <button
            onClick={generateOutfitSuggestion}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-300 hover:text-primary-600 transition-colors duration-200 text-sm font-medium disabled:opacity-50"
          >
            <Shuffle className="h-4 w-4" />
            <span>Generate Another</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* No Data State */}
      {!currentOutfit && !isLoading && !error && (
        <div className="text-center py-8">
          <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            AI Outfit Suggestions
          </h4>
          <p className="text-gray-600 text-sm mb-4">
            Add some clothing items to get personalized outfit suggestions
          </p>
          <button
            onClick={generateOutfitSuggestion}
            className="btn-primary text-sm"
          >
            Get Started
          </button>
        </div>
      )}
    </div>
  )
}