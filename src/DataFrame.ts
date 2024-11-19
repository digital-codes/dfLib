// src/DataFrame.ts

/**
 * Represents a row in a data frame, where each key is a column name and the value can be of any type.
 *
 * @typedef {Record<string, any>} Row
 */
export type Row = Record<string, any>;

/**
 * Represents a DataFrame, a 2-dimensional labeled data structure with columns of potentially different types.
 *
 * @class
 * @example
 * // Creating a DataFrame from an array of rows
 * const df = new DataFrame([
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 30 }
 * ]);
 *
 * // Creating a DataFrame from a 2D array with column names
 * const df2 = new DataFrame([
 *   ['Alice', 25],
 *   ['Bob', 30]
 * ], ['name', 'age']);
 *
 * // Creating a DataFrame from a JSON object
 * const df3 = DataFrame.fromJSON({
 *   name: ['Alice', 'Bob'],
 *   age: [25, 30]
 * });
 *
 * @param {Row[] | any[][]} data - The data to be stored in the DataFrame. It can be either an array of rows (objects) or a 2D array.
 * @param {string[]} [columns] - Optional. The column names for the DataFrame. Required if `data` is a 2D array.
 *
 * @throws {Error} If `data` is a 2D array and `columns` are not provided.
 */
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
      // table input from 2D array with columns
      if (!columns)
        throw new Error("Column names are required for 2D array data.");
      // this.data = (data as any[][]).map((row) => Object.fromEntries(row.map((cell, i) => [columns[i], cell])));
      this.data = (data as any[][]).map((row) =>
        Object.fromEntries(
          columns.map((col, i) => [col, row[i] === undefined ? null : row[i]])
        )
      );
      this.columns = columns;
    } else {
      // record input from array of objects
      // Detect all unique keys across all rows
      const detectedColumns = Array.from(
        new Set(data.flatMap((row) => Object.keys(row)))
      );
      this.columns = columns || detectedColumns;

      // console.log("columns", this.columns)
      // Normalize rows to ensure all rows have all keys, filling missing keys with `null`
      this.data = data.map((row) => {
        const normalizedRow: Row = {};
        this.columns.forEach((col) => {
          normalizedRow[col] = (row as Row).hasOwnProperty(col)
            ? (row as Row)[col]
            : null;
        });
        return normalizedRow;
      });
    }
    this.dtypes = this.detectDtypes();
  }

  // normally, we have tables with header. optionally infer names of columns
  /**
   * Creates a DataFrame from a 2D array.
   *
   * @param data - A 2D array where each sub-array represents a row of data.
   * @param infer - A boolean indicating whether to infer column names or use the first row as column names.
   *                If false, the first row of the array is used as the column names.
   *                If true, column names are inferred as "col1", "col2", etc.
   * @returns A new DataFrame instance.
   */
  static fromArray(data: any[][], infer: boolean = false): DataFrame {
    if (!infer) {
      // Use the first row as the column names
      const colNames = data[0];
      const rowData = data
        .slice(1)
        .map((row) =>
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

  /**
   * Creates a DataFrame instance from a JSON object or an array of rows.
   *
   * @param data - The input data which can be either an array of rows or an object where each key is a column name and each value is an array of column data.
   * @param columns - Optional array of column names. If not provided, column names will be inferred from the keys of the input object.
   * @returns A new DataFrame instance.
   */
  static fromJSON(
    data: Row[] | { [key: string]: any[] },
    columns?: string[]
  ): DataFrame {
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

  // Detects and stores data types for each column
  /**
   * Detects the data types of the columns in the DataFrame.
   * @returns An object where the keys are column names and the values are the detected data types.
   */
  private detectDtypes(): { [key: string]: string | undefined } {
    const types: { [key: string]: string | undefined } = {};

    this.columns.forEach((col) => {
      types[col] = this.detectDtype(col);
    });

    return types;
  }

  /**
   * Detects the data type of a specified column in the DataFrame.
   *
   * @param column - The name of the column to detect the data type for.
   * @returns The detected data type as a string ('number', 'string', or 'mixed'), or `undefined` if the column contains NaN values.
   * @throws Will throw an error if the specified column does not exist in the DataFrame.
   */
  private detectDtype(column: string): string | undefined {
    if (!this.columns.includes(column)) {
      throw new Error(`Column "${column}" does not exist in the DataFrame`);
    }

    const colValues = this.data.map((row) => row[column]);

    // Check for NaN values; if any found, set dtype to undefined
    const hasNaN = colValues.some(
      (value) => typeof value === "number" && isNaN(value)
    );
    if (hasNaN) {
      return undefined;
    } else {
      // Determine column type if there are no NaNs
      const nonNullValues = colValues.filter(
        (value) => value !== null && value !== undefined
      );
      const inferredType = nonNullValues.every(
        (value) => typeof value === "number"
      )
        ? "number"
        : nonNullValues.every((value) => typeof value === "string")
        ? "string"
        : "mixed";

      return inferredType;
    }
  }

  // Accessor method to retrieve dtypes
  /**
   * Retrieves the data types of the DataFrame columns.
   *
   * @returns An object where the keys are column names and the values are their respective data types.
   */
  getDtypes(): { [key: string]: string | undefined } {
    return this.dtypes;
  }

  /**
   * Returns the names of the columns in the DataFrame.
   *
   * @returns {string[]} An array of column names.
   */
  columnNames(): string[] {
    return this.columns;
  }

  // Method to get unique values from a specified column
  /**
   * Returns an array of unique values from the specified column in the DataFrame.
   *
   * @param column - The name of the column from which to extract unique values.
   * @returns An array of unique values from the specified column.
   * @throws Will throw an error if the specified column does not exist in the DataFrame.
   */
  unique(column: string): any[] {
    if (!this.columns.includes(column)) {
      throw new Error(`Column "${column}" does not exist in the DataFrame`);
    }

    const values = this.data.map((row) => row[column]);
    return Array.from(new Set(values));
  }

  // Method to add a new column to the DataFrame
  /**
   * Adds a new column to the DataFrame.
   *
   * @param columnName - The name of the new column to be added.
   * @param values - An array of values or a single value to populate the new column.
   *                 If an array is provided, its length must match the number of rows in the DataFrame.
   *                 If a single value is provided, it will be assigned to all rows.
   *
   * @throws {Error} If the column name already exists in the DataFrame.
   * @throws {Error} If the length of the values array does not match the number of rows in the DataFrame.
   */
  addColumn(columnName: string, values: any[] | any): void {
    if (this.columns.includes(columnName)) {
      throw new Error(`Column "${columnName}" already exists in the DataFrame`);
    }

    // Add the new column to columns array
    this.columns.push(columnName);

    // Determine if a single value or array of values is provided
    if (Array.isArray(values)) {
      if (values.length !== this.data.length) {
        this.columns.pop(); // remove new column name
        throw new Error(
          `Length of values array (${values.length}) does not match the number of rows (${this.data.length})`
        );
      }
      // Add each value in the array to the corresponding row
      this.data = this.data.map((row, i) => ({
        ...row,
        [columnName]: values[i],
      }));
    } else {
      // Single default value provided, so add it to all rows
      this.data = this.data.map((row) => ({ ...row, [columnName]: values }));
    }
    // Update the dtype for the new column
    this.dtypes[columnName] = this.detectDtype(columnName);
  }

  /**
   * Adds a new row of data to the DataFrame.
   * Fills missing keys in the row with `null`.
   * If the row contains new keys, updates the DataFrame to include those keys.
   * @param newRow - An object representing the new row to add.
   */
  addRow(newRow: Row): void {
    // Check for new columns in the incoming row
    const newKeys = Object.keys(newRow).filter(
      (key) => !this.columns.includes(key)
    );
    if (newKeys.length > 0) {
      // Add new keys to the DataFrame's column list
      this.columns.push(...newKeys);

      // Update existing rows with `null` for the new keys
      this.data = this.data.map((row) => {
        newKeys.forEach((key) => {
          row[key] = null;
        });
        return row;
      });
    }

    // Normalize the new row to include all columns
    const normalizedRow: Row = {};
    this.columns.forEach((col) => {
      normalizedRow[col] = newRow.hasOwnProperty(col) ? newRow[col] : null;
    });

    // Add the normalized row to the DataFrame
    this.data.push(normalizedRow);
    this.dtypes = this.detectDtypes();    
  }

  // Method to transpose the DataFrame on a given column
  /**
   * Transposes the DataFrame by converting columns into rows based on a key column.
   *
   * @param {string} keyColumn - The name of the column to use as the key for transposing.
   * @param {string | null} [keyLabel=null] - An optional new label for the key column in the transposed DataFrame.
   * @returns {DataFrame} A new DataFrame with the transposed data.
   *
   * @throws {Error} If the key column does not exist in the DataFrame.
   * @throws {Error} If there are duplicate values in the key column.
   *
   * @example
   * // Given a DataFrame with columns 'A', 'B', and 'C', and 'A' as the key column:
   * // A | B | C
   * // 1 | 2 | 3
   * // 4 | 5 | 6
   * // The transposed DataFrame will have columns 'A', '1', and '4':
   * // A | 1 | 4
   * // B | 2 | 5
   * // C | 3 | 6
   *
   * const df = new DataFrame([
   *   { A: 1, B: 2, C: 3 },
   *   { A: 4, B: 5, C: 6 }
   * ], ['A', 'B', 'C']);
   *
   * const transposedDf = df.transpose('A');
   * console.log(transposedDf.data);
   * // Output:
   * // [
   * //   { A: 'B', 1: 2, 4: 5 },
   * //   { A: 'C', 1: 3, 4: 6 }
   * // ]
   */
  transpose(keyColumn: string, keyLabel: string | null = null): DataFrame {
    if (!this.columns.includes(keyColumn)) {
      throw new Error(`Column "${keyColumn}" does not exist in the DataFrame`);
    }

    // Check for duplicate values in the key column
    const keyValues = this.data.map((row) => row[keyColumn]);
    const uniqueKeys = new Set(keyValues);
    if (uniqueKeys.size !== keyValues.length) {
      throw new Error(
        `Duplicate values found in column "${keyColumn}". Each key must be unique for transposing.`
      );
    }

    // Prepare transposed data
    const transposedData: Row[] = [];
    const otherColumns = this.columns.filter((col) => col !== keyColumn);

    // Build rows by mapping each original column (except keyColumn) to the unique key values
    otherColumns.forEach((col) => {
      const newRow: Row = { [keyColumn]: col };
      this.data.forEach((row) => {
        const key = row[keyColumn];
        newRow[key] = row[col];
      });
      transposedData.push(newRow);
    });

    // Create the new DataFrame with transposed data
    const newDf = new DataFrame(transposedData, [
      keyColumn,
      ...Array.from(uniqueKeys),
    ]);
    //
    if (keyLabel) {
      newDf.renameColumns({ [keyColumn]: keyLabel });
    }
    return newDf;
  }

  /**
   * Converts the DataFrame to a JSON representation.
   *
   * @param records - If true, returns an array of row objects (default). If false, returns an object with arrays for each column.
   * @returns An array of row objects if `records` is true, otherwise an object with arrays for each column.
   */
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

  /**
   * Converts the DataFrame into a 2D array.
   *
   * @param includeHeader - A boolean indicating whether to include the header row (column names) in the output array. Defaults to `true`.
   * @returns A 2D array representation of the DataFrame. If `includeHeader` is `true`, the first row will contain the column names.
   */
  toArray(includeHeader: boolean = true): any[][] {
    const rows = this.data.map((row) => this.columns.map((col) => row[col]));
    if (includeHeader) {
      return [this.columns, ...rows];
    }
    return rows;
  }

  /**
   * Fills NA values in the dataframe with a specified value, forward fill, or backfill.
   * @param value - The value to fill NA cells with (only used if method is 'value').
   * @param method - The method to use for filling NA cells: 'value', 'ffill', or 'bfill'.
   */
  // Inside DataFrame.ts
  fillNA(
    value: any = null,
    method: "value" | "ffill" | "bfill" = "value"
  ): void {
    if (method === "value") {
      this.data = this.data.map((row) => {
        const newRow = { ...row };
        this.columns.forEach((col) => {
          if (newRow[col] == null) newRow[col] = value;
        });
        return newRow;
      });
    } else if (method === "ffill") {
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
    } else if (method === "bfill") {
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

  // Method to get the total number of rows
  /**
   * Returns the number of rows in the DataFrame.
   *
   * @returns {number} The count of rows in the DataFrame.
   */
  count(): number {
    return this.data.length;
  }

  // Count number of non-null values in the column
  /**
   * Counts the number of non-null, non-undefined, and numeric values in a specified column.
   *
   * @param column - The name of the column to count values in.
   * @returns The count of valid values in the specified column.
   */
  valueCount(column: string): number {
    return this.data.reduce((acc, row) => {
      const value = row[column];
      return (
        acc + (value !== null && value !== undefined && !isNaN(value) ? 1 : 0)
      );
    }, 0);
  }

  // Calculate mean (average) for the column
  /**
   * Calculates the mean (average) of the specified column in the DataFrame.
   *
   * @param column - The name of the column for which to calculate the mean.
   * @returns The mean of the column values. Returns NaN if the column has no numeric values.
   */
  mean(column: string): number {
    const values = this.data
      .map((row) => row[column])
      .filter(
        (value) => typeof value === "number" && !isNaN(value)
      ) as number[];
    if (values.length === 0) return NaN;
    const sum = values.reduce((acc, value) => acc + value, 0);
    return sum / values.length;
  }

  // Calculate the minimum value in the column
  /**
   * Calculates the minimum value in a specified column of the DataFrame.
   *
   * @param column - The name of the column to find the minimum value in.
   * @returns The minimum value in the specified column. If the column contains no numeric values, returns NaN.
   */
  min(column: string): number {
    const values = this.data
      .map((row) => row[column])
      .filter(
        (value) => typeof value === "number" && !isNaN(value)
      ) as number[];
    return values.length > 0 ? Math.min(...values) : NaN;
  }

  // Calculate the maximum value in the column
  /**
   * Returns the maximum value in the specified column.
   *
   * @param column - The name of the column to find the maximum value in.
   * @returns The maximum value in the column, or NaN if the column has no numeric values.
   */
  max(column: string): number {
    const values = this.data
      .map((row) => row[column])
      .filter(
        (value) => typeof value === "number" && !isNaN(value)
      ) as number[];
    return values.length > 0 ? Math.max(...values) : NaN;
  }

  /**
   * Selects specific columns from the DataFrame and returns a new DataFrame containing only those columns.
   *
   * @param columns - An array of column names to be selected.
   * @returns A new DataFrame containing only the specified columns.
   */
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

  /**
   * Selects rows from the DataFrame that match the specified filter criteria.
   *
   * @param filter - An object where the keys are column names and the values are the values to filter by.
   * @returns A new DataFrame containing only the rows that match the filter criteria.
   */
  selectRows(filter: { [key: string]: any }): DataFrame {
    const filteredData = this.data.filter((row) => {
      return Object.entries(filter).every(([col, value]) => row[col] === value);
    });
    return new DataFrame(filteredData, this.columns);
  }

  /**
   * Drops the specified columns from the DataFrame.
   *
   * @param columns - An array of column names to be removed from the DataFrame.
   * @returns A new DataFrame instance with the specified columns removed.
   */
  dropCols(columns: string[]): DataFrame {
    const newData = this.data.map((row) => {
      const newRow: Row = { ...row };
      columns.forEach((col) => delete newRow[col]);
      return newRow;
    });
    return new DataFrame(newData);
  }

  /**
   * Joins the current DataFrame with another DataFrame based on the specified columns and join type.
   *
   * @param other - The DataFrame to join with.
   * @param on - The column name or an array of column names to join on.
   * @param how - The type of join to perform. Can be 'inner', 'left' Defaults to 'inner'.
   *
   * @returns A new DataFrame resulting from the join operation.
   */
  //join(other: DataFrame, on: string | string[], how: 'inner' | 'left' | 'right' | 'outer' = 'inner'): DataFrame {
  join(
    other: DataFrame,
    on: string | string[],
    how: "inner" | "left" = "inner"
  ): DataFrame {
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
        matches.forEach((match) => {
          const updatedMatch = { ...match };
          if (Array.isArray(on)) {
            on.forEach((key) => delete updatedMatch[key]);
          } else {
            delete updatedMatch[on];
          }
          Object.keys(updatedMatch).forEach((key) => {
            if (row.hasOwnProperty(key)) {
              updatedMatch[`${key}_r`] = updatedMatch[key];
              delete updatedMatch[key];
            }
          });
          joinedData.push({ ...row, ...updatedMatch });
        });
        //      } else if (how === 'left' || how === 'outer') {
      } else if (how === "left") {
        joinedData.push(row);
      }
    });
    /*
    if (how === 'right' || how === 'outer') {
      otherData.forEach((otherRow) => {
        if (!this.data.some((row) => isMatch(row, otherRow))) {
          joinedData.push(otherRow);
        }
      });
    }
    */

    return new DataFrame(joinedData);
  }

  /**
   * Renames the columns of the DataFrame based on the provided rename map.
   *
   * @param renameMap - An object where the keys are the current column names and the values are the new column names.
   *
   * @remarks
   * This method updates both the `columns` array and each row in the `data` to reflect the new column names.
   * If a column name in the `columns` array does not exist in the `renameMap`, it will remain unchanged.
   * Similarly, if a key in a row does not exist in the `renameMap`, it will remain unchanged.
   *
   * @example
   * ```typescript
   * const df = new DataFrame({
   *   columns: ['name', 'age'],
   *   data: [
   *     { name: 'Alice', age: 25 },
   *     { name: 'Bob', age: 30 }
   *   ]
   * });
   *
   * df.renameColumns({ name: 'fullName', age: 'years' });
   *
   * console.log(df.columns); // ['fullName', 'years']
   * console.log(df.data); // [{ fullName: 'Alice', years: 25 }, { fullName: 'Bob', years: 30 }]
   * ```
   */
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
