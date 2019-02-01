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
import { SignUpFormContainer } from "../SignUpForm/SignUpFormContainer";
import { IViewProps } from "./SignUpPagePresenter";

export class SignUpPageView extends React.Component<
  IViewProps & InjectedIntlProps
> {
  public render() {
    const { intl, isOpen, onClose } = this.props;
    return (
      <Modal isOpen={isOpen}>
        <ModalBackground />
        <ModalContent>
          <Box>
            <Title css={textCenterMixin} size={3}>
              {intl.formatMessage({ id: "SignUpPage.title" })}
            </Title>
            <SignUpFormContainer />
          </Box>
        </ModalContent>
        <ModalClose className="is-large" onClick={onClose} />
      </Modal>
    );
  }
}
