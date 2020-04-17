/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { IViewProps as IProps } from 'src/components/Client/LanguageDropdown/LanguageDropdownPresenter';
import { Anchor } from 'src/components/common-v2/Anchor/Anchor';
import { Popover, TriggerClickProps as PopoverTriggerProps } from 'src/components/common/Popover/Popover';

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

export const LanguageDropdownView = React.forwardRef<HTMLDivElement, IProps>(
  ({ locales, changeLocale, currentLocale, TriggerComponent = Trigger, openOnHover }, ref) => (
    <Popover<HTMLDivElement> TriggerComponent={TriggerComponent} openOnHover={openOnHover}>
      <Popover.Content ref={ref}>
        {locales.map(locale => {
          const onClick = () => changeLocale(locale);
          return (
            <Anchor key={locale} active={locale === currentLocale} onClick={onClick} thin>
              {nameOfLocale[locale] || locale}
            </Anchor>
          );
        })}
      </Popover.Content>
    </Popover>
  ),
);
