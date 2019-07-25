/** @jsx jsx */
import * as React from "react";
import { Link } from "react-router-dom";

import { css, jsx } from "@emotion/core";
import classNames from "classnames";
import { InjectedIntlProps, injectIntl } from "react-intl";

import logo from "src/assets/images/logo.png";
import { Button } from "src/components/common/Button/Button";
import { Container } from "src/components/common/Container/Container";
import {
  Dropdown,
  ITriggerProps
} from "src/components/common/Dropdown/Dropdown";
import { DropdownItemLink } from "src/components/common/DropdownItemLink/DropdownItemLink";
import { Navbar } from "src/components/common/Navbar/Navbar";
import { NavbarBrand } from "src/components/common/NavbarBrand/NavbarBrand";
import { NavbarBurger } from "src/components/common/NavbarBurger/NavbarBurger";
import { NavbarEnd } from "src/components/common/NavbarEnd/NavbarEnd";
import { NavbarItem } from "src/components/common/NavbarItem/NavbarItem";
import { NavbarMenu } from "src/components/common/NavbarMenu/NavbarMenu";
import { NavbarStart } from "src/components/common/NavbarStart/NavbarStart";

import { IViewProps as IProps } from "./AdminHeaderPresenter";

const DropdownTrigger = injectIntl(
  ({ intl, className, ...props }: ITriggerProps & InjectedIntlProps) => (
    <NavbarItem
      className={classNames("navbar-link is-uppercase", className)}
      {...props}
    >
      {intl.formatMessage({ id: "AdminMenu.modelsLabel" })}
    </NavbarItem>
  )
);

export const AdminHeaderView = ({
  intl,
  onLogOutClick
}: IProps & InjectedIntlProps) => {
  const [isOpen, setOpen] = React.useState(false);

  const toggleOpen = () => setOpen(!isOpen);

  return (
    <Navbar>
      <Container>
        <NavbarBrand>
          <Link className="navbar-item" to="/">
            <img
              css={css`
                max-height: 3rem !important;
              `}
              src={logo}
            />
          </Link>
          <NavbarBurger isActive={isOpen} onClick={toggleOpen} />
        </NavbarBrand>
        <NavbarMenu isActive={isOpen}>
          <NavbarStart>
            <NavbarItem className="is-uppercase">
              <Dropdown Trigger={DropdownTrigger}>
                <DropdownItemLink to="/admin/categories">
                  {intl.formatMessage({ id: "AdminMenu.categoriesLinkText" })}
                </DropdownItemLink>
                <DropdownItemLink to="/admin/featureTypes">
                  {intl.formatMessage({ id: "AdminMenu.featureTypesLinkText" })}
                </DropdownItemLink>
              </Dropdown>
            </NavbarItem>
          </NavbarStart>
          <NavbarEnd>
            <NavbarItem>
              <Button onClick={onLogOutClick} color="is-info">
                {intl.formatMessage({ id: "Header.logOut" })}
              </Button>
            </NavbarItem>
          </NavbarEnd>
        </NavbarMenu>
      </Container>
    </Navbar>
  );
};
