import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Win() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [doctorName, setDoctorName] = useState("Doctor");

  useEffect(() => {
    // Get score and doctor name from localStorage
    const savedScore = localStorage.getItem("gameScore");
    const savedName = localStorage.getItem("doctorName");
    if (savedScore) {
      setScore(parseInt(savedScore, 10));
    }
    if (savedName) {
      setDoctorName(savedName);
    }
  }, []);

  const handlePlayAgain = () => {
    router.push("/game");
  };

  const handleLeaderboard = () => {
    router.push("/leaderboard");
  };

  const handleMainMenu = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-red-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full">
        {/* Trophy Icon */}
        

        {/* Logo */}
        <div className="mb-4 flex justify-center">
          <Image
            src="/logo.png"
            alt="Glenmark Logo"
            width={60}
            height={60}
            priority
          />
        </div>

        {/* Congratulations */}
        <h1 className="text-3xl font-bold text-red-600 mb-2">
          Congratulations!
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Dr. {doctorName}
        </p>

        {/* Success Message */}
        <p className="text-gray-500 mb-6">
          You have successfully matched all diseases!
        </p>

        {/* Score Display */}
        <div className="bg-red-50 rounded-2xl p-6 mb-8">
          <p className="text-gray-600 text-sm uppercase tracking-wide mb-2">
            Your Score
          </p>
          <p className="text-5xl font-bold text-red-600">
            {score}<span className="text-2xl text-gray-400">/12</span>
          </p>
          <div className="mt-3">
            <span className="inline-block bg-red-600 text-white text-sm font-bold px-4 py-1 rounded-full">
              PERFECT SCORE!
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handlePlayAgain}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Play Again
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
