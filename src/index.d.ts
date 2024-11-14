// index.d.ts

type Row = Record<string, any>;

interface DataFrameOptions {
  columns?: string[]; // Optional columns for array-based data
}

interface JoinOptions {
  how?: 'inner' | 'left' | 'right' | 'outer';
}

declare class DataFrame {
  private data: Row[];
  private columns: string[];
  private dtypes: { [key: string]: string | undefined };

  constructor(data: Row[] | any[][], options?: DataFrameOptions);

  // method to get data types of columns
  getDtypes() : { [key: string]: string | undefined } ;

  // Method to rename one or more columns
  renameColumns(renameMap: { [key: string]: string }): void;

  // Method to select rows by specific column values
  selectRows(filter: { [key: string]: any }): DataFrame;

  // Method to join with another DataFrame
  join(
    other: DataFrame,
    on: string | string[],
    how?: 'inner' | 'left' | 'right' | 'outer'
  ): DataFrame;

  // Method to export data as JSON
  toJSON(records?: boolean): Row[] | { [key: string]: any[] };

  // Method to export data as a 2D array with an optional header row
  toArray(includeHeader?: boolean): any[][];

  // Static method to create a DataFrame from JSON (array of rows or array of columns)
  static fromJSON(data: Row[] | { [key: string]: any[] }, columns?: string[]): DataFrame;

  // Static method to create a DataFrame from a 2D array, with optional column names and header flag
  static fromArray(data: any[][], columns?: string[] | null, header?: boolean): DataFrame;
}

export = DataFrame;
