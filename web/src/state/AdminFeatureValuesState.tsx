import * as React from "react";

import { IFeatureValueListRawIntlResponseItem } from "src/api/FeatureValueAPI";
import { injectDependencies } from "src/DI/DI";
import { extendIntlTextWithLocaleNames } from "src/helpers/intl";
import { IFeatureValueService } from "src/services/FeatureValueService";
import {
  IContextValue as IntlStateContextValue,
  injectIntlState
} from "src/state/IntlState";

export interface IContextValue {
  adminFeatureValuesState: {
    featureValues: IFeatureValueListRawIntlResponseItem[];
    isListLoading: boolean;
    hasListLoaded: boolean;
    listError: undefined | string;
    getFeatureValues: () => Promise<void>;
    deleteFeatureValue: (id: number) => void;
    addFeatureValue: (
      featureValue: IFeatureValueListRawIntlResponseItem
    ) => void;
    setFeatureValue: (
      featureValue: IFeatureValueListRawIntlResponseItem
    ) => void;
  };
}

const Context = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children?: React.ReactNode;
  service: IFeatureValueService;
}

interface IProviderState {
  featureValues: { [key: string]: IFeatureValueListRawIntlResponseItem };
  featureValuesOrder: number[];
  isListLoading: boolean;
  listError: undefined | string;
  hasListLoaded: boolean;
}

class Provider extends React.Component<
  IProviderProps & IntlStateContextValue,
  IProviderState
> {
  public state = {
    featureValues: {},
    featureValuesOrder: [],
    hasListLoaded: false,
    isListLoading: false,
    listError: undefined
  };

  public render() {
    const {
      featureValues,
      featureValuesOrder,
      isListLoading,
      listError,
      hasListLoaded
    } = this.state;
    const {
      children,
      intlState: { availableLocales }
    } = this.props;
    const {
      addFeatureValue,
      getFeatureValues,
      deleteFeatureValue,
      setFeatureValue
    } = this;

    return (
      <Context.Provider
        value={{
          adminFeatureValuesState: {
            addFeatureValue,
            deleteFeatureValue,
            featureValues: featureValuesOrder.map(featureValueId => {
              const featureValue: IFeatureValueListRawIntlResponseItem =
                featureValues[featureValueId];

              return {
                ...featureValue,
                feature_type: {
                  ...featureValue.feature_type,
                  name: extendIntlTextWithLocaleNames(
                    featureValue.feature_type.name,
                    availableLocales
                  )
                },
                name: extendIntlTextWithLocaleNames(
                  featureValue.name,
                  availableLocales
                )
              };
            }),
            getFeatureValues,
            hasListLoaded,
            isListLoading,
            listError,
            setFeatureValue
          }
        }}
      >
        {children}
      </Context.Provider>
    );
  }

  private getFeatureValues = async () => {
    const { service } = this.props;
    this.setState({ isListLoading: true });
    try {
      const { entities, result } = await service.getAllRawIntl();
      this.setState({
        featureValues: entities.featureValues,
        featureValuesOrder: result,
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

  private addFeatureValue = (
    featureValue: IFeatureValueListRawIntlResponseItem
  ) => {
    const { featureValues, featureValuesOrder } = this.state;

    const newFeatureValues = {
      ...featureValues,
      [featureValue.id]: featureValue
    };

    this.setState({
      featureValues: newFeatureValues,
      featureValuesOrder: [...featureValuesOrder, featureValue.id]
    });
  };

  private setFeatureValue = (
    featureValue: IFeatureValueListRawIntlResponseItem
  ) => {
    const { featureValues } = this.state;

    const newFeatureValues = {
      ...featureValues,
      [featureValue.id]: featureValue
    };

    this.setState({ featureValues: newFeatureValues });
  };

  private deleteFeatureValue = (id: number) => {
    const { featureValues, featureValuesOrder } = this.state;

    const newFeatureValues = { ...featureValues };
    delete newFeatureValues[id!];

    this.setState({
      featureValues: newFeatureValues,
      featureValuesOrder: featureValuesOrder.filter(
        idFromOrder => idFromOrder !== id
      )
    });
  };
}

export const AdminFeatureValuesStateProvider = injectIntlState(
  injectDependencies(({ dependencies, ...props }) => (
    <Provider {...props} service={dependencies.services.featureValue} />
  ))
);

export const injectAdminFeatureValuesState = (
  Component: React.ComponentClass<IContextValue> | React.SFC<IContextValue>
): React.SFC<any> => props => (
  <Context.Consumer>
    {(context: IContextValue) => <Component {...{ ...props, ...context }} />}
  </Context.Consumer>
);
