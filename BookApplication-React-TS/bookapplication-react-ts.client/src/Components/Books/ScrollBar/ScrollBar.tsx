import { useRef } from 'react';

interface ScrollBarProps<T> {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
    keyExtractor: (item: T) => string | number;
}

function ScrollBar<T>({ items, renderItem, keyExtractor }: ScrollBarProps<T>) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        scrollRef.current?.scrollBy({
            left: direction === "right" ? 300 : -300,
            behavior: "smooth",
        });
    };

    return (
        <div className="relative flex items-center">

            {/* Left button */}
            <button
                onClick={() => scroll("left")}
                className="absolute left-0 z-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-md"
            >
                ‹
            </button>

            {/* Scrollable list */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide px-12 py-4 w-full"
            >
                {items.map((item) => (
                    <div key={keyExtractor(item)}>
                        {renderItem(item)}
                    </div>
                ))}
            </div>

            {/* Right button */}
            <button
                onClick={() => scroll("right")}
                className="absolute right-0 z-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-md"
            >
                ›
            </button>

        </div>
    );
}

export default ScrollBar
