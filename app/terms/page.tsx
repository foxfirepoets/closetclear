'use client'

import Link from 'next/link'
import { Shirt, ArrowLeft, FileText } from 'lucide-react'

export default function TermsPage() {
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
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
                Terms of Service
              </h1>
              <p className="text-gray-500 text-sm mt-1">Last updated: December 9, 2024</p>
            </div>
          </div>

          {/* Terms Content */}
          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600 mb-4">
                By accessing and using ClosetClear ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                2. Use of Service
              </h2>
              <p className="text-gray-600 mb-4">
                ClosetClear provides an AI-powered wardrobe management platform. You agree to use the Service only for lawful purposes and in accordance with these Terms.
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>You must be at least 13 years old to use this Service</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You agree not to misuse the Service or help anyone else do so</li>
                <li>You will not upload content that infringes on others' intellectual property rights</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                3. User Content
              </h2>
              <p className="text-gray-600 mb-4">
                You retain all rights to the content you upload to ClosetClear. By uploading content, you grant us a license to use, store, and display your content solely for the purpose of providing the Service.
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>You are responsible for the content you upload</li>
                <li>We reserve the right to remove content that violates these terms</li>
                <li>Your images and data are stored securely and privately</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                4. Privacy and Data Protection
              </h2>
              <p className="text-gray-600 mb-4">
                Your privacy is important to us. Please review our{' '}
                <Link href="/privacy" className="text-primary-600 hover:text-primary-500 font-medium">
                  Privacy Policy
                </Link>{' '}
                to understand how we collect, use, and protect your personal information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                5. AI-Generated Recommendations
              </h2>
              <p className="text-gray-600 mb-4">
                ClosetClear uses artificial intelligence to provide outfit suggestions and wardrobe insights. While we strive for accuracy, AI-generated recommendations are provided "as is" without warranties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                6. Subscription and Payments
              </h2>
              <p className="text-gray-600 mb-4">
                Some features of ClosetClear may require a paid subscription. By subscribing, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Pay all applicable fees as described at the time of purchase</li>
                <li>Automatic renewal unless cancelled before the renewal date</li>
                <li>All fees are non-refundable except as required by law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                7. Termination
              </h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to terminate or suspend your account at our discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                8. Limitation of Liability
              </h2>
              <p className="text-gray-600 mb-4">
                ClosetClear and its affiliates will not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                9. Changes to Terms
              </h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through the Service. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                10. Contact Information
              </h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="text-gray-600">
                Email: <a href="mailto:legal@closetclear.com" className="text-primary-600 hover:text-primary-500 font-medium">legal@closetclear.com</a>
              </p>
            </section>
          </div>

          {/* Footer Actions */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Link
              href="/privacy"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              View Privacy Policy
            </Link>
            <Link
              href="/register"
              className="btn-primary"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
