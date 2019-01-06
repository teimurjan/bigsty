import * as React from "react";
import { IDependenciesContainer } from "./DependenciesContainer";

const { Provider, Consumer } = React.createContext<
  IDependenciesContainer | undefined
>(undefined);

export { Provider as DIProvider };

export const injectDependencies = <P extends object>(
  Component:
    | React.ComponentClass<P & { dependencies: IDependenciesContainer }>
    | React.StatelessComponent<P & { dependencies: IDependenciesContainer }>
): React.ComponentClass<P> =>
  class extends React.Component<P & { dependencies: IDependenciesContainer }> {
    public render() {
      return (
        <Consumer>
          {(dependencies: IDependenciesContainer) => (
            <Component {...this.props} dependencies={dependencies} />
          )}
        </Consumer>
      );
    }
  };
