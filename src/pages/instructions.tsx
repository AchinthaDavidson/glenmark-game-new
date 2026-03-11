import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Instructions() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(20);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/game");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleStartGame = () => {
    router.push("/game");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex flex-col items-center justify-center w-full max-w-2xl px-8 py-12">
        {/* Card Container */}
        <div className="bg-white rounded-lg shadow-2xl p-10 w-full">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <Image
              src="/logo.png"
              alt="Glenmark Logo"
              width={80}
              height={80}
              priority
            />
          </div>

          {/* Welcome Message */}
          <h1 className="text-4xl font-bold text-center mb-4">
            <span className="text-black">Welcome, Doctor!</span>
          </h1>

          <p className="text-gray-700 text-center text-lg mb-2">
            Thank you for joining the Glenmark Medical Challenge.
          </p>

          <p className="text-gray-700 text-center text-lg mb-8">
            Select the appropriate therapy with the diagnosis.
          </p>

          {/* How to Play Section */}
          <div className="w-full mb-8">
            <h2 className="text-xl font-bold text-center text-gray-800 mb-6 italic tracking-wider">
              HOW TO PLAY
            </h2>

            <div className="space-y-4 text-gray-700 text-lg">
              <p>
                <span className="font-semibold">01.</span> Drag the disease names and place them into the correct product basket.
              </p>
              <p>
                <span className="font-semibold">02.</span> Complete the activity by matching all items correctly.
              </p>
            </div>
          </div>

          {/* Start Challenge Button */}
          <button
            onClick={handleStartGame}
            className="w-full max-w-md bg-red-600 hover:bg-red-700 text-white font-bold text-2xl py-5 px-8 rounded transition-colors mb-6 mx-auto block"
          >
            START CHALLENGE
          </button>

          {/* Countdown */}
          <p className="text-2xl font-bold text-gray-800 text-center">
            STARTING IN {countdown}
          </p>
        </div>
      </main>
    </div>
  );
}
