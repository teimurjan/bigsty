import * as React from 'react';

interface ColoredButtonProps extends React.HTMLProps<HTMLButtonElement> {
  outline?: boolean;
  block?: boolean;
  rounded?: boolean;
  circle?: boolean;
  mWidth?: boolean;
}

interface ButtonProps extends ColoredButtonProps {
  color?: string;
}

export const Button: React.SFC<ButtonProps> = ({
                                                 color, children, className, outline,
                                                 block, rounded, circle, mWidth, ...props
                                               }) => {
  const outlineClassName = outline ? 'btn-outline' : '';
  const blockClassName = block ? 'btn-block' : '';
  const roundedClassName = rounded ? 'btn-rounded' : '';
  const circleClassName = circle ? 'btn-circle' : '';
  const mWidthClassName = mWidth ? 'btn-w-m' : '';
  const btnClassName = `btn btn-${color} ${className} ${outlineClassName} 
  ${blockClassName} ${roundedClassName} ${circleClassName} ${mWidthClassName}`;
  return (
    <button className={btnClassName} {...props}>
      {children}
    </button>
  );
};

export const PrimaryButton: React.SFC<ColoredButtonProps> = props => <Button color="primary" {...props}/>;
export const InfoButton: React.SFC<ColoredButtonProps> = props => <Button color="info" {...props}/>;
export const SuccessButton: React.SFC<ColoredButtonProps> = props => <Button color="success" {...props}/>;
export const WarningButton: React.SFC<ColoredButtonProps> = props => <Button color="warning" {...props}/>;
export const DangerButton: React.SFC<ColoredButtonProps> = props => <Button color="danger" {...props}/>;

const coloredButtonDefaultProps: ColoredButtonProps = {
  outline: false,
  block: false,
  rounded: false,
  circle: false,
  mWidth: false
};

const buttonDefaultProps: ButtonProps = {
  color: 'default',
  ...coloredButtonDefaultProps
};

Button.defaultProps = buttonDefaultProps;
PrimaryButton.defaultProps = coloredButtonDefaultProps;
InfoButton.defaultProps = coloredButtonDefaultProps;
SuccessButton.defaultProps = coloredButtonDefaultProps;
WarningButton.defaultProps = coloredButtonDefaultProps;
DangerButton.defaultProps = coloredButtonDefaultProps;