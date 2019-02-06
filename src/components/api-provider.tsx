import * as React from 'react';
import { DataProvider } from 'react-orbitjs';
import Store from '@orbit/store';
import { Source } from '@orbit/data';

import { ICreateStoreResult } from '~/strategies/pessimistic-with-remote-ids';

export interface IProps {
  storeCreator: () => Promise<ICreateStoreResult>;
}

interface IState {
  store?: Store;
  sources?: { [sourceName: string]: Source };
}

export class APIProvider extends React.Component<IProps, IState> {
  state = { store: undefined, sources: undefined };

  constructor(props: any) {
    super(props);

    this.initDataStore.bind(this)();
  }

  async initDataStore() {
    const { store, sources } = await this.props.storeCreator();

    this.setState({ store, sources });
  }

  render() {
    const { store, sources } = this.state;

    if (!store || !sources) {
      return null;
    }

    return (
      <DataProvider dataStore={store} sources={sources}>
        {this.props.children}
      </DataProvider>
    );
  }
}
