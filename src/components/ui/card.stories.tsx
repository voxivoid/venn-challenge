import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

/** `Card` props plus the text of its slots, so the controls can edit both. */
type CardStoryArgs = ComponentProps<typeof Card> & {
  title: string;
  content: string;
};

const meta = {
  title: "UI/Card",
  component: Card,
  args: { size: "default", title: "Title", content: "Content" },
  argTypes: {
    size: { control: "inline-radio", options: ["default", "sm"] },
    title: { control: "text" },
    content: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  render: ({ title, content, ...args }) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  ),
} satisfies Meta<CardStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
