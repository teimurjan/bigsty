/** @jsx jsx */
import * as React from 'react';

import { css, jsx } from '@emotion/core';
import { useIntl } from 'react-intl';

import { Container } from 'src/components/common/Container/Container';
import { Section } from 'src/components/common/Section/Section';
import { LoaderLayout } from 'src/components/common/LoaderLayout/LoaderLayout';
import { Input } from 'src/components/common/Input/Input';

import { fullWidthMixin, textCenterMixin, marginAutoMixin } from 'src/styles/mixins';

import { IViewProps as IProps } from './HomePagePresenter';
import { LinkButton } from 'src/components/common/LinkButton/LinkButton';
import { similarity } from 'src/utils/similarity';
import { Subtitle } from 'src/components/common/Subtitle/Subtitle';

export const HomePageView: React.FC<IProps> = ({ categories, isLoading, error }) => {
  const intl = useIntl();
  const [searchValue, setSearchValue] = React.useState('');
  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    e => setSearchValue(e.currentTarget.value),
    [],
  );

  const entity = React.useMemo(() => {
    if (isLoading) {
      return <LoaderLayout />;
    }
    if (error) {
      return intl.formatMessage({ id: error });
    }

    const matchedCategories =
      searchValue.length > 0
        ? categories.filter(category => similarity(category.name, searchValue) > 0.07 * searchValue.length)
        : categories;

    return (
      <div
        css={css`
          height: calc(100vh - 9.25rem);
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <Input
          css={css`
            border: none;
            box-shadow: none;
            border-radius: 0;
            font-size: 2.5rem;
            max-width: 700px;
            text-align: center;

            &:focus {
              border: none;
              box-shadow: none;
            }
          `}
          autoFocus
          placeholder={`${intl.formatMessage({ id: 'Home.searchFor' })} 🔎`}
          onChange={onSearchChange}
          value={searchValue}
        />
        <div
          css={css`
            margin-top: 1rem;
            display: flex;
            ${fullWidthMixin};
          `}
        >
          {matchedCategories.length > 0 ? (
            matchedCategories.map(category => (
              <LinkButton
                key={category.id}
                to={`/categories/${category.id}/productTypes`}
                css={css`
                  width: 20%;
                  margin-right: 10px;
                `}
                color="is-link"
              >
                {category.name}
              </LinkButton>
            ))
          ) : (
            <Subtitle
              css={css`
                ${marginAutoMixin}
              `}
              size={4}
            >
              {intl.formatMessage({ id: 'common.noResults' })}
            </Subtitle>
          )}
        </div>
      </div>
    );
  }, [categories, error, intl, isLoading, onSearchChange, searchValue]);

  return (
    <Section>
      <Container>{entity}</Container>
    </Section>
  );
};
