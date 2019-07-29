import * as React from "react";

import { InjectedIntlProps, injectIntl } from "react-intl";

import { Form, FormRenderProps } from "react-final-form";

import { Button } from "src/components/common/Button/Button";
import { HelpText } from "src/components/common/HelpText/HelpText";
import { Modal } from "src/components/common/Modal/Modal";
import { ModalBackground } from "src/components/common/ModalBackground/ModalBackground";
import { ModalCard } from "src/components/common/ModalCard/ModalCard";
import { ModalContent } from "src/components/common/ModalContent/ModalContent";

import { textCenterMixin } from "src/styles/mixins";

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => any;
  onSubmit: (values: object) => any;
  isLoading?: boolean;
  validate?: (values: object) => object | Promise<object>;
  globalError: string | undefined;
  renderFields: () => React.ReactNode;
  title: string;
  formID: string;
}

export const CreateModal = injectIntl(
  class extends React.Component<IProps & InjectedIntlProps> {
    public render() {
      const { isOpen, onClose, onSubmit, validate } = this.props;
      return (
        <Modal isOpen={isOpen}>
          <ModalBackground onClick={onClose} />
          <ModalContent>
            <Form
              validate={validate}
              onSubmit={onSubmit}
              render={this.renderInnerForm}
            />
          </ModalContent>
        </Modal>
      );
    }

    private renderInnerForm = ({ handleSubmit, ...props }: FormRenderProps) => {
      const {
        onClose,
        intl,
        isLoading = false,
        title,
        globalError,
        renderFields,
        formID
      } = this.props;
console.log(props);
      return (
        <ModalCard>
          <ModalCard.Head>
            <ModalCard.Title>{title}</ModalCard.Title>
            <ModalCard.Close onClick={onClose} />
          </ModalCard.Head>
          <ModalCard.Body>
            <form id={formID} onSubmit={handleSubmit}>
              {renderFields()}
              <div css={textCenterMixin}>
                {globalError && (
                  <HelpText type="is-danger">
                    {intl.formatMessage({ id: globalError })}
                  </HelpText>
                )}
              </div>
            </form>
          </ModalCard.Body>
          <ModalCard.Foot>
            <Button
              form={formID}
              type="submit"
              color="is-primary"
              isLoading={isLoading}
            >
              {intl.formatMessage({ id: "common.create" })}
            </Button>
            <Button color="is-danger" onClick={onClose}>
              {intl.formatMessage({ id: "common.cancel" })}
            </Button>
          </ModalCard.Foot>
        </ModalCard>
      );
    };
  }
);
