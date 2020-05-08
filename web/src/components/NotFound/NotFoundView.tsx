/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import { useIntl } from 'react-intl';

import { LinkButton } from 'src/components/common-v2/Button/Button';
import { Hero } from 'src/components/common/Hero/Hero';
import { HeroBody } from 'src/components/common/HeroBody/HeroBody';
import { Title } from 'src/components/common/Title/Title';

export const NotFoundView = () => {
  const intl = useIntl();

  return (
    <Hero className={classNames('is-large')}>
      <HeroBody
        css={css`
          text-align: center;
        `}
      >
        <Title className="is-uppercase" size={1}>
          {intl.formatMessage({ id: 'NotFound.title' })}
        </Title>
        <LinkButton className={classNames('is-medium', 'is-uppercase')} color="dark" href="/">
          {intl.formatMessage({ id: 'NotFound.goHome.text' })}
        </LinkButton>
      </HeroBody>
    </Hero>
  );
};
