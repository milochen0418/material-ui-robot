import React from "react";
import {action} from "@storybook/addon-actions";
import {storiesOf} from "@storybook/react";
import {JointMoveControl} from "../components/robotControls/JointMoveControl";

const stories = storiesOf("JointMoveControl", module);

stories.addWithJSX("interactive", () => (
    <JointMoveControl
        moveJoint={action("clicked")}
    />
));
