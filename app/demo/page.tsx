'use client'

import Link from 'next/link'
import { Shirt, ArrowLeft, Play, Star, Zap, Check } from 'lucide-react'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Shirt className="h-8 w-8 text-primary-600" />
              <span className="font-display font-bold text-xl text-gray-900">ClosetClear</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              See ClosetClear in Action
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch how ClosetClear transforms your wardrobe management with AI-powered features
            </p>
          </div>

          {/* Video Demo Placeholder */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden aspect-video">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-secondary-100 flex flex-col items-center justify-center">
                <div className="bg-white rounded-full p-6 shadow-lg mb-6">
                  <Play className="h-16 w-16 text-primary-600" />
                </div>
                <h3 className="text-2xl font-display font-semibold text-gray-900 mb-2">
                  Interactive Demo Coming Soon
                </h3>
                <p className="text-gray-600 text-center max-w-md px-4">
                  Experience the full power of ClosetClear by creating your free account today
                </p>
                <Link
                  href="/register"
                  className="mt-6 btn-primary flex items-center space-x-2"
                >
                  <span>Get Started Free</span>
                  <Zap className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
                Smart Cataloging
              </h3>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>AI-powered image recognition</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Automatic categorization</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Color and style tagging</span>
                </li>
              </ul>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-secondary-600" />
              </div>
              <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
                Outfit Suggestions
              </h3>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Weather-aware recommendations</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Occasion-based styling</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Personal style learning</span>
                </li>
              </ul>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
                Wardrobe Analytics
              </h3>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Wear frequency tracking</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Cost per wear calculations</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Unused items identification</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <div className="inline-block bg-white rounded-2xl shadow-xl p-8 max-w-2xl">
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-gray-600 mb-6">
                Join thousands of users who have already transformed their closet experience
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <span>Create Free Account</span>
                  <Zap className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="btn-secondary flex items-center justify-center space-x-2"
                >
                  <span>Sign In</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
