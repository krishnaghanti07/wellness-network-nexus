
import React, { useState, useEffect, useRef } from "react";
import { pipeline } from "@huggingface/transformers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Bot } from "lucide-react";
import { useHospitals } from "@/context/HospitalContext";

const QnABot: React.FC = () => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [history, setHistory] = useState<{ question: string; answer: string }[]>([]);
  const questionerRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { hospitals } = useHospitals();

  // Build context from hospital data
  const buildContext = () => {
    return hospitals.map(hospital => {
      return `Hospital Name: ${hospital.name}
Location: ${hospital.city}
Specialities: ${hospital.specialities?.join(", ")}
Rating: ${hospital.rating}
Description: ${hospital.description || "No description available"}
Number of Doctors: ${hospital.numberOfDoctors || "Information not available"}
Number of Departments: ${hospital.numberOfDepartments || "Information not available"}
`;
    }).join("\n\n");
  };

  useEffect(() => {
    const loadModel = async () => {
      try {
        questionerRef.current = await pipeline(
          "question-answering",
          "Xenova/distilbert-base-uncased-distilled-squad",
          { device: "cpu" }
        );
        setModelLoading(false);
      } catch (error) {
        console.error("Error loading model:", error);
        setModelLoading(false);
      }
    };

    loadModel();
  }, []);

  useEffect(() => {
    // Scroll to bottom of message list
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading || modelLoading) return;

    const userQuestion = query.trim();
    setQuery("");
    setIsLoading(true);

    try {
      const context = buildContext();
      const result = await questionerRef.current({
        question: userQuestion,
        context: context
      });

      // Format the answer or provide a fallback
      let botAnswer = "";
      if (result.score > 0.1) {
        botAnswer = result.answer;
      } else {
        botAnswer = "I don't have enough information to answer that question accurately. Please try asking about our hospitals, specialties, or available services.";
      }

      setAnswer(botAnswer);
      setHistory(prev => [...prev, { question: userQuestion, answer: botAnswer }]);
    } catch (error) {
      console.error("Error generating answer:", error);
      setAnswer("Sorry, I encountered an error while processing your question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="shadow-md border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            Hospital Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          {modelLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-2 text-muted-foreground">
                Loading the Q&A model... This may take a few moments.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 max-h-[500px] overflow-y-auto p-4 rounded-lg bg-muted/50">
                {history.length === 0 ? (
                  <div className="text-center py-8">
                    <Bot className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      Ask me anything about our hospitals, doctors, specialties, or services.
                    </p>
                  </div>
                ) : (
                  history.map((item, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex items-start mb-2">
                        <div className="p-3 bg-primary/10 rounded-lg max-w-[80%]">
                          <p className="font-medium">{item.question}</p>
                        </div>
                      </div>
                      <div className="flex items-start justify-end">
                        <div className="p-3 bg-primary rounded-lg text-primary-foreground max-w-[80%]">
                          <p>{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ask a question about our hospitals..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={isLoading || modelLoading}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || modelLoading || !query.trim()}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QnABot;
