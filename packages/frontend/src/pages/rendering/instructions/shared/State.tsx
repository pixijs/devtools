import React from 'react';
import type { StateData } from '../Instructions';

export const State: React.FC<StateData> = ({
  blend,
  blendMode,
  clockwiseFrontFace,
  cullMode,
  culling,
  depthMask,
  depthTest,
  offsets,
  polygonOffset,
}) => {
  return (
    <div className="ml-2 text-sm text-white">
      <div className="text-lg">State</div>
      <div>State Blend: {blend ? 'true' : 'false'}</div>
      <div>State BlendMode: {blendMode}</div>
      <div>State Clockwise Front Face: {clockwiseFrontFace ? 'true' : 'false'}</div>
      <div>State CullMode: {cullMode}</div>
      <div>State Culling: {culling ? 'true' : 'false'}</div>
      <div>State Depth Mask: {depthMask ? 'true' : 'false'}</div>
      <div>State Depth Test: {depthTest ? 'true' : 'false'}</div>
      <div>State Offsets: {offsets ? 'true' : 'false'}</div>
      <div>State Polygon Offset: {polygonOffset}</div>
    </div>
  );
};
