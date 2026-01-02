'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Briefcase, Plus, X, Edit2, Trash2, Globe, Award, FileText, Users } from 'lucide-react';
import { auth } from '@/lib/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';
import { getCVs } from '@/app/actions/cv';

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

interface Recommendation {
  id: string;
  name: string;
  date: string;
  text: string;
  image: string;
}

interface Achievement {
  id: string;
  title: string;
  date: string;
  description: string;
}

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

interface Reference {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
}

type UserCv = {
  id: string;
  title: string;
  templateId: string;
  createdAt: string | Date;
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default function PortfolioPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Profile Data
  const [fullName, setFullName] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('https://i.pravatar.cc/300?img=5');
  const [socialLinks, setSocialLinks] = useState<string[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempFullName, setTempFullName] = useState('');
  const [tempProfileImageUrl, setTempProfileImageUrl] = useState('');
  const [tempSocialLinks, setTempSocialLinks] = useState<string[]>([]);

  // State for About Section
  const [about, setAbout] = useState('');
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [tempAbout, setTempAbout] = useState('');

  // State for Experience Section
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [newExperience, setNewExperience] = useState<Omit<Experience, 'id'>>({
    title: '',
    company: '',
    period: '',
    description: '',
  });

  // State for Skills Section
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  // State for Recommendations Section
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isAddingRecommendation, setIsAddingRecommendation] = useState(false);
  const [newRecommendation, setNewRecommendation] = useState<Omit<Recommendation, 'id'>>({
    name: '',
    date: '',
    text: '',
    image: 'https://i.pravatar.cc/150?img=12',
  });

  // State for Achievements
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isAddingAchievement, setIsAddingAchievement] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Omit<Achievement, 'id'>>({
    title: '',
    date: '',
    description: '',
  });

  // State for Certificates
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isAddingCertificate, setIsAddingCertificate] = useState(false);
  const [newCertificate, setNewCertificate] = useState<Omit<Certificate, 'id'>>({
    name: '',
    issuer: '',
    date: '',
    url: '',
  });

  // State for CVs
  const [cvs, setCvs] = useState<UserCv[]>([]);

  // State for References
  const [references, setReferences] = useState<Reference[]>([]);
  const [isAddingReference, setIsAddingReference] = useState(false);
  const [newReference, setNewReference] = useState<Omit<Reference, 'id'>>({
    name: '',
    position: '',
    company: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const response = await fetch('/api/portfolio/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            const profile = data.user.profile;
            setUserId(data.user.id);
            setFullName(profile.fullName || '');
            setProfileImageUrl(profile.profileImageUrl || 'https://i.pravatar.cc/300?img=5');
            setSocialLinks(profile.socialLinks || []);
            setAbout(profile.bio || '');
            setExperiences(profile.experiences || []);
            setSkills(profile.skills || []);
            setRecommendations(profile.recommendations || []);
            setAchievements(profile.achievements || []);
            setCertificates(profile.certificates || []);
            setReferences(profile.references || []);

            // Fetch CVs
            const fetchedCvs = await getCVs();
            setCvs(fetchedCvs);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handlers for Profile
  const handleSaveProfile = async () => {
    if (!userId) return;
    try {
      const response = await fetch('/api/portfolio/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          fullName: tempFullName,
          profileImageUrl: tempProfileImageUrl,
          socialLinks: tempSocialLinks,
        }),
      });

      if (response.ok) {
        setFullName(tempFullName);
        setProfileImageUrl(tempProfileImageUrl);
        setSocialLinks(tempSocialLinks);
        setIsEditingProfile(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  // Handlers for About
  const handleSaveAbout = async () => {
    if (!userId) return;
    try {
      const response = await fetch('/api/portfolio/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, about: tempAbout }),
      });

      if (response.ok) {
        setAbout(tempAbout);
        setIsEditingAbout(false);
      }
    } catch (error) {
      console.error('Error saving about:', error);
    }
  };

  // Handlers for Experience (Existing)
  const handleAddExperience = async () => {
    if (!userId) return;
    if (newExperience.title && newExperience.description) {
      try {
        const response = await fetch('/api/portfolio/experience', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, ...newExperience }),
        });

        if (response.ok) {
          const savedExperience = await response.json();
          setExperiences([...experiences, savedExperience]);
          setNewExperience({ title: '', company: '', period: '', description: '' });
          setIsAddingExperience(false);
        }
      } catch (error) {
        console.error('Error adding experience:', error);
      }
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      const response = await fetch(`/api/portfolio/experience?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setExperiences(experiences.filter((exp) => exp.id !== id));
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  // Handlers for Skills (Existing)
  const handleAddSkill = async () => {
    if (!userId) return;
    if (newSkill.trim()) {
      try {
        const response = await fetch('/api/portfolio/skill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, skill: newSkill.trim() }),
        });

        if (response.ok) {
          const updatedSkills = await response.json();
          setSkills(updatedSkills);
          setNewSkill('');
        }
      } catch (error) {
        console.error('Error adding skill:', error);
      }
    }
  };

  const handleDeleteSkill = async (skillToDelete: string) => {
    if (!userId) return;
    try {
      const response = await fetch('/api/portfolio/skill', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, skill: skillToDelete }),
      });

      if (response.ok) {
        const updatedSkills = await response.json();
        setSkills(updatedSkills);
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  // Handlers for Recommendations (Existing)
  const handleAddRecommendation = async () => {
    if (!userId) return;
    if (newRecommendation.name && newRecommendation.text) {
      try {
        const response = await fetch('/api/portfolio/recommendation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, ...newRecommendation }),
        });

        if (response.ok) {
          const savedRecommendation = await response.json();
          setRecommendations([...recommendations, savedRecommendation]);
          setNewRecommendation({
            name: '',
            date: '',
            text: '',
            image: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70),
          });
          setIsAddingRecommendation(false);
        }
      } catch (error) {
        console.error('Error adding recommendation:', error);
      }
    }
  };

  const handleDeleteRecommendation = async (id: string) => {
    try {
      const response = await fetch(`/api/portfolio/recommendation?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRecommendations(recommendations.filter((rec) => rec.id !== id));
      }
    } catch (error) {
      console.error('Error deleting recommendation:', error);
    }
  };

  // Handlers for Achievements
  const handleAddAchievement = async () => {
    if (!userId) return;
    if (newAchievement.title) {
      try {
        const response = await fetch('/api/portfolio/achievement', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, ...newAchievement }),
        });

        if (response.ok) {
          const saved = await response.json();
          setAchievements([...achievements, saved]);
          setNewAchievement({ title: '', date: '', description: '' });
          setIsAddingAchievement(false);
        }
      } catch (error) {
        console.error('Error adding achievement:', error);
      }
    }
  };

  const handleDeleteAchievement = async (id: string) => {
    try {
      const response = await fetch(`/api/portfolio/achievement?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setAchievements(achievements.filter((a) => a.id !== id));
      }
    } catch (error) {
      console.error('Error deleting achievement:', error);
    }
  };

  // Handlers for Certificates
  const handleAddCertificate = async () => {
    if (!userId) return;
    if (newCertificate.name && newCertificate.issuer) {
      try {
        const response = await fetch('/api/portfolio/certificate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, ...newCertificate }),
        });

        if (response.ok) {
          const saved = await response.json();
          setCertificates([...certificates, saved]);
          setNewCertificate({ name: '', issuer: '', date: '', url: '' });
          setIsAddingCertificate(false);
        }
      } catch (error) {
        console.error('Error adding certificate:', error);
      }
    }
  };

  const handleDeleteCertificate = async (id: string) => {
    try {
      const response = await fetch(`/api/portfolio/certificate?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setCertificates(certificates.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error('Error deleting certificate:', error);
    }
  };

  // Handlers for References
  const handleAddReference = async () => {
    if (!userId) return;
    if (newReference.name) {
      try {
        const response = await fetch('/api/portfolio/reference', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, ...newReference }),
        });

        if (response.ok) {
          const saved = await response.json();
          setReferences([...references, saved]);
          setNewReference({ name: '', position: '', company: '', email: '', phone: '' });
          setIsAddingReference(false);
        }
      } catch (error) {
        console.error('Error adding reference:', error);
      }
    }
  };

  const handleDeleteReference = async (id: string) => {
    try {
      const response = await fetch(`/api/portfolio/reference?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setReferences(references.filter((r) => r.id !== id));
      }
    } catch (error) {
      console.error('Error deleting reference:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white p-8 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-10 relative group/header">
          <button
            onClick={() => {
              setIsEditingProfile(true);
              setTempFullName(fullName);
              setTempProfileImageUrl(profileImageUrl);
              setTempSocialLinks(socialLinks);
            }}
            className="absolute top-0 right-0 text-gray-400 hover:text-blue-500 transition-opacity"
          >
            <Edit2 size={18} />
          </button>

          <Modal
            isOpen={isEditingProfile}
            onClose={() => setIsEditingProfile(false)}
            title="Edit Profile"
          >
            <div className="w-full">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  value={tempProfileImageUrl}
                  onChange={(e) => setTempProfileImageUrl(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={tempFullName}
                  onChange={(e) => setTempFullName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Social Links (up to 3)
                </label>
                {tempSocialLinks.map((link, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={link}
                      onChange={(e) => {
                        const newLinks = [...tempSocialLinks];
                        newLinks[index] = e.target.value;
                        setTempSocialLinks(newLinks);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <button
                      onClick={() => {
                        const newLinks = tempSocialLinks.filter((_, i) => i !== index);
                        setTempSocialLinks(newLinks);
                      }}
                      className="text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                {tempSocialLinks.length < 3 && (
                  <button
                    onClick={() => setTempSocialLinks([...tempSocialLinks, ''])}
                    className="text-blue-500 text-sm flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Link
                  </button>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-md text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </Modal>

          <>
            <div className="relative w-32 h-32 mb-4">
              <Image
                src={profileImageUrl}
                alt={fullName}
                fill
                className="rounded-full object-cover border-4 border-white shadow-sm"
              />
            </div>

            <div className="flex gap-3 mb-2">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 bg-gray-200 rounded-full text-gray-700 w-8 h-8 flex items-center justify-center hover:bg-gray-300"
                >
                  <Globe size={16} />
                </a>
              ))}
            </div>

            <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
          </>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-8 sticky top-0 bg-white z-10 overflow-x-auto">
          <nav className="flex gap-8 min-w-max">
            <button
              onClick={() => scrollToSection('about')}
              className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium hover:border-gray-300"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('experience')}
              className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium hover:border-gray-300"
            >
              Experience
            </button>
            <button
              onClick={() => scrollToSection('skills')}
              className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium hover:border-gray-300"
            >
              Skills
            </button>
            <button
              onClick={() => scrollToSection('achievements')}
              className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium hover:border-gray-300"
            >
              Achievements
            </button>
            <button
              onClick={() => scrollToSection('certificates')}
              className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium hover:border-gray-300"
            >
              Certificates
            </button>
            <button
              onClick={() => scrollToSection('references')}
              className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium hover:border-gray-300"
            >
              References
            </button>
            <button
              onClick={() => scrollToSection('recommendations')}
              className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium hover:border-gray-300"
            >
              Recommendations
            </button>
          </nav>
        </div>

        {/* About Section */}
        <section id="about" className="mb-10 group relative scroll-mt-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">About</h2>
            <button
              onClick={() => {
                setIsEditingAbout(true);
                setTempAbout(about);
              }}
              className="text-gray-400 hover:text-blue-500 transition-opacity"
            >
              <Edit2 size={18} />
            </button>
          </div>

          <Modal
            isOpen={isEditingAbout}
            onClose={() => setIsEditingAbout(false)}
            title="Edit About"
          >
            <div className="w-full">
              <textarea
                value={tempAbout}
                onChange={(e) => setTempAbout(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px]"
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => setIsEditingAbout(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-md text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAbout}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </Modal>

          <p className="text-gray-600 leading-relaxed">{about}</p>
        </section>

        {/* Experience Section */}
        <section id="experience" className="mb-10 scroll-mt-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Experience</h2>
            <button
              onClick={() => setIsAddingExperience(true)}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              <Plus size={16} /> Add Experience
            </button>
          </div>

          <Modal
            isOpen={isAddingExperience}
            onClose={() => setIsAddingExperience(false)}
            title="Add Experience"
          >
            <div className="w-full">
              <div className="grid gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Job Title"
                  value={newExperience.title}
                  onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={newExperience.company}
                  onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Date Range (e.g., 2018 - Present)"
                  value={newExperience.period}
                  onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <textarea
                  placeholder="Description"
                  value={newExperience.description}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, description: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md min-h-[100px]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAddingExperience(false)}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-md text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddExperience}
                  className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
          </Modal>

          <div className="space-y-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="bg-blue-50/30 rounded-lg p-6 flex gap-4 items-start group relative"
              >
                <div className="bg-gray-200 p-3 rounded-md">
                  <Briefcase className="text-gray-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{exp.title}</h3>
                  <p className="text-gray-700 text-sm font-medium">{exp.company}</p>
                  <p className="text-blue-400 text-sm mb-2">{exp.period}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteExperience(exp.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="mb-10 scroll-mt-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Skills</h2>
            <button
              onClick={() => setIsAddingSkill(true)}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              <Plus size={16} /> Add Skill
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium text-sm flex items-center gap-2 group"
              >
                {skill}
                <button
                  onClick={() => handleDeleteSkill(skill)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>

          <Modal isOpen={isAddingSkill} onClose={() => setIsAddingSkill(false)} title="Add Skill">
            <div className="w-full">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Add a skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAddingSkill(false)}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-md text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleAddSkill();
                    setIsAddingSkill(false);
                  }}
                  className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-800"
                >
                  Add
                </button>
              </div>
            </div>
          </Modal>
        </section>

        {/* Achievements Section */}
        <section id="achievements" className="mb-10 scroll-mt-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Achievements</h2>
            <button
              onClick={() => setIsAddingAchievement(true)}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              <Plus size={16} /> Add Achievement
            </button>
          </div>
          <Modal
            isOpen={isAddingAchievement}
            onClose={() => setIsAddingAchievement(false)}
            title="Add Achievement"
          >
            <div className="w-full">
              <div className="grid gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={newAchievement.title}
                  onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Date"
                  value={newAchievement.date}
                  onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <textarea
                  placeholder="Description"
                  value={newAchievement.description}
                  onChange={(e) =>
                    setNewAchievement({ ...newAchievement, description: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md min-h-[80px]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAddingAchievement(false)}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-md text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAchievement}
                  className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
          </Modal>
          <div className="space-y-4">
            {achievements.map((ach) => (
              <div key={ach.id} className="border border-gray-200 rounded-lg p-4 relative group">
                <div className="flex items-start gap-3">
                  <Award className="text-yellow-500 mt-1" size={20} />
                  <div>
                    <h3 className="font-bold text-gray-900">{ach.title}</h3>
                    <p className="text-sm text-gray-500">{ach.date}</p>
                    <p className="text-gray-700 mt-1">{ach.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteAchievement(ach.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Certificates Section */}
        <section id="certificates" className="mb-10 scroll-mt-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Certificates</h2>
            <button
              onClick={() => setIsAddingCertificate(true)}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              <Plus size={16} /> Add Certificate
            </button>
          </div>
          <Modal
            isOpen={isAddingCertificate}
            onClose={() => setIsAddingCertificate(false)}
            title="Add Certificate"
          >
            <div className="w-full">
              <div className="grid gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Certificate Name"
                  value={newCertificate.name}
                  onChange={(e) => setNewCertificate({ ...newCertificate, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Issuer"
                  value={newCertificate.issuer}
                  onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Date"
                  value={newCertificate.date}
                  onChange={(e) => setNewCertificate({ ...newCertificate, date: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="URL"
                  value={newCertificate.url}
                  onChange={(e) => setNewCertificate({ ...newCertificate, url: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAddingCertificate(false)}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-md text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCertificate}
                  className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
          </Modal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="border border-gray-200 rounded-lg p-4 relative group flex items-center gap-3"
              >
                <FileText className="text-blue-500" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900">{cert.name}</h3>
                  <p className="text-sm text-gray-600">{cert.issuer}</p>
                  <p className="text-xs text-gray-400">{cert.date}</p>
                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline"
                    >
                      View Certificate
                    </a>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteCertificate(cert.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* CVs Section */}
        <section id="cvs" className="mb-10 scroll-mt-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">My CVs</h2>
            <Link
              href="/user/buildcv"
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              <Plus size={16} /> Create New CV
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cvs.map((cv) => (
              <div
                key={cv.id}
                className="border border-gray-200 rounded-lg p-4 relative group flex items-center gap-3"
              >
                <FileText className="text-blue-500" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900">{cv.title}</h3>
                  <p className="text-sm text-gray-600">Template: {cv.templateId}</p>
                  <p className="text-xs text-gray-400">
                    Created: {new Date(cv.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {/* Add actions like delete or edit if needed */}
              </div>
            ))}
            {cvs.length === 0 && (
              <div className="col-span-2 text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 mb-2">You haven&apos;t created any CVs yet.</p>
                <Link href="/user/buildcv" className="text-blue-600 hover:underline font-medium">
                  Build your first CV
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* References Section */}
        <section id="references" className="mb-10 scroll-mt-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">References</h2>
            <button
              onClick={() => setIsAddingReference(true)}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              <Plus size={16} /> Add Reference
            </button>
          </div>
          <Modal
            isOpen={isAddingReference}
            onClose={() => setIsAddingReference(false)}
            title="Add Reference"
          >
            <div className="w-full">
              <div className="grid gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={newReference.name}
                  onChange={(e) => setNewReference({ ...newReference, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Position"
                  value={newReference.position}
                  onChange={(e) => setNewReference({ ...newReference, position: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={newReference.company}
                  onChange={(e) => setNewReference({ ...newReference, company: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Email"
                  value={newReference.email}
                  onChange={(e) => setNewReference({ ...newReference, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={newReference.phone}
                  onChange={(e) => setNewReference({ ...newReference, phone: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAddingReference(false)}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-md text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddReference}
                  className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
          </Modal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {references.map((ref) => (
              <div key={ref.id} className="border border-gray-200 rounded-lg p-4 relative group">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="text-gray-500" size={20} />
                  <div>
                    <h3 className="font-bold text-gray-900">{ref.name}</h3>
                    <p className="text-sm text-gray-600">
                      {ref.position} at {ref.company}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {ref.email && <p>Email: {ref.email}</p>}
                  {ref.phone && <p>Phone: {ref.phone}</p>}
                </div>
                <button
                  onClick={() => handleDeleteReference(ref.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Recommendations Section */}
        <section id="recommendations" className="mb-10 scroll-mt-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recommendations</h2>
            <button
              onClick={() => setIsAddingRecommendation(true)}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              <Plus size={16} /> Add Recommendation
            </button>
          </div>

          <Modal
            isOpen={isAddingRecommendation}
            onClose={() => setIsAddingRecommendation(false)}
            title="Add Recommendation"
          >
            <div className="w-full">
              <div className="grid gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={newRecommendation.name}
                  onChange={(e) =>
                    setNewRecommendation({ ...newRecommendation, name: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Date (e.g., 1 year ago)"
                  value={newRecommendation.date}
                  onChange={(e) =>
                    setNewRecommendation({ ...newRecommendation, date: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <textarea
                  placeholder="Recommendation Text"
                  value={newRecommendation.text}
                  onChange={(e) =>
                    setNewRecommendation({ ...newRecommendation, text: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md min-h-[100px]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAddingRecommendation(false)}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-md text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRecommendation}
                  className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
          </Modal>

          <div className="space-y-6">
            {recommendations.map((rec) => (
              <div key={rec.id} className="flex gap-4 items-start group relative">
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={rec.image}
                    alt={rec.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{rec.name}</h3>
                    <span className="text-gray-400 text-xs">{rec.date}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{rec.text}</p>
                </div>
                <button
                  onClick={() => handleDeleteRecommendation(rec.id)}
                  className="absolute top-0 right-0 text-gray-400 hover:text-red-500 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Actions */}
        <div className="mt-8">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium text-sm flex items-center gap-2 mb-4 transition-colors">
            Download CV
          </button>
        </div>
      </div>
    </div>
  );
}
