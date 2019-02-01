/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import { InjectedIntlProps } from "react-intl";
import { Box } from "src/components/common/Box/Box";
import { Modal } from "src/components/common/Modal/Modal";
import { ModalBackground } from "src/components/common/ModalBackground/ModalBackground";
import { ModalClose } from "src/components/common/ModalClose/ModalClose";
import { ModalContent } from "src/components/common/ModalContent/ModalContent";
import { textCenterMixin } from "src/styles/mixins";
import { Title } from "../../common/Title/Title";
import { LoginFormContainer } from "../LoginForm/LoginFormContainer";
import { IViewProps as IProps } from "./LoginPagePresenter";

export class LoginPageView extends React.Component<IProps & InjectedIntlProps> {
  public render() {
    const { intl, isOpen, onClose } = this.props;
    return (
      <Modal isOpen={isOpen}>
        <ModalBackground />
        <ModalContent>
          <Box>
            <Title css={textCenterMixin} size={3}>
              {intl.formatMessage({ id: "LoginPage.title" })}
            </Title>
            <LoginFormContainer />
          </Box>
        </ModalContent>
        <ModalClose className="is-large" onClick={onClose} />
      </Modal>
    );
  }
}
