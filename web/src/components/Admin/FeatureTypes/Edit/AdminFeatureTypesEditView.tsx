import * as React from 'react';

import { InjectedIntlProps, injectIntl } from 'react-intl';

import { IntlField } from '../../IntlField';
import { ModalForm } from '../../ModalForm';

import { FEATURE_TYPE_NAME_FIELD_KEY, IViewProps as IProps } from './AdminFeatureTypesEditPresenter';

interface IFieldsProps {
  availableLocales: IProps['availableLocales'];
}

const Fields = injectIntl(({ availableLocales, intl }: IFieldsProps & InjectedIntlProps) => (
  <IntlField
    key_={FEATURE_TYPE_NAME_FIELD_KEY}
    locales={availableLocales}
    label={intl.formatMessage({
      id: 'AdminFeatureTypes.nameInput.label',
    })}
    placeholder={intl.formatMessage({
      id: 'AdminFeatureTypes.nameInput.placeholder',
    })}
  />
));

const getFieldsRenderer = (props: IFieldsProps) => () => <Fields {...props} />;

export const AdminFeatureTypesEditView = ({
  isOpen,
  edit,
  close,
  isLoading,
  isUpdating,
  error,
  intl,
  initialValues,
  availableLocales,
  validate,
  preloadingError,
}: IProps & InjectedIntlProps) => (
  <ModalForm
    formID="adminFeatureTypesEditForm"
    isOpen={isOpen}
    onSubmit={edit}
    onClose={close}
    isLoading={isUpdating}
    isPreloading={isLoading}
    globalError={error}
    title={intl.formatMessage({ id: 'AdminFeatureTypes.edit.title' })}
    renderFields={getFieldsRenderer({ availableLocales })}
    validate={validate}
    initialValues={initialValues}
    preloadingError={preloadingError}
  />
);
