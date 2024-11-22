import { useEffect, useRef } from "react";
import Reveal from "reveal.js";
import "reveal.js/dist/reveal.css";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
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

  const handlePDFDownload = () => {
    // Create a new window with the presentation content
    const presentationHTML = deckRef.current?.outerHTML || "";
    const printWindow = window.open("", "_blank");
    
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Presentation</title>
            <link rel="stylesheet" href="/node_modules/reveal.js/dist/reveal.css">
            <link rel="stylesheet" href="/node_modules/reveal.js/css/print/pdf.css">
            <style>
              .reveal { height: auto !important; }
              .reveal .slides { position: relative !important; }
              .slide-content { color: white !important; }
            </style>
          </head>
          <body>
            ${presentationHTML}
            <script src="/node_modules/reveal.js/dist/reveal.js"></script>
            <script>
              window.onload = () => {
                Reveal.initialize({ 
                  width: "100%",
                  height: "100%",
                  margin: 0,
                  pdfSeparateFragments: false
                });
                window.print();
              };
            </script>
          </body>
        </html>
      `);
      
      toast({
        title: "Download Started",
        description: "Your presentation will open in a new tab. Use your browser's print function to save as PDF.",
      });
    } else {
      toast({
        title: "Download Failed",
        description: "Please allow pop-ups and try again",
        variant: "destructive",
      });
    }
  };

  const handleHTMLDownload = () => {
    const presentationHTML = deckRef.current?.outerHTML || "";
    const fullHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Presentation</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reveal.min.css">
          <style>
            .reveal { height: 100vh !important; }
            .reveal .slides { position: relative !important; }
            .slide-content { color: white !important; }
            .slide-overlay { 
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.5);
            }
          </style>
        </head>
        <body>
          ${presentationHTML}
          <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reveal.min.js"></script>
          <script>
            window.onload = () => {
              Reveal.initialize({
                width: "100%",
                height: "100%",
                margin: 0,
                transition: "fade"
              });
            };
          </script>
        </body>
      </html>
    `;

    const blob = new Blob([fullHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "presentation.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Complete",
      description: "Your presentation has been downloaded as HTML.",
    });
  };

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <Button onClick={handlePDFDownload} variant="secondary">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        <Button onClick={handleHTMLDownload} variant="secondary">
          <FileText className="w-4 h-4 mr-2" />
          Download HTML
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