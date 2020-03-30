/** @jsx jsx */
import { jsx } from '@emotion/core';
import { IntlShape } from 'react-intl';

import { Box } from 'src/components/common/Box/Box';
import { Modal } from 'src/components/common/Modal/Modal';
import { ModalBackground } from 'src/components/common/ModalBackground/ModalBackground';
import { ModalClose } from 'src/components/common/ModalClose/ModalClose';
import { ModalContent } from 'src/components/common/ModalContent/ModalContent';
import { Title } from 'src/components/common/Title/Title';
import { LoginFormContainer } from 'src/components/Login/LoginForm/LoginFormContainer';
import { IViewProps as IProps } from 'src/components/Login/LoginPage/LoginPagePresenter';
import { textCenterMixin } from 'src/styles/mixins';



export const LoginPageView = ({ intl, isOpen, onClose }: IProps & { intl: IntlShape }) => (
  <Modal isOpen={isOpen}>
    <ModalBackground />
    <ModalContent>
      <Box>
        <Title css={textCenterMixin} size={3}>
          {intl.formatMessage({ id: 'LoginPage.title' })}
        </Title>
        <LoginFormContainer />
      </Box>
    </ModalContent>
    <ModalClose className="is-large" onClick={onClose} />
  </Modal>
);
