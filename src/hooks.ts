import { useContext } from 'react';
import { OrbitContext } from './components/orbit-context';

export function useOrbit() {
  return useContext(OrbitContext);
}
