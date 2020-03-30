import * as React from 'react';

import { IProductTypeListResponseItem, IProductTypeListResponseMeta } from 'src/api/ProductTypeAPI';
import { IProps as IListViewProps } from 'src/components/Client/ProductType/ProductTypesList/ProductTypesListView';
import { IProductTypeService } from 'src/services/ProductTypeService';

export interface IProps {
  ListView: React.ComponentClass<IListViewProps> | React.SFC<IListViewProps>;
  productTypeService: IProductTypeService;
  categoryId: number;
}

interface IState {
  error: string | undefined;
  isLoading: boolean;
  productTypes: { [key: string]: IProductTypeListResponseItem };
  productTypesMeta: IProductTypeListResponseMeta;
  productTypesOrder: number[];
}

export class ProductTypesPagePresenter extends React.Component<IProps, IState> {
  public state = {
    error: undefined,
    isLoading: false,
    productTypes: {},
    productTypesMeta: { count: 0, pages_count: 0, limit: 0, page: 0 },
    productTypesOrder: [],
  };

  public componentDidMount() {
    this.getProductTypes();
  }

  public componentDidUpdate(prevProps: IProps) {
    const isNewCategory = prevProps.categoryId !== this.props.categoryId;
    if (isNewCategory) {
      this.getProductTypes();
    }
  }

  public render() {
    const { ListView } = this.props;
    const { productTypes, productTypesMeta, productTypesOrder, isLoading, error } = this.state;

    return (
      <ListView
        productTypes={productTypesOrder.map(id => productTypes[id])}
        meta={productTypesMeta}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  private getProductTypes = async () => {
    this.startLoading();
    try {
      const { productTypeService, categoryId } = this.props;
      const { entities, result, meta } = await productTypeService.getForCategory(categoryId, 1);
      this.setState({
        productTypes: entities.productTypes,
        productTypesMeta: meta,
        productTypesOrder: result,
      });
    } catch (e) {
      this.setError('errors.common');
    }
    this.stopLoading();
  };

  private startLoading = () => this.setState({ isLoading: true });

  private stopLoading = () => this.setState({ isLoading: false });

  private setError = (error: string | undefined) => this.setState({ error });
}
