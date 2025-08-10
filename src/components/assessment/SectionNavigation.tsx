import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, Clock, AlertCircle } from "lucide-react";
import { Section } from "@/data/questionnaire";

interface SectionNavigationProps {
  sections: Section[];
  currentSection: number;
  answers: Record<string, number>;
  onNavigate: (sectionIndex: number) => void;
  getSectionIcon: (title: string) => React.ComponentType<unknown>;
}

export function SectionNavigation({
  sections,
  currentSection,
  answers,
  onNavigate,
  getSectionIcon
}: SectionNavigationProps) {
  const getSectionProgress = (section: Section) => {
    const sectionQuestions = section.questions;
    const answeredInSection = sectionQuestions.filter(q => q.id in answers).length;
    return (answeredInSection / sectionQuestions.length) * 100;
  };

  const getSectionStatus = (sectionIndex: number, section: Section) => {
    const progress = getSectionProgress(section);
    
    if (sectionIndex === currentSection) {
      return { icon: Clock, color: "text-blue-600", bg: "bg-blue-50" };
    } else if (progress === 100) {
      return { icon: Check, color: "text-green-600", bg: "bg-green-50" };
    } else if (progress > 0) {
      return { icon: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-50" };
    } else {
      return { icon: Clock, color: "text-gray-400", bg: "bg-gray-50" };
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Assessment Sections</h2>
      
      {sections.map((section, sectionIndex) => {
        const progress = getSectionProgress(section);
        const status = getSectionStatus(sectionIndex, section);
        const Icon = getSectionIcon(section.title);
        const StatusIcon = status.icon;
        const isCurrentSection = sectionIndex === currentSection;
        const answered = section.questions.filter(q => q.id in answers).length;
        let badge: { text: string; className: string };
        if (progress === 100) {
          badge = { text: "Done", className: "bg-green-100 text-green-800" };
        } else if (progress > 0) {
          badge = { text: "In Progress", className: "bg-yellow-100 text-yellow-800" };
        } else {
          badge = { text: "Not Started", className: "bg-gray-100 text-gray-800" };
        }

        return (
          <Card
            key={section.id}
            className={`transition-all duration-200 cursor-pointer border-2 ${
              isCurrentSection
                ? "border-blue-500 shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
            }`}
            onClick={() => onNavigate(sectionIndex)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className={`p-2 rounded-lg ${status.bg}`}>
                  <Icon className={`h-5 w-5 ${status.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm leading-tight">
                    {section.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {section.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${badge.className} text-xs`}>{badge.text}</Badge>
                  <StatusIcon className={`h-4 w-4 ${status.color}`} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">
                    {answered} of {section.questions.length}
                  </span>
                  <Badge
                    variant={progress === 100 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {Math.round(progress)}%
                  </Badge>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Overall Progress */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Overall Progress</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-blue-800">
              <span>
                {Object.keys(answers).length} of {sections.reduce((sum, s) => sum + s.questions.length, 0)} questions
              </span>
              <span>
                {Math.round((Object.keys(answers).length / sections.reduce((sum, s) => sum + s.questions.length, 0)) * 100)}%
              </span>
            </div>
            <Progress 
              value={(Object.keys(answers).length / sections.reduce((sum, s) => sum + s.questions.length, 0)) * 100} 
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}