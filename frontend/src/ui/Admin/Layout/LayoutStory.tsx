import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Layout from './Layout';

storiesOf('Admin Layout', module)
  .add('Initial state', () => <Layout />);
