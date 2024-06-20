export const pointToArray = (value: any) => [value.x, value.y];
export const boundsToArray = (value: any) => [value.x, value.y, value.width, value.height];
export const matrixToArray = (value: any) => [value.a, value.b, value.c, value.d, value.tx, value.ty];

export const arrayToPoint = (container: any, prop: string, value: any) => container[prop].set(value[0], value[1]);
export const arrayToBounds = (container: any, prop: string, value: any) => {
  container[prop].x = value[0];
  container[prop].y = value[1];
  container[prop].width = value[2];
  container[prop].height = value[3];
};
export const arrayToMatrix = (container: any, prop: string, value: any) => container[prop].fromArray(value);
