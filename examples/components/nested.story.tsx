import React from "react";
import { Text } from "ink";
import type { StoryExport } from "../../src";

const NextedStory = () => <Text>Nested story</Text>;

const storyExport: StoryExport = {
  stories: [
    {
      id: "nested-story",
      title: "Nested Story",
      component: <NextedStory />,
    },
  ],

  meta: {
    group: "Simple Examples",
    order: 1,
  },
};

export default storyExport;
