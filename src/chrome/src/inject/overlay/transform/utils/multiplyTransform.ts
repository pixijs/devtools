import type { Matrix } from 'pixi.js';
import { decomposeTransform } from './decomposeTransform';

import type { Container } from 'pixi.js';
import { getPixiObject } from './getPixiObject';

let tempMatrix: Matrix;
let tempParentMatrix: Matrix;

/**
 * Multiplies the transformation matrix {@code transform} to the display-object's transform.
 *
 * @ignore
 * @param displayObject
 * @param transform
 * @param skipUpdate
 */
export function multiplyTransform(displayObject: Container, transform: Matrix, skipUpdate?: boolean): void {
  if (!tempMatrix) {
    const Mat = getPixiObject('Matrix');
    tempMatrix = new Mat();
    tempParentMatrix = new Mat();
  }

  if (!skipUpdate) {
    if (displayObject.enableTempParent) {
      const parent = !displayObject.parent ? displayObject.enableTempParent() : displayObject.parent;

      displayObject.updateTransform();
      displayObject.disableTempParent(parent);
    } else {
      displayObject.updateLocalTransform();
    }
  }

  const worldTransform = displayObject.worldTransform;
  const parentTransform = displayObject.parent
    ? tempParentMatrix.copyFrom(displayObject.parent.worldTransform)
    : getPixiObject('Matrix').IDENTITY;

  tempMatrix.copyFrom(worldTransform);
  tempMatrix.prepend(transform);
  tempMatrix.prepend(parentTransform.invert()); // gets new "local" transform

  if (displayObject.enableTempParent) {
    decomposeTransform(displayObject.transform, tempMatrix);
  } else {
    decomposeTransform(displayObject, tempMatrix);
  }
}
