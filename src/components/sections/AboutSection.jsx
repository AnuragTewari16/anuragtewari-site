import React from 'react';

export const AboutSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white" data-testid="about-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="font-manrope text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-8">
            About Me
          </h2>
          
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p className="text-lg">
              I'm a creator based in Berlin with a background in engineering and business. 
              For over a decade, I've worked in data-driven, high-responsibility environments where 
              decisions carry real consequences.
            </p>
            
            <p className="text-lg">
              Today, I'm passionate about exploring the intersection of <strong className="text-gray-900">AI tools</strong>, 
              <strong className="text-gray-900"> investing</strong>, and <strong className="text-gray-900">building leverage</strong> — 
              sharing what I learn along the way.
            </p>
            
            <p className="text-lg">
              I'm still a full-time employee. This site and my YouTube channel are my personal spaces 
              to learn by doing, share my experiments, and connect with others on a similar journey.
            </p>

            {/* Values statement */}
            <div className="mt-8 p-6 bg-surface-subtle rounded-xl border border-gray-100">
              <p className="text-lg font-medium text-gray-900 italic">
                "I value clarity over hype, systems over shortcuts, and long-term thinking over quick wins."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
