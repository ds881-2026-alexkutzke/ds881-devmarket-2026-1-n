import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  children: React.ReactNode[];
}

export default function Carousel({ children }: CarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const SCROLL_DISTANCE = 320;

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = direction === 'left' ? -SCROLL_DISTANCE : SCROLL_DISTANCE;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleScroll('left');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleScroll('right');
    }
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => handleScroll('left')}
        disabled={!canScrollLeft}
        aria-label="Scroll carousel left"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        <ChevronLeft size={20} className="text-gray-700" />
      </button>

      <div
        ref={scrollContainerRef}
        onScroll={updateScrollButtons}
        onLoad={updateScrollButtons}
        onKeyDown={handleKeyDown}
        role="region"
        aria-label="Carousel"
        tabIndex={0}
        className="overflow-x-auto overflow-y-hidden scroll-smooth flex gap-4 px-12 py-4 scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        {children}
      </div>

      <button
        onClick={() => handleScroll('right')}
        disabled={!canScrollRight}
        aria-label="Scroll carousel right"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        <ChevronRight size={20} className="text-gray-700" />
      </button>
    </div>
  );
}
