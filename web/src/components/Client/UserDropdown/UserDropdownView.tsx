import { faUser } from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { LanguageDropdownContainer as LanguageDropdown } from 'src/components/Client/LanguageDropdown/LanguageDropdownContainer';
import { IViewProps as IProps } from 'src/components/Client/UserDropdown/UserDropdownPresenter';
import { IconLink } from 'src/components/common/IconLink/IconLink';
import { Popover, TriggerProps as PopoverTriggerProps } from 'src/components/common/Popover/Popover';
import { isUserAuthorized, isUserAdmin } from 'src/helpers/user';

const Trigger = React.forwardRef<HTMLDivElement, PopoverTriggerProps>((props, ref) => (
  <div ref={ref} {...props}>
    <IconLink icon={faUser} />
  </div>
));

export const UserDropdownView = ({ user, onLogoutClick }: IProps) => {
  const intl = useIntl();

  const items = [];

  if (isUserAdmin(user)) {
    items.push(
      <Popover.Link key="adminPanel" href="/admin">
        {intl.formatMessage({ id: 'Header.admin' })}
      </Popover.Link>,
    );
  }

  if (isUserAuthorized(user)) {
    items.push(
      <Popover.Link key="logOut" onClick={onLogoutClick}>
        {intl.formatMessage({ id: 'Header.logOut' })}
      </Popover.Link>,
    );
  } else {
    items.push(
      <Popover.Link key="logIn" href="/login">
        {intl.formatMessage({ id: 'Header.logIn' })}
      </Popover.Link>,
      <Popover.Link key="signUp" href="/signup">
        {intl.formatMessage({ id: 'Header.signUp' })}
      </Popover.Link>,
    );
  }

  items.push(
    <Popover.Link key="language">
      <LanguageDropdown />
    </Popover.Link>,
  );

  return (
    <Popover TriggerComponent={Trigger}>
      <Popover.Content>{items}</Popover.Content>
    </Popover>
  );
};
