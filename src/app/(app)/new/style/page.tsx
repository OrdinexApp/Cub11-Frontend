import { StepShell } from "@/components/generate/StepShell";
import { StylePickerStep } from "@/components/generate/StylePickerStep";

export const metadata = { title: "Pick a style · Cube11" };

export default function NewStylePage() {
  return (
    <StepShell
      current={2}
      backHref="/new"
      title="Pick a vibe"
      subtitle="Five honest words. No guidance scales, no CFGs."
    >
      <StylePickerStep />
    </StepShell>
  );
}
