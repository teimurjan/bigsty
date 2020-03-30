import * as React from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';


import { ProductTypePagePresenter, IProps } from 'src/components/Client/ProductTypePage/ProductTypePagePresenter';
import { ProductTypePageView } from 'src/components/Client/ProductTypePage/ProductTypePageView';
import { useDependencies } from 'src/DI/DI';

let addToCartTimeoutID: NodeJS.Timeout;
export const ProductTypePageContainer = () => {
  const { dependencies } = useDependencies();
  const { id } = useParams<{ id: string }>();
  const intl = useIntl();

  const [showAddedText, setShowAddedText] = React.useState(false);
  const action: IProps['action'] = React.useCallback(
    product => {
      dependencies.storages.cart.add(product);
      setShowAddedText(true);
      addToCartTimeoutID = setTimeout(() => {
        setShowAddedText(false);
      }, 2000);
    },
    [dependencies.storages.cart],
  );

  React.useEffect(
    () => () => {
      clearTimeout(addToCartTimeoutID);
    },
    [],
  );

  return (
    <ProductTypePagePresenter
      action={showAddedText ? undefined : action}
      actionText={intl.formatMessage({ id: showAddedText ? 'common.addedToCart' : 'common.addToCart' })}
      id={parseInt(id, 10)}
      productService={dependencies.services.product}
      productTypeService={dependencies.services.productType}
      View={ProductTypePageView}
    />
  );
};
