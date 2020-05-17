/** @jsx jsx */

import { css, jsx } from '@emotion/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from 'emotion-theming';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { IViewProps as IProps } from 'src/components/Client/Search/SearchPresenter';
import { Anchor } from 'src/components/common-v2/Anchor/Anchor';
import { Drawer } from 'src/components/common-v2/Drawer/Drawer';
import { Popover } from 'src/components/common-v2/Popover/Popover';
import { WithIcon } from 'src/components/common-v2/WithIcon/WithIcon';
import { DropdownDivider } from 'src/components/common/DropdownDivider/DropdownDivider';
import { DropdownItem } from 'src/components/common/DropdownItem/DropdownItem';
import { DropdownItemLink } from 'src/components/common/DropdownItemLink/DropdownItemLink';
import { LoaderLayout } from 'src/components/common/LoaderLayout/LoaderLayout';
import { Tag } from 'src/components/common/Tag/Tag';
import { UnderlinedInput } from 'src/components/common/UnderlinedInput/UnderlinedInput';
import { useBoolean } from 'src/hooks/useBoolean';
import { useDebounce } from 'src/hooks/useDebounce';
import { mediaQueries } from 'src/styles/media';
import { formatMediaURL } from 'src/utils/url';

const inputCSS = css`
  width: 300px !important;
  max-width: 100%;

  @media ${mediaQueries.maxWidth768} {
    width: 90vw !important;
  }
`;

const contentCSS = css`
  ${inputCSS};
  padding: 5px;
`;

export const SearchView: React.FC<IProps> = ({
  categories,
  productTypes,
  isLoading,
  error,
  onSearchValueChange,
  isOpen,
  open,
  close,
}) => {
  const { value: drawerOpened, setPositive: setDrawerOpened, setNegative: setDrawerClosed } = useBoolean();
  const theme = useTheme<CSSThemeV2>();
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
            <DropdownItemLink
              key={category.id}
              as={`/categories/${category.slug}/products`}
              href="/categories/[id]/products"
            >
              {category.name} <Tag color="is-primary">{intl.formatMessage({ id: 'common.category' })}</Tag>
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
              as={`/products/${productType.slug}`}
              href="/products/[slug]"
            >
              <img
                alt={productType.name}
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

  return (
    <>
      <Anchor onClick={open} noHoverOnTouch>
        <WithIcon icon={faSearch} hideTextOnMobile>
          {intl.formatMessage({ id: 'common.search' })}
        </WithIcon>
      </Anchor>
      <Drawer
        isOpen={isOpen}
        close={close}
        fromSide="top"
        onEnter={setDrawerClosed}
        onEntered={setDrawerOpened}
        onExit={setDrawerClosed}
        lockScroll={false}
        fixed={true}
      >
        <div
          css={css`
            width: 100%;
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: ${theme.backgroundPrimaryColor};
          `}
        >
          <Popover<HTMLInputElement>
            forceClose={searchValue === '' || !drawerOpened}
            renderTrigger={({ ref, open }) => (
              <UnderlinedInput
                autoFocus
                css={inputCSS}
                ref={ref}
                onFocus={open}
                placeholder={intl.formatMessage({ id: 'Search.searchFor' })}
                onChange={onSearchChange}
                value={searchValue}
                data-mousetrap
              />
            )}
          >
            <Popover.Content css={contentCSS}>{entity}</Popover.Content>
          </Popover>
        </div>
      </Drawer>
    </>
  );
};
