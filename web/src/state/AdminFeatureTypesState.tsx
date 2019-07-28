import * as React from "react";

import { IFeatureTypeListRawIntlResponseItem } from "src/api/FeatureTypeAPI";
import { injectDependencies } from "src/DI/DI";
import { extendIntlTextWithLocaleNames } from "src/helpers/intl";
import { IFeatureTypeService } from "src/services/FeatureTypeService";
import {
  IContextValue as IntlStateContextValue,
  injectIntlState
} from "src/state/IntlState";

export interface IContextValue {
  adminFeatureTypesState: {
    featureTypes: IFeatureTypeListRawIntlResponseItem[];
    isListLoading: boolean;
    hasListLoaded: boolean;
    listError: undefined | string;
    getFeatureTypes: () => Promise<void>;
    deleteFeatureType: (id: number) => void;
    addFeatureType: (featureType: IFeatureTypeListRawIntlResponseItem) => void;
  };
}

const Context = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children?: React.ReactNode;
  service: IFeatureTypeService;
}

interface IProviderState {
  featureTypes: { [key: string]: IFeatureTypeListRawIntlResponseItem };
  featureTypesOrder: number[];
  isListLoading: boolean;
  listError: undefined | string;
  hasListLoaded: boolean;
}

class Provider extends React.Component<
  IProviderProps & IntlStateContextValue,
  IProviderState
> {
  public state = {
    featureTypes: {},
    featureTypesOrder: [],
    hasListLoaded: false,
    isListLoading: false,
    listError: undefined
  };

  public render() {
    const {
      featureTypes,
      featureTypesOrder,
      isListLoading,
      listError,
      hasListLoaded
    } = this.state;
    const {
      children,
      intlState: { availableLocales }
    } = this.props;
    const { addFeatureType, getFeatureTypes, deleteFeatureType } = this;

    return (
      <Context.Provider
        value={{
          adminFeatureTypesState: {
            addFeatureType,
            deleteFeatureType,
            featureTypes: featureTypesOrder.map(featureTypeId => {
              const featureType: IFeatureTypeListRawIntlResponseItem =
                featureTypes[featureTypeId];

              return {
                ...featureType,
                name: extendIntlTextWithLocaleNames(
                  featureType.name,
                  availableLocales
                )
              };
            }),
            getFeatureTypes,
            hasListLoaded,
            isListLoading,
            listError
          }
        }}
      >
        {children}
      </Context.Provider>
    );
  }

  private getFeatureTypes = async () => {
    const { service } = this.props;
    this.setState({ isListLoading: true });
    try {
      const { entities, result } = await service.getAllRawIntl();
      this.setState({
        featureTypes: entities.featureTypes,
        featureTypesOrder: result,
        hasListLoaded: true,
        isListLoading: false
      });
    } catch (e) {
      this.setState({
        hasListLoaded: true,
        isListLoading: false,
        listError: "errors.common"
      });
    }
  };

  private addFeatureType = (
    featureType: IFeatureTypeListRawIntlResponseItem
  ) => {
    const { featureTypes, featureTypesOrder } = this.state;

    const newFeatureTypes = {
      ...featureTypes,
      [featureType.id]: featureType
    };

    this.setState({
      featureTypes: newFeatureTypes,
      featureTypesOrder: [...featureTypesOrder, featureType.id]
    });
  };

  private deleteFeatureType = (id: number) => {
    const { featureTypes, featureTypesOrder } = this.state;

    const newFeatureTypes = { ...featureTypes };
    delete newFeatureTypes[id!];

    this.setState({
      featureTypes: newFeatureTypes,
      featureTypesOrder: featureTypesOrder.filter(
        idFromOrder => idFromOrder !== id
      )
    });
  };
}

export const AdminFeatureTypesStateProvider = injectIntlState(
  injectDependencies(({ dependencies, ...props }) => (
    <Provider {...props} service={dependencies.services.featureType} />
  ))
);

export const injectAdminFeatureTypesState = (
  Component: React.ComponentClass<IContextValue> | React.SFC<IContextValue>
): React.SFC<any> => props => (
  <Context.Consumer>
    {(context: IContextValue) => <Component {...{ ...props, ...context }} />}
  </Context.Consumer>
);
