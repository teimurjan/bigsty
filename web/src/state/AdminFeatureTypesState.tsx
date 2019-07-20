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
    isDeleteLoading: boolean;
    isDeleteOpen: boolean;
    deleteError: undefined | string;
    getFeatureTypes: () => Promise<void>;
    deleteFeatureType: () => Promise<void>;
    openDeletion: (id: number) => void;
    closeDeletion: () => void;
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
  deleteError: undefined | string;
  deletingFeatureTypeID: number | null;
  isDeleteLoading: boolean;
  isListLoading: boolean;
  listError: undefined | string;
  hasListLoaded: boolean;
}

class Provider extends React.Component<
  IProviderProps & IntlStateContextValue,
  IProviderState
> {
  public state = {
    deleteError: undefined,
    deletingFeatureTypeID: null,
    featureTypes: {},
    featureTypesOrder: [],
    hasListLoaded: false,
    isDeleteLoading: false,
    isListLoading: false,
    listError: undefined
  };

  public render() {
    const {
      featureTypes,
      featureTypesOrder,
      deleteError,
      deletingFeatureTypeID,
      isDeleteLoading,
      isListLoading,
      listError,
      hasListLoaded
    } = this.state;
    const {
      children,
      intlState: { availableLocales }
    } = this.props;
    const {
      getFeatureTypes,
      deleteFeatureType,
      openDeletion,
      closeDeletion
    } = this;

    return (
      <Context.Provider
        value={{
          adminFeatureTypesState: {
            closeDeletion,
            deleteError,
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
            isDeleteLoading,
            isDeleteOpen: !!deletingFeatureTypeID,
            isListLoading,
            listError,
            openDeletion
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

  private deleteFeatureType = async () => {
    const {
      deletingFeatureTypeID,
      featureTypes,
      featureTypesOrder
    } = this.state;
    if (!deletingFeatureTypeID) {
      return;
    }

    const { service } = this.props;
    this.setState({ isDeleteLoading: true });
    try {
      await service.delete(deletingFeatureTypeID!);

      const newFeatureTypes = { ...featureTypes };
      delete newFeatureTypes[deletingFeatureTypeID!];

      this.setState({
        deletingFeatureTypeID: null,
        featureTypes: newFeatureTypes,
        featureTypesOrder: featureTypesOrder.filter(
          id => id !== deletingFeatureTypeID
        ),
        isDeleteLoading: false
      });
    } catch (e) {
      this.setState({ deleteError: "errors.common", isDeleteLoading: false });
    }
  };

  private openDeletion = (id: number) => {
    this.setState({ deletingFeatureTypeID: id });
  };

  private closeDeletion = () => {
    this.setState({ deletingFeatureTypeID: null });
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
