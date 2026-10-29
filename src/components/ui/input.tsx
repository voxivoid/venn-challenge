import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import { cn } from "@/utils/cn";

/** A state shown as an icon at the input's right edge, e.g. while a remote check runs. */
export type InputStatus = "loading" | "valid" | "invalid";

const statusIcons = {
  loading: {
    Icon: LoaderCircle,
    label: "Checking",
    className: "animate-spin text-muted-foreground",
  },
  valid: {
    Icon: CircleCheck,
    label: "Valid",
    className: "text-green-600 dark:text-green-500",
  },
  invalid: { Icon: CircleX, label: "Invalid", className: "text-destructive" },
} satisfies Record<
  InputStatus,
  { Icon: React.ElementType; label: string; className: string }
>;

function Input({
  className,
  type,
  status,
  ...props
}: React.ComponentProps<"input"> & { status?: InputStatus }) {
  const input = (
    <InputPrimitive
      type={type}
      data-slot="input"
      aria-busy={status === "loading" || undefined}
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
        // After `className`, so a caller's padding cannot slide text under the icon.
        status && "pr-9",
      )}
      {...props}
    />
  );
  if (!status) return input;

  const { Icon, label, className: iconClassName } = statusIcons[status];
  return (
    <div data-slot="input-wrapper" className="relative w-full">
      {input}
      <Icon
        role="img"
        aria-label={label}
        aria-hidden={false}
        className={cn(
          "pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2",
          iconClassName,
        )}
      />
    </div>
  );
}

export { Input };
