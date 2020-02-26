import * as React from 'react';

import { IntlShape } from 'react-intl';

import { ModalForm } from '../../ModalForm';

import { BANNER_TEXT_FIELD_KEY, BANNER_LINK_TEXT_FIELD_KEY, IViewProps as IProps } from './AdminBannersCreatePresenter';
import { Fields } from './Fields';

export const AdminBannersCreateView = ({
  isOpen,
  create,
  close,
  isLoading,
  error,
  intl,
  availableLocales,
  validate,
  isCreating,
}: IProps & { intl: IntlShape }) => (
  <ModalForm
    formID="adminBannersCreateForm"
    isOpen={isOpen}
    onSubmit={create}
    onClose={close}
    isLoading={isCreating}
    isPreloading={isLoading}
    globalError={error}
    title={intl.formatMessage({ id: 'AdminBanners.create.title' })}
    fields={
      <Fields
        availableLocales={availableLocales}
        textFieldKey={BANNER_TEXT_FIELD_KEY}
        linkTextFieldKey={BANNER_LINK_TEXT_FIELD_KEY}
      />
    }
    validate={validate}
  />
);
