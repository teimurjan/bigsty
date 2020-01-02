/** @jsx jsx */
import * as React from 'react';

import { css, jsx } from '@emotion/core';

import { IntlShape, injectIntl } from 'react-intl';

import { Form, FormRenderProps } from 'react-final-form';

import { Button } from 'src/components/common/Button/Button';
import { HelpText } from 'src/components/common/HelpText/HelpText';
import { Modal } from 'src/components/common/Modal/Modal';
import { ModalBackground } from 'src/components/common/ModalBackground/ModalBackground';
import { ModalCard } from 'src/components/common/ModalCard/ModalCard';
import { ModalContent } from 'src/components/common/ModalContent/ModalContent';

import { useMedia } from 'src/hooks/useMedia';

import { textCenterMixin } from 'src/styles/mixins';
import { mediaQueries } from 'src/styles/media';

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
  wide?: boolean;
}

export const ModalForm = injectIntl(
  ({
    cancelText,
    submitText,
    onClose,
    intl,
    isLoading = false,
    title,
    globalError,
    renderFields,
    formID,
    isPreloading,
    isOpen,
    preloadingError,
    validate,
    onSubmit,
    initialValues,
    wide,
  }: IProps & { intl: IntlShape }) => {
    const modalCSS = wide
      ? useMedia(
          [mediaQueries.minWidth1024],
          [
            css`
              width: 1024px;
              margin: 0;
            `,
          ],
          css`
            width: 100%;
            margin: 0;
          `,
        )
      : undefined;

    const renderInnerForm = React.useCallback(
      ({ handleSubmit }: FormRenderProps) => (
        <ModalCard css={modalCSS}>
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
              {submitText || intl.formatMessage({ id: 'common.submit' })}
            </Button>
            <Button color="is-danger" onClick={onClose}>
              {cancelText || intl.formatMessage({ id: 'common.cancel' })}
            </Button>
          </ModalCard.Foot>
        </ModalCard>
      ),
      [
        cancelText,
        formID,
        globalError,
        intl,
        isLoading,
        isPreloading,
        modalCSS,
        onClose,
        renderFields,
        submitText,
        title,
      ],
    );

    return (
      <Modal isOpen={isOpen}>
        <ModalBackground onClick={onClose} />
        <ModalContent css={modalCSS}>
          {preloadingError ? (
            <Message color="is-danger">
              <Message.Header>
                {intl.formatMessage({ id: 'common.error' })}
                <ModalCard.Close onClick={onClose} />
              </Message.Header>
              <Message.Body>{intl.formatMessage({ id: preloadingError })}</Message.Body>
            </Message>
          ) : (
            <Form validate={validate} onSubmit={onSubmit} render={renderInnerForm} initialValues={initialValues} />
          )}
        </ModalContent>
      </Modal>
    );
  },
);
