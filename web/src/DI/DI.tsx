import * as React from "react";
import { IDependenciesContainer } from "./DependenciesContainer";

export interface IContextValue {
  dependencies: IDependenciesContainer;
}

const { Provider, Consumer } = React.createContext<IContextValue | null>(null);

export { Provider as DIProvider };

export const injectDependencies = (
  Component:
    | React.ComponentClass<IContextValue>
    | React.StatelessComponent<IContextValue>
): React.ComponentClass<any> =>
  class extends React.Component<any> {
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
