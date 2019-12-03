import * as React from 'react';

import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router';

import { DeleteModalPresenter, IProps as IPresenterProps } from './DeleteModalPresenter';
import { DeleteModalView } from './DeleteModalView';

const ConnectedDeleteModalPresenter = withRouter(DeleteModalPresenter);

export const DeleteModalContainer = (props: Omit<IPresenterProps, 'View'>) => (
  <ConnectedDeleteModalPresenter View={injectIntl(DeleteModalView)} {...props} />
);
