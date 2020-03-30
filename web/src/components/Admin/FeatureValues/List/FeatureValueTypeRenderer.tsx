import * as React from 'react';

import { IFeatureValueListRawIntlResponseItem } from 'src/api/FeatureValueAPI';
import { IRenderer } from 'src/components/Admin/AdminTable';
import { Table } from 'src/components/common/Table/Table';



type BaseRenderer = IRenderer<IFeatureValueListRawIntlResponseItem>;

export class FeatureValueTypeRenderer implements BaseRenderer {
  private locale: string;

  constructor(locale: string) {
    this.locale = locale;
  }

  public renderHeader: BaseRenderer['renderHeader'] = (title: string, { componentKey }) => (
    <Table.HeadCell key={componentKey}>{title}</Table.HeadCell>
  );

  public renderSubheader: BaseRenderer['renderSubheader'] = ({ componentKey }) => <Table.HeadCell key={componentKey} />;

  public renderEntity: BaseRenderer['renderEntity'] = (featureValue, { colKey: _, componentKey }) => (
    <Table.Cell key={componentKey}>{featureValue.feature_type.name[this.locale]}</Table.Cell>
  );
}
