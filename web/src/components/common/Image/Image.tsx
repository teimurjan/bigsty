import * as React from "react";

import classNames from "classnames";

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  imgProps: React.ImgHTMLAttributes<HTMLImageElement>;
}

export const Image = ({ imgProps, className, ...props }: IProps) => (
  <figure className={classNames("image", className)} {...props}>
    <img {...imgProps} />
  </figure>
);
