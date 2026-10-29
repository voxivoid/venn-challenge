import type { Meta, StoryObj } from "@storybook/react-vite";
import { DefaultLayout } from "./default-layout";

const meta = {
  title: "Layouts/DefaultLayout",
  component: DefaultLayout,
  args: { children: <p>Page content</p> },
} satisfies Meta<typeof DefaultLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
