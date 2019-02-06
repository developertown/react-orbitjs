react-orbitjs
=============

[![Build Status](https://travis-ci.com/developertown/react-orbitjs.svg?branch=master)](https://travis-ci.com/developertown/react-orbitjs)
[![Maintainability](https://api.codeclimate.com/v1/badges/9755e12c66ccc470efad/maintainability)](https://codeclimate.com/github/developertown/react-orbitjs/maintainability)

[React](https://reactjs.org/) bindings for [Orbit.js](http://orbitjs.com/).

This package attempts to make it easier to work with
[Orbit.js](http://orbitjs.com/) in a [React](https://reactjs.org/)
environment. In a nutshell it's a transform listener, updating
a component props with records as they are changed. If you're familiar
with [redux](https://github.com/reactjs/redux/) in combination with
[react-redux](https://github.com/reactjs/react-redux), you already know
how to use this package.

Installation
------------

_react-orbitjs requires React 16 and Orbit 0.15 or later._

_yarn_

```
yarn add developertown/react-orbitjs
```
Note: there is no published npm package at the moment, but part of C.I. is testing the latest build against projects that use this library.

See: "External partner tests" in travis.

API
---

 - Context / Data Store Access
   - [`APIProvider`](#apiprovider-)
   - [`OribtProvider`](#orbitprovider-)
   - [`withOrbit`](#orbitprovider)

 - Utilities
   - [`query`](#query)
   - [`strategies`](#strategies)
     - [`pessimisticWithRemoteIds`](#pessimisticwithremoteids)
  - Errors 
    - [`ErrorMessage`](#errormessage)
    - [`parseError`](#parseerror)
  - Utils
    - [`pushPayload`](#pushpayload)
    - [`recordIdentityFrom`](#recordidentityfrom)
    - [`localIdFromRecordIdentity`](#localidfromrecordidentity)
    - [`remoteIdentityFrom`](#remoteidentityfrom)
    - [`attributesFor`](#attributesfor)


---------------------------

### `<APIProvider />`

The default ContextProvider that should be used in most applications. This will allow `withOrbit` and `query` to be used througout the application.

```tsx
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { APIProvider, strategies } from 'react-orbitjs';

// application imports
import { baseUrl } from '@data/store';
import { ReduxProvider } from '@store';
import { schema, keyMap } from '@data/schema';
import RootRoute from './routes/root';

export default class Application extends React.Component {
  render() {
    return (
      <APIProvider
        storeCreator={() =>
          strategies.pessimisticWithRemoteIds.createStore(baseUrl, schema, keyMap)
        }
      >
        <ReduxProvider>
          <BrowserRouter>
            <RootRoute />
          </BrowserRouter>
        </ReduxProvider>
      </APIProvider>
    );
  }
}

```

### `<OrbitProvider />`

Used for creating a Wrapper Context Provider to abstract away the creation of the orbit.js datastore.

Example from [`APIProvider`](#apiprovider-)

```tsx
import * as React from 'react';
import { OrbitProvider } from 'react-orbitjs';
import Store from '@orbit/store';
import { Source } from '@orbit/data';

import { ICreateStoreResult } from '~/strategies/pessimistic-with-remote-ids';

interface IProps {
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

```


### `withOrbit`

`withOrbit` is a Higher-order Component that provides access to the store and data sources. It also allows you to subscribe to changes to the default store's cache.

```ts
import { withOrbit } from 'react-orbitjs';
import { compose } from 'recompose';
import { withRouter } from 'react-router';

import Display from './display';

export default compose(
  withRouter,
  withOrbit(({ project }) => ({
    // all of these will be passed as props to `Display` and will cause re-renders if any of 
    // the underlying data in the store for these records / queries changes
    project: (q) => q.findRecord(project),
    organization: (q) => q.findRelatedRecord(project, 'organization'),
    owner: (q) => q.findRelatedRecord(project, 'owner'),
    group: (q) => q.findRelatedRecord(project, 'group'),
    products: (q) => q.findRelatedRecords(project, 'products'),
  }))
)(Display);

```

### `query`

`query` will make a network request directly using the `remote` data source.

```ts
import { query } from 'react-orbitjs';
import { compose } from 'recompose';

import Display from './display';

return compose(
  query(() => {
    return {
      users: [
        (q) => q.findRecords(USER),
        {
          label: 'Get Users for User Input Select',
          sources: {
            remote: {
              settings: { ...defaultSourceOptions() },
              include: ['group-memberships.group', 'organization-memberships.organization'],
            },
          },
        },
      ],
    };
  }),
)(Display);
```

### `strategies`

```ts
import { strategies, APIProvider } from 'react-orbitjs';


```

### `pessimisticWithRemoteIds`

```ts
import { strategies } from 'react-orbitjs';

const strategy = strategies.pessimisticWithRemoteIds;


```

### `<ErrorMessage />`

```ts
import { ErrorMessage } from 'react-orbitjs';


```

### `parseError`

```ts
import { parseError } from 'react-orbitjs';


```

### `pushPayload`

```ts
import { pushPayload } from 'react-orbitjs';


```

### `recordIdentityFrom`

```ts
import { recordIdentityFrom } from 'react-orbitjs';


```

### `localIdFromRecordIdentity`

```ts
import { localIdFromRecordIdentity } from 'react-orbitjs';


```

### `remoteIdentityFrom`

```ts
import { remoteIdentityFrom } from 'react-orbitjs';


```

### `attributesFor`

```ts
import { attributesFor } from 'react-orbitjs';


```


License
-------

MIT
