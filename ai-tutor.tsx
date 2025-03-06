import { useState } from "react";
import { Subject } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

type AiTutorProps = {
  subject: Subject;
  learningStyle: string;
  level: string;
};

type LearningState = "topic-selection" | "learning" | "completed";

export default function AiTutor({ subject, learningStyle, level }: AiTutorProps) {
  const [, setLocation] = useLocation();
  const [topic, setTopic] = useState("");
  const [learningState, setLearningState] = useState<LearningState>("topic-selection");
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState<string | null>(null);

  const handleTopicSubmit = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    try {
      // In a real implementation, this would call the Groq API
      // For now, we'll simulate content generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate different content based on learning style
      let generatedContent = "";
      switch (learningStyle) {
        case "visual":
          generatedContent = `[Visual explanation of ${topic}]\n\nKey diagrams and visual aids would be shown here...`;
          break;
        case "auditory":
          generatedContent = `[Audio explanation of ${topic}]\n\nDetailed verbal explanation would be provided...`;
          break;
        case "reading":
          generatedContent = `Comprehensive written explanation of ${topic}:\n\nDetailed text content would be shown here...`;
          break;
        case "kinesthetic":
          generatedContent = `Interactive exercises for ${topic}:\n\nPractical examples and exercises would be provided...`;
          break;
        default:
          generatedContent = `Learning content for ${topic}`;
      }

      setContent(generatedContent);
      setLearningState("learning");
    } catch (error) {
      console.error("Failed to generate content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    setLearningState("completed");
    // Navigate to knowledge test
    setLocation(`/assessment?topic=${encodeURIComponent(topic)}`);
  };

  if (learningState === "topic-selection") {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">What would you like to learn?</h2>
        <Card className="p-6">
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Choose a topic from {subject.name} to start learning:
            </p>
            <div className="flex gap-2">
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic..."
                className="flex-1"
              />
              <Button
                onClick={handleTopicSubmit}
                disabled={!topic.trim() || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Start Learning"
                )}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {(subject.topics as string[]).map((t) => (
                <Button
                  key={t}
                  variant="outline"
                  size="sm"
                  onClick={() => setTopic(t)}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Learning: {topic}</h2>
        <Button variant="outline" onClick={() => setLearningState("topic-selection")}>
          Change Topic
        </Button>
      </div>

      <Card className="p-6">
        <div className="prose max-w-none dark:prose-invert">
          <div className="whitespace-pre-wrap">{content}</div>
        </div>

        <div className="mt-8 text-center">
          <Button
            size="lg"
            onClick={handleComplete}
          >
            Complete & Take Assessment
          </Button>
        </div>
      </Card>
    </div>
  );
}