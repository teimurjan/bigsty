/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IProps extends React.HTMLProps<HTMLOrSVGElement> {}

export const ModalClose: React.FC<IProps> = ({ className, onClick }) => (
  <FontAwesomeIcon
    className={className}
    icon={faTimes}
    css={css`
      position: absolute;
      top: 20px;
      right: 20px;
      cursor: pointer;
    `}
    onClick={onClick}
  />
);
