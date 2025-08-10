import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "./QuestionCard";
import type { Section } from "@/data/questionnaire";
import { cn } from "@/lib/utils";

interface SectionFormProps {
  section: Section;
  answers: Record<string, number>;
  onSave: (values: Record<string, number>) => Promise<void>;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
  isFirst: boolean;
  isLast: boolean;
  onDirtyChange?: (dirty: boolean) => void;
}

export function SectionForm({
  section,
  answers,
  onSave,
  onNext,
  onPrev,
  onExit,
  isFirst,
  isLast,
  onDirtyChange,
}: SectionFormProps) {
  const defaultValues: Record<string, number | undefined> = {};
  section.questions.forEach((q) => {
    defaultValues[q.id] = answers[q.id];
  });

  const {
    control,
    watch,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
  } = useForm<Record<string, number | undefined>>({ defaultValues });

  const watched = watch();
  const [saved, setSaved] = useState(false);

  // reset when the section or saved answers change
  useEffect(() => {
    const values: Record<string, number | undefined> = {};
    section.questions.forEach((q) => {
      values[q.id] = answers[q.id];
    });
    reset(values);
  }, [section, answers, reset]);

  // autosave with debounce only when form is dirty
  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(async () => {
      await onSave(watched as Record<string, number>);
      reset(watched);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
    return () => clearTimeout(timer);
  }, [watched, isDirty, onSave, reset]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const completion = Math.round(
    (Object.values(watched).filter((v) => v !== undefined).length /
      section.questions.length) *
      100
  );

  const onSubmitNext = handleSubmit(async () => {
    await onSave(watched as Record<string, number>);
    onNext();
  });

  const onSubmitPrev = async () => {
    await onSave(watched as Record<string, number>);
    onPrev();
  };

  const onSubmitExit = async () => {
    await onSave(watched as Record<string, number>);
    onExit();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <form className="space-y-6" onSubmit={onSubmitNext}>
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white z-10 py-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">{section.title}</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{completion}% complete</span>
          {saved && <span className="text-green-600">Saved</span>}
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="pt-4"
      >
        {section.questions.map((question, index) => (
          <motion.div
            key={question.id}
            variants={itemVariants}
            className={cn(
              "bg-white rounded-lg shadow p-6",
              index > 0 && "mt-6"
            )}
          >
            <Controller
              name={question.id}
              control={control}
              rules={{ required: question.required }}
              render={({ field }) => (
                <QuestionCard
                  question={question}
                  value={field.value as number | undefined}
                  onChange={field.onChange}
                />
              )}
            />
            {errors[question.id] && (
              <p className="text-sm text-red-500 mt-2">This question is required.</p>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <div>
          {!isFirst && (
            <Button type="button" variant="outline" onClick={onSubmitPrev}>
              Save &amp; Previous Section
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onSubmitExit}>
            Save &amp; Exit
          </Button>
          {!isLast && (
            <Button type="button" onClick={onSubmitNext}>
              Save &amp; Next Section
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

