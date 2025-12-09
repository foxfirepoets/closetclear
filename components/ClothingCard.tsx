'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Heart,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Tag,
  DollarSign,
  Loader2,
  AlertTriangle
} from 'lucide-react'
import { pb, utils } from '@/lib/pocketbase'

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
  tags?: string[]
}

interface ClothingCardProps {
  item: ClothingItem
  showActions?: boolean
  viewMode?: 'grid' | 'list'
  onUpdate?: (updatedItem: ClothingItem) => void
  onDelete?: (deletedItemId: string) => void
}

export default function ClothingCard({
  item,
  showActions = false,
  viewMode = 'grid',
  onUpdate,
  onDelete
}: ClothingCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isWearing, setIsWearing] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const imageUrl = item.image ? utils.getFileUrl(item, item.image, '300x300') : null

  const handleWearItem = async () => {
    if (isWearing) return

    setIsWearing(true)
    try {
      const result = await pb.collection('clothing_items').update(item.id, {
        wear_count: (item.wear_count || 0) + 1,
        last_worn: new Date().toISOString()
      })

      if (onUpdate) {
        onUpdate({
          ...item,
          wear_count: result.wear_count,
          last_worn: result.last_worn
        })
      }
    } catch (error) {
      console.error('Error updating wear count:', error)
    } finally {
      setIsWearing(false)
    }
  }

  const handleDeleteItem = async () => {
    if (isDeleting) return

    setIsDeleting(true)
    try {
      await pb.collection('clothing_items').delete(item.id)

      if (onDelete) {
        onDelete(item.id)
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      setIsDeleting(false)
    }
  }

  const handleToggleFavorite = async () => {
    try {
      setIsFavorite(!isFavorite)
      // TODO: Implement favorite functionality when collection is set up
    } catch (error) {
      console.error('Error toggling favorite:', error)
      setIsFavorite(!isFavorite) // Revert on error
    }
  }

  const formatLastWorn = (lastWorn?: string) => {
    if (!lastWorn) return 'Never worn'

    try {
      const date = new Date(lastWorn)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) return 'Yesterday'
      if (diffDays < 7) return `${diffDays} days ago`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
      return `${Math.floor(diffDays / 365)} years ago`
    } catch {
      return 'Recently'
    }
  }

  if (viewMode === 'list') {
    return (
      <div className="card hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center space-x-4">
          {/* Image */}
          <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={item.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Tag className="h-8 w-8" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {item.name}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                    {item.category}
                  </span>
                  <span className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2 border border-gray-300"
                      style={{ backgroundColor: item.color.toLowerCase() }}
                    />
                    {item.color}
                  </span>
                  {item.brand && <span>{item.brand}</span>}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    Worn {item.wear_count || 0}x
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatLastWorn(item.last_worn)}
                  </p>
                </div>

                {showActions && (
                  <div className="relative">
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {isMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setIsMenuOpen(false)}
                        />
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                          <button
                            onClick={handleWearItem}
                            disabled={isWearing}
                            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                          >
                            {isWearing ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Calendar className="h-4 w-4" />
                            )}
                            <span>Mark as Worn</span>
                          </button>

                          <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                <h3 className="text-lg font-medium text-gray-900">Delete Item</h3>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{item.name}"? This action cannot be undone.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 btn-secondary"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteItem}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Grid view (default)
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 group">
      {/* Image */}
      <div className="relative aspect-square bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Tag className="h-16 w-16" />
          </div>
        )}

        {/* Overlay actions */}
        {showActions && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleWearItem}
                disabled={isWearing}
                className="bg-white text-gray-900 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                title="Mark as worn"
              >
                {isWearing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Calendar className="h-4 w-4" />
                )}
              </button>

              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ${
                  isFavorite
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-900 hover:bg-red-50 hover:text-red-500'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        )}

        {/* Actions menu button */}
        {showActions && (
          <div className="absolute top-2 right-2">
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-white bg-opacity-90 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:bg-opacity-100 transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-600" />
              </button>

              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        // TODO: Open edit modal
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        // TODO: Open detail view
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        setShowDeleteConfirm(true)
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-gray-900 truncate flex-1 mr-2">
            {item.name}
          </h3>
          {item.purchase_price && (
            <div className="flex items-center text-xs text-gray-500">
              <DollarSign className="h-3 w-3 mr-1" />
              <span>{item.purchase_price}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
            {item.category}
          </span>
          <div className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-1 border border-gray-300"
              style={{ backgroundColor: item.color.toLowerCase() }}
            />
            <span className="text-xs text-gray-600">{item.color}</span>
          </div>
        </div>

        {item.brand && (
          <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Worn {item.wear_count || 0}x</span>
          <span>{formatLastWorn(item.last_worn)}</span>
        </div>

        {item.size && (
          <div className="mt-2">
            <span className="text-xs text-gray-500">Size: {item.size}</span>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-medium text-gray-900">Delete Item</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{item.name}"? This action cannot be undone.
            </p>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 btn-secondary"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteItem}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}