/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NextRouter } from 'next/router';
import { useIntl } from 'react-intl';

import { IViewProps as IProps } from 'src/components/Client/Nav/NavPresenter';
import { Menu } from 'src/components/common/Menu/Menu';
import { NavLink } from 'src/components/common/NavLink/NavLink';
import { useBoolean } from 'src/hooks/useBoolean';
import { mediaQueries } from 'src/styles/media';

interface ICategoryMenuItemProps {
  active: boolean;
  asPath: string;
  renderChildren: (renderProps: { collapsed: boolean }) => React.ReactNode;
  defaultCollpsed?: boolean;
  name: string;
}

const CategoryMenuItem = ({
  active,
  asPath,
  renderChildren,
  name,
  defaultCollpsed = false,
}: ICategoryMenuItemProps) => {
  const { value: collapsed, toggle } = useBoolean(defaultCollpsed);

  const children = renderChildren({ collapsed });

  return (
    <Menu.Item>
      <NavLink
        css={css`
          display: flex !important;
          align-items: center;
          justify-content: space-between;
          padding-right: 0.25rem !important;
        `}
        active={active}
        as={asPath}
        href="/categories/[id]/products"
      >
        {name}
        {children && (
          <FontAwesomeIcon
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              toggle();
            }}
            css={css`
              padding: 5px;
              box-sizing: content-box;
              transform: ${collapsed ? 'rotateZ(180deg)' : undefined};
              transition: transform 300ms ease-in-out;
            `}
            icon={faCaretDown}
            size="sm"
          />
        )}
      </NavLink>
      {children}
    </Menu.Item>
  );
};

interface ICategoryMenuListProps {
  categories: IProps['categories'];
  router: NextRouter;
  parentId?: number | null;
  level?: number;
  collapsed?: boolean;
}

const renderCategoryMenuList = ({
  categories,
  router,
  collapsed = false,
  parentId = null,
  level = 0,
}: ICategoryMenuListProps) => {
  const parentCategories = categories.filter(category => category.parent_category_id === parentId);
  if (parentCategories.length === 0) {
    return null;
  }

  return (
    <Menu.List collapsed={collapsed}>
      {parentCategories.map(parentCategory => {
        const asPath = `/categories/${parentCategory.slug}/products`;
        return (
          <CategoryMenuItem
            key={parentCategory.id}
            active={router.asPath === asPath}
            asPath={asPath}
            name={parentCategory.name}
            defaultCollpsed={level > 1}
            renderChildren={({ collapsed: collapsed_ }) =>
              renderCategoryMenuList({
                categories,
                router,
                collapsed: collapsed_,
                parentId: parentCategory.id,
                level: level + 1,
              })
            }
          />
        );
      })}
    </Menu.List>
  );
};

export const NavView = ({ categories, router }: IProps & { router: NextRouter }) => {
  const intl = useIntl();

  return (
    <Menu
      css={css`
        width: 250px;
        padding: 0 1.5rem;

        @media ${mediaQueries.maxWidth768} {
          width: 100%;
          padding: 0;
        }
      `}
    >
      <Menu.List>
        <Menu.Item>
          <NavLink active={router.asPath === '/'} href="/">
            {intl.formatMessage({ id: 'AdminMenu.home' })}
          </NavLink>
        </Menu.Item>
      </Menu.List>
      <Menu.Label>{intl.formatMessage({ id: 'Nav.categories.title' })}</Menu.Label>
      {renderCategoryMenuList({ categories, router })}
    </Menu>
  );
};
