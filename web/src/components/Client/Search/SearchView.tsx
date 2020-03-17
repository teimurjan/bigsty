/** @jsx jsx */
import * as React from 'react';

import { css, jsx } from '@emotion/core';
import { useIntl } from 'react-intl';

import { LoaderLayout } from 'src/components/common/LoaderLayout/LoaderLayout';
import { Input } from 'src/components/common/Input/Input';

import { IViewProps as IProps } from './SearchPresenter';

import { useDebounce } from 'src/hooks/useDebounce';
import { Dropdown } from 'src/components/common/Dropdown/Dropdown';
import { DropdownItem } from 'src/components/common/DropdownItem/DropdownItem';
import { DropdownItemLink } from 'src/components/common/DropdownItemLink/DropdownItemLink';
import { DropdownDivider } from 'src/components/common/DropdownDivider/DropdownDivider';
import { Tag } from 'src/components/common/Tag/Tag';
import { mediaQueries } from 'src/styles/media';
import { formatMediaURL } from 'src/utils/url';

export const SearchView: React.FC<IProps> = ({ categories, productTypes, isLoading, error, onSearchValueChange }) => {
  const intl = useIntl();
  const [searchValue, setSearchValue] = React.useState('');
  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    e => setSearchValue(e.currentTarget.value),
    [],
  );

  const debouncedSearchValue = useDebounce(searchValue, 500);
  React.useEffect(() => {
    onSearchValueChange(debouncedSearchValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchValue]);

  const entity = React.useMemo(() => {
    if (isLoading) {
      return <LoaderLayout />;
    }
    if (error) {
      return intl.formatMessage({ id: error });
    }

    return (
      <React.Fragment>
        {categories.length > 0 &&
          categories.map(category => (
            <DropdownItemLink key={category.id} to={`/categories/${category.id}/productTypes`}>
              {category.name} <Tag color="is-info">{intl.formatMessage({ id: 'common.category' })}</Tag>
            </DropdownItemLink>
          ))}
        {productTypes.length > 0 && categories.length > 0 && <DropdownDivider />}
        {productTypes.length > 0 &&
          productTypes.map(productType => (
            <DropdownItemLink
              css={css`
                overflow: hidden;
                text-overflow: ellipsis;
              `}
              key={productType.id}
              to={`/products/${productType.id}`}
            >
              <img
                css={css`
                  width: 30px;
                  height: 30px;
                  vertical-align: middle;
                  margin-right: 0.25rem;
                `}
                src={formatMediaURL(productType.image)}
              />{' '}
              {productType.name}
            </DropdownItemLink>
          ))}
        {categories.length === 0 && productTypes.length === 0 && (
          <DropdownItem elementType="div">{intl.formatMessage({ id: 'common.noResults' })}</DropdownItem>
        )}
      </React.Fragment>
    );
  }, [categories, error, intl, isLoading, productTypes]);

  const dropdownCSS = css`
    width: 300px;
    max-width: 100%;

    @media ${mediaQueries.maxWidth768} {
      width: 100%;
    }
  `;

  return (
    <Dropdown
      css={dropdownCSS}
      menuClassName={`css-${dropdownCSS.name}`}
      trigger={({ open }) => (
        <Input
          css={dropdownCSS}
          onFocus={open}
          placeholder={`${intl.formatMessage({ id: 'Search.searchFor' })} 🔎`}
          onChange={onSearchChange}
          value={searchValue}
        />
      )}
    >
      {entity}
    </Dropdown>
  );
};
