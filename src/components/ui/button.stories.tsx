import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight } from "lucide-react";
import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  args: { children: "Submit", size: "lg" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
export const LoadingIconLeft: Story = {
  args: { loading: true, iconPosition: "left" },
};
export const WithIcon: Story = { args: { icon: <ArrowRight /> } };
export const WithIconLeft: Story = {
  args: { icon: <ArrowRight />, iconPosition: "left" },
};
