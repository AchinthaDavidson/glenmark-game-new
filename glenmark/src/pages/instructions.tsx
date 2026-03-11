import Image from "next/image";
import { useRouter } from "next/router";

export default function Instructions() {
  const router = useRouter();

  const handleStartGame = () => {
    router.push("/game");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex flex-col items-center justify-center w-full max-w-2xl px-8 py-12">
        {/* Logo */}
        <div className="mb-6">
          <Image
            src="/logo.png"
            alt="Glenmark Logo"
            width={80}
            height={80}
            priority
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-8">
          <span className="text-black">Game </span>
          <span className="text-red-600">Instructions</span>
        </h1>

        {/* Instructions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg mb-8 w-full">
          <ul className="space-y-4 text-gray-700 text-lg">
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-2">1.</span>
              <span>Match the diseases with their corresponding treatments</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-2">2.</span>
              <span>You have 60 seconds to complete the challenge</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-2">3.</span>
              <span>Each correct match earns you 10 points</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-2">4.</span>
              <span>Wrong matches will deduct 5 points</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-2">5.</span>
              <span>The player with the highest score wins!</span>
            </li>
          </ul>
        </div>

        {/* Start Game Button */}
        <button
          onClick={handleStartGame}
          className="w-full max-w-xs bg-red-600 hover:bg-red-700 text-white font-bold text-xl py-4 px-8 rounded transition-colors"
        >
          Play Now
        </button>
      </main>
    </div>
  );
}
