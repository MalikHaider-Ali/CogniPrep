import Header from 'lucide-react';

export default function Dashboard({ onStartInterview, onViewFeedback }) {
  const pastInterviews = [
    { title: 'Frontend Dev Interview', type: 'Technical', date: 'Feb 28, 2025', score: '12/100', icon: '⚛️', color: 'bg-purple-500' },
    { title: 'Behavioral Interview', type: 'Non-Technical', date: 'Feb 23, 2025', score: '54/100', icon: '💼', color: 'bg-blue-500' },
    { title: 'Backend Dev Interview', type: 'Technical', date: 'Feb 21, 2025', score: '94/100', icon: '⚙️', color: 'bg-red-500' }
  ];

  const interviewTypes = [
    { title: 'Full-Stack Dev Interview', type: 'Technical', icon: '💻', color: 'bg-purple-600' },
    { title: 'DevOps & Cloud Interview', type: 'Technical', icon: '☁️', color: 'bg-orange-600' },
    { title: 'HR Screening Interview', type: 'Non-Technical', icon: '👥', color: 'bg-blue-500' },
    { title: 'System Design Interview', type: 'Technical', icon: '🏗️', color: 'bg-blue-600' },
    { title: 'Business Analyst Interview', type: 'Non-Technical', icon: '📊', color: 'bg-green-500' },
    { title: 'Mobile App Dev Interview', type: 'Technical', icon: '📱', color: 'bg-red-600' },
    { title: 'Database & SQL Interview', type: 'Technical', icon: '🗄️', color: 'bg-red-500' },
    { title: 'Cybersecurity Interview', type: 'Technical', icon: '🔒', color: 'bg-blue-400' },
    { title: 'Sales & Marketing Interview', type: 'Non-Technical', icon: '📈', color: 'bg-pink-500' }
  ];

  return (
    <div className="min-h-screen pb-20">
      <Header showProfile={true} />
      
      <div className="px-8 py-8">
        <div className="bg-gradient-to-r from-indigo-950 to-purple-950 rounded-3xl p-12 mb-12 relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <h1 className="text-4xl font-bold mb-3">Get Interview-Ready with AI-Powered Practice & Feedback</h1>
            <p className="text-gray-300 mb-6">Practice real interview questions & get instant feedback.</p>
            <button onClick={onStartInterview} className="bg-purple-300 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-purple-200">
              Start an interview
            </button>
          </div>
          <div className="absolute right-12 bottom-0 w-64 h-64">
            <div className="w-full h-full bg-white rounded-t-full opacity-10"></div>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Your Past Interviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastInterviews.map((interview, idx) => (
              <div key={idx} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${interview.color} rounded-xl flex items-center justify-center text-2xl`}>
                    {interview.icon}
                  </div>
                  <span className="bg-gray-800 px-3 py-1 rounded-lg text-xs">{interview.type}</span>
                </div>
                <h3 className="text-lg font-semibold mb-3">{interview.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span>📅 {interview.date}</span>
                  <span>⭐ {interview.score}</span>
                </div>
                <p className="text-sm text-gray-400 mb-4">This interview does not reflect serious interest or engagement from the candidate. Their responses are dismissive...</p>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
                  <div className="w-8 h-8 bg-teal-500 rounded-lg"></div>
                  <button onClick={onViewFeedback} className="ml-auto bg-purple-300 text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-200">
                    View interview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Pick Your Interview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviewTypes.map((interview, idx) => (
              <div key={idx} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${interview.color} rounded-xl flex items-center justify-center text-2xl`}>
                    {interview.icon}
                  </div>
                  <span className="bg-gray-800 px-3 py-1 rounded-lg text-xs">{interview.type}</span>
                </div>
                <h3 className="text-lg font-semibold mb-3">{interview.title}</h3>
                <p className="text-sm text-gray-400 mb-4">This interview does not reflect serious interest or engagement from the candidate. Their responses are dismissive...</p>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
                  <div className="w-8 h-8 bg-teal-500 rounded-lg"></div>
                  <button onClick={onStartInterview} className="ml-auto bg-purple-300 text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-200">
                    Take interview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}