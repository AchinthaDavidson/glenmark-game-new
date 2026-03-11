import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";

interface LeaderboardEntry {
  DoctorName: string;
  SLMC_ID: string;
  Score: number;
  Completed: boolean;
}

export default function Leaderboard() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/leaderboard");
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }
      const data = await response.json();

      await setLeaderboard(data.leaderboard);

      console.log("Leaderboard entries:", leaderboard);
    } catch (err) {
      setError("Failed to load leaderboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  const handlePlayAgain = () => {
    router.push("/game");
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full">
        {/* Header */}
        <div className="text-center mb-8">
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

          <h1 className="text-3xl font-bold text-red-600 mb-2">
            Leaderboard
          </h1>
          <p className="text-gray-500">Top 10 Players</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
            <p className="text-gray-500 mt-4">Loading...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchLeaderboard}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Leaderboard Table */}
        {!loading && !error && (
          <div className="mb-8">
            <div className="bg-red-50 rounded-xl overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-2 bg-red-500 text-white p-3 font-bold text-sm">
                <div className="col-span-2 text-center">Rank</div>
                <div className="col-span-6">Doctor</div>
                <div className="col-span-2 text-center">Score</div>
                
              </div>

              {/* Scrollable Table Rows */}
              <div className="max-h-80 overflow-y-auto">
                {leaderboard.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No scores yet. Be the first to play!
                  </div>
                ) : (
                  leaderboard.map((entry, index) => (
                    <div
                      key={index}
                      className={`grid grid-cols-12 gap-2 p-4 items-center text-sm ${
                        index % 2 === 0 ? "bg-white" : "bg-red-50"
                      } ${index < 3 ? "font-semibold" : ""}`}
                    >
                      {/* Rank */}
                      <div className="col-span-2 text-center">
                        {index === 0 && <span className="text-2xl">🥇</span>}
                        {index === 1 && <span className="text-2xl">🥈</span>}
                        {index === 2 && <span className="text-2xl">🥉</span>}
                        {index > 2 && <span className="text-gray-600">#{index + 1}</span>}
                      </div>

                      {/* Doctor Name */}
                      <div className="col-span-6">
                        <p className="text-gray-800 truncate">{entry.DoctorName}</p>
                        <p className="text-gray-400 text-xs">{entry.SLMC_ID}</p>
                      </div>

                      {/* Score */}
                      <div className="col-span-2 text-center">
                        <span className="text-red-600 font-bold">{entry.Score}</span>
                      </div>

                      {/* Status */}
                      
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handlePlayAgain}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-3 px-6 rounded-xl transition-all duration-200 shadow-lg"
          >
            Play Again
          </button>
          
          <button
            onClick={handleBack}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm py-3 px-6 rounded-xl transition-all duration-200"
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
