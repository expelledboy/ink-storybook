import React from "react";
import { Text } from "ink";

const VanillaJsStory = () => <Text>Vanilla JS Story</Text>;

const storyExport = {
  stories: [
    {
      id: "vanilla-js-story",
      title: "Vanilla JS Story",
      component: <VanillaJsStory />
    },
  ],

  meta: {
    group: "Simple Examples",
    order: 1,
  },
};

export default storyExport;
