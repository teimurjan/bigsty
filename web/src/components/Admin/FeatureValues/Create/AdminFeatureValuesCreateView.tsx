import * as React from 'react';

import { IntlShape } from 'react-intl';

import { ModalForm } from '../../ModalForm';

import { IViewProps as IProps } from './AdminFeatureValuesCreatePresenter';
import { Fields, IFieldsProps } from './Fields';

const getFieldsRenderer = (props: IFieldsProps) => () => <Fields {...props} />;

export const AdminFeatureValuesCreateView = ({
  isOpen,
  create,
  close,
  isCreating,
  isLoading,
  error,
  intl,
  availableLocales,
  featureTypes,
  validate,
}: IProps & { intl: IntlShape }) => (
  <ModalForm
    formID="adminFeatureValuesCreateForm"
    isOpen={isOpen}
    onSubmit={create}
    onClose={close}
    isLoading={isCreating}
    isPreloading={isLoading}
    globalError={error}
    title={intl.formatMessage({ id: 'AdminFeatureValues.create.title' })}
    renderFields={getFieldsRenderer({ availableLocales, featureTypes })}
    validate={validate}
  />
);
