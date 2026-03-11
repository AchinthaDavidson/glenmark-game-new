import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [name, setName] = useState("");
  const [slmcNo, setSlmcNo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const router = useRouter();

  const showAlert = (message: string) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  const handleStartGame = async () => {
    if (!name || !slmcNo) {
      showAlert("Please enter both name and SLMC number");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          DoctorName: name,
          SLMC_ID: slmcNo,
        }),
      });

      if (response.status === 400) {
        const data = await response.json();
        if (data.message === "Doctor is already registered") {
          showAlert("Doctor is already registered");
          setIsLoading(false);
          return;
        }
      }

      if (response.ok) {
        // Save SLMC_ID to localStorage for game use
        localStorage.setItem("SLMC_ID", slmcNo);
        // Navigate to game instruction page
        router.push("/instructions");
      } else {
        const errorData = await response.json();
        showAlert(errorData.message || "Registration failed");
      }
    } catch (error) {
      showAlert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex flex-col items-center justify-center w-full max-w-md px-8">
        {/* Logo */}
        <div className="mb-4">
          <Image
            src="/logo.png"
            alt="Glenmark Logo"
            width={80}
            height={80}
            priority
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-2">
          <span className="text-black">Glenmark </span>
          <span className="text-red-600">Medical</span>
        </h1>
        <h2 className="text-2xl font-bold text-red-600 mb-4">Challenge</h2>

        {/* Subtitle */}
        <p className="text-gray-500 text-center text-lg mb-10">
          Match diseases with their Corresponding treatements
        </p>

        {/* Name Input */}
        <div className="w-full mb-6">
          <label className="block text-black font-bold text-lg mb-2">
            ENTER YOUR NAME
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dr.Jane Smith"
            className="w-full px-4 py-3 border border-gray-300 rounded bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* SLMC NO Input */}
        <div className="w-full mb-10">
          <label className="block text-black font-bold text-lg mb-2">
            SLMC NO
          </label>
          <input
            type="text"
            value={slmcNo}
            onChange={(e) => setSlmcNo(e.target.value)}
            placeholder="DR-12345"
            className="w-full px-4 py-3 border border-gray-300 rounded bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Start Game Button */}
        <button
          onClick={handleStartGame}
          disabled={isLoading}
          className="w-full max-w-xs bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold text-xl py-4 px-8 rounded transition-colors"
        >
          {isLoading ? "Loading..." : "Start Game"}
        </button>
      </main>

      {/* Alert Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 text-red-600 mx-auto"
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
              <p className="text-gray-800 text-lg mb-6">{modalMessage}</p>
              <button
                onClick={closeModal}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
