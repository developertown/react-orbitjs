// NOTE: for legacy reasons / compatibility with upstream,
//       all the data* names need to be maintained
//       a major version update will remove those in favor of
//       - OrbitProvider
//       - withOrbit

export {
  OrbitProvider,
  DataProvider,
  IProps as IOrbitProviderProps,
  IProvidedProps as ILegacyProvidedProps,
} from './components/data-provider';

export { APIProvider, IProps as IAPIProps } from './components/api-provider';

export { withOrbit, withData } from './components/with-data';

export { MapRecordsToProps } from './components/shared';

export { query, IProvidedProps as IQueryProps } from './components/query';

export { default as strategies } from './strategies';

export * from './hooks';

// TODO: why can't I import from subdirectories in the built package?
export * from './components/errors';
export * from './utils';
