import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";

const VARK_QUESTIONS = [
  {
    question: "When learning a new skill, you prefer to:",
    options: [
      { value: "visual", label: "Watch demonstrations and videos" },
      { value: "auditory", label: "Listen to verbal instructions" },
      { value: "reading", label: "Read written instructions" },
      { value: "kinesthetic", label: "Try it hands-on immediately" }
    ]
  },
  {
    question: "When studying, you find it most effective to:",
    options: [
      { value: "visual", label: "Use diagrams and charts" },
      { value: "auditory", label: "Discuss the topic with others" },
      { value: "reading", label: "Take detailed notes" },
      { value: "kinesthetic", label: "Create physical models or act it out" }
    ]
  },
  {
    question: "When remembering directions, you prefer:",
    options: [
      { value: "visual", label: "Looking at a map" },
      { value: "auditory", label: "Listening to verbal directions" },
      { value: "reading", label: "Reading written directions" },
      { value: "kinesthetic", label: "Walking the route once" }
    ]
  },
  {
    question: "When solving a problem, you tend to:",
    options: [
      { value: "visual", label: "Visualize the solution" },
      { value: "auditory", label: "Talk through the steps" },
      { value: "reading", label: "Write down the steps" },
      { value: "kinesthetic", label: "Use trial and error" }
    ]
  }
];

type VarkAssessmentProps = {
  onComplete: () => void;
};

export default function VarkAssessment({ onComplete }: VarkAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(VARK_QUESTIONS.length).fill(""));
  const { toast } = useToast();

  const submitAssessment = useMutation({
    mutationFn: async (answers: string[]) => {
      const res = await apiRequest("POST", "/api/vark-assessment", { answers });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], data);
      toast({
        title: "Assessment Complete",
        description: `Your dominant learning style is ${data.learningStyle}`,
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

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const canSubmit = answers.every(answer => answer !== "");
  const progress = ((answers.filter(a => a !== "").length) / VARK_QUESTIONS.length) * 100;

  const navigateNext = () => {
    if (currentQuestion < VARK_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (canSubmit) {
      submitAssessment.mutate(answers);
    }
  };

  const navigatePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const question = VARK_QUESTIONS[currentQuestion];

  return (
    <div className="space-y-8">
      <Progress value={progress} className="w-full" />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Question {currentQuestion + 1} of {VARK_QUESTIONS.length}
        </h2>
        <p className="text-lg">{question.question}</p>
      </div>

      <RadioGroup
        className="space-y-4"
        value={answers[currentQuestion]}
        onValueChange={handleAnswer}
        disabled={submitAssessment.isPending}
      >
        {question.options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2 p-4 rounded-lg hover:bg-accent cursor-pointer">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value} className="text-base flex-1 cursor-pointer">
              {option.label}
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
          {currentQuestion + 1} / {VARK_QUESTIONS.length}
        </div>

        <Button
          onClick={navigateNext}
          disabled={!answers[currentQuestion] || submitAssessment.isPending}
        >
          {currentQuestion === VARK_QUESTIONS.length - 1 ? (
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