'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, Camera, Loader2, CheckCircle, AlertCircle, Sparkles, Wand2 } from 'lucide-react'
import { pb } from '@/lib/pocketbase'
import Navbar from '@/components/Navbar'

interface FormData {
  name: string
  category: string
  color: string
  brand: string
  size: string
  season: string
  purchase_price: string
  description: string
  tags: string
}

interface AIAnalysis {
  name: string
  category: string
  color: string
  pattern: string
  material: string
  style: string
  season: string
  occasions: string[]
  brand_guess: string
  condition: string
  care_tips: string[]
  resale_potential: string
  keep_donate_sell: string
  recommendation_reason: string
}

const CATEGORIES = [
  'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes',
  'Accessories', 'Underwear', 'Sleepwear', 'Activewear', 'Other'
]

const COLORS = [
  'Black', 'White', 'Gray', 'Brown', 'Beige', 'Red', 'Pink',
  'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Navy',
  'Burgundy', 'Gold', 'Silver', 'Multi-color'
]

const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter', 'All Seasons']

const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'One Size', 'Other']

export default function AddItemPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: 'Tops',
    color: 'Black',
    brand: '',
    size: 'M',
    season: 'All Seasons',
    purchase_price: '',
    description: '',
    tags: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    if (error) setError('')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }

      setSelectedFile(file)
      setAiAnalysis(null) // Reset AI analysis when new image selected

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      if (error) setError('')
    }
  }

  const analyzeWithAI = async () => {
    if (!selectedFile) {
      setError('Please upload an image first')
      return
    }

    setIsAnalyzing(true)
    setError('')

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('image', selectedFile)

      const response = await fetch('/api/analyze-item', {
        method: 'POST',
        body: formDataToSend
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze image')
      }

      const analysis = data.analysis as AIAnalysis
      setAiAnalysis(analysis)

      // Auto-fill form with AI analysis
      setFormData(prev => ({
        ...prev,
        name: analysis.name || prev.name,
        category: CATEGORIES.includes(analysis.category) ? analysis.category : prev.category,
        color: COLORS.includes(analysis.color) ? analysis.color : prev.color,
        brand: analysis.brand_guess !== 'Unknown' ? analysis.brand_guess : prev.brand,
        season: SEASONS.includes(analysis.season) ? analysis.season : prev.season,
        description: `${analysis.style} ${analysis.material || ''} ${analysis.pattern || ''} item. ${analysis.recommendation_reason}`.trim(),
        tags: analysis.occasions?.join(', ') || prev.tags
      }))

    } catch (err: any) {
      console.error('AI analysis error:', err)
      setError(err.message || 'Failed to analyze image with AI')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Item name is required')
      return false
    }
    if (!formData.category) {
      setError('Please select a category')
      return false
    }
    if (!formData.color) {
      setError('Please select a color')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      // Prepare form data for PocketBase
      const data = new FormData()

      // Add text fields
      data.append('name', formData.name.trim())
      data.append('category', formData.category)
      data.append('color', formData.color)
      data.append('brand', formData.brand.trim())
      data.append('size', formData.size)
      data.append('season', formData.season)
      data.append('description', formData.description.trim())
      const userId = pb.authStore.model?.id || ''
      data.append('user', userId)
      data.append('wear_count', '0')

      // Handle purchase price
      if (formData.purchase_price) {
        const price = parseFloat(formData.purchase_price)
        if (!isNaN(price) && price >= 0) {
          data.append('purchase_price', price.toString())
        }
      }

      // Handle tags
      if (formData.tags.trim()) {
        const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        data.append('tags', JSON.stringify(tags))
      }

      // Add AI analysis metadata if available
      if (aiAnalysis) {
        data.append('ai_analysis', JSON.stringify(aiAnalysis))
      }

      // Add image file if selected
      if (selectedFile) {
        data.append('image', selectedFile)
      }

      // Create the record
      const record = await pb.collection('clothing_items').create(data)

      setSuccess(true)

      // Reset form after successful submission
      setTimeout(() => {
        router.push('/closet')
      }, 1500)

    } catch (err: any) {
      console.error('Error creating clothing item:', err)

      if (err?.data?.data?.name?.code === 'validation_required') {
        setError('Item name is required')
      } else if (err?.status === 400) {
        setError('Failed to create item. Please check your information.')
      } else {
        setError('Failed to create item. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Tops',
      color: 'Black',
      brand: '',
      size: 'M',
      season: 'All Seasons',
      purchase_price: '',
      description: '',
      tags: ''
    })
    setSelectedFile(null)
    setImagePreview(null)
    setAiAnalysis(null)
    setError('')
    setSuccess(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Added Successfully!</h2>
            <p className="text-gray-600 mb-6">Your item has been added to your closet.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={resetForm}
                className="btn-secondary"
              >
                Add Another Item
              </button>
              <Link href="/closet" className="btn-primary">
                View My Closet
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href="/dashboard"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span>Back</span>
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Add New Item</h1>
            <p className="text-gray-600">Add a clothing item to your closet</p>
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Photo
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors duration-200">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full h-48 object-contain mx-auto rounded-lg"
                    />
                    <div className="flex justify-center space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null)
                          setImagePreview(null)
                          setAiAnalysis(null)
                        }}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove Image
                      </button>
                      <button
                        type="button"
                        onClick={analyzeWithAI}
                        disabled={isAnalyzing}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-4 w-4 mr-2" />
                            AI Auto-Fill
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-gray-600 mb-2">Upload a photo of your item</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="image-upload"
                        disabled={isLoading}
                      />
                      <label
                        htmlFor="image-upload"
                        className="btn-secondary inline-flex items-center space-x-2 cursor-pointer"
                      >
                        <Camera className="h-4 w-4" />
                        <span>Choose Photo</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Analysis Results */}
            {aiAnalysis && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-900">AI Analysis Complete</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Style:</span>
                    <span className="ml-2 text-gray-900">{aiAnalysis.style}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Material:</span>
                    <span className="ml-2 text-gray-900">{aiAnalysis.material}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Pattern:</span>
                    <span className="ml-2 text-gray-900">{aiAnalysis.pattern}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Condition:</span>
                    <span className="ml-2 text-gray-900">{aiAnalysis.condition}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-purple-200">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      aiAnalysis.keep_donate_sell === 'keep'
                        ? 'bg-green-100 text-green-800'
                        : aiAnalysis.keep_donate_sell === 'sell'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      Suggestion: {aiAnalysis.keep_donate_sell.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      aiAnalysis.resale_potential === 'high'
                        ? 'bg-green-100 text-green-800'
                        : aiAnalysis.resale_potential === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      Resale: {aiAnalysis.resale_potential}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{aiAnalysis.recommendation_reason}</p>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Blue denim jacket"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  id="brand"
                  name="brand"
                  type="text"
                  value={formData.brand}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Nike, H&M, Zara"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                  disabled={isLoading}
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                  Color *
                </label>
                <select
                  id="color"
                  name="color"
                  required
                  value={formData.color}
                  onChange={handleChange}
                  className="input-field"
                  disabled={isLoading}
                >
                  {COLORS.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <select
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="input-field"
                  disabled={isLoading}
                >
                  {SIZES.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="season" className="block text-sm font-medium text-gray-700 mb-2">
                  Season
                </label>
                <select
                  id="season"
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                  className="input-field"
                  disabled={isLoading}
                >
                  {SEASONS.map(season => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="purchase_price" className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Price
                </label>
                <input
                  id="purchase_price"
                  name="purchase_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.purchase_price}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="0.00"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., casual, work, formal (comma separated)"
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate tags with commas to help organize and find your items
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="input-field resize-none"
                placeholder="Add any additional details about this item..."
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Adding Item...</span>
                  </>
                ) : (
                  <span>Add to Closet</span>
                )}
              </button>

              <Link
                href="/dashboard"
                className="btn-secondary"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
