/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import classNames from "classnames";
import * as React from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { Button } from "../common/Button/Button";
import { Dropdown, ITriggerProps } from "../common/Dropdown/Dropdown";
import { DropdownItemLink } from "../common/DropdownItemLink/DropdownItemLink";
import { LinkButton } from "../common/LinkButton/LinkButton";
import { Navbar } from "../common/Navbar/Navbar";
import { NavbarBrand } from "../common/NavbarBrand/NavbarBrand";
import { NavbarBurger } from "../common/NavbarBurger/NavbarBurger";
import { NavbarEnd } from "../common/NavbarEnd/NavbarEnd";
import { NavbarItem } from "../common/NavbarItem/NavbarItem";
import { NavbarMenu } from "../common/NavbarMenu/NavbarMenu";
import { NavbarStart } from "../common/NavbarStart/NavbarStart";
import { IViewProps as IProps } from "./HeaderPresenter";

interface IState {
  isOpen: boolean;
}

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

export class HeaderView extends React.Component<
  IProps & InjectedIntlProps,
  IState
> {
  public state = {
    isOpen: false
  };

  public render() {
    const { isOpen } = this.state;
    const { categories, user, intl, onLogOutClick } = this.props;
    return (
      <Navbar>
        <NavbarBrand>
          <Link className="navbar-item" to="/">
            <img
              css={css`
                max-height: 3rem !important;
              `}
              src={logo}
            />
          </Link>
          <NavbarBurger isActive={isOpen} onClick={this.toggleIsOpen} />
        </NavbarBrand>
        <NavbarMenu isActive={isOpen}>
          <NavbarStart>
            <NavbarItem className="is-uppercase">
              <Dropdown Trigger={DropdownTrigger}>
                {categories.map(category => (
                  <DropdownItemLink
                    key={category.id}
                    to={`/categories/${category.id}`}
                  >
                    {category.name}
                  </DropdownItemLink>
                ))}
              </Dropdown>
            </NavbarItem>
          </NavbarStart>
          <NavbarEnd>
            <NavbarItem>
              {user ? (
                <Button onClick={onLogOutClick} color="is-primary">
                  {intl.formatMessage({ id: "Header.logOut" })}
                </Button>
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
      </Navbar>
    );
  }

  private toggleIsOpen = () => this.setState({ isOpen: !this.state.isOpen });
}
