/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { Route, Switch } from 'react-router';

import { AdminCategoriesStateProvider } from 'src/state/AdminCategoriesState';
import { AdminFeatureTypesStateProvider } from 'src/state/AdminFeatureTypesState';
import { AdminFeatureValuesStateProvider } from 'src/state/AdminFeatureValuesState';

import { AdminCategories } from './Categories/AdminCategories';
import { AdminFeatureTypes } from './FeatureTypes/AdminFeatureTypes';
import { AdminFeatureValues } from './FeatureValues/AdminFeatureValues';

import { AdminHeaderContainer } from './Header/AdminHeaderContainer';
import { alignItemsFlexStartMixin } from 'src/styles/mixins';

interface IProps {
  match: { path: string };
}

export const Admin = ({ match }: IProps) => (
  <AdminCategoriesStateProvider>
    <AdminFeatureTypesStateProvider>
      <AdminFeatureValuesStateProvider>
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
            </Switch>
          </div>
        </div>
      </AdminFeatureValuesStateProvider>
    </AdminFeatureTypesStateProvider>
  </AdminCategoriesStateProvider>
);
