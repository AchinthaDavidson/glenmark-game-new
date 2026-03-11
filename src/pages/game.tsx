import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

// Disease data with image paths and correct product matches
const allDiseases = [
  // Canditral (Product 0)
  { id: 1, name: "Onychomycosis", image: "/dieseses/1.1.png", productId: 0, width: 160, height: 96 },
  { id: 2, name: "Tinea capitis", image: "/dieseses/1.2.png", productId: 0, width: 160, height: 96 },
  { id: 3, name: "Tinea corporis", image: "/dieseses/1.3.png", productId: 0, width: 160, height: 96 },
  // Keto Plus (Product 4)
  { id: 4, name: "Dandruff", image: "/dieseses/2.1.png", productId: 4, width: 160, height: 96 },
  { id: 5, name: "Pityriasis versicolor", image: "/dieseses/2.2.png", productId: 4, width: 160, height: 96 },
  { id: 6, name: "Seborrheic dermatitis", image: "/dieseses/2.3.png", productId: 4, width: 160, height: 96 },
  // Deriva C (Product 2)
  { id: 7, name: "Comedonal acne", image: "/dieseses/3.1.png", productId: 2, width: 160, height: 96 },
  { id: 8, name: "Inflammatory acne", image: "/dieseses/3.2.png", productId: 2, width: 160, height: 96 },
  // Fisoativ (Product 3)
  { id: 9, name: "Xerosis", image: "/dieseses/4.1.png", productId: 3, width:160, height:96 },
  { id: 10, name: "Adjuvant therapy in Eczema", image: "/dieseses/4.2.png", productId: 3, width:500, height: 96 },
  // Tacroz (Product 1)
  { id: 11, name: "Atopic dermatitis", image: "/dieseses/5.1.png", productId: 1, width: 160, height: 96 },// 
  { id: 12, name: "Steroid sparing agent", image: "/dieseses/5.2.png", productId: 1, width:160, height:96 },
  // Momate (Product 5)
  { id: 13, name: "Atopic dermatitis", image: "/dieseses/6.1.png", productId: 5, width: 160, height: 96 },
  { id: 14, name: "Psoriasis", image: "/dieseses/6.2.png", productId: 5, width: 160, height: 96 },
];

const products = [
  { id: 0, name: "Canditral", src: "/1x/0.png" },
  { id: 1, name: "Tacroz", src: "/1x/1.png" },
  { id: 2, name: "Deriva-C", src: "/1x/2.png" },
  { id: 3, name: "Fisoativ", src: "/1x/3.png" },
  { id: 4, name: "Keto Plus", src: "/1x/4.png" },
  { id: 5, name: "Momate", src: "/1x/5.png" },
];

// Shuffle array function
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Game() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(60);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentDiseases, setCurrentDiseases] = useState<typeof allDiseases>([]);
  const [remainingDiseases, setRemainingDiseases] = useState<typeof allDiseases>([]);
  const [matchedDiseases, setMatchedDiseases] = useState<number[]>([]);
  const [draggedDisease, setDraggedDisease] = useState<typeof allDiseases[0] | null>(null);
  const [dragOverProduct, setDragOverProduct] = useState<number | null>(null);
  const [returningDisease, setReturningDisease] = useState<number | null>(null);

  // Initialize game
  useEffect(() => {
    const shuffled = shuffleArray(allDiseases);
    setCurrentDiseases(shuffled.slice(0, 4));
    setRemainingDiseases(shuffled.slice(4));
  }, []);

  // Update score API call
  const updateScore = async (score: number, completed: boolean) => {
    try {
      const slmcId = localStorage.getItem("SLMC_ID") || "UNKNOWN";
      await fetch("/api/update-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          SLMC_ID: slmcId,
          Score: score,
          Completed: completed,
        }),
      });
    } catch (error) {
      console.error("Failed to update score:", error);
    }
  };

  // Game timer
  useEffect(() => {
    if (timeLeft <= 0) {
      localStorage.setItem("gameScore", correctCount.toString());
      updateScore(correctCount, false).then(() => {
        router.push("/game-over");
      });
      return;
    }

    if (correctCount >= 12) {
      localStorage.setItem("gameScore", correctCount.toString());
      updateScore(correctCount, true).then(() => {
        router.push("/win");
      });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, correctCount, router]);

  // Load next batch of diseases
  const loadNextDiseases = useCallback(() => {
    if (remainingDiseases.length >= 4) {
      setCurrentDiseases(remainingDiseases.slice(0, 4));
      setRemainingDiseases(remainingDiseases.slice(4));
    } else if (remainingDiseases.length > 0) {
      setCurrentDiseases(remainingDiseases);
      setRemainingDiseases([]);
    }
  }, [remainingDiseases]);

  // Handle drag start
  const handleDragStart = (disease: typeof allDiseases[0]) => {
    setDraggedDisease(disease);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, productId: number) => {
    e.preventDefault();
    setDragOverProduct(productId);
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setDragOverProduct(null);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, productId: number) => {
    e.preventDefault();
    processDrop(productId);
  };

  // Process drop logic (shared between drag and touch)
  const processDrop = (productId: number) => {
    setDragOverProduct(null);

    if (!draggedDisease) return;

    if (draggedDisease.productId === productId) {
      // Correct match
      setCorrectCount((prev) => prev + 1);
      setMatchedDiseases((prev) => [...prev, draggedDisease.id]);
      
      // Remove from current diseases
      const newCurrentDiseases = currentDiseases.filter(d => d.id !== draggedDisease.id);
      setCurrentDiseases(newCurrentDiseases);

      // Load next batch if current is empty
      if (newCurrentDiseases.length === 0 && correctCount < 11) {
        setTimeout(loadNextDiseases, 300);
      }
    } else {
      // Wrong match - animate return
      setReturningDisease(draggedDisease.id);
      setTimeout(() => setReturningDisease(null), 500);
    }
    
    setDraggedDisease(null);
  };

  // Pointer event handlers for mouse/touch/pen (works on smart TV touchscreens)
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const [isPointerDragging, setIsPointerDragging] = useState(false);
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent, disease: typeof allDiseases[0]) => {
    e.preventDefault();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setPointerOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setPointerPosition({ x: e.clientX, y: e.clientY });
    setDraggedDisease(disease);
    setIsPointerDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDragging || !draggedDisease) return;
    e.preventDefault();
    
    // Update pointer position for visual feedback
    setPointerPosition({ x: e.clientX, y: e.clientY });
    
    // Check if over a product
    const productElements = document.querySelectorAll('[data-product-id]');
    let foundProduct: number | null = null;
    
    productElements.forEach((product) => {
      const rect = product.getBoundingClientRect();
      const productId = parseInt(product.getAttribute('data-product-id') || '0');
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        foundProduct = productId;
      }
    });
    
    setDragOverProduct(foundProduct);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDragging) return;
    e.preventDefault();
    setIsPointerDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    
    const productElements = document.querySelectorAll('[data-product-id]');
    let droppedProductId: number | null = null;
    
    productElements.forEach((product) => {
      const rect = product.getBoundingClientRect();
      const productId = parseInt(product.getAttribute('data-product-id') || '0');
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        droppedProductId = productId;
      }
    });
    
    if (droppedProductId !== null) {
      processDrop(droppedProductId);
    } else {
      setDraggedDisease(null);
      setDragOverProduct(null);
    }
  };

  return (
    <div className="min-h-screen  to-blue-600 flex flex-col">
      {/* Top Bar - Score and Timer */}
      <div className="bg-white shadow-lg px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <span className="text-red-600 text-2xl font-bold">
            Correct: {correctCount} / 12
          </span>
          <span className="text-red-600 text-2xl font-bold">
            TIME: {timeLeft}
          </span>
        </div>
      </div>

      {/* Game Area - Disease Cards */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 min-h-[200px] items-start">
            {currentDiseases.map((disease) => (
              <div
                key={disease.id}
                draggable
                onDragStart={() => handleDragStart(disease)}
                onPointerDown={(e) => handlePointerDown(e, disease)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className={`
                  touch-none
                  transition-all duration-300 ease-out flex-shrink-0
                  ${matchedDiseases.includes(disease.id) ? 'opacity-0 scale-0' : 'opacity-100'}
                  ${returningDisease === disease.id ? 'animate-bounce' : ''}
                  ${draggedDisease?.id === disease.id && isPointerDragging ? 'opacity-0' : 'opacity-100'}
                  ${draggedDisease?.id === disease.id && !isPointerDragging ? 'scale-110 rotate-3' : 'hover:scale-105'}
                `}
              >
                <div className="w-full h-full overflow-hidden rounded-lg">
                  <Image
                    src={disease.image}
                    alt={disease.name}
                    width={disease.width}
                    height={disease.height}
                    className="object-cover w-full h-full"
                    style={{ objectPosition: 'center' }}
                    draggable={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar - Product Baskets */}
      <div className="bg-white/20  px-6 py-8">
        <div className="max-w-8xl mx-auto">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                data-product-id={product.id}
                onDragOver={(e) => handleDragOver(e, product.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, product.id)}
                className={`
                  relative
                  transition-all duration-200
                  ${dragOverProduct === product.id ? 'scale-110 ' : 'hover:scale-105'}
                `}
              >
                <div className="relative w-full h-32">
                  <Image
                    src={product.src}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 33vw, 16vw"
                  />
                </div>

                
                {/* Drop zone indicator */}
                <div className={`
                  absolute inset-0 rounded-xl border-4  border-red-500 pointer-events-none
                  transition-opacity duration-200
                  ${dragOverProduct === product.id ? 'opacity-100' : 'opacity-0'}
                `} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating drag image that follows pointer */}
      {isPointerDragging && draggedDisease && (
        <div
          className="fixed pointer-events-none z-50 shadow-2xl rounded-lg overflow-hidden"
          style={{
            left: pointerPosition.x - pointerOffset.x,
            top: pointerPosition.y - pointerOffset.y,
            width: draggedDisease.width,
            height: draggedDisease.height,
          }}
        >
          <Image
            src={draggedDisease.image}
            alt={draggedDisease.name}
            width={draggedDisease.width}
            height={draggedDisease.height}
            className="object-cover w-full h-full"
          />
        </div>
      )}
    </div>
  );
}
