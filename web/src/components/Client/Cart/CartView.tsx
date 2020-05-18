/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { faShoppingCart, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from 'emotion-theming';
import * as React from 'react';
import { Form, Field as FinalFormField, FieldRenderProps } from 'react-final-form';
import { useIntl } from 'react-intl';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { CartItem } from 'src/components/Client/Cart/CartItem/CartItem';
import { IViewProps as IProps, IFormValues } from 'src/components/Client/Cart/CartPresenter';
import { PriceText } from 'src/components/Client/Price/Price';
import { Anchor } from 'src/components/common-v2/Anchor/Anchor';
import { Button } from 'src/components/common-v2/Button/Button';
import { Drawer } from 'src/components/common-v2/Drawer/Drawer';
import { HelpText } from 'src/components/common-v2/HelpText/HelpText';
import { Title } from 'src/components/common-v2/Title/Title';
import { Tooltip } from 'src/components/common-v2/Tooltip/Tooltip';
import { UnderlinedInput } from 'src/components/common-v2/UnderlinedInput/UnderlinedInput';
import { WithIcon } from 'src/components/common-v2/WithIcon/WithIcon';
import { LoaderLayout } from 'src/components/common/LoaderLayout/LoaderLayout';
import { Message } from 'src/components/common/Message/Message';
import { bounce, fadeInFromRight, fadeInFromLeft } from 'src/styles/keyframes';
import { easeOutCubic } from 'src/styles/timing-functions';
import { calculateDiscountedPrice } from 'src/utils/number';
import { parsePhoneNumber } from 'src/utils/phone';

const buttonCSS = css`
  display: block;
  margin: 10px auto;
  width: 100% !important;
`;

const CartTrigger = React.forwardRef<HTMLSpanElement>((props, ref) => {
  const intl = useIntl();
  return (
    <WithIcon ref={ref} icon={faShoppingCart} hideTextOnMobile {...props}>
      {intl.formatMessage({ id: 'common.cart' })}
    </WithIcon>
  );
});

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
    <div>
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
    </div>
  );
};

const NameField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;
  return (
    <UnderlinedInput
      placeholder={intl.formatMessage({ id: 'Cart.nameInput.label' })}
      error={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      {...input}
    />
  );
};

const AddressField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;
  return (
    <UnderlinedInput
      placeholder={intl.formatMessage({ id: 'Cart.addressInput.label' })}
      error={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      {...input}
    />
  );
};

const PhoneField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;
  return (
    <UnderlinedInput
      mask="+\9\96 (999) 99-99-99"
      placeholder={intl.formatMessage({ id: 'common.phoneInput.label' })}
      error={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      {...input}
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
          <FinalFormField name="phone" component={PhoneField} parse={parsePhoneNumber} />
          <FinalFormField name="address" component={AddressField} />
          <Button color="dark" type="submit" css={buttonCSS} loading={submitting}>
            {intl.formatMessage({ id: 'Cart.order' })}
          </Button>
          <div
            css={css`
              text-align: center;
            `}
          >
            {error && <HelpText color="danger">{intl.formatMessage({ id: error })}</HelpText>}
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

export const CartView: React.FC<IProps> = props => {
  const { isOpen, open, close, step, cartItemsCount, goToPrevStep } = props;
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
          <Tooltip TriggerComponent={CartTrigger}>shift + c</Tooltip>
        </Anchor>
      </div>
      <Drawer
        css={css`
          padding: 20px 30px;
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
        <div
          css={css`
            position: relative;
            width: 100%;
            height: 100%;
            overflow-x: hidden;
          `}
        >
          <FontAwesomeIcon
            onClick={goToPrevStep}
            css={css`
              position: absolute;
              left: 0;
              top: 0;
              cursor: pointer;
              opacity: ${step > 0 ? 1 : 0};
              transition: opacity 200ms;
              color: ${theme.textColor};
            `}
            icon={faArrowLeft}
          />
          <TransitionGroup component={null}>
            <CSSTransition key={step} classNames="fading" timeout={400}>
              <div
                css={css`
                  position: absolute;
                  top: 30px;
                  left: 0;
                  width: 100%;
                  overflow: auto;

                  &.fading-enter {
                    transform: translateX(100%);
                  }

                  &.fading-exit {
                    transform: translateX(-100%);
                  }

                  &.fading-enter,
                  &.fading-entered {
                    animation: ${fadeInFromRight} 300ms ${easeOutCubic};
                    animation-fill-mode: forwards;
                    animation-delay: 100ms;
                  }

                  &.fading-exit,
                  &.fading-exited {
                    animation: ${fadeInFromLeft} 200ms ${easeOutCubic};
                    animation-direction: reverse;
                    animation-fill-mode: forwards;
                  }
                `}
              >
                {step === 0 && <FirstStep {...props} />}
                {step === 1 && <SecondStep {...props} />}
                {step === 2 && <ThirdStep {...props} />}
              </div>
            </CSSTransition>
          </TransitionGroup>
        </div>
      </Drawer>
    </React.Fragment>
  );
};
