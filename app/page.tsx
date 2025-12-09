'use client'

import Link from 'next/link'
import { Sparkles, Zap, Star, ArrowRight, Shirt, Palette, Brain } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shirt className="h-8 w-8 text-primary-600" />
              <span className="font-display font-bold text-xl text-gray-900">ClosetClear</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="btn-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Wardrobe Intelligence</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 mb-6 leading-tight">
              Revolutionize Your
              <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Closet Experience
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your wardrobe with AI-powered organization, smart outfit suggestions,
              and intelligent inventory management. Your style, simplified.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
              >
                <span>Start Organizing</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/demo"
                className="btn-secondary flex items-center space-x-2 text-lg px-8 py-4"
              >
                <span>Watch Demo</span>
                <Zap className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary-100 to-transparent rounded-full blur-3xl opacity-30 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary-100 to-transparent rounded-full blur-3xl opacity-30 -z-10"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Why Choose ClosetClear?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the future of wardrobe management with features designed to simplify and enhance your style journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center group hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors duration-300">
                <Brain className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-display font-semibold text-gray-900 mb-3">
                AI-Powered Suggestions
              </h3>
              <p className="text-gray-600">
                Get personalized outfit recommendations based on weather, occasion, and your unique style preferences.
              </p>
            </div>

            <div className="card text-center group hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary-200 transition-colors duration-300">
                <Palette className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-display font-semibold text-gray-900 mb-3">
                Smart Organization
              </h3>
              <p className="text-gray-600">
                Automatically categorize and tag your clothing items with advanced image recognition and machine learning.
              </p>
            </div>

            <div className="card text-center group hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors duration-300">
                <Star className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-display font-semibold text-gray-900 mb-3">
                Style Analytics
              </h3>
              <p className="text-gray-600">
                Track your wearing patterns, identify unused items, and optimize your wardrobe for maximum efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Ready to Transform Your Closet?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of style-conscious individuals who have revolutionized their wardrobe management.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center space-x-2 bg-white text-primary-700 font-semibold py-4 px-8 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg"
          >
            <span>Get Started Free</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shirt className="h-6 w-6 text-primary-400" />
              <span className="font-display font-semibold text-white">ClosetClear</span>
            </div>
            <div className="text-center md:text-right">
              <p>&copy; 2024 ClosetClear. All rights reserved.</p>
              <p className="text-sm text-gray-400 mt-1">AI-powered wardrobe management</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}