type StepIndicatorProps = {
  step: number;
  totalSteps: number;
};

export function StepIndicator({ step, totalSteps }: StepIndicatorProps) {
  return (
    <p className="text-lg">
      Step {step} of {totalSteps}
    </p>
  );
}
