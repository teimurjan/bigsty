/** @jsx jsx */
import * as React from "react";

import { css, jsx } from "@emotion/core";

import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { InjectedIntlProps } from "react-intl";

import { Button } from "src/components/common/Button/Button";
import { Container } from "src/components/common/Container/Container";
import { LoaderLayout } from "src/components/common/LoaderLayout/LoaderLayout";
import { Section } from "src/components/common/Section/Section";
import { Table } from "src/components/common/Table/Table";

import { textCenterMixin } from "src/styles/mixins";

interface IAdminTableRendererRequiredArgs {
  componentKey: string;
  colKey: string;
}

interface IAdminTableColProps<T> {
  title: string;
  key_: keyof T;
  renderer?: IRenderer<T>;
}

const AdminTableCol = <T extends any>(_: IAdminTableColProps<T>) => null;

interface IRenderer<T> {
  renderHeader: (
    title: string,
    { componentKey }: IAdminTableRendererRequiredArgs
  ) => React.ReactNode;

  renderSubheader: ({
    componentKey
  }: IAdminTableRendererRequiredArgs) => React.ReactNode;

  renderEntity: (
    entity: T,
    { colKey, componentKey }: IAdminTableRendererRequiredArgs
  ) => React.ReactNode;
}

class DefaultRenderer<T> implements IRenderer<T> {
  public renderHeader = (
    title: string,
    { componentKey }: IAdminTableRendererRequiredArgs
  ) => <Table.HeadCell key={componentKey}>{title}</Table.HeadCell>;

  public renderSubheader = ({
    componentKey
  }: IAdminTableRendererRequiredArgs) => <Table.HeadCell key={componentKey} />;

  public renderEntity = (
    entity: T,
    { colKey, componentKey }: IAdminTableRendererRequiredArgs
  ) => <Table.Cell key={componentKey}>{entity[colKey]}</Table.Cell>;
}

export class IntlRenderer<T> implements IRenderer<T> {
  private locales: string[];

  constructor(locales: string[]) {
    this.locales = locales;
  }

  public renderHeader = (
    title: string,
    { componentKey }: IAdminTableRendererRequiredArgs
  ) => (
    <Table.HeadCell key={componentKey} colSpan={this.locales.length}>
      {title}
    </Table.HeadCell>
  );

  public renderSubheader = ({
    componentKey
  }: IAdminTableRendererRequiredArgs) =>
    this.locales.map(locale => (
      <Table.HeadCell key={`${componentKey}-${locale}`}>
        {locale}
      </Table.HeadCell>
    ));

  public renderEntity = (
    entity: T,
    { colKey, componentKey }: IAdminTableRendererRequiredArgs
  ) => (
    <React.Fragment key={componentKey}>
      {this.locales.map(locale => (
        <Table.Cell key={locale}>{entity[colKey][locale]}</Table.Cell>
      ))}
    </React.Fragment>
  );
}

interface IProps<T> {
  isLoading: boolean;
  isDataLoaded: boolean;
  onDelete?: (id: number) => any;
  onEdit?: (id: number) => void;
  renderNoData: () => React.ReactNode;
  entities: T[];
  children: Array<React.ReactElement<IAdminTableColProps<T>>>;
}

const defaultRenderer = new DefaultRenderer();

export const AdminTable = <T extends { id: number }>({
  onDelete,
  onEdit,
  renderNoData,
  isLoading,
  isDataLoaded,
  entities,
  children,
  intl
}: IProps<T> & InjectedIntlProps) => (
  <Section>
    <Container>
      {isLoading && <LoaderLayout />}
      {entities.length === 0 && isDataLoaded && renderNoData()}
      {entities.length > 0 && (
        <Table
          className={classNames(
            "is-bordered",
            "is-striped",
            "is-narrow",
            "is-hoverable",
            "is-fullwidth"
          )}
        >
          <Table.Head>
            <Table.Row>
              {React.Children.map(
                children,
                ({ props: { title, key_, renderer } }) =>
                  (renderer || defaultRenderer).renderHeader(title, {
                    colKey: key_ as string,
                    componentKey: `head-cell-${key_}`
                  })
              )}
              <Table.HeadCell key="head-cell-actions">
                {intl.formatMessage({ id: "common.actions" })}
              </Table.HeadCell>
            </Table.Row>
            <Table.Row>
              {React.Children.map(children, ({ props: { key_, renderer } }) =>
                (renderer || defaultRenderer).renderSubheader({
                  colKey: key_ as string,
                  componentKey: `sub-head-cell-${key_}`
                })
              )}
              <Table.HeadCell key="sub-head-cell-actions" />
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {entities.map(entity => (
              <Table.Row key={entity.id}>
                {React.Children.map(children, ({ props: { key_, renderer } }) =>
                  (renderer || defaultRenderer).renderEntity(entity, {
                    colKey: key_ as string,
                    componentKey: `table-cell-${key_}-${entity.id}`
                  })
                )}

                <Table.Cell
                  key={`table-cell-${entity.id}`}
                  css={css`
                    ${textCenterMixin};
                    width: 15%;
                  `}
                >
                  {onEdit && (
                    <Button
                      css={css`
                        margin-right: 0.5rem;
                      `}
                      color="is-info"
                      /* tslint:disable-next-line jsx-no-lambda */
                      onClick={() => onEdit(entity.id)}
                    >
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      color="is-danger"
                      /* tslint:disable-next-line jsx-no-lambda */
                      onClick={() => onDelete(entity.id)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  </Section>
);

AdminTable.Col = AdminTableCol;
