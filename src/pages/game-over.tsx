import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function GameOver() {
  const router = useRouter();
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Get score from localStorage or query params
    const savedScore = localStorage.getItem("gameScore");
    if (savedScore) {
      setScore(parseInt(savedScore, 10));
    }
  }, []);

  const handleTryAgain = () => {
    router.push("/game");
  };

  const handleLeaderboard = () => {
    router.push("/leaderboard");
  };

  const handleMainMenu = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen  from-red-600 via-red-500 to-red-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full">
        {/* Game Over Icon */}
        <div className="mb-6">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-16 h-16 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-red-600 mb-2">GAME OVER</h1>
        <p className="text-gray-500 text-lg mb-6">Time is up!</p>

        {/* Score Display */}
        <div className="bg-red-50 rounded-2xl p-6 mb-8">
          <p className="text-gray-600 text-sm uppercase tracking-wide mb-2">
            Your Score
          </p>
          <p className="text-5xl font-bold text-red-600">
            {score}<span className="text-2xl text-gray-400">/12</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleTryAgain}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Try Again
          </button>
          
          <button
            onClick={handleLeaderboard}
            className="w-full bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 font-bold text-lg py-4 px-8 rounded-xl transition-all duration-200"
          >
            Leaderboard
          </button>
          
          <button
            onClick={handleMainMenu}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-lg py-4 px-8 rounded-xl transition-all duration-200"
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
