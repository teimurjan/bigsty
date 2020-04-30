/** @jsx jsx */
import { css, jsx, ClassNames } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import uniqBy from 'lodash/uniqBy';
import Head from 'next/head';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { PriceCrossedText } from 'src/components/Client/Price/Price';
import { ProductTypeImageCarousel } from 'src/components/Client/ProductType/ProductTypeImageCarousel/ProductTypeImageCarousel';
import { IViewProps as IProps } from 'src/components/Client/ProductTypePage/ProductTypePagePresenter';
import { Anchor } from 'src/components/common-v2/Anchor/Anchor';
import { Button } from 'src/components/common-v2/Button/Button';
import { Subtitle } from 'src/components/common-v2/Subtitle/Subtitle';
import { Title } from 'src/components/common-v2/Title/Title';
import { Container } from 'src/components/common/Container/Container';
import { ErrorLayout } from 'src/components/common/ErrorLayout/ErrorLayout';
import { FormNativeSelectField } from 'src/components/common/FormNativeSelectField/FormNativeSelectField';
import { LoaderLayout } from 'src/components/common/LoaderLayout/LoaderLayout';
import { fadeInFromLeft, fadeInFromRight, fadeInFromTop } from 'src/styles/keyframes';
import { mediaQueries } from 'src/styles/media';
import { formatMediaURL } from 'src/utils/url';

const getAllFeatureValuesGroupedByType = (
  products: IProps['products'],
  allFeatureTypes: Array<IProps['products'][0]['feature_values'][0]['feature_type']>,
) =>
  allFeatureTypes.reduce<{ [key: string]: IProps['products'][0]['feature_values'] }>(
    (acc, featureType) => ({
      ...acc,
      [featureType.id]: products.reduce(
        (acc, product) =>
          uniqBy(
            [...acc, ...product.feature_values.filter(featureValue => featureValue.feature_type.id === featureType.id)],
            'id',
          ),
        [] as IProps['products'][0]['feature_values'],
      ),
    }),
    {},
  );

export const ProductTypePageView = ({ productType, products, error, isLoading, action, actionText }: IProps) => {
  const intl = useIntl();
  const theme = useTheme<CSSThemeV2>();
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);

  const allImages = products
    .reduce((acc, product) => [...acc, ...product.images], [...(productType ? [productType.image] : [])])
    .map(formatMediaURL);

  const allFeatureTypes =
    products.length > 0 ? products[0].feature_values.map(featureValue => featureValue.feature_type) : [];

  const allFeatureValuesGroupedByFeatureType = getAllFeatureValuesGroupedByType(products, allFeatureTypes);
  const [chosenFeatureValues, setChosenFeatureValues] = React.useState<{ [key: string]: number }>(
    Object.keys(allFeatureValuesGroupedByFeatureType).reduce((acc, featureTypeId) => {
      const featueValues = allFeatureValuesGroupedByFeatureType[featureTypeId];
      return { ...acc, [featureTypeId]: featueValues.length > 0 ? featueValues[0].id : undefined };
    }, {}),
  );

  const matchingProduct = products.find(product =>
    product.feature_values.every(featureValue => chosenFeatureValues[featureValue.feature_type.id] === featureValue.id),
  );

  const autoChangeImage = React.useCallback(() => {
    const activeImage = allImages[activeImageIndex];
    if (matchingProduct && matchingProduct.images.indexOf(activeImage) === -1) {
      if (matchingProduct.images[0]) {
        setActiveImageIndex(allImages.indexOf(matchingProduct.images[0]));
      }
    }
  }, [activeImageIndex, allImages, matchingProduct]);

  const onFeatureValueChange = React.useCallback(
    (featureTypeId: number, featureValueId: number) => {
      setChosenFeatureValues({ ...chosenFeatureValues, [featureTypeId]: featureValueId });
      autoChangeImage();
    },
    [autoChangeImage, chosenFeatureValues],
  );

  const onActionClick = React.useCallback(() => {
    if (matchingProduct && action) {
      action(matchingProduct);
    }
  }, [action, matchingProduct]);

  if (isLoading) {
    return <LoaderLayout />;
  }

  if (error) {
    return <ErrorLayout>{intl.formatMessage({ id: error })}</ErrorLayout>;
  }

  const getOptions = (featureType: IProps['products'][0]['feature_values'][0]['feature_type']) =>
    allFeatureValuesGroupedByFeatureType[featureType.id].map(featureValue => ({
      title: featureValue.name,
      value: featureValue.id.toString(),
    }));

  return productType ? (
    <div
      css={css`
        margin-top: 20px;
      `}
    >
      <Container>
        <Head>
          <title>{productType.name}</title>
          <meta name="description" content={productType.short_description} />
          <meta property="og:title" content={productType.name} />
          <meta property="og:description" content={productType.short_description} />
          <meta property="og:type" content="og:product" />
          {matchingProduct && <meta property="product:price:amount" content={matchingProduct.price.toString()} />}
          {matchingProduct && <meta property="product:price:currency" content="USD" />}
          <meta property="og:image" content={productType.image} />
          <meta name="twitter:title" content={productType.name} />
          <meta name="twitter:description" content={productType.short_description} />
          <meta name="twitter:image:src" content={productType.image} />
        </Head>
        <div
          css={css`
            align-items: center;
            margin-bottom: 1.5rem;
            display: flex;

            @media ${mediaQueries.maxWidth768} {
              flex-direction: column;
            }
          `}
        >
          <div
            css={css`
              display: flex;
              justify-content: flex-start;
              width: 40vw;
              animation: ${fadeInFromLeft} 700ms cubic-bezier(0.33, 1, 0.68, 1);

              @media ${mediaQueries.maxWidth768} {
                width: 100%;
                animation: ${fadeInFromTop} 500ms cubic-bezier(0.33, 1, 0.68, 1);
              }
            `}
          >
            <ProductTypeImageCarousel
              images={allImages}
              activeImageIndex={activeImageIndex}
              setActiveImageIndex={setActiveImageIndex}
            />
          </div>
          <div
            css={css`
              display: flex;
              padding: 0 0 7.5vw 50px;
              flex-direction: column;
              width: calc(100% - 40vw);
              animation: ${fadeInFromRight} 700ms cubic-bezier(0.33, 1, 0.68, 1);

              @media ${mediaQueries.maxWidth768} {
                padding: 25px 0 0 0;
                width: 100%;
                animation: ${fadeInFromTop} 700ms cubic-bezier(0.33, 1, 0.68, 1);
              }
            `}
          >
            <div
              css={css`
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
              `}
            >
              <Title
                css={css`
                  flex: 0 0 60%;
                `}
                size={2}
              >
                {productType.name}
              </Title>
              {matchingProduct && matchingProduct.quantity > 0 ? (
                <Subtitle size={3}>
                  <PriceCrossedText price={matchingProduct.price} discount={matchingProduct.discount} />
                </Subtitle>
              ) : (
                <Subtitle size={3}>{intl.formatMessage({ id: 'ProductPage.notInStock' })}</Subtitle>
              )}
            </div>
            {allFeatureTypes.map(featureType => (
              <ClassNames key={featureType.id}>
                {({ css: css_ }) => (
                  <FormNativeSelectField
                    labelProps={{ children: featureType.name }}
                    selectProps={{
                      value: chosenFeatureValues[featureType.id]
                        ? chosenFeatureValues[featureType.id].toString()
                        : undefined,
                      onChange: e => onFeatureValueChange(featureType.id, parseInt(e.currentTarget.value, 10)),
                      options: getOptions(featureType),
                    }}
                    fieldProps={{ className: css_`width: 300px; @media ${mediaQueries.maxWidth768} { width: 100%; }` }}
                  />
                )}
              </ClassNames>
            ))}
            <Subtitle
              css={css`
                width: 100%;
              `}
              size={6}
            >
              {productType.short_description}
            </Subtitle>
            {matchingProduct && matchingProduct.quantity > 0 && (
              <Button
                color="dark"
                onClick={onActionClick}
                css={css`
                  margin-top: 20px;
                `}
              >
                {actionText}
              </Button>
            )}
            <Anchor
              css={css`
                padding-top: 15px;
                margin-top: 15px;
                border-top: 1px solid ${theme.borderColor};
              `}
              primary
              href="/categories/[id]/products"
              asPath={`/categories/${productType.category.slug}/products`}
            >
              >{' '}
              {intl.formatMessage({ id: 'ProductTypePage.findMoreForCategory' }, { value: productType.category.name })}
            </Anchor>
          </div>
        </div>
      </Container>
      <div
        css={css`
          background-color: ${theme.backgroundSecondaryColor};
          padding: 30px 0;
          border-top: 1px solid ${theme.borderColor};
          border-bottom: 1px solid ${theme.borderColor};
        `}
      >
        <Container>
          <div className="content" dangerouslySetInnerHTML={{ __html: productType.description }} />
        </Container>
      </div>
    </div>
  ) : null;
};
