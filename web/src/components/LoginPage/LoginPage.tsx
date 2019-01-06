/** @jsx jsx */
import { jsx } from "@emotion/core";
import classNames from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { textCenterMixin } from "src/styles/mixins";
import { Title } from "../common/Title/Title";
import { LoginFormContainer } from "../LoginForm/LoginFormContainer";

export class LoginPage extends React.Component {
  public render() {
    return (
      <div
        className={classNames(
          "column",
          "is-three-fifths",
          "is-offset-one-fifth"
        )}
      >
        <Title css={textCenterMixin} size={3}>
          <FormattedMessage id="LoginPage.title" defaultMessage="Hello!" />
        </Title>
        <LoginFormContainer />
      </div>
    );
  }
}
