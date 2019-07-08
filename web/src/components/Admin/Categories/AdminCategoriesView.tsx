/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { Button } from "src/components/common/Button/Button";
import { Container } from "src/components/common/Container/Container";
import { Section } from "src/components/common/Section/Section";
import { Table } from "src/components/common/Table/Table";

import { textCenterMixin } from "src/styles/mixins";

import { IViewProps as IProps } from "./AdminCategoriesPresenter";

export const AdminCategoriesView = ({ categories, locales }: IProps) => (
  <Section>
    <Container>
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
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Parent Category ID</Table.HeadCell>
            <Table.HeadCell colSpan={locales.length}>Names</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Row>
          <Table.Row>
            <Table.HeadCell />
            <Table.HeadCell />
            {locales.map(locale => (
              <Table.HeadCell key={locale}>{locale}</Table.HeadCell>
            ))}
            <Table.HeadCell />
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {categories.map(({ id, name, parent_category_id }) => (
            <Table.Row key={id}>
              <Table.Cell>{id}</Table.Cell>
              <Table.Cell>
                {parent_category_id ? parent_category_id : "null"}
              </Table.Cell>
              {locales.map(locale => (
                <Table.Cell key={locale}>{name[locale]}</Table.Cell>
              ))}
              <Table.Cell
                css={css`
                  ${textCenterMixin};
                  width: 15%;
                `}
              >
                <Button
                  css={css`
                    margin-right: 0.5rem;
                  `}
                  color="is-info"
                >
                  <FontAwesomeIcon icon={faPencilAlt} />
                </Button>
                <Button color="is-danger">
                  <FontAwesomeIcon icon={faTrashAlt} />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  </Section>
);
