import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export const PrivacyPolicyPage = () => {
  return (
    <main className="pt-24 pb-16 md:pt-32 md:pb-24 bg-surface-default min-h-screen" data-testid="privacy-policy-page">
      <div className="max-w-[800px] mx-auto px-6 lg:px-8">
        {/* Back Link */}
        <Link 
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-brand-primary transition-colors mb-8"
          data-testid="privacy-back-link"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          
          <h1 className="font-manrope text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-500 italic">Datenschutzerklärung</p>
          
          <p className="text-lg text-gray-600 mt-4">
            Information about data collection and processing on this website
          </p>
        </div>

        {/* Placeholder Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12 space-y-8">
          
          {/* Section: Overview */}
          <section>
            <h2 className="font-manrope text-xl font-semibold text-gray-900 mb-4">
              1. Overview of Data Protection
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
              <p className="font-medium mb-2">⚠️ PLACEHOLDER - Replace with your privacy policy</p>
              <p>Add a general overview of how you handle visitor data on this website.</p>
            </div>
          </section>

          {/* Section: Data Controller */}
          <section>
            <h2 className="font-manrope text-xl font-semibold text-gray-900 mb-4">
              2. Data Controller
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
              <p className="font-medium mb-2">⚠️ PLACEHOLDER - Add data controller information</p>
              <p>Include the name and contact details of the person responsible for data processing.</p>
            </div>
            <div className="mt-4 text-gray-600 space-y-2">
              <p><strong>Name:</strong> [Your Full Legal Name]</p>
              <p><strong>Address:</strong> [Your Address]</p>
              <p><strong>Email:</strong> [Your Contact Email]</p>
            </div>
          </section>

          {/* Section: Data Collection */}
          <section>
            <h2 className="font-manrope text-xl font-semibold text-gray-900 mb-4">
              3. Data Collection on This Website
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
              <p className="font-medium mb-2">⚠️ PLACEHOLDER - Describe data collection practices</p>
              <p>Explain what data is collected (e.g., newsletter signups, contact forms) and how it's used.</p>
            </div>
            
            <div className="mt-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Newsletter Subscription</h3>
              <p className="text-gray-600 text-sm">
                [Describe how newsletter data (name, email) is collected, stored, and used. 
                Include information about consent and how users can unsubscribe.]
              </p>
              
              <h3 className="font-semibold text-gray-900 mt-4">Contact Form</h3>
              <p className="text-gray-600 text-sm">
                [Describe how contact form submissions (name, email, message) are handled and stored.]
              </p>
            </div>
          </section>

          {/* Section: Cookies */}
          <section>
            <h2 className="font-manrope text-xl font-semibold text-gray-900 mb-4">
              4. Cookies
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
              <p className="font-medium mb-2">⚠️ PLACEHOLDER - Add cookie policy</p>
              <p>Describe what cookies (if any) are used on this website and their purpose.</p>
            </div>
          </section>

          {/* Section: Third-Party Services */}
          <section>
            <h2 className="font-manrope text-xl font-semibold text-gray-900 mb-4">
              5. Third-Party Services
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
              <p className="font-medium mb-2">⚠️ PLACEHOLDER - List third-party services</p>
              <p>Include information about any third-party services used (hosting, analytics, etc.) 
              and how they handle data.</p>
            </div>
          </section>

          {/* Section: Your Rights */}
          <section>
            <h2 className="font-manrope text-xl font-semibold text-gray-900 mb-4">
              6. Your Rights (GDPR)
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
              <p className="font-medium mb-2">⚠️ PLACEHOLDER - Add GDPR rights information</p>
              <p>Explain users' rights under GDPR: access, rectification, erasure, restriction, 
              data portability, and right to object.</p>
            </div>
          </section>

          {/* Section: Data Retention */}
          <section>
            <h2 className="font-manrope text-xl font-semibold text-gray-900 mb-4">
              7. Data Retention
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
              <p className="font-medium mb-2">⚠️ PLACEHOLDER - Specify data retention periods</p>
              <p>Describe how long different types of data are stored.</p>
            </div>
          </section>

          {/* Section: Changes */}
          <section>
            <h2 className="font-manrope text-xl font-semibold text-gray-900 mb-4">
              8. Changes to This Policy
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
              <p className="font-medium mb-2">⚠️ PLACEHOLDER - Add change notification policy</p>
              <p>Explain how users will be notified of changes to this privacy policy.</p>
            </div>
          </section>

        </div>

        {/* Last Updated */}
        <p className="text-sm text-gray-400 mt-8 text-center">
          Last updated: [Add Date]
        </p>
      </div>
    </main>
  );
};

export default PrivacyPolicyPage;
