'use client'

import Link from 'next/link'
import { Shirt, ArrowLeft, Shield } from 'lucide-react'

export default function PrivacyPage() {
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
              <Shield className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
                Privacy Policy
              </h1>
              <p className="text-gray-500 text-sm mt-1">Last updated: December 9, 2024</p>
            </div>
          </div>

          {/* Privacy Content */}
          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-600 mb-4">
                ClosetClear ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered wardrobe management service.
              </p>
              <p className="text-gray-600 mb-4">
                By using ClosetClear, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                2. Information We Collect
              </h2>
              <h3 className="text-xl font-display font-semibold text-gray-900 mb-3 mt-6">
                2.1 Personal Information
              </h3>
              <p className="text-gray-600 mb-4">
                When you create an account, we collect:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Name and email address</li>
                <li>Account credentials (encrypted password)</li>
                <li>Profile information you choose to provide</li>
              </ul>

              <h3 className="text-xl font-display font-semibold text-gray-900 mb-3 mt-6">
                2.2 Wardrobe Data
              </h3>
              <p className="text-gray-600 mb-4">
                To provide our service, we collect:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Photos of clothing items you upload</li>
                <li>Item descriptions, categories, and tags</li>
                <li>Outfit combinations you create</li>
                <li>Usage patterns and preferences</li>
              </ul>

              <h3 className="text-xl font-display font-semibold text-gray-900 mb-3 mt-6">
                2.3 Automatically Collected Information
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Device information (browser type, operating system)</li>
                <li>IP address and general location data</li>
                <li>Usage statistics and analytics</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-600 mb-4">
                We use the collected information to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Provide, maintain, and improve our service</li>
                <li>Generate AI-powered outfit suggestions and recommendations</li>
                <li>Analyze wardrobe patterns and usage statistics</li>
                <li>Communicate with you about your account and updates</li>
                <li>Detect and prevent fraud or abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                4. AI and Machine Learning
              </h2>
              <p className="text-gray-600 mb-4">
                ClosetClear uses artificial intelligence to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Automatically categorize and tag clothing items from images</li>
                <li>Generate personalized outfit recommendations</li>
                <li>Identify colors, patterns, and styles</li>
                <li>Improve service quality through machine learning</li>
              </ul>
              <p className="text-gray-600 mb-4 mt-4">
                Your images are processed securely, and we do not use your personal wardrobe data to train models that would be shared with other users without your explicit consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                5. Data Sharing and Disclosure
              </h2>
              <p className="text-gray-600 mb-4">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Service Providers:</strong> Trusted third-party services that help us operate (e.g., cloud hosting, analytics)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                6. Data Security
              </h2>
              <p className="text-gray-600 mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Encrypted data transmission (HTTPS/TLS)</li>
                <li>Secure password hashing</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
              </ul>
              <p className="text-gray-600 mb-4 mt-4">
                However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                7. Your Privacy Rights
              </h2>
              <p className="text-gray-600 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct your information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Data Portability:</strong> Export your wardrobe data</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              </ul>
              <p className="text-gray-600 mb-4 mt-4">
                To exercise these rights, contact us at{' '}
                <a href="mailto:privacy@closetclear.com" className="text-primary-600 hover:text-primary-500 font-medium">
                  privacy@closetclear.com
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                8. Cookies and Tracking
              </h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Maintain your session and keep you logged in</li>
                <li>Remember your preferences</li>
                <li>Analyze usage patterns and improve our service</li>
                <li>Provide personalized experiences</li>
              </ul>
              <p className="text-gray-600 mb-4 mt-4">
                You can control cookies through your browser settings, but some features may not work properly if cookies are disabled.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                9. Children's Privacy
              </h2>
              <p className="text-gray-600 mb-4">
                ClosetClear is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will delete it promptly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                10. International Data Transfers
              </h2>
              <p className="text-gray-600 mb-4">
                Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                11. Changes to This Policy
              </h2>
              <p className="text-gray-600 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by email or through a notice on our service. Your continued use of ClosetClear after such changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                12. Contact Us
              </h2>
              <p className="text-gray-600 mb-4">
                If you have questions or concerns about this Privacy Policy, please contact us:
              </p>
              <p className="text-gray-600">
                Email: <a href="mailto:privacy@closetclear.com" className="text-primary-600 hover:text-primary-500 font-medium">privacy@closetclear.com</a>
              </p>
            </section>
          </div>

          {/* Footer Actions */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Link
              href="/terms"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              View Terms of Service
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
