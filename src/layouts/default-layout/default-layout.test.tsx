import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { DefaultLayout } from "./default-layout";

it("renders its children inside the main landmark", () => {
  render(
    <DefaultLayout>
      <p>content</p>
    </DefaultLayout>,
  );

  expect(screen.getByRole("main")).toHaveTextContent("content");
});
