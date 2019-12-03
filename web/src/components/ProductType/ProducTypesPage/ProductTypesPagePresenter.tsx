import * as React from 'react';

import { RouteComponentProps } from 'react-router';

import { IProductTypeListResponseItem, IProductTypeListResponseMeta } from 'src/api/ProductTypeAPI';
import { IProductTypeService } from 'src/services/ProductTypeService';

export interface IProps extends RouteComponentProps<{ categoryId: string }> {
  ListView: React.ComponentClass<IListViewProps>;
  productTypeService: IProductTypeService;
}

interface IState {
  error: string | undefined;
  isLoading: boolean;
  productTypes: { [key: string]: IProductTypeListResponseItem };
  productTypesMeta: IProductTypeListResponseMeta;
  productTypesOrder: number[];
}

export interface IListViewProps {
  productTypes: IProductTypeListResponseItem[];
  meta: IProductTypeListResponseMeta;
  error: string | undefined;
  isLoading: boolean;
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
    const isNewCategory = prevProps.match.params.categoryId !== this.props.match.params.categoryId;
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
      const { productTypeService, match } = this.props;
      const { entities, result, meta } = await productTypeService.getForCategory(
        parseInt(match.params.categoryId, 10),
        1,
      );
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
