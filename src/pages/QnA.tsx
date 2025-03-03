
import React from "react";
import QnABot from "@/components/QnABot";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const QnA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-transition container mx-auto min-h-screen px-4 py-20">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Hospital Assistant
        </h1>
        <p className="mt-2 text-muted-foreground">
          Ask questions about our hospitals, specialties, or services
        </p>
      </div>

      <QnABot />
    </div>
  );
};

export default QnA;
