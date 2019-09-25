/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { InjectedIntlProps } from "react-intl";

import {
  Dropdown,
  ITriggerProps
} from "src/components/common/Dropdown/Dropdown";
import { DropdownItem } from "src/components/common/DropdownItem/DropdownItem";
import { NavbarItem } from "src/components/common/NavbarItem/NavbarItem";

import { IViewProps as IProps } from "./LanguageDropdownPresenter";

const LocaleDropdownTrigger = ({ className, ...props }: ITriggerProps) => (
  <span
    css={css`
      font-size: 1.5rem;
    `}
    {...props}
  >
    <FontAwesomeIcon icon={faGlobe} />
  </span>
);

export const LanguageDropdownView = ({
  locales,
  changeLocale,
  currentLocale
}: IProps & InjectedIntlProps) => (
  <NavbarItem className={classNames("navbar-link is-uppercase is-arrowless")}>
    <Dropdown Trigger={LocaleDropdownTrigger}>
      {locales.map(locale => {
        const onClick = async () => {
          await changeLocale(locale);
          window.location.reload();
        };
        return (
          <DropdownItem
            key={locale}
            className={locale === currentLocale ? "is-active" : undefined}
            onClick={onClick}
          >
            {locale}
          </DropdownItem>
        );
      })}
    </Dropdown>
  </NavbarItem>
);
