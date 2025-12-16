import React, { useState } from 'react';
import { Shield, Activity, Users, AlertCircle, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { EducationTopic } from '../types';

const EducationView: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const topics: EducationTopic[] = [
    {
      id: 'vaccines',
      title: 'Vaccination Guide',
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      summary: 'Understanding mRNA, Viral Vector, and Protein Subunit vaccines.',
      details: `
        **Importance:** Vaccination is the most effective way to protect against severe illness and death from COVID-19.
        
        **Types of Vaccines:**
        1. **mRNA Vaccines (Pfizer-BioNTech, Moderna):** Use genetically engineered RNA to teach cells how to make a protein that triggers an immune response.
        2. **Viral Vector (AstraZeneca, J&J):** Use a modified version of a different virus to deliver protection instructions.
        3. **Protein Subunit (Novavax):** Contain harmless pieces of the COVID-19 virus to build immunity.
        
        **Booster Shots:** recommended to maintain immunity over time.
      `
    },
    {
      id: 'protocols',
      title: 'Health Protocols',
      icon: <Users className="w-6 h-6 text-emerald-500" />,
      summary: 'Essential habits: Washing hands, Masks, and Distancing.',
      details: `
        **Effective Measures:**
        * **Masking:** Wear a high-quality mask (N95/KN95) in crowded indoor spaces.
        * **Hand Hygiene:** Wash hands with soap for 20 seconds or use alcohol-based sanitizer.
        * **Ventilation:** Open windows or use air purifiers to reduce airborne transmission.
        * **Social Distancing:** Maintain 1.5 - 2 meters distance from others when possible.
      `
    },
    {
      id: 'symptoms',
      title: 'Symptom Recognition',
      icon: <Activity className="w-6 h-6 text-red-500" />,
      summary: 'Early warning signs and when to seek medical help.',
      details: `
        **Common Symptoms:**
        * Fever or chills
        * Cough
        * Fatigue
        * Muscle or body aches
        * Headache
        * New loss of taste or smell
        * Sore throat
        
        **Emergency Warning Signs:** Trouble breathing, persistent chest pain, new confusion, inability to wake or stay awake, pale/gray/blue skin tones. **Seek medical care immediately.**
      `
    },
    {
      id: 'variants',
      title: 'Variants of Concern',
      icon: <AlertCircle className="w-6 h-6 text-orange-500" />,
      summary: 'Information on Alpha, Delta, Omicron and sub-variants.',
      details: `
        Viruses constantly change through mutation. 
        
        **Omicron & Sub-variants (XBB, EG.5, etc.):** 
        Currently the dominant strains globally. They tend to be more transmissible but may cause less severe disease in vaccinated individuals compared to Delta.
        
        **Surveillance:** Global health organizations continue to monitor for new variants that might escape immunity.
      `
    },
    {
      id: 'mental',
      title: 'Mental Wellbeing',
      icon: <Heart className="w-6 h-6 text-pink-500" />,
      summary: 'Coping strategies for pandemic fatigue and anxiety.',
      details: `
        **Tips for Mental Health:**
        1. **Limit News Consumption:** Take breaks from COVID-19 news to reduce anxiety.
        2. **Stay Connected:** Use video calls to stay in touch with family and friends.
        3. **Healthy Routine:** Prioritize sleep, exercise, and healthy eating.
        4. **Seek Help:** If you feel overwhelmed, contact a professional counselor or helpline.
      `
    }
  ];

  return (
    <div className="h-full p-6 md:p-10 bg-gray-50 overflow-y-auto">
      <div className="mb-8">
        <h2 className="brand-font text-3xl font-bold text-emerald-800">COVID-19 Education Hub</h2>
        <p className="text-gray-600 mt-2">Verified information to keep you and your community safe.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
        {topics.map((topic) => (
          <div key={topic.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  {topic.icon}
                </div>
                <h3 className="font-bold text-lg text-gray-800">{topic.title}</h3>
              </div>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {topic.summary}
              </p>
              
              <button 
                onClick={() => setExpandedId(expandedId === topic.id ? null : topic.id)}
                className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                {expandedId === topic.id ? 'Show Less' : 'Read Detailed Guide'}
                {expandedId === topic.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            
            {expandedId === topic.id && (
              <div className="px-6 pb-6 pt-0 animate-fade-in">
                <div className="pt-4 border-t border-gray-100">
                  {topic.details.split('\n').map((line, i) => (
                    <p key={i} className="text-gray-700 text-sm mb-2 leading-relaxed">
                      {line.trim().startsWith('*') || line.trim().startsWith('1.') 
                        ? <span className="font-semibold block mt-2">{line.replace(/[*1.]/g, '')}</span> 
                        : line
                      }
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationView;