import { useId, type ComponentProps } from "react"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type FormFieldProps = Omit<ComponentProps<typeof Input>, "id"> & {
  label: string
  error?: string
}

export function FormField({
  label,
  error,
  className,
  ...inputProps
}: FormFieldProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <Field data-invalid={!!error} className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className="h-11 rounded-xl px-3"
        {...inputProps}
      />
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </Field>
  )
}
