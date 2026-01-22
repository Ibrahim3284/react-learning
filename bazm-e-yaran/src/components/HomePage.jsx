import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
  "https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  "https://img.freepik.com/free-photo/book-with-green-board-background_1150-3837.jpg",
  "https://images.pexels.com/photos/2781814/pexels-photo-2781814.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
];

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (idx) => {
    setCurrentIndex(idx);
  };

  return (
    <div className="w-screen h-[60vh] relative overflow-hidden">
      {/* Images */}
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`slide-${idx}`}
          className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70"></div>

      {/* Caption & CTA */}
      <div className="absolute inset-0 flex flex-col justify-center items-start px-12">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white drop-shadow-lg mb-4 animate-fadeIn">
          Inspiring Education ✨
        </h1>
        <p className="text-white text-lg sm:text-2xl drop-shadow-md mb-6">
          Unlock your potential with world-class courses.
        </p>
        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition duration-300">
          Explore Courses
        </button>
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full hover:bg-black/60 transition"
      >
        <ChevronLeft className="text-white w-6 h-6" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full hover:bg-black/60 transition"
      >
        <ChevronRight className="text-white w-6 h-6" />
      </button>

      {/* Indicator Circles */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-3 h-3 rounded-full transition ${
              idx === currentIndex ? "bg-red-600 scale-125" : "bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
