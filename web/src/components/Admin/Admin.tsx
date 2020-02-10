/** @jsx jsx */
import * as React from 'react';

import { css, jsx } from '@emotion/core';

import { Route, Switch } from 'react-router';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AdminCategoriesStateProvider } from 'src/state/AdminCategoriesState';
import { AdminFeatureTypesStateProvider } from 'src/state/AdminFeatureTypesState';
import { AdminFeatureValuesStateProvider } from 'src/state/AdminFeatureValuesState';
import { AdminProductTypesStateProvider } from 'src/state/AdminProductTypesState';
import { AdminProductsStateProvider } from 'src/state/AdminProductsState';

import { AdminCategories } from './Categories/AdminCategories';
import { AdminFeatureTypes } from './FeatureTypes/AdminFeatureTypes';
import { AdminFeatureValues } from './FeatureValues/AdminFeatureValues';
import { AdminProductTypes } from './ProductTypes/AdminProductTypes';
import { AdminProducts } from './Products/AdminProducts';

import { NewCategoryButton } from './Categories/List/AdminCategoriesListView';
import { NewFeatureTypeButton } from './FeatureTypes/List/AdminFeatureTypesListView';
import { NewFeatureValueButton } from './FeatureValues/List/AdminFeatureValuesListView';
import { NewProductTypeButton } from './ProductTypes/List/AdminProductTypesListView';
import { NewProductButton } from './Products/List/AdminProductsListView';

import { AdminHeaderContainer } from './Header/AdminHeaderContainer';
import {
  alignItemsFlexStartMixin,
  flexMixin,
  flexDirectionColumnMixin,
  alignItemsCenterMixin,
  marginAutoMixin,
} from 'src/styles/mixins';
import { Section } from '../common/Section/Section';
import { Subtitle } from '../common/Subtitle/Subtitle';
import { Title } from '../common/Title/Title';
import { Tag } from '../common/Tag/Tag';
import { useIntl } from 'react-intl';

interface IProps {
  match: { path: string };
}

const arrowDivider = (
  <FontAwesomeIcon
    css={css`
      display: block;
      font-size: 20px;
      margin: 10px auto 10px auto;
    `}
    className="has-text-dark"
    icon={faArrowDown}
  />
);

interface IStepProps {
  subtitle: React.ReactNode;
  button_: React.ReactNode;
}

const Step = ({ button_, subtitle }: IStepProps) => (
  <div
    css={css`
      ${flexMixin};
      ${flexDirectionColumnMixin};
      ${alignItemsCenterMixin};
      padding: 20px 0;
    `}
  >
    <Subtitle
      size={5}
      css={css`
        padding-bottom: 10px;
      `}
    >
      {subtitle}
    </Subtitle>
    {button_}
  </div>
);

const AdminHome = () => {
  const intl = useIntl();

  return (
    <Section>
      <div
        css={css`
          padding-bottom: 40px;
          text-align: center;
          width: 1000px;
          max-width: 100%;
          ${marginAutoMixin};
        `}
      >
        <Title size={1}>{intl.formatMessage({ id: 'AdminHome.title' })}</Title>
        <br />
        <Title size={2}>{intl.formatMessage({ id: 'AdminHome.description' })}</Title>
      </div>
      <Step
        subtitle={
          <React.Fragment>
            {intl.formatMessage({ id: 'AdminHome.makeCategory' })} {intl.formatMessage({ id: 'common.example' })}{' '}
            <Tag color="is-info">{intl.formatMessage({ id: 'AdminHome.exampleCategory' })}</Tag>.
          </React.Fragment>
        }
        button_={<NewCategoryButton />}
      />
      {arrowDivider}
      <Step
        subtitle={
          <React.Fragment>
            {intl.formatMessage({ id: 'AdminHome.makeFeatureType' })} {intl.formatMessage({ id: 'common.example' })}{' '}
            <Tag color="is-info">{intl.formatMessage({ id: 'AdminHome.exampleFeatureType1' })}</Tag>,{' '}
            <Tag color="is-info">{intl.formatMessage({ id: 'AdminHome.exampleFeatureType2' })}</Tag>.
          </React.Fragment>
        }
        button_={<NewFeatureTypeButton />}
      />
      {arrowDivider}
      <Step
        subtitle={
          <React.Fragment>
            {intl.formatMessage({ id: 'AdminHome.makeFeatureValue' })} {intl.formatMessage({ id: 'common.example' })}{' '}
            <Tag color="is-info">{intl.formatMessage({ id: 'AdminHome.exampleFeatureValue1' })}</Tag>,{' '}
            <Tag color="is-info">{intl.formatMessage({ id: 'AdminHome.exampleFeatureValue2' })}</Tag>,{' '}
            <Tag color="is-info">{intl.formatMessage({ id: 'AdminHome.exampleFeatureValue3' })}</Tag>,{' '}
            <Tag color="is-info">{intl.formatMessage({ id: 'AdminHome.exampleFeatureValue4' })}</Tag>.
          </React.Fragment>
        }
        button_={<NewFeatureValueButton />}
      />
      {arrowDivider}
      <Step
        subtitle={
          <React.Fragment>
            {intl.formatMessage({ id: 'AdminHome.makeProductType' })} {intl.formatMessage({ id: 'common.example' })}{' '}
            <Tag color="is-info">{intl.formatMessage({ id: 'AdminHome.exampleProductType1' })}</Tag>,{' '}
            <Tag color="is-info">{intl.formatMessage({ id: 'AdminHome.exampleProductType2' })}</Tag>.
          </React.Fragment>
        }
        button_={<NewProductTypeButton />}
      />
      {arrowDivider}
      <Step
        subtitle={
          <React.Fragment>
            {intl.formatMessage({ id: 'AdminHome.makeProduct' })} {intl.formatMessage({ id: 'common.example' })}{' '}
            <Tag color="is-info">{intl.formatMessage({ id: 'AdminHome.exampleProduct1' })}</Tag>,{' '}
            <Tag color="is-info">{intl.formatMessage({ id: 'AdminHome.exampleProduct2' })}</Tag>.
          </React.Fragment>
        }
        button_={<NewProductButton />}
      />
    </Section>
  );
};

export const Admin = ({ match }: IProps) => (
  <AdminCategoriesStateProvider>
    <AdminFeatureTypesStateProvider>
      <AdminFeatureValuesStateProvider>
        <AdminProductTypesStateProvider>
          <AdminProductsStateProvider>
            <div
              css={css`
                ${alignItemsFlexStartMixin}
              `}
              className="level"
            >
              <div
                css={css`
                  flex-grow: 0 !important;
                  flex-basis: 350px;
                `}
                className="level-item"
              >
                <AdminHeaderContainer />
              </div>
              <div className="level-item">
                <Switch>
                  <Route path={`${match.path}/categories`} component={AdminCategories} />
                  <Route path={`${match.path}/featureTypes`} component={AdminFeatureTypes} />
                  <Route path={`${match.path}/featureValues`} component={AdminFeatureValues} />
                  <Route path={`${match.path}/productTypes`} component={AdminProductTypes} />
                  <Route path={`${match.path}/products`} component={AdminProducts} />
                  <Route component={AdminHome} />
                </Switch>
              </div>
            </div>
          </AdminProductsStateProvider>
        </AdminProductTypesStateProvider>
      </AdminFeatureValuesStateProvider>
    </AdminFeatureTypesStateProvider>
  </AdminCategoriesStateProvider>
);
