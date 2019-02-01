import classNames from "classnames";
import * as React from "react";

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  imgProps: React.HTMLAttributes<HTMLImageElement>;
}

export class Image extends React.Component<IProps> {
  public render() {
    const { imgProps, className, ...props } = this.props;
    return (
      <figure className={classNames("image", className)} {...props}>
        <img {...imgProps} />
      </figure>
    );
  }
}
