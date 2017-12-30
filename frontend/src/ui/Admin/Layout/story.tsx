import * as React from 'react';
import { storiesOf } from '@storybook/react';
import LayoutComponent from './Layout';
import withIntl from '../../../stories/withIntl';

const Layout = withIntl(LayoutComponent);

storiesOf('Admin Layout', module)
  .add('Initial state', () => <Layout/>);
