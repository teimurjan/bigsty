/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import { IntlShape } from 'react-intl';

import { Hero } from 'src/components/common/Hero/Hero';
import { HeroBody } from 'src/components/common/HeroBody/HeroBody';
import { LinkButton } from 'src/components/common/LinkButton/LinkButton';
import { Title } from 'src/components/common/Title/Title';
import { textCenterMixin } from 'src/styles/mixins';

export const NotFoundView = ({ intl }: { intl: IntlShape }) => (
  <Hero className={classNames('is-large')}>
    <HeroBody
      css={css`
        ${textCenterMixin};
      `}
    >
      <Title className="is-uppercase" size={1}>
        {intl.formatMessage({ id: 'NotFound.title' })}
      </Title>
      <LinkButton className={classNames('is-medium', 'is-uppercase')} color="is-dark" href="/">
        {intl.formatMessage({ id: 'NotFound.goHome.text' })}
      </LinkButton>
    </HeroBody>
  </Hero>
);
