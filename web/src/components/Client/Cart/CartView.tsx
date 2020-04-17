/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/core';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from 'emotion-theming';
import * as React from 'react';
import { Form, Field as FinalFormField, FieldRenderProps } from 'react-final-form';
import { useIntl } from 'react-intl';

import { CartItem } from 'src/components/Client/Cart/CartItem/CartItem';
import { IViewProps as IProps, IFormValues } from 'src/components/Client/Cart/CartPresenter';
import { PriceText } from 'src/components/Client/Price/Price';
import { Anchor } from 'src/components/common-v2/Anchor/Anchor';
import { Button } from 'src/components/common-v2/Button/Button';
import { Title } from 'src/components/common-v2/Title/Title';
import { WithIcon } from 'src/components/common-v2/WithIcon/WithIcon';
import { Drawer } from 'src/components/common/Drawer/Drawer';
import { FormPhoneField } from 'src/components/common/FormPhoneField/FormPhoneField';
import { FormTextField } from 'src/components/common/FormTextField/FormTextField';
import { HelpText } from 'src/components/common/HelpText/HelpText';
import { LoaderLayout } from 'src/components/common/LoaderLayout/LoaderLayout';
import { Message } from 'src/components/common/Message/Message';
import { calculateDiscountedPrice } from 'src/utils/number';
import { parsePhoneNumber } from 'src/utils/phone';

const buttonCSS = css`
  display: block;
  margin: 10px auto;
  width: 100% !important;
`;

const FirstStep: React.FC<IProps> = ({ isLoading, products, getProductCount, addMore, remove, goToNextStep }) => {
  const intl = useIntl();

  if (isLoading) {
    return <LoaderLayout />;
  }

  if (products.length === 0) {
    return <Title size={5}>{intl.formatMessage({ id: 'Cart.empty' })}</Title>;
  }

  const totalPrice = products.reduce(
    (acc, product) => acc + calculateDiscountedPrice(product.price, product.discount) * getProductCount(product.id),
    0,
  );

  const isAnyProductCountNotAllowed = products.some(product => product.quantity < getProductCount(product.id));

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
      <Title size={5}>
        {intl.formatMessage({ id: 'Cart.total' })}: <PriceText price={totalPrice} />
      </Title>
      <Button color="dark" css={buttonCSS} disabled={isAnyProductCountNotAllowed} onClick={goToNextStep}>
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

const SecondStep: React.FC<IProps> = ({ validator, initialValues, onSubmit, error }) => {
  const intl = useIntl();

  return (
    <Form<IFormValues>
      onSubmit={onSubmit}
      initialValues={initialValues as IFormValues}
      validate={validator.validate}
      render={({ handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit}>
          <FinalFormField name="name" component={NameField} />
          <FinalFormField name="phone" component={FormPhoneField} parse={parsePhoneNumber} />
          <FinalFormField name="address" component={AddressField} />
          <Button color="dark" type="submit" css={buttonCSS} loading={submitting}>
            {intl.formatMessage({ id: 'Cart.order' })}
          </Button>
          <div
            css={css`
              text-align: center;
            `}
          >
            {error && <HelpText type="is-danger">{intl.formatMessage({ id: error })}</HelpText>}
          </div>
        </form>
      )}
    />
  );
};

const ThirdStep: React.FC<IProps> = () => {
  const intl = useIntl();

  return (
    <Message color="is-success">
      <Message.Body>{intl.formatMessage({ id: 'Cart.orderReceived' })}</Message.Body>
    </Message>
  );
};

const bounce = keyframes`
  0%   { transform: scale(1,1)      translateY(0); }
  10%  { transform: scale(1.1,.9)   translateY(0); }
  30%  { transform: scale(.9,1.1)   translateY(-20px); }
  50%  { transform: scale(1.05,.95) translateY(0); }
  57%  { transform: scale(1,1)      translateY(-3px); }
  64%  { transform: scale(1,1)      translateY(0); }
  100% { transform: scale(1,1)      translateY(0); }
`;

export const CartView: React.FC<IProps> = props => {
  const intl = useIntl();
  const { isOpen, open, close, step, cartItemsCount } = props;
  const theme = useTheme<CSSThemeV2>();
  return (
    <React.Fragment>
      <div
        css={css`
          position: relative;
        `}
      >
        {cartItemsCount > 0 && (
          <span
            key={cartItemsCount}
            css={css`
              animation: ${bounce} 1s ease;
              position: absolute;
              width: 16px;
              height: 16px;
              text-align: center;
              font-weight: bold;
              font-size: 10px;
              top: -7.5px;
              right: -12.5px;
              color: ${theme.textOnPrimaryColor};
              background: ${theme.primaryColor};
              border-radius: 50%;
            `}
          >
            {cartItemsCount}
          </span>
        )}
        <Anchor onClick={open} noHoverOnTouch>
          <WithIcon icon={faShoppingCart} hideTextOnMobile>
            {intl.formatMessage({ id: 'common.cart' })}
          </WithIcon>
        </Anchor>
      </div>
      <Drawer
        css={css`
          padding: 1rem 2rem;
          background: ${theme.backgroundSecondaryColor};
          width: 500px;
          max-width: 100%;
        `}
        fromSide="right"
        isOpen={isOpen}
        close={close}
        lockScroll={false}
        backdrop
        fixed
      >
        {step === 0 && <FirstStep {...props} />}
        {step === 1 && <SecondStep {...props} />}
        {step === 2 && <ThirdStep {...props} />}
      </Drawer>
    </React.Fragment>
  );
};
