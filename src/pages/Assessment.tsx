import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Car, Wrench, Package, BarChart3, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SectionNavigation } from "@/components/assessment/SectionNavigation";
import { SectionForm } from "@/components/assessment/SectionForm";
import { SmartAssistant } from "@/components/SmartAssistant";
import { questionnaire } from "@/data/questionnaire";
import { useAssessmentData } from "@/hooks/useAssessmentData";

export default function Assessment() {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const [showAssistant, setShowAssistant] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [formDirty, setFormDirty] = useState(false);

  const navigate = useNavigate();
  const { assessment, saveAssessment, loadAssessment } = useAssessmentData();

  const sections = questionnaire.sections;
  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;
  const overallProgress = (answeredQuestions / totalQuestions) * 100;

  const currentSectionData = sections[currentSection];

  // score calculation reused from previous implementation
  const calculateScores = useCallback(
    (currentAnswers: Record<string, number>) => {
      const sectionScores: Record<string, number> = {};
      const sectionWeights: Record<string, number> = {};
      const sectionCompletion: Record<string, number> = {};

      sections.forEach((section) => {
        let weightedTotal = 0;
        let answeredWeight = 0;
        let possibleWeight = 0;

        section.questions.forEach((q) => {
          const weight = q.weight ?? 1;
          possibleWeight += weight;
          const answer = currentAnswers[q.id];
          if (answer !== undefined) {
            const min = q.scale?.min ?? 1;
            const max = q.scale?.max ?? 5;
            const ratio = (answer - min) / (max - min);
            const logistic = 1 / (1 + Math.exp(-12 * (ratio - 0.5)));
            const normalized = logistic * 100;
            weightedTotal += normalized * weight;
            answeredWeight += weight;
          }
        });

        if (answeredWeight > 0) {
          sectionScores[section.id] = Math.round(weightedTotal / answeredWeight);
          sectionWeights[section.id] = answeredWeight;
          sectionCompletion[section.id] = answeredWeight / possibleWeight;
        }
      });

      const totalWeight = Object.entries(sectionWeights).reduce(
        (sum, [id, weight]) => sum + weight * (sectionCompletion[id] || 0),
        0
      );
      const overallScore = totalWeight
        ? Math.round(
            Object.entries(sectionScores).reduce(
              (sum, [id, score]) =>
                sum + score * sectionWeights[id] * (sectionCompletion[id] || 0),
              0
            ) / totalWeight
          )
        : 0;

      return { sectionScores, overallScore };
    },
    [sections]
  );

  const handleSectionSave = async (sectionAnswers: Record<string, number>) => {
    const newAnswers = { ...answers, ...sectionAnswers };
    setAnswers(newAnswers);
    const { sectionScores, overallScore } = calculateScores(newAnswers);
    setScores(sectionScores);
    try {
      await saveAssessment({
        answers: newAnswers,
        scores: sectionScores,
        overallScore,
        status: 'in_progress' as const,
      });
    } catch (error) {
      console.error('Failed to save assessment:', error);
    }
  };

  const navigateToSection = (index: number) => {
    if (formDirty) {
      setPendingNavigation(() => () => setCurrentSection(index));
      setShowConfirmDialog(true);
    } else {
      setCurrentSection(index);
    }
  };

  const handleNext = () => navigateToSection(currentSection + 1);
  const handlePrev = () => navigateToSection(currentSection - 1);
  const handleExit = () => navigate('/');

  const getSectionIcon = (title: string) => {
    if (title.includes("New Vehicle")) return Car;
    if (title.includes("Used Vehicle")) return Car;
    if (title.includes("Service")) return Wrench;
    if (title.includes("Parts")) return Package;
    return BarChart3;
  };

  // load existing
  useEffect(() => {
    const load = async () => {
      try {
        await loadAssessment();
      } catch (e) {
        console.error('load failed', e);
      }
    };
    load();
  }, [loadAssessment]);

  // sync
  useEffect(() => {
    if (assessment) {
      setAnswers(assessment.answers || {});
      setScores(assessment.scores || {});
    }
  }, [assessment]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Car className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Dealership Performance Assessment</h1>
          </div>
          <p className="text-gray-600 mb-6">Comprehensive analysis of your dealership's operational excellence</p>

          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{answeredQuestions} of {totalQuestions} questions</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <Button variant="outline" className="mt-2" disabled>
              {Math.round(overallProgress)}% Complete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SectionNavigation
              sections={sections}
              currentSection={currentSection}
              answers={answers}
              onNavigate={navigateToSection}
              getSectionIcon={getSectionIcon}
            />
          </div>

          {/* Main */}
          <div className="lg:col-span-3">
            <Card className="p-4">
              <SectionForm
                section={currentSectionData}
                answers={answers}
                onSave={handleSectionSave}
                onNext={handleNext}
                onPrev={handlePrev}
                onExit={handleExit}
                isFirst={currentSection === 0}
                isLast={currentSection === sections.length - 1}
                onDirtyChange={setFormDirty}
              />
            </Card>
          </div>
        </div>

        {/* Smart Assistant Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setShowAssistant(true)}
            className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
          >
            <Bot className="h-6 w-6" />
          </Button>
        </div>

        {/* Smart Assistant */}
        <SmartAssistant
          open={showAssistant}
          onOpenChange={setShowAssistant}
          currentQuestion={undefined}
          currentSection={currentSectionData}
          answers={answers}
          scores={scores}
        />

        {/* Unsaved changes dialog */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved changes on this section. Are you sure you want to navigate away?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (pendingNavigation) {
                    pendingNavigation();
                    setPendingNavigation(null);
                  }
                  setShowConfirmDialog(false);
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

