/** @jsx jsx */
import * as React from 'react';

import { css, jsx } from '@emotion/core';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useIntl } from 'react-intl';
import { Form, Field as FinalFormField, FieldRenderProps } from 'react-final-form';

import { Modal } from 'src/components/common/Modal/Modal';
import { Button } from 'src/components/common/Button/Button';
import { ModalBackground } from 'src/components/common/ModalBackground/ModalBackground';
import { ModalClose } from 'src/components/common/ModalClose/ModalClose';
import { LoaderLayout } from 'src/components/common/LoaderLayout/LoaderLayout';
import { ModalContent } from 'src/components/common/ModalContent/ModalContent';

import { IViewProps as IProps } from './CartPresenter';
import { CartItem } from './CartItem/CartItem';
import { FormTextField } from 'src/components/common/FormTextField/FormTextField';
import { useTheme } from 'emotion-theming';
import { ITheme } from 'src/themes';
import { Title } from 'src/components/common/Title/Title';

const FirstStep: React.FC<IProps> = ({ isLoading, products, getProductCount, addMore, remove, goToNextStep }) => {
  const intl = useIntl();

  if (isLoading) {
    return <LoaderLayout />;
  }

  if (products.length === 0) {
    return <Title size={5}>{intl.formatMessage({ id: 'Cart.empty' })}</Title>;
  }

  return (
    <React.Fragment>
      <div>
        {products.map(product => (
          <CartItem
            key={product.id}
            product={product}
            count={getProductCount(product.id)}
            onAddClick={() => addMore(product)}
            onRemoveClick={() => remove(product)}
          />
        ))}
      </div>
      <Button
        color="is-info"
        css={css`
          display: block;
          width: 100%;
          text-transform: uppercase;
        `}
        onClick={goToNextStep}
      >
        {intl.formatMessage({ id: 'Cart.order' })}
      </Button>
    </React.Fragment>
  );
};

const NameField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;
  return (
    <FormTextField
      labelProps={{
        children: intl.formatMessage({ id: 'Cart.nameInput.label' }),
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        placeholder: intl.formatMessage({
          id: 'Cart.nameInput.placeholder',
        }),
        type: 'text',
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

const PhoneField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;
  return (
    <FormTextField
      labelProps={{
        children: intl.formatMessage({ id: 'Cart.phoneInput.label' }),
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        placeholder: intl.formatMessage({
          id: 'Cart.phoneInput.placeholder',
        }),
        type: 'text',
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

const AddressField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;
  return (
    <FormTextField
      labelProps={{
        children: intl.formatMessage({ id: 'Cart.addressInput.label' }),
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        placeholder: intl.formatMessage({
          id: 'Cart.addressInput.placeholder',
        }),
        type: 'text',
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

const SecondStep: React.FC<IProps> = ({ validator, initialValues }) => {
  const intl = useIntl();

  return (
    <Form
      onSubmit={console.log}
      initialValues={initialValues}
      validate={validator.validate}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <FinalFormField name="name" component={NameField} />
          <FinalFormField name="phone" component={PhoneField} />
          <FinalFormField name="address" component={AddressField} />
          <Button
            color="is-info"
            type="submit"
            css={css`
              display: block;
              width: 100%;
              text-transform: uppercase;
            `}
          >
            {intl.formatMessage({ id: 'Cart.order' })}
          </Button>
        </form>
      )}
    />
  );
};

export const CartView: React.FC<IProps> = props => {
  const { isOpen, open, close, step, cartItemsCount } = props;
  const theme = useTheme<ITheme>();
  return (
    <React.Fragment>
      <Button
        onClick={open}
        className="is-large"
        color="is-info"
        css={css`
          position: fixed;
          bottom: 20px;
          right: 20px;
          border-radius: 100% !important;
        `}
      >
        <span
          css={css`
            position: relative;
          `}
          className="icon"
        >
          {cartItemsCount > 0 && (
            <span
              css={css`
                position: absolute;
                width: 16px;
                height: 16px;
                font-weight: bold;
                font-size: 10px;
                top: -10px;
                right: -10px;
                background: ${theme.danger};
                border-radius: 50%;
              `}
            >
              {cartItemsCount}
            </span>
          )}
          <FontAwesomeIcon icon={faShoppingCart} />
        </span>
      </Button>
      <Modal isOpen={isOpen}>
        <ModalBackground onClick={close} />
        <ModalClose className="is-large" onClick={close} />

        <ModalContent
          css={css`
            padding: 1rem 2rem;
          `}
          className="has-background-light"
        >
          {step === 0 && <FirstStep {...props} />}
          {step === 1 && <SecondStep {...props} />}
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};
