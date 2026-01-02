'use client';
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import {
  Briefcase,
  GraduationCap,
  User,
  Award,
  CheckCircle,
  ChevronDown,
  Lightbulb,
  Users,
  Scale,
  Send,
  UserPlus,
} from 'lucide-react';

export default function JobPortalLanding() {
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedExperience, setSelectedExperience] = useState('');

  const steps = [
    { id: 1, icon: CheckCircle, label: 'Start' },
    { id: 2, icon: Briefcase, label: 'Experience' },
    { id: 3, icon: GraduationCap, label: 'Education' },
    { id: 4, icon: User, label: 'Profile' },
    { id: 5, icon: Award, label: 'Complete' },
  ];

  const handleFindJob = () => {
    setShowModal(true);
    setCurrentStep(1);
  };

  const handleExperienceSelect = (level: 'entry' | 'mid' | 'senior') => {
    setSelectedExperience(level);
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Chevron Icon Below Header */}
      <div className="container mx-auto px-4 pt-6 pb-4 flex justify-center relative z-10">
        <ChevronDown className="w-10 h-10 md:w-12 md:h-12 text-gray-600 animate-bounce" />
      </div>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8 md:py-16 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-2 md:mb-4 leading-tight tracking-tight">
          Your Next Big
        </h1>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-6 md:mb-10 leading-tight tracking-tight">
          <span className="relative inline-block">
            Opportunity
            <svg
              className="absolute -bottom-3 md:-bottom-4 left-0 w-full"
              height="24"
              viewBox="0 0 500 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 18 Q 250 8, 495 18"
                stroke="#FF8C00"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>{' '}
          <span className="relative inline-block">
            Awaits
            <svg
              className="absolute -bottom-3 md:-bottom-4 left-0 w-full"
              height="24"
              viewBox="0 0 200 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 18 Q 100 8, 195 18"
                stroke="#FF8C00"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </h1>

        <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-10 md:mb-14 max-w-4xl mx-auto leading-relaxed px-4 font-light">
          Whether you're searching for your dream Job or offering your skills as a freelancer, we
          connect talent with opportunity — faster, smarter, and simpler.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 mb-20 md:mb-24 px-4">
          <button
            onClick={handleFindJob}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 md:px-14 py-4 md:py-5 rounded-xl text-base md:text-lg font-bold hover:from-orange-600 hover:to-orange-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 uppercase tracking-wide"
          >
            FIND A JOB
          </button>
          <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 md:px-14 py-4 md:py-5 rounded-xl text-base md:text-lg font-bold hover:from-orange-600 hover:to-orange-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 uppercase tracking-wide">
            POST A GIG
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 md:gap-16 px-4 pb-12">
          <div className="text-center transform hover:scale-110 transition-transform duration-300 group">
            <div className="text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2 group-hover:from-blue-700 group-hover:to-blue-800 transition-all duration-300">
              10,000+
            </div>
            <div className="text-gray-600 font-semibold text-base md:text-lg">Jobs Posted</div>
          </div>
          <div className="hidden sm:block w-px h-20 bg-gradient-to-b from-transparent via-blue-400 to-transparent"></div>
          <div className="text-center transform hover:scale-110 transition-transform duration-300 group">
            <div className="text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2 group-hover:from-blue-700 group-hover:to-blue-800 transition-all duration-300">
              6500+
            </div>
            <div className="text-gray-600 font-semibold text-base md:text-lg">Active Users</div>
          </div>
          <div className="hidden sm:block w-px h-20 bg-gradient-to-b from-transparent via-blue-400 to-transparent"></div>
          <div className="text-center transform hover:scale-110 transition-transform duration-300 group">
            <div className="text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2 group-hover:from-blue-700 group-hover:to-blue-800 transition-all duration-300">
              1000+
            </div>
            <div className="text-gray-600 font-semibold text-base md:text-lg">Employers</div>
          </div>
        </div>
      </main>

      {/* Why Work With Us Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 relative z-10" id="jobs">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
            Why Work With Us
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join a team that values innovation, diversity, and personal growth while making a real
            impact on the future of work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Innovation & Growth */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <Lightbulb className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
              Innovation & Growth
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Work with cutting-edge technology and contribute to innovative solutions that shape
              the future of work.
            </p>
          </div>

          {/* Diversity & Inclusion */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
              Diversity & Inclusion
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Celebrate different perspectives and backgrounds in our inclusive, collaborative
              environment.
            </p>
          </div>

          {/* Work-Life Balance */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <Scale className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Work-Life Balance</h3>
            <p className="text-gray-600 leading-relaxed">
              Flexible schedules, remote options, and wellness programs to help you thrive
              personally and professionally.
            </p>
          </div>

          {/* Learning Opportunities */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
              <GraduationCap className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
              Learning Opportunities
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Continuous learning through mentorship, conferences, courses, and hands-on experience
              with new technologies.
            </p>
          </div>
        </div>
      </section>

      {/* Life at 360 Technologies Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
            Life at 360 Technologies
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience our vibrant culture through the eyes of our team members who are passionate
            about building the future of work.
          </p>
        </div>

        {/* Image Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {/* Team Collaboration */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
            <div className="aspect-[4/3] bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <Users className="w-24 h-24 text-white opacity-80" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
              <div>
                <h3 className="text-white text-xl md:text-2xl font-bold mb-2">
                  Team Collaboration
                </h3>
                <p className="text-white/90 text-sm md:text-base">
                  Working together on innovative solutions
                </p>
              </div>
            </div>
          </div>

          {/* Company Events */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
            <div className="aspect-[4/3] bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center">
              <Users className="w-24 h-24 text-white opacity-80" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
              <div>
                <h3 className="text-white text-xl md:text-2xl font-bold mb-2">Company Events</h3>
                <p className="text-white/90 text-sm md:text-base">
                  Building connections beyond work
                </p>
              </div>
            </div>
          </div>

          {/* Remote Flexibility */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
            <div className="aspect-[4/3] bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center">
              <User className="w-24 h-24 text-white opacity-80" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
              <div>
                <h3 className="text-white text-xl md:text-2xl font-bold mb-2">
                  Remote Flexibility
                </h3>
                <p className="text-white/90 text-sm md:text-base">
                  Work from anywhere in the world
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Sarah Chen Testimonial */}
          <div className="bg-orange-50 rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">Sarah Chen</h4>
                <p className="text-gray-600 text-sm">Senior Frontend Engineer</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed italic">
              "WorkFlow has given me the opportunity to work on cutting-edge projects while
              maintaining a healthy work-life balance. The team is incredibly supportive and
              innovative."
            </p>
          </div>

          {/* Marcus Johnson Testimonial */}
          <div className="bg-blue-50 rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">Marcus Johnson</h4>
                <p className="text-gray-600 text-sm">Product Manager</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed italic">
              "The culture here is amazing. Everyone is passionate about what they do, and there's a
              real sense of purpose in connecting talent with opportunities worldwide."
            </p>
          </div>
        </div>
      </section>

      {/* Don't See the Right Role Section */}
      <section
        className="bg-gradient-to-r from-orange-500 to-blue-600 py-16 md:py-20 relative z-10"
        id="gigs"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
            Don't See the Right Role?
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed">
            We're always looking for exceptional talent to join our mission. Send us your CV and
            tell us how you'd like to contribute to the future of work.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
            <button className="bg-white text-blue-600 px-8 md:px-10 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
              <Send className="w-5 h-5" />
              Send Your CV
            </button>
            <button className="bg-blue-700 text-white px-8 md:px-10 py-4 rounded-xl font-semibold hover:bg-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
              <UserPlus className="w-5 h-5" />
              Join Our Talent Pool
            </button>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-12 max-w-3xl w-full shadow-2xl relative animate-slideUp max-h-[90vh] overflow-y-auto">
            {/* Step Indicators */}
            <div className="flex justify-center items-center gap-3 md:gap-6 mb-8 md:mb-12 flex-wrap">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <React.Fragment key={step.id}>
                    <div
                      className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 transform ${
                        isCompleted
                          ? 'bg-teal-500 scale-110'
                          : isActive
                            ? 'bg-teal-500 scale-110 shadow-lg'
                            : 'bg-white border-2 border-gray-300'
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 md:w-8 md:h-8 ${
                          isCompleted || isActive ? 'text-white' : 'text-gray-400'
                        }`}
                      />
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex-1 max-w-[40px] md:max-w-[60px] hidden sm:block">
                        <div
                          className={`h-1 rounded transition-all duration-300 ${
                            currentStep > step.id ? 'bg-teal-500' : 'bg-gray-300'
                          }`}
                        ></div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Modal Content Based on Step */}
            {currentStep === 1 && (
              <div className="text-center animate-fadeIn">
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6 md:mb-8">
                  Welcome!
                </h2>
                <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12">
                  Let's get started with your job search journey.
                </p>
                <button
                  onClick={handleNext}
                  className="bg-blue-500 text-white px-10 md:px-12 py-3 rounded-lg text-base md:text-lg font-semibold hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Get Started
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="text-center animate-fadeIn">
                <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-8 md:mb-12">
                  Tell us about your experience....
                </h2>

                <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 mb-8 md:mb-12">
                  <button
                    onClick={() => handleExperienceSelect('entry')}
                    className={`px-8 md:px-10 py-4 rounded-xl text-base md:text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                      selectedExperience === 'entry'
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                  >
                    Entry Level
                  </button>
                  <button
                    onClick={() => handleExperienceSelect('mid')}
                    className={`px-8 md:px-10 py-4 rounded-xl text-base md:text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                      selectedExperience === 'mid'
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                  >
                    Mid-Level
                  </button>
                  <button
                    onClick={() => handleExperienceSelect('senior')}
                    className={`px-8 md:px-10 py-4 rounded-xl text-base md:text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                      selectedExperience === 'senior'
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                  >
                    Senior / Expert
                  </button>
                </div>

                <p className="text-gray-600 mb-8">
                  So we can match you with the right opportunities.
                </p>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={handlePrevious}
                    className="bg-gray-300 text-gray-700 px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-300"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!selectedExperience}
                    className={`px-6 md:px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      selectedExperience
                        ? 'bg-blue-500 text-white hover:bg-blue-600 transform hover:scale-105 shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="text-center animate-fadeIn">
                <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-6 md:mb-8">
                  Tell us about your education....
                </h2>
                <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12">
                  Share your educational background with us.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handlePrevious}
                    className="bg-gray-300 text-gray-700 px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-300"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    className="bg-blue-500 text-white px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="text-center animate-fadeIn">
                <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-6 md:mb-8">
                  Create your profile....
                </h2>
                <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12">
                  Let's set up your professional profile.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handlePrevious}
                    className="bg-gray-300 text-gray-700 px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-300"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    className="bg-blue-500 text-white px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="text-center animate-fadeIn">
                <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-6 md:mb-8">
                  Almost done!
                </h2>
                <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12">
                  Complete your registration to start your journey.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handlePrevious}
                    className="bg-gray-300 text-gray-700 px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-300"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setCurrentStep(1);
                      setSelectedExperience('');
                    }}
                    className="bg-green-500 text-white px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Complete
                  </button>
                </div>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => {
                setShowModal(false);
                setCurrentStep(1);
                setSelectedExperience('');
              }}
              className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-gray-600 transition-all duration-300 transform hover:scale-110 hover:rotate-90 bg-white rounded-full p-2 shadow-md"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
