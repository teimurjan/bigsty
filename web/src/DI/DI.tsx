import * as React from "react";
import { IDependenciesContainer } from "./DependenciesContainer";

const { Provider, Consumer } = React.createContext<
  IDependenciesContainer | undefined
>(undefined);

export { Provider as DIProvider };

export const injectDependencies = <
  P extends { dependencies: IDependenciesContainer }
>(
  Component: React.ComponentClass<P> | React.StatelessComponent<P>
): React.ComponentClass<P & { dependencies: IDependenciesContainer }> =>
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
