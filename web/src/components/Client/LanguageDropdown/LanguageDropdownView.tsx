/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import * as React from 'react';
import { IntlShape, useIntl } from 'react-intl';

import { IViewProps as IProps } from 'src/components/Client/LanguageDropdown/LanguageDropdownPresenter';
import { Popover, TriggerProps as PopoverTriggerProps } from 'src/components/common/Popover/Popover';

const nameOfLocale = {
  en: 'English',
  ru: 'Русский',
};

const Trigger = React.forwardRef<HTMLDivElement, PopoverTriggerProps>((props, ref) => {
  const intl = useIntl();

  return (
    <div
      css={css`
        cursor: pointer;
      `}
      ref={ref}
      {...props}
    >
      {intl.formatMessage({ id: 'AdminMenu.changeLangaugeLinkText' })}
    </div>
  );
});

export const LanguageDropdownView = ({
  locales,
  changeLocale,
  currentLocale,
  TriggerComponent = Trigger,
}: IProps & { intl: IntlShape }) => (
  <Popover TriggerComponent={TriggerComponent}>
    <Popover.Content>
      {locales.map(locale => {
        const onClick = async () => {
          await changeLocale(locale);
        };
        return (
          <Popover.Link key={locale} active={locale === currentLocale} onClick={onClick}>
            {nameOfLocale[locale] || locale}
          </Popover.Link>
        );
      })}
    </Popover.Content>
  </Popover>
);
