export default function Header({ showProfile = false }) {
  return (
    <header className="flex items-center justify-between px-8 py-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
        <span className="text-xl font-bold">CogniPrep</span>
      </div>
      {showProfile && (
        <div className="w-12 h-12 rounded-full bg-gray-600 overflow-hidden">
          <img src="/assets/placeholder.png" alt="Profile" className="w-full h-full object-cover" />
        </div>
      )}
    </header>
  );
}