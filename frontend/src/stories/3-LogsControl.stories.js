import React from "react";
import {storiesOf} from "@storybook/react";
import {text} from "@storybook/addon-knobs";
import LogsControl from "../components/LogsControl";

const stories = storiesOf("LogsControl", module);

const mockLogListener = (robotId, onNewMessage) => {
    let isInitial = true;
    let counter = 0;
    const intervalId = setInterval(() => {
        if (isInitial) {
            isInitial = false;
            const date = new Date();
            return onNewMessage([
                {
                    date: new Date(date.getTime() - 15000),
                    message: `mock message number ${counter++}`,
                },
                {
                    date: new Date(date.getTime() - 10000),
                    message: `mock message number ${counter++}`,
                },
                {
                    date: new Date(date.getTime() - 5000),
                    message: `mock message number ${counter++}`,
                },
                {
                    date,
                    message: `mock message number ${counter++}`,
                },
            ]);
        }

        return onNewMessage({
            date: new Date(),
            message: `mock message number ${counter++}`,
        });
    }, 1000);
    return {
        close: () => {
            clearInterval(intervalId);
        },
    };
};

stories.addWithJSX("interactive", () => (
    <div style={{height: "200px"}}>
        <LogsControl
            robotId={text("robotId", "123")}
            initLogListener={mockLogListener}
        />
    </div>
));
