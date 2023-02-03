import { Table } from './utils';

/** one element in data */
export type ItemData = {
  /** time */
  t: string;
  /** value */
  v: number;
};

export enum DataType {
  Temperature = Table.Temperature,
  Precipitation = Table.Precipitation,
}
