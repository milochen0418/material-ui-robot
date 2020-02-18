import React from "react";
import {storiesOf} from "@storybook/react";
import {text} from "@storybook/addon-knobs";
import {Title} from "../components";

const stories = storiesOf("Title", module);

stories.addWithJSX("interactive", () => (
    <Title>
        {text("Title", "Your special title")}
    </Title>
));
