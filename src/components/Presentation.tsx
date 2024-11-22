import { useEffect, useRef } from "react";
import Reveal from "reveal.js";
import "reveal.js/dist/reveal.css";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PresentationProps {
  slides: Array<{ text: string; imageUrl: string }>;
  onReset: () => void;
}

const Presentation = ({ slides, onReset }: PresentationProps) => {
  const deckRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (deckRef.current) {
      const deck = new Reveal(deckRef.current, {
        hash: false,
        mouseWheel: true,
        transition: "fade",
        width: "100%",
        height: "100%",
        margin: 0,
        embedded: false,
        pdfSeparateFragments: false,
        showNotes: false,
      });
      deck.initialize();

      return () => {
        deck.destroy();
      };
    }
  }, [slides]);

  const handleDownload = () => {
    // Add print stylesheet for PDF export
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'node_modules/reveal.js/css/print/pdf.css';
    document.getElementsByTagName('head')[0].appendChild(link);

    // Open print dialog
    const printWindow = window.open(window.location.href + '?print-pdf', '_blank');
    if (printWindow) {
      toast({
        title: "Download Started",
        description: "Your presentation will open in a new tab. Use your browser's print function to save as PDF.",
      });
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
    } else {
      toast({
        title: "Download Failed",
        description: "Please allow pop-ups and try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <Button onClick={handleDownload} variant="secondary">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        <Button onClick={onReset} variant="secondary">
          New Presentation
        </Button>
      </div>
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