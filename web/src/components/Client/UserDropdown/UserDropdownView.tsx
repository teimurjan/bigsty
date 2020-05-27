import { faUser } from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { Anchor } from 'src/components/client-ui/Anchor/Anchor';
import { Popover, TriggerHoverProps as PopoverTriggerProps } from 'src/components/client-ui/Popover/Popover';
import { WithIcon } from 'src/components/client-ui/WithIcon/WithIcon';
import { LanguageDropdownContainer as LanguageDropdown } from 'src/components/Client/LanguageDropdown/LanguageDropdownContainer';
import { IViewProps as IProps } from 'src/components/Client/UserDropdown/UserDropdownPresenter';
import { isUserAuthorized, isUserAdmin } from 'src/helpers/user';
import { useLazyInitialization } from 'src/hooks/useLazyInitialization';
import { useMedia } from 'src/hooks/useMedia';
import { mediaQueries } from 'src/styles/media';

const Trigger = React.forwardRef<HTMLAnchorElement, PopoverTriggerProps>((props, ref) => {
  const intl = useIntl();
  return (
    <Anchor ref={ref} noHoverOnTouch {...props}>
      <WithIcon icon={faUser} hideTextOnMobile>
        {intl.formatMessage({ id: 'common.account' })}
      </WithIcon>
    </Anchor>
  );
});

export const UserDropdownView = ({ user, onLogoutClick }: IProps) => {
  const intl = useIntl();
  const languageDropdownRef = React.useRef<HTMLDivElement>(null);
  const isMobile = useMedia([mediaQueries.maxWidth768], [true], false);
  const { value: lazyIsMobile } = useLazyInitialization(isMobile, false);

  const items = [];

  if (isUserAdmin(user)) {
    items.push(
      <Anchor key="adminPanel" href="/admin" thin>
        {intl.formatMessage({ id: 'Header.admin' })}
      </Anchor>,
    );
  }

  if (!isUserAuthorized(user)) {
    items.push(
      <Anchor key="logIn" href="/login" thin>
        {intl.formatMessage({ id: 'Header.logIn' })}
      </Anchor>,
      <Anchor key="signUp" href="/signup" thin>
        {intl.formatMessage({ id: 'Header.signUp' })}
      </Anchor>,
    );
  }

  items.push(
    <Anchor key="language" thin>
      <LanguageDropdown ref={languageDropdownRef} openOnHover placement="left" />
    </Anchor>,
  );

  if (lazyIsMobile) {
    items.push(
      <Anchor key="how-it-works" href="/how-it-works" thin>
        {intl.formatMessage({ id: 'HowItWorks.title' })}
      </Anchor>,
    );
  }

  if (isUserAuthorized(user)) {
    items.push(
      <Anchor key="logOut" onClick={onLogoutClick} thin>
        {intl.formatMessage({ id: 'Header.logOut' })}
      </Anchor>,
    );
  }

  return (
    <Popover refsToInclude={[languageDropdownRef]} TriggerComponent={Trigger} openOnHover>
      <Popover.Content>{items}</Popover.Content>
    </Popover>
  );
};
