import { useContext } from 'react';
import { OrbitContext } from './components/orbit-context';
import { IProps as IOrbitProviderProps } from './components/data-provider';

export function useOrbit() {
  return useContext<IOrbitProviderProps>(OrbitContext);
}
