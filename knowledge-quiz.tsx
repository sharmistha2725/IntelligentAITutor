import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

type KnowledgeQuizProps = {
  subjectId: number;
  onComplete: () => void;
  topic?: string;
};

export default function KnowledgeQuiz({ subjectId, topic, onComplete }: KnowledgeQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const { toast } = useToast();

  // In a real implementation, questions would be generated based on the topic
  const questions = [
    {
      question: `What is the main concept of ${topic || "this subject"}?`,
      options: [
        "Option A explanation",
        "Option B explanation",
        "Option C explanation",
        "Option D explanation"
      ],
      correct: 0
    },
    {
      question: "How does this concept apply in practice?",
      options: [
        "Application A",
        "Application B",
        "Application C",
        "Application D"
      ],
      correct: 1
    },
    {
      question: "What are the key components?",
      options: [
        "Components A",
        "Components B",
        "Components C",
        "Components D"
      ],
      correct: 2
    }
  ];

  const submitAssessment = useMutation({
    mutationFn: async (data: { subjectId: number; score: number }) => {
      const res = await apiRequest("POST", "/api/knowledge-assessment", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], data);
      const score = answers.filter((answer, index) => answer === questions[index].correct).length;
      toast({
        title: "Assessment Complete",
        description: `You scored ${score} out of ${questions.length}`,
      });
      onComplete();
    },
    onError: (error) => {
      toast({
        title: "Assessment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const navigateNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (answers.length === questions.length) {
      const score = answers.filter((answer, index) => answer === questions[index].correct).length;
      submitAssessment.mutate({ subjectId, score });
    }
  };

  const navigatePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const canSubmit = answers.length === questions.length;
  const progress = (answers.filter(a => a !== undefined).length / questions.length) * 100;

  return (
    <div className="space-y-8">
      <Progress value={progress} className="w-full" />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Question {currentQuestion + 1} of {questions.length}
        </h2>
        <p className="text-lg">{questions[currentQuestion].question}</p>
      </div>

      <RadioGroup
        className="space-y-4"
        value={answers[currentQuestion]?.toString()}
        onValueChange={(value) => handleAnswer(parseInt(value))}
        disabled={submitAssessment.isPending}
      >
        {questions[currentQuestion].options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2 p-4 rounded-lg hover:bg-accent cursor-pointer">
            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
            <Label htmlFor={`option-${index}`} className="text-base flex-1 cursor-pointer">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          onClick={navigatePrev}
          disabled={currentQuestion === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="text-sm text-muted-foreground">
          {currentQuestion + 1} / {questions.length}
        </div>

        <Button
          onClick={navigateNext}
          disabled={answers[currentQuestion] === undefined || submitAssessment.isPending}
        >
          {currentQuestion === questions.length - 1 ? (
            canSubmit ? "Submit" : "Complete All Questions"
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}