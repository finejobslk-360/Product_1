'use client';
/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import {
  Rocket,
  Users,
  Briefcase,
  Building2,
  Check,
  Globe,
  Lock,
  Shield,
  Clock,
} from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Our Mission Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Rocket className="w-8 h-8 text-orange-500" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                Our Mission
              </h1>
            </div>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              We're revolutionizing the way talent connects with opportunity. Our dual-platform
              approach bridges the gap between traditional employment and freelance work, creating a
              comprehensive ecosystem where careers flourish.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              From entry-level positions to executive roles, from quick gigs to long-term
              projects—we believe everyone deserves access to meaningful work that matches their
              skills, aspirations, and lifestyle.
            </p>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">50K+</div>
                <div className="text-gray-600 text-sm md:text-base">Active Users</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">25K+</div>
                <div className="text-gray-600 text-sm md:text-base">Jobs Posted</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">15K+</div>
                <div className="text-gray-600 text-sm md:text-base">Projects Completed</div>
              </div>
            </div>
          </div>

          {/* Right Side - Image Placeholder */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <div className="aspect-[4/3] bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
              <Users className="w-32 h-32 text-white opacity-80" />
            </div>
          </div>
        </div>
      </section>

      {/* How We Help Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
              How We Help
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our platform serves four key communities, each with unique needs and goals. Here's how
              we support each group in their journey to success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {/* Job Seekers Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-l-4 border-blue-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Job Seekers</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Find your perfect role with our advanced matching system and comprehensive job
                listings.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">Advanced job matching</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">Portfolio builder</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">Career guidance</span>
                </li>
              </ul>
            </div>

            {/* Freelancers Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-l-4 border-green-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Freelancers</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Build your freelance career with access to quality projects and secure payment
                systems.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Project marketplace</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Secure payments</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Skill verification</span>
                </li>
              </ul>
            </div>

            {/* Employers Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-l-4 border-orange-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Employers</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Discover top talent and streamline your hiring process with our powerful recruitment
                tools.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  <span className="text-gray-700">Smart candidate matching</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  <span className="text-gray-700">Applicant tracking</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  <span className="text-gray-700">Team collaboration tools</span>
                </li>
              </ul>
            </div>

            {/* Clients Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-l-4 border-purple-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Clients</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Get your projects done by skilled professionals with full project management
                support.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="text-gray-700">Project management</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="text-gray-700">Quality assurance</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="text-gray-700">24/7 support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Company Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
            Our Company
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed">
            Passionate professionals dedicated to transforming how the world works. We're here to
            support your journey every step of the way.
          </p>

          {/* Globe Icon with 360 */}
          <div className="flex justify-center">
            <div className="relative">
              <Globe className="w-48 h-48 md:w-64 md:h-64 text-gray-800" strokeWidth={1.5} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl md:text-8xl font-bold text-blue-600">360</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Transform Your Career Section */}
      <section className="bg-gradient-to-r from-blue-600 to-orange-500 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed">
            Join thousands of professionals who have already discovered their next opportunity.
            Whether you're seeking employment, freelance work, or looking to hire talent—your
            journey starts here.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 mb-8 md:mb-12">
            <button className="bg-white text-gray-900 px-8 md:px-10 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Join Our Platform Today
            </button>
            <button className="bg-gray-100 text-gray-900 px-8 md:px-10 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Schedule a Demo
            </button>
          </div>

          {/* Features */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 md:gap-12 text-white/90">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              <span className="text-sm md:text-base">Free to join</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm md:text-base">Secure platform</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm md:text-base">24/7 support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">360</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">360 Technologies</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Connecting talent with opportunities worldwide.
              </p>
            </div>

            {/* For Job Seekers */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">For Job Seekers</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                  >
                    Browse Jobs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                  >
                    Career Resources
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                  >
                    Resume Builder
                  </a>
                </li>
              </ul>
            </div>

            {/* For Employers */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">For Employers</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                  >
                    Post Jobs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                  >
                    Find Talent
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-gray-600 text-sm">© 2025 360 Technologies. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
