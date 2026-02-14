import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export const ImpressumPage = () => {
  return (
    <main className="pt-24 pb-16 md:pt-32 md:pb-24 bg-surface-default min-h-screen" data-testid="impressum-page">
      <div className="max-w-[800px] mx-auto px-6 lg:px-8">
        {/* Back Link */}
        <Link 
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-brand-primary transition-colors mb-8"
          data-testid="impressum-back-link"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          
          <h1 className="font-manrope text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Impressum
          </h1>
          
          <p className="text-lg text-gray-600">
            Legal disclosure according to German law (§ 5 TMG)
          </p>
        </div>

        {/* Placeholder Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12 space-y-8">
          
          {/* Section: Contact Information */}
          <section>
            <h2 className="font-manrope text-xl font-semibold text-gray-900 mb-4">
              Contact Information
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
              <p className="font-medium mb-2">⚠️ PLACEHOLDER - Replace with your legal information</p>
              <p>Add your full name, address, and contact details here as required by German law.</p>
            </div>
            <div className="mt-4 text-gray-600 space-y-2">
              <p><strong>Name:</strong> [Your Full Legal Name]</p>
              <p><strong>Address:</strong> [Your Street Address]</p>
              <p><strong>City:</strong> [Postal Code, City]</p>
              <p><strong>Country:</strong> Germany</p>
              <p><strong>Email:</strong> [Your Contact Email]</p>
            </div>
          </section>

          {/* Section: Responsible for Content */}
          <section>
            <h2 className="font-manrope text-xl font-semibold text-gray-900 mb-4">
              Responsible for Content (§ 55 Abs. 2 RStV)
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
              <p className="font-medium mb-2">⚠️ PLACEHOLDER - Replace with responsible party details</p>
              <p>Add the name and address of the person responsible for the content.</p>
            </div>
            <div className="mt-4 text-gray-600 space-y-2">
              <p><strong>Name:</strong> [Responsible Person's Name]</p>
              <p><strong>Address:</strong> [Address]</p>
            </div>
          </section>

          {/* Section: Disclaimer */}
          <section>
            <h2 className="font-manrope text-xl font-semibold text-gray-900 mb-4">
              Disclaimer
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
              <p className="font-medium mb-2">⚠️ PLACEHOLDER - Add your disclaimer text</p>
              <p>Include liability disclaimers for content and external links as required.</p>
            </div>
          </section>

          {/* Section: Copyright */}
          <section>
            <h2 className="font-manrope text-xl font-semibold text-gray-900 mb-4">
              Copyright
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
              <p className="font-medium mb-2">⚠️ PLACEHOLDER - Add your copyright notice</p>
              <p>Include information about copyright protection of your content.</p>
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

export default ImpressumPage;
