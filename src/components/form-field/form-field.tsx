import { useId, type ComponentProps } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

/** Everything a field needs except its label: input props plus an error message. */
export type FormFieldControl = Omit<
  ComponentProps<typeof Input>,
  "id" | "required"
> & {
  error?: string;
};

type FormFieldProps = FormFieldControl & {
  label: string;
  /**
   * Announced via `aria-required`, not native `required`: validation is ours, so the
   * browser's constraint validation must not mark untouched fields invalid.
   */
  required?: boolean;
};

export function FormField({
  label,
  error,
  required,
  className,
  "aria-describedby": describedBy,
  ...inputProps
}: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <Field data-invalid={!!error} className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        className="h-11 rounded-xl px-3"
        {...inputProps}
        id={id}
        aria-required={required || undefined}
        aria-invalid={!!error}
        aria-describedby={
          [describedBy, error && errorId].filter(Boolean).join(" ") || undefined
        }
      />
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </Field>
  );
}
