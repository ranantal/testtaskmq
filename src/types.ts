/** one element in data */
export type ItemData = {
  /** time */
  t: string;
  /** value */
  v: number;
};

export enum DATA_TYPES {
  TEMP = 'temperature',
  PREC = 'precipitation',
}
