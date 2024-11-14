// src/DataFrame.ts

/**
 * Represents a row in a data frame, where each key is a column name and the value can be of any type.
 * 
 * @typedef {Record<string, any>} Row
 */
type Row = Record<string, any>;

export class DataFrame {
  private data: Row[];
  private columns: string[] = [];
  private dtypes: { [key: string]: string | undefined };

  /**
   * Constructs a new DataFrame instance.
   * 
   * @param data - The data to be stored in the DataFrame. It can be either an array of rows (objects) or a 2D array.
   * @param columns - Optional. The column names for the DataFrame. Required if `data` is a 2D array.
   * 
   * @throws {Error} If `data` is a 2D array and `columns` are not provided.
   */
  constructor(data: Row[] | any[][], columns?: string[]) {
    if (Array.isArray(data) && Array.isArray(data[0])) {
      if (!columns) throw new Error("Column names are required for 2D array data.");
      this.data = (data as any[][]).map((row) => Object.fromEntries(row.map((cell, i) => [columns[i], cell])));
      this.columns = columns
    } else {
      this.data = data as Row[];
      this.columns = columns || Object.keys(this.data[0] || {});
    }
    this.dtypes = this.detectDtypes();
  }

  // Detects and stores data types for each column
  /**
   * Detects the data types of the columns in the DataFrame.
   * 
   * This method iterates over each column in the DataFrame and determines the data type
   * of the column based on its values. If any value in the column is NaN, the data type
   * for that column is set to `undefined`. Otherwise, it checks the types of non-null
   * and non-undefined values to infer the column type. The inferred type can be 'number',
   * 'string', or 'mixed'.
   * 
   * @returns {Object} An object where the keys are column names and the values are the
   * inferred data types ('number', 'string', 'mixed', or `undefined`).
   */
  private detectDtypes(): { [key: string]: string | undefined } {
    const types: { [key: string]: string | undefined } = {};

    this.columns.forEach((col) => {
      const colValues = this.data.map((row) => row[col]);

      // Check for NaN values; if any found, set dtype to undefined
      const hasNaN = colValues.some((value) => typeof value === 'number' && isNaN(value));
      if (hasNaN) {
        types[col] = undefined;
      } else {
        // Determine column type if there are no NaNs
        const nonNullValues = colValues.filter((value) => value !== null && value !== undefined);
        const inferredType = nonNullValues.every((value) => typeof value === 'number')
          ? 'number'
          : nonNullValues.every((value) => typeof value === 'string')
            ? 'string'
            : 'mixed';

        types[col] = inferredType;
      }
    });

    return types;
  }

  // Accessor method to retrieve dtypes
  getDtypes(): { [key: string]: string | undefined } {
    return this.dtypes;
  }

  // normally, we have tables with header. optionally infer names of columns
  static fromArray(data: any[][], infer: boolean = false): DataFrame {
    if (!infer) {
      // Use the first row as the column names
      const colNames = data[0];
      const rowData = data.slice(1).map((row) =>
        Object.fromEntries(colNames.map((col, i) => [col, row[i]]))
      );
      return new DataFrame(rowData, colNames);
    } else {
      // Use provided columns or infer names as "col1", "col2", etc.
      const inferredColumns = data[0].map((_, i) => `col${i + 1}`);
      const rowData = data.map((row) =>
        Object.fromEntries(inferredColumns.map((col, i) => [col, row[i]]))
      );
      return new DataFrame(rowData, inferredColumns);
    }
  }

  static fromJSON(data: Row[] | { [key: string]: any[] }, columns?: string[]): DataFrame {
    if (Array.isArray(data)) {
      // Array of rows
      return new DataFrame(data);
    } else {
      // Object where each key is a column name and each value is an array of column data
      const colNames = Object.keys(data);
      const rowCount = data[colNames[0]].length;
      const rowData = Array.from({ length: rowCount }, (_, i) =>
        Object.fromEntries(colNames.map((col) => [col, data[col][i]]))
      );
      return new DataFrame(rowData, colNames);
    }
  }

  columnNames(): string[] {
    return this.columns;
  }

  toJSON(records: boolean = true): Row[] | { [key: string]: any[] } {
    if (records) {
      // Default row-oriented export (array of row objects)
      return this.data;
    } else {
      // Column-oriented export (object with arrays for each column)
      const columnsData: { [key: string]: any[] } = {};
      this.columns.forEach((col) => {
        columnsData[col] = this.data.map((row) => row[col]);
      });
      return columnsData;
    }
  }


  toArray(includeHeader: boolean = true): any[][] {
    const rows = this.data.map((row) => this.columns.map((col) => row[col]));
    if (includeHeader) {
      return [this.columns, ...rows];
    }
    return rows;
  }

  /*
  detectTypes(): Record<string, string> {
    const types: Record<string, string> = {};
    this.columns.forEach((col) => {
      const colTypes = this.data.map((row) => typeof row[col]);
      types[col] = colTypes.every((type) => type === "number") ? "number" : "string";
    });
    return types;
  }
*/
  // Inside DataFrame.ts
  detectTypes(): Record<string, string> {
    const types: Record<string, string> = {};
    this.columns.forEach((col) => {
      const colTypes = this.data
        .map((row) => row[col])
        .filter((value) => value !== null) // Exclude null values from type check
        .map((value) => typeof value);

      types[col] = colTypes.every((type) => type === 'number') ? 'number' : 'string';
    });
    return types;
  }


  /*
  fillNA(value: any): void {
    this.data = this.data.map((row) => {
      const newRow = { ...row };
      this.columns.forEach((col) => {
        if (newRow[col] == null) newRow[col] = value;
      });
      return newRow;
    });
  }
*/
  /**
    * Fills NA values in the dataframe with a specified value, forward fill, or backfill.
    * @param value - The value to fill NA cells with (only used if method is 'value').
    * @param method - The method to use for filling NA cells: 'value', 'ffill', or 'bfill'.
    */
  // Inside DataFrame.ts
  fillNA(value: any = null, method: 'value' | 'ffill' | 'bfill' = 'value'): void {
    if (method === 'value') {
      this.data = this.data.map((row) => {
        const newRow = { ...row };
        this.columns.forEach((col) => {
          if (newRow[col] == null) newRow[col] = value;
        });
        return newRow;
      });
    } else if (method === 'ffill') {
      let lastValid: Record<string, any> = {};
      this.data = this.data.map((row) => {
        const newRow = { ...row };
        this.columns.forEach((col) => {
          if (newRow[col] == null && lastValid[col] !== undefined) {
            newRow[col] = lastValid[col];
          } else if (newRow[col] != null) {
            lastValid[col] = newRow[col];
          }
        });
        return newRow;
      });
    } else if (method === 'bfill') {
      let nextValid: Record<string, any> = {};
      for (let i = this.data.length - 1; i >= 0; i--) {
        const row = this.data[i];
        const newRow = { ...row };
        this.columns.forEach((col) => {
          if (newRow[col] == null && nextValid[col] !== undefined) {
            newRow[col] = nextValid[col];
          } else if (newRow[col] != null) {
            nextValid[col] = newRow[col];
          }
        });
        this.data[i] = newRow;
      }
    }
  }


  selectCols(columns: string[]): DataFrame {
    const newData = this.data.map((row) => {
      const newRow: Row = {};
      columns.forEach((col) => {
        newRow[col] = row[col];
      });
      return newRow;
    });
    return new DataFrame(newData);
  }

  selectRows(filter: { [key: string]: any }): DataFrame {
    const filteredData = this.data.filter((row) => {
      return Object.entries(filter).every(([col, value]) => row[col] === value);
    });
    return new DataFrame(filteredData, this.columns);
  }



  drop(columns: string[]): DataFrame {
    const newData = this.data.map((row) => {
      const newRow: Row = { ...row };
      columns.forEach((col) => delete newRow[col]);
      return newRow;
    });
    return new DataFrame(newData);
  }

  /*
  join(other: DataFrame, on: string, how: "inner" | "left" | "right" | "outer" = "inner"): DataFrame {
    const joinedData: Row[] = [];
    const otherData = other.toJSON();
 
    this.data.forEach((row) => {
      const match = otherData.find((otherRow) => row[on] === otherRow[on]);
      if (match) {
        joinedData.push({ ...row, ...match });
      } else if (how === "left" || how === "outer") {
        joinedData.push(row);
      }
    });
 
    if (how === "right" || how === "outer") {
      otherData.forEach((otherRow) => {
        if (!this.data.find((row) => row[on] === otherRow[on])) {
          joinedData.push(otherRow);
        }
      });
    }
 
    return new DataFrame(joinedData);
  }
*/
  join(other: DataFrame, on: string | string[], how: 'inner' | 'left' | 'right' | 'outer' = 'inner'): DataFrame {
    const joinedData: Row[] = [];
    const otherData = other.toJSON() as Row[];

    const isMatch = (row1: Row, row2: Row) => {
      if (Array.isArray(on)) {
        return on.every((key) => row1[key] === row2[key]);
      } else {
        return row1[on] === row2[on];
      }
    };

    this.data.forEach((row) => {
      const matches = otherData.filter((otherRow) => isMatch(row, otherRow));
      if (matches.length > 0) {
        matches.forEach((match) => joinedData.push({ ...row, ...match }));
      } else if (how === 'left' || how === 'outer') {
        joinedData.push(row);
      }
    });

    if (how === 'right' || how === 'outer') {
      otherData.forEach((otherRow) => {
        if (!this.data.some((row) => isMatch(row, otherRow))) {
          joinedData.push(otherRow);
        }
      });
    }

    return new DataFrame(joinedData);
  }

  renameColumns(renameMap: { [key: string]: string }): void {
    // Update columns array
    this.columns = this.columns.map((col) => renameMap[col] || col);

    // Update each row in the data
    this.data = this.data.map((row) => {
      const newRow: Row = {};
      for (const key in row) {
        newRow[renameMap[key] || key] = row[key];
      }
      return newRow;
    });
  }

}



export default DataFrame;
