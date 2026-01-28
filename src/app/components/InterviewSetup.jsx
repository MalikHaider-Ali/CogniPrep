import { useState, useRef } from 'react';
import { ChevronDown, Upload, ArrowLeft, X, CheckCircle } from 'lucide-react';
import Header from './header';

export default function InterviewSetup({ onNext, onBack, preSelectedCategory }) {
  const [category, setCategory] = useState(preSelectedCategory || '');
  const [focusAreas, setFocusAreas] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [duration, setDuration] = useState('');
  const [sessionImage, setSessionImage] = useState(null);
  const [sessionImagePreview, setSessionImagePreview] = useState('');
  const fileInputRef = useRef(null);

  const allInterviewCategories = [
    'Frontend Developer Interview',
    'Backend Developer Interview',
    'Full-Stack Developer Interview',
    'DevOps & Cloud Interview',
    'Mobile App Developer Interview',
    'System Design Interview',
    'Database & SQL Interview',
    'Data Science & ML Interview',
    'Cybersecurity Interview',
    'Behavioral Interview',
    'HR Screening Interview',
    'Product Manager Interview',
    'Business Analyst Interview',
    'Sales & Marketing Interview',
    'UI/UX Designer Interview'
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setSessionImage(file);
    setSessionImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setSessionImage(null);
    setSessionImagePreview('');
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleStartInterview = () => {
    if (!category) {
      alert('Please select an interview category');
      return;
    }
    if (!experienceLevel) {
      alert('Please select your experience level');
      return;
    }
    if (!duration) {
      alert('Please select interview duration');
      return;
    }

    onNext({ 
      category,
      focusAreas,
      experienceLevel,
      duration,
      sessionImagePreview 
    });
  };

  const getFocusAreasPlaceholder = () => {
    if (category.includes('Frontend')) {
      return 'React hooks, state management, CSS Grid';
    } else if (category.includes('Backend')) {
      return 'API design, database optimization, authentication';
    } else if (category.includes('DevOps')) {
      return 'Docker, Kubernetes, CI/CD pipelines';
    } else if (category.includes('Behavioral')) {
      return 'Leadership examples, conflict resolution';
    } else if (category.includes('System Design')) {
      return 'Scalability, caching, load balancing';
    }
    return 'Specific topics you want to cover';
  };

  // Check if all required fields are filled
  const isFormComplete = category && experienceLevel && duration;

  return (
    <div className="min-h-screen bg-gray-950">
      <Header showProfile={true} onNavigateToProfile={onBack} />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Configure Your Interview</h1>
          <p className="text-gray-400 text-lg">Set up your AI-powered interview session with personalized parameters</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Interview Category */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <label className="block text-base font-semibold text-white mb-1">
                    Interview Category
                  </label>
                  <p className="text-sm text-gray-400">Select the type of interview you want to practice</p>
                </div>
                <span className="text-red-400 text-sm font-medium">Required</span>
              </div>
              
              <div className="relative">
  <select 
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="w-full bg-gray-800 rounded-xl px-4 py-3.5 appearance-none cursor-pointer pr-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700 hover:border-gray-600 transition-colors"
  >
    <option value="" className="text-gray-400 bg-gray-800">Choose an interview type...</option>
    {allInterviewCategories.map((cat) => (
      <option key={cat} value={cat} className="py-2 bg-gray-800 text-white">{cat}</option>
    ))}
  </select>
  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
</div>
              
              
            </div>

            {/* Focus Areas */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <label className="block text-base font-semibold text-white mb-1">
                    Focus Areas
                  </label>
                  <p className="text-sm text-gray-400">Specify topics for the AI to emphasize</p>
                </div>
                <span className="text-gray-500 text-sm font-medium">Optional</span>
              </div>
              
              <input
                type="text"
                value={focusAreas}
                onChange={(e) => setFocusAreas(e.target.value)}
                placeholder={getFocusAreasPlaceholder()}
                className="w-full bg-gray-800 rounded-xl px-4 py-3.5 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700 hover:border-gray-600 transition-colors"
              />
            </div>

            {/* Experience Level */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <label className="block text-base font-semibold text-white mb-1">
                    Experience Level
                  </label>
                  <p className="text-sm text-gray-400">Your professional experience level</p>
                </div>
                <span className="text-red-400 text-sm font-medium">Required</span>
              </div>
              
              <div className="relative">
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full bg-gray-800 rounded-xl px-4 py-3.5 appearance-none cursor-pointer pr-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <option value="" className="text-gray-400">Select your level...</option>
                  <option value="junior">Junior (0-2 years)</option>
                  <option value="mid">Mid-Level (3-5 years)</option>
                  <option value="senior">Senior (6+ years)</option>
                  <option value="lead">Lead/Principal (10+ years)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Duration */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <label className="block text-base font-semibold text-white mb-1">
                    Interview Duration
                  </label>
                  <p className="text-sm text-gray-400">Expected length of the session</p>
                </div>
                <span className="text-red-400 text-sm font-medium">Required</span>
              </div>
              
              <div className="relative">
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-gray-800 rounded-xl px-4 py-3.5 appearance-none cursor-pointer pr-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <option value="" className="text-gray-400">Choose duration...</option>
                  <option value="15">15 minutes (Quick Practice)</option>
                  <option value="30">30 minutes (Standard Session)</option>
                  <option value="45">45 minutes (In-Depth Interview)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Session Photo */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <label className="block text-base font-semibold text-white mb-1">
                    Session Photo
                  </label>
                  <p className="text-sm text-gray-400">Custom image for this interview session</p>
                </div>
                <span className="text-gray-500 text-sm font-medium">Optional</span>
              </div>
              
              {sessionImagePreview ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl border border-gray-700">
                    <img 
                      src={sessionImagePreview} 
                      alt="Session preview" 
                      className="w-14 h-14 rounded-lg object-cover border border-purple-500"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Image uploaded successfully</p>
                      <p className="text-xs text-gray-400 mt-0.5">Will be displayed during interview</p>
                    </div>
                    <button
                      onClick={removeImage}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400 hover:text-white" />
                    </button>
                  </div>
                  <button
                    onClick={triggerFileUpload}
                    className="w-full bg-gray-800 hover:bg-gray-750 rounded-xl px-4 py-3 text-sm font-medium text-white transition-colors border border-gray-700"
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <button
                  onClick={triggerFileUpload}
                  className="w-full bg-gray-800 hover:bg-gray-750 rounded-xl px-4 py-3.5 flex items-center justify-center gap-2 transition-colors border border-gray-700 hover:border-gray-600"
                >
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-white">Upload Image</span>
                </button>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Start Button at bottom of main form */}
           
              <button
                onClick={handleStartInterview}
                disabled={!isFormComplete}
                className={`w-full rounded-xl px-4 py-3.5 font-semibold transition-all ${
                  isFormComplete
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isFormComplete ? 'Start Interview' : 'Start Interview'}
              </button>

              {!isFormComplete && (
                <p className="text-xs text-gray-500 text-center">
                  Fill all required fields to continue
                </p>
              )}
       

          </div>

          {/* Tips Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-sm font-semibold text-white mb-3">Preparation Tips</h3>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>Ensure your microphone is working properly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>Find a quiet environment for best results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>Take your time to answer each question</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>Speak clearly and at a steady pace</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}