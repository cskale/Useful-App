import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

export default function QuestionExplanation({ explanation }: { explanation?: string }) {
  if (!explanation) return null;
  return (
    <div className="mt-4">
      <Collapsible>
        <div className="flex items-center gap-2 text-slate-600">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Why we ask this</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <CollapsibleTrigger className="text-sm font-medium underline underline-offset-4">
            Why we ask this
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="mt-2 text-sm text-slate-700 bg-slate-50 p-3 rounded-md">
          {explanation}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
