import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, Check, Plus } from "lucide-react";
import { fn } from "storybook/test";
import { Button } from "./button";

/** Icons the `icon` control can pick; stories pass the key, e.g. `icon: "ArrowRight"`. */
const icons = {
  none: undefined,
  ArrowRight: <ArrowRight />,
  Check: <Check />,
  Plus: <Plus />,
};

const meta = {
  title: "UI/Button",
  component: Button,
  args: {
    children: "Submit",
    variant: "default",
    size: "lg",
    loading: false,
    disabled: false,
    icon: "none",
    iconPosition: "right",
    onClick: fn(),
  },
  argTypes: {
    children: { control: "text" },
    variant: {
      control: "select",
      options: [
        "default",
        "outline",
        "secondary",
        "ghost",
        "destructive",
        "link",
      ],
    },
    size: {
      control: "select",
      options: [
        "default",
        "xs",
        "sm",
        "lg",
        "icon",
        "icon-xs",
        "icon-sm",
        "icon-lg",
      ],
    },
    icon: { control: "select", options: Object.keys(icons), mapping: icons },
    iconPosition: { control: "inline-radio", options: ["left", "right"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
export const LoadingIconLeft: Story = {
  args: { loading: true, iconPosition: "left" },
};
export const WithIcon: Story = { args: { icon: "ArrowRight" } };
export const WithIconLeft: Story = {
  args: { icon: "ArrowRight", iconPosition: "left" },
};
