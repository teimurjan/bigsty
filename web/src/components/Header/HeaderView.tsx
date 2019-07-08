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
import { LinkButton } from "src/components/common/LinkButton/LinkButton";
import { Navbar } from "src/components/common/Navbar/Navbar";
import { NavbarBrand } from "src/components/common/NavbarBrand/NavbarBrand";
import { NavbarBurger } from "src/components/common/NavbarBurger/NavbarBurger";
import { NavbarEnd } from "src/components/common/NavbarEnd/NavbarEnd";
import { NavbarItem } from "src/components/common/NavbarItem/NavbarItem";
import { NavbarMenu } from "src/components/common/NavbarMenu/NavbarMenu";
import { NavbarStart } from "src/components/common/NavbarStart/NavbarStart";

import { isUserAdmin } from "src/helpers/user";
import { IViewProps as IProps } from "./HeaderPresenter";

const DropdownTrigger = injectIntl(
  ({ intl, className, ...props }: ITriggerProps & InjectedIntlProps) => (
    <NavbarItem
      className={classNames("navbar-link is-uppercase", className)}
      {...props}
    >
      {intl.formatMessage({ id: "Header.categories.title" })}
    </NavbarItem>
  )
);

const renderCategories = (categories: IProps["categories"]): React.ReactNode =>
  categories
    .filter(({ parent_category_id }) => !parent_category_id)
    .map(({ id, name }) => (
      <DropdownItemLink key={id} to={`/categories/${id}/productTypes`}>
        {name}
      </DropdownItemLink>
    ));

export const HeaderView = ({
  categories,
  user,
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
                {renderCategories(categories)}
              </Dropdown>
            </NavbarItem>
          </NavbarStart>
          <NavbarEnd>
            <NavbarItem>
              {user ? (
                <div className="buttons">
                  <Button onClick={onLogOutClick} color="is-primary">
                    {intl.formatMessage({ id: "Header.logOut" })}
                  </Button>
                  {isUserAdmin(user) && (
                    <LinkButton color="is-info" to="/admin">
                      {intl.formatMessage({ id: "Header.admin" })}
                    </LinkButton>
                  )}
                </div>
              ) : (
                <div className="buttons">
                  <LinkButton color="is-primary" to="/login">
                    {intl.formatMessage({ id: "Header.logIn" })}
                  </LinkButton>
                  <LinkButton color="is-info" to="/signup">
                    {intl.formatMessage({ id: "Header.signUp" })}
                  </LinkButton>
                </div>
              )}
            </NavbarItem>
          </NavbarEnd>
        </NavbarMenu>
      </Container>
    </Navbar>
  );
};
