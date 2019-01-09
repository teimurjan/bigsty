import * as React from "react";
import { IDependenciesContainer } from "./DependenciesContainer";

export interface IContextValue {
  dependencies: IDependenciesContainer;
}

const { Provider, Consumer } = React.createContext<IContextValue | null>(null);

export { Provider as DIProvider };

export const injectDependencies = <P extends object>(
  Component:
    | React.ComponentClass<P & IContextValue>
    | React.StatelessComponent<P & IContextValue>
): React.ComponentClass<P> =>
  class extends React.Component<P & IContextValue> {
    public render() {
      return (
        <Consumer>
          {(context: IContextValue) => (
            <Component {...this.props} dependencies={context.dependencies} />
          )}
        </Consumer>
      );
    }
  };
