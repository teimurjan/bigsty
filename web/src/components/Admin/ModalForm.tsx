import * as React from 'react';

import { InjectedIntlProps, injectIntl } from 'react-intl';

import { Form, FormRenderProps } from 'react-final-form';

import { Button } from 'src/components/common/Button/Button';
import { HelpText } from 'src/components/common/HelpText/HelpText';
import { Modal } from 'src/components/common/Modal/Modal';
import { ModalBackground } from 'src/components/common/ModalBackground/ModalBackground';
import { ModalCard } from 'src/components/common/ModalCard/ModalCard';
import { ModalContent } from 'src/components/common/ModalContent/ModalContent';

import { textCenterMixin } from 'src/styles/mixins';
import { LoaderLayout } from '../common/LoaderLayout/LoaderLayout';
import { Message } from '../common/Message/Message';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => any;
  onSubmit: (values: object) => any;
  isLoading?: boolean;
  isPreloading?: boolean;
  validate?: (values: object) => object | Promise<object>;
  globalError?: string;
  renderFields: () => React.ReactNode;
  title: string;
  formID: string;
  submitText?: string;
  cancelText?: string;
  initialValues?: object;
  preloadingError?: string;
}

export const ModalForm = injectIntl(
  class extends React.Component<IProps & InjectedIntlProps> {
    public render() {
      const { isOpen, onClose, onSubmit, validate, initialValues, preloadingError, intl } = this.props;
      return (
        <Modal isOpen={isOpen}>
          <ModalBackground onClick={onClose} />
          <ModalContent>
            {preloadingError ? (
              <Message color="is-danger">
                <Message.Header>
                  {intl.formatMessage({ id: 'common.error' })}
                  <ModalCard.Close onClick={onClose} />
                </Message.Header>
                <Message.Body>{intl.formatMessage({ id: preloadingError })}</Message.Body>
              </Message>
            ) : (
              <Form
                validate={validate}
                onSubmit={onSubmit}
                render={this.renderInnerForm}
                initialValues={initialValues}
              />
            )}
          </ModalContent>
        </Modal>
      );
    }

    private renderInnerForm = ({ handleSubmit }: FormRenderProps) => {
      const { onClose, intl, isLoading = false, title, globalError, renderFields, formID, isPreloading } = this.props;

      const {
        submitText = intl.formatMessage({ id: 'common.submit' }),
        cancelText = intl.formatMessage({ id: 'common.cancel' }),
      } = this.props;

      return (
        <ModalCard>
          <ModalCard.Head>
            <ModalCard.Title>{title}</ModalCard.Title>
            <ModalCard.Close onClick={onClose} />
          </ModalCard.Head>
          <ModalCard.Body>
            {isPreloading ? (
              <LoaderLayout />
            ) : (
              <form id={formID} onSubmit={handleSubmit}>
                {renderFields()}
                <div css={textCenterMixin}>
                  {globalError && <HelpText type="is-danger">{intl.formatMessage({ id: globalError })}</HelpText>}
                </div>
              </form>
            )}
          </ModalCard.Body>
          <ModalCard.Foot>
            <Button form={formID} type="submit" color="is-primary" isLoading={isLoading || isPreloading}>
              {submitText}
            </Button>
            <Button color="is-danger" onClick={onClose}>
              {cancelText}
            </Button>
          </ModalCard.Foot>
        </ModalCard>
      );
    };
  },
);
