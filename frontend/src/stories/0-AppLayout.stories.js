import React from "react";
import {storiesOf} from "@storybook/react";
import withStore from "../../.storybook/with-store";
import AppContainer from "../app/AppContainer";
import storyStoreState from "./storyStoreState";

storiesOf("App", module)
    .addDecorator(withStore(storyStoreState))
    .addWithJSX("interactive", () => (
        <AppContainer>
            App content
        </AppContainer>
    ));
