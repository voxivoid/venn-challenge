import type { ReactNode } from "react";

type DefaultLayoutProps = {
  children: ReactNode;
};

/** App-wide page wrapper: full-height, centered column on a muted background. */
export function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <main className="flex min-h-svh flex-col items-center gap-12 bg-muted/50 px-4 py-8">
      {children}
    </main>
  );
}
