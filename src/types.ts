import type { Table } from './utils';

/** one element in data */
export type ItemData = {
  /** time */
  t: string;
  /** value */
  v: number;
};

export interface DataSources {
  [Table.Temperature]: ItemData[];
  [Table.Precipitation]: ItemData[];
}
