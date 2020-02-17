/** @jsx jsx */
import * as React from 'react';

import { css, jsx } from '@emotion/core';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IntlShape } from 'react-intl';

import { Dropdown, ITriggerProps } from 'src/components/common/Dropdown/Dropdown';
import { DropdownItem } from 'src/components/common/DropdownItem/DropdownItem';

import { IViewProps as IProps } from './LanguageDropdownPresenter';

const DefaultDropdownTrigger = ({ onClick, ...props }: ITriggerProps) => {
  const modifiedOnClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      if (onClick) {
        onClick(e);
      }
    },
    [onClick],
  );

  return (
    <a
      css={css`
        font-size: 1.5rem;
      `}
      {...props}
      onClick={modifiedOnClick}
    >
      <FontAwesomeIcon icon={faGlobe} />
    </a>
  );
};

export const LanguageDropdownView = ({
  locales,
  changeLocale,
  currentLocale,
  TriggerComponent = DefaultDropdownTrigger,
  className,
}: IProps & { intl: IntlShape }) => (
  <Dropdown className={className} TriggerComponent={TriggerComponent}>
    {locales.map(locale => {
      const onClick = async () => {
        await changeLocale(locale);
      };
      return (
        <DropdownItem key={locale} className={locale === currentLocale ? 'is-active' : undefined} onClick={onClick}>
          {locale}
        </DropdownItem>
      );
    })}
  </Dropdown>
);
