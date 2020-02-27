/** @jsx jsx */
import * as React from 'react';

import { css, jsx, SerializedStyles } from '@emotion/core';

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
import { arePropsEqual } from 'src/utils/propEquality';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => any;
  onSubmit: (values: object) => any;
  isLoading?: boolean;
  isPreloading?: boolean;
  validate?: (values: object) => object | Promise<object>;
  globalError?: string;
  fields: React.ReactNode;
  title: string;
  formID: string;
  submitText?: string;
  cancelText?: string;
  initialValues?: object;
  preloadingError?: string;
  wide?: boolean;
}

interface IMemoizedFormProps {
  id: string;
  fields: IProps['fields'];
  globalError: IProps['globalError'];
  intl: IntlShape;
  handleSubmit: FormRenderProps['handleSubmit'];
}

const MemoizedForm: React.SFC<IMemoizedFormProps> = React.memo(
  ({ id, handleSubmit, fields, globalError, intl }) => (
    <form id={id} onSubmit={handleSubmit}>
      {fields}
      <div css={textCenterMixin}>
        {globalError && <HelpText type="is-danger">{intl.formatMessage({ id: globalError })}</HelpText>}
      </div>
    </form>
  ),
  (prevProps, nextProps) => arePropsEqual(prevProps, nextProps, ['id', 'globalError', 'fields']),
);

(MemoizedForm as any).whyDidYouRender = {
  customName: 'ModalForm.MemoizedForm',
};

const renderInnerForm = ({
  handleSubmit,
  title,
  onClose,
  isPreloading,
  formID,
  fields,
  intl,
  globalError,
  submitText,
  cancelText,
  isLoading,
  className,
}: FormRenderProps & IProps & { intl: IntlShape; className?: string }) => (
  <ModalCard className={className}>
    <ModalCard.Head>
      <ModalCard.Title>{title}</ModalCard.Title>
      <ModalCard.Close onClick={onClose} />
    </ModalCard.Head>
    <ModalCard.Body>
      {isPreloading ? (
        <LoaderLayout />
      ) : (
        <MemoizedForm id={formID} handleSubmit={handleSubmit} fields={fields} globalError={globalError} intl={intl} />
      )}
    </ModalCard.Body>
    <ModalCard.Foot>
      <Button form={formID} type="submit" color="is-primary" loading={isLoading || isPreloading}>
        {submitText || intl.formatMessage({ id: 'common.submit' })}
      </Button>
      <Button color="is-danger" onClick={onClose}>
        {cancelText || intl.formatMessage({ id: 'common.cancel' })}
      </Button>
    </ModalCard.Foot>
  </ModalCard>
);

export const ModalForm = injectIntl((props: IProps & { intl: IntlShape }) => {
  const modalCSS = props.wide
    ? useMedia(
        [mediaQueries.minWidth1024],
        [
          css`
            width: 90vw;
            margin: 0;
          `,
        ],
        css`
          width: 100%;
          margin: 0;
        `,
      )
    : undefined;

  const { isOpen, onClose, preloadingError, intl, validate, onSubmit, initialValues } = props;

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
          <Form
            css={modalCSS}
            validate={validate}
            onSubmit={onSubmit}
            render={renderInnerForm}
            initialValues={initialValues}
            {...props}
          />
        )}
      </ModalContent>
    </Modal>
  );
});
