import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Presentation from "@/components/Presentation";

const Index = () => {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [presentationData, setPresentationData] = useState<Array<{ text: string; imageUrl: string }>>([]);
  const { toast } = useToast();

  const generatePresentation = async () => {
    if (!topic) {
      toast({
        title: "Please enter a topic",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Fetch Wikipedia content
      const wikiResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(
          topic
        )}&origin=*`
      );
      const wikiData = await wikiResponse.json();
      const page = Object.values(wikiData.query.pages)[0] as any;
      const text = page.extract || "No content found";

      // Split into sentences and take first 10
      const sentences = text
        .split(/[.!?]+/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0)
        .slice(0, 10);

      // Generate slides data
      const slides = await Promise.all(
        sentences.map(async (sentence: string, index: number) => ({
          text: sentence,
          imageUrl: `https://picsum.photos/1920/1080?random=${index}`,
        }))
      );

      setPresentationData(slides);
      setIsGenerating(false);
    } catch (error) {
      toast({
        title: "Error generating presentation",
        description: "Please try again with a different topic",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {!presentationData.length ? (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto space-y-8">
            <h1 className="text-4xl font-bold text-white text-center font-serif">
              Presentation Generator
            </h1>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter your topic..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full"
              />
              <Button
                onClick={generatePresentation}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Generate Presentation"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Presentation slides={presentationData} onReset={() => setPresentationData([])} />
      )}
    </div>
  );
};

export default Index;