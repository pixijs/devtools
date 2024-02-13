import React from 'react';
import CollapsibleComponent from '../collapsible/Collapsible';
import { Inspector } from './Inspector';
import { Stats } from './Stats';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SceneComponentProps {}

export const SceneComponent: React.FC<SceneComponentProps> = () => {
  console.log('rendering scene');
  return (
    <>
      <CollapsibleComponent title={'Stats'}>
        <Stats />
      </CollapsibleComponent>
      <CollapsibleComponent title={'Inspector'}>
        <Inspector />
      </CollapsibleComponent>
    </>
  );
};
