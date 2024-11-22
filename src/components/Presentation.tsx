import { useEffect, useRef } from "react";
import Reveal from "reveal.js";
import "reveal.js/dist/reveal.css";
import { Button } from "@/components/ui/button";

interface PresentationProps {
  slides: Array<{ text: string; imageUrl: string }>;
  onReset: () => void;
}

const Presentation = ({ slides, onReset }: PresentationProps) => {
  const deckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (deckRef.current) {
      const deck = new Reveal(deckRef.current, {
        hash: false,
        mouseWheel: true,
        transition: "fade",
      });
      deck.initialize();
    }
  }, []);

  return (
    <div className="relative">
      <Button
        onClick={onReset}
        className="absolute top-4 right-4 z-50"
        variant="secondary"
      >
        New Presentation
      </Button>
      <div className="reveal" ref={deckRef}>
        <div className="slides">
          {slides.map((slide, index) => (
            <section
              key={index}
              data-background={slide.imageUrl}
              data-background-size="cover"
            >
              <div className="slide-overlay" />
              <div className="slide-content">
                <h2 className="text-4xl text-white max-w-4xl mx-auto leading-relaxed">
                  {slide.text}
                </h2>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Presentation;