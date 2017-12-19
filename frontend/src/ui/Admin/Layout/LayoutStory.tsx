import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Layout from './Layout';
import WithIntl from '../../Common/WithIntl';

const LayoutWithIntl: React.SFC<{}> = WithIntl(Layout);

storiesOf('Admin Layout', module)
  .add('Initial state', () => <LayoutWithIntl/>);
