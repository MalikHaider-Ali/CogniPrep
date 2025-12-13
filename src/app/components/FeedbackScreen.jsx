import Header from 'lucide-react';

export default function FeedbackScreen({ onBack }) {
  return (
    <div className="min-h-screen pb-20">
      <Header showProfile={true} />
      
      <div className="max-w-4xl mx-auto px-8 py-8">
        <h1 className="text-4xl font-bold text-center mb-4">
          Feedback on the Interview —<br />Frontend Developer Interview
        </h1>
        
        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">⭐</span>
            <span className="text-gray-400">Overall Impression:</span>
            <span className="font-bold">12/100</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span>📅</span>
            <span>Feb 28, 2025 - 3:45 PM</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 mb-8 border border-gray-800">
          <p className="text-gray-300 leading-relaxed">
            This interview does not reflect serious interest or engagement from the candidate. Their responses are dismissive, vague, or outright negative, making it difficult to assess their qualifications, motivation, or suitability for the role.
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-6">Breakdown of Evaluation:</h2>

        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-3">1. Enthusiasm & Interest (0/20)</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex gap-2">
                <span className="text-gray-500">•</span>
                <span>The candidate openly states, "I really don't," when asked why they want to work for the company.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-500">•</span>
                <span>Their response to future career plans ("Probably in some other company") indicates a lack of commitment.</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3">2. Communication Skills (5/20)</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex gap-2">
                <span className="text-gray-500">•</span>
                <span>Responses are brief and unhelpful.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-500">•</span>
                <span>Some answers lack clarity (e.g., "What am I going to do in this role at this role?").</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-500">•</span>
                <span>A slight redeeming factor is that they remain polite.</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3">3. Self-Awareness & Reflection (2/20)</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex gap-2">
                <span className="text-gray-500">•</span>
                <span>The candidate refuses to discuss their background and weaknesses.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-500">•</span>
                <span>They claim to have "no weaknesses at all," which suggests a lack of self-awareness.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 mb-8 border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold">Final Verdict:</span>
            <span className="bg-red-500 px-4 py-2 rounded-lg font-bold">Not Recommended</span>
          </div>
          <p className="text-gray-300 leading-relaxed">
            This candidate does not appear to be seriously considering the role and fails to provide meaningful responses. If this is reflective of their true attitude, they would not be a good fit for most positions.
          </p>
        </div>

        <div className="flex gap-4">
          <button onClick={onBack} className="flex-1 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl font-semibold">
            Back to dashboard
          </button>
          <button className="flex-1 bg-purple-300 text-gray-900 hover:bg-purple-200 px-6 py-3 rounded-xl font-semibold">
            Retake interview
          </button>
        </div>
      </div>
    </div>
  );
}