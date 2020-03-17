/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { useIntl } from 'react-intl';

import { Container } from 'src/components/common/Container/Container';

export const FooterView = () => {
  const intl = useIntl();

  return (
    <footer
      css={css`
        margin-top: 1rem;
        padding: 0;
        height: 80px;
        padding: 15px 0;
        box-sizing: content-box;
      `}
      className="footer"
    >
      <Container>
        <div
          css={css`
            display: flex;
            justify-content: space-between;
          `}
        >
          <a href="https://www.instagram.com/eye8_collection/" rel="noopener noreferrer" target="_blank">
            <FontAwesomeIcon size="lg" icon={faInstagram} /> Instagram
          </a>

          <a href="tel:+996550010726">
            <FontAwesomeIcon size="lg" icon={faPhoneAlt} /> +996 550 01 07 26
          </a>
        </div>

        <div
          css={css`
            text-align: center;
            margin-top: 1.5rem;
          `}
        >
          {intl.formatMessage({ id: 'Footer.copy' }, { year: new Date().getFullYear() })}
        </div>
      </Container>
    </footer>
  );
};
