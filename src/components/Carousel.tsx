import React, { useRef, useState, useEffect, useCallback } from 'react';

interface CarouselProps {
  children: React.ReactNode;
}

const Carousel = ({ children }: CarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScroll, setCanScroll] = useState(false);

  const childrenArray = React.Children.toArray(children);
  const childrenCount = childrenArray.length;
  const dotsCount = Math.min(5, childrenCount);

  const getItemDimensions = useCallback(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const firstChild = container.firstElementChild as HTMLElement;
      if (firstChild) {
        const gap = parseInt(window.getComputedStyle(container).gap) || 0;
        const itemWidth = firstChild.offsetWidth;
        return { itemWidth, gap, scrollStep: itemWidth + gap };
      }
    }
    return { itemWidth: 0, gap: 0, scrollStep: 0 };
  }, []);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      setCanScroll(scrollWidth > clientWidth);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll]);

  const handleScrollEvent = () => {
    if (scrollRef.current && canScroll) {
      const container = scrollRef.current;
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScrollLeft = scrollWidth - clientWidth;

      if (maxScrollLeft <= 0) {
        setActiveIndex(0);
        return;
      }

      const { scrollStep } = getItemDimensions();
      if (scrollStep === 0) return;

      const currentItemIndex = Math.round(scrollLeft / scrollStep);
      const maxItemIndex = Math.round(maxScrollLeft / scrollStep);

      if (childrenCount <= dotsCount) {
        setActiveIndex(currentItemIndex);
      } else {
        if (currentItemIndex <= 1) {
          setActiveIndex(currentItemIndex);
        } else if (currentItemIndex >= maxItemIndex - 1) {
          const offset = maxItemIndex - currentItemIndex;
          setActiveIndex(Math.max(0, dotsCount - 1 - offset));
        } else {
          setActiveIndex(Math.floor(dotsCount / 2));
        }
      }
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (container) {
      const { scrollStep } = getItemDimensions();
      if (scrollStep === 0) return;

        const maxScrollLeft = container.scrollWidth - container.clientWidth;

        const isAtEnd = container.scrollLeft >= maxScrollLeft - 10;
        const isAtStart = container.scrollLeft <= 10;

        if (direction === 'right' && isAtEnd) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
          return;
        }

        if (direction === 'left' && isAtStart) {
          container.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
          return;
        }

        container.scrollBy({
          left: direction === 'left' ? -scrollStep : scrollStep,
          behavior: 'smooth',
        });
    }
  };

  const scrollToDot = (index: number) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const { scrollStep } = getItemDimensions();
      if (scrollStep === 0) return;

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const maxItemIndex = Math.round(maxScrollLeft / scrollStep);

      let targetItemIndex = 0;

      if (childrenCount <= dotsCount) {
        targetItemIndex = index;
      } else {
        if (index === 0) {
          targetItemIndex = 0;
        } else if (index === 1) {
          targetItemIndex = Math.min(1, maxItemIndex);
        } else if (index === dotsCount - 1) {
          targetItemIndex = maxItemIndex;
        } else if (index === dotsCount - 2) {
          targetItemIndex = Math.max(0, maxItemIndex - 1);
        } else {
          targetItemIndex = Math.round(maxItemIndex / 2);
        }
      }
      container.scrollTo({
        left: targetItemIndex * scrollStep,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    handleScrollEvent();
  }, [children, canScroll, getItemDimensions]);

  return (
    <div className="relative flex flex-col items-center w-full group gap-2">
      <div className="relative flex items-center w-full">
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-2 z-10 p-2 bg-(--bg) hover:bg-primary-50 border border-(--border) rounded-full shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) transition-all opacity-0 group-hover:opacity-100"
          aria-label="Anterior"
        >
          <span className="text-xl font-bold flex items-center justify-center w-6 h-6" aria-hidden="true">&lt;</span>
        </button>

        <div
          ref={scrollRef}
          onScroll={handleScrollEvent}
          className="flex overflow-x-auto gap-4 scroll-smooth w-full py-4 px-2 no-scrollbar *:shrink-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {children}
        </div>

        <button
          onClick={() => handleScroll('right')}
          className="absolute right-2 z-10 p-2 bg-(--bg) hover:bg-primary-50 border border-(--border) rounded-full shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) transition-all opacity-0 group-hover:opacity-100"
          aria-label="Próximo"
        >
          <span className="text-xl font-bold flex items-center justify-center w-6 h-6" aria-hidden="true">&gt;</span>
        </button>
      </div>

      {canScroll && dotsCount > 1 && (
        <div className="flex gap-2 pb-2">
          {Array.from({ length: dotsCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToDot(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === activeIndex ? 'bg-(--accent) w-4' : 'bg-(--border) opacity-50'
              }`}
              aria-label={`Ir para a seção ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;