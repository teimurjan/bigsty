/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import React from 'react';

import { Title } from 'src/components/client-ui/Title/Title';
import { fadeInFromBottom } from 'src/styles/keyframes';
import { mediaQueries } from 'src/styles/media';
import { easeOutCubic } from 'src/styles/timing-functions';

interface IProps {
  src: string;
  title: React.ReactNode;
  description: React.ReactNode;
  rtl?: boolean;
  backgroundPosition?: string;
}

export const Story = ({ src, title, description, rtl, backgroundPosition }: IProps) => {
  return (
    <div
      className={classNames({ rtl })}
      css={css`
        display: flex;
        align-items: center;
        animation: ${fadeInFromBottom} 500ms ${easeOutCubic};

        &.rtl {
          flex-direction: row-reverse;
        }

        @media ${mediaQueries.maxWidth768} {
          margin-bottom: 30px;
          flex-direction: column;

          &.rtl {
            flex-direction: column;
          }
        }
      `}
    >
      <div
        style={{ backgroundImage: `url(${src})`, backgroundPosition }}
        css={css`
          flex: 0 0 50%;
          height: 650px;
          background-position: center center;
          background-repeat: no-repeat;
          background-size: cover;

          @media ${mediaQueries.maxWidth768} {
            margin-bottom: 20px;
            width: 100%;
            flex: 1 1 300px;
          }
        `}
      ></div>
      <div
        css={css`
          flex: 0 0 50%;
          padding: 0 7.5vw;
        `}
      >
        {title}
        {description}
      </div>
    </div>
  );
};

const StoryTitle: React.FC = ({ children }) => (
  <Title
    css={css`
      margin-bottom: 15px;
    `}
    size={3}
  >
    {children}
  </Title>
);

const StoryDescription: React.FC = ({ children }) => {
  const theme = useTheme<ClientUITheme>();
  return (
    <p
      css={css`
        line-height: 1.75;
        color: ${theme.textSecondaryColor};
      `}
    >
      {children}
    </p>
  );
};

Story.Description = StoryDescription;
Story.Title = StoryTitle;
