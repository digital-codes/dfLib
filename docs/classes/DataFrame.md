[**dflib v0.1.7**](../README.md)

***

[dflib](../globals.md) / DataFrame

# Class: DataFrame

Defined in: [DataFrame.ts:38](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L38)

Represents a DataFrame, a 2-dimensional labeled data structure with columns of potentially different types.

## Example

```ts
// Creating a DataFrame from an array of rows
const df = new DataFrame([
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 }
]);

// Creating a DataFrame from a 2D array with column names
const df2 = new DataFrame([
  ['Alice', 25],
  ['Bob', 30]
], ['name', 'age']);

// Creating a DataFrame from a JSON object
const df3 = DataFrame.fromJSON({
  name: ['Alice', 'Bob'],
  age: [25, 30]
});
```

## Param

The data to be stored in the DataFrame. It can be either an array of rows (objects) or a 2D array.

## Param

Optional. The column names for the DataFrame. Required if `data` is a 2D array.

## Throws

If `data` is a 2D array and `columns` are not provided.

## Constructors

### Constructor

> **new DataFrame**(`data`, `columns?`): `DataFrame`

Defined in: [DataFrame.ts:51](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L51)

Constructs a new DataFrame instance.

#### Parameters

##### data

The data to be stored in the DataFrame. It can be either an array of rows (objects) or a 2D array.

[`Row`](../type-aliases/Row.md)[] | `any`[][]

##### columns?

`string`[]

Optional. The column names for the DataFrame. Required if `data` is a 2D array.

#### Returns

`DataFrame`

#### Throws

If `data` is a 2D array and `columns` are not provided.

## Methods

### addColumn()

> **addColumn**(`columnName`, `values`): `void`

Defined in: [DataFrame.ts:242](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L242)

Adds a new column to the DataFrame.

#### Parameters

##### columnName

`string`

The name of the new column to be added.

##### values

`any`

An array of values or a single value to populate the new column.
                If an array is provided, its length must match the number of rows in the DataFrame.
                If a single value is provided, it will be assigned to all rows.

#### Returns

`void`

#### Throws

If the column name already exists in the DataFrame.

#### Throws

If the length of the values array does not match the number of rows in the DataFrame.

***

### addRow()

> **addRow**(`newRow`): `void`

Defined in: [DataFrame.ts:277](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L277)

Adds a new row of data to the DataFrame.
Fills missing keys in the row with `null`.
If the row contains new keys, updates the DataFrame to include those keys.

#### Parameters

##### newRow

[`Row`](../type-aliases/Row.md)

An object representing the new row to add.

#### Returns

`void`

***

### columnNames()

> **columnNames**(): `string`[]

Defined in: [DataFrame.ts:209](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L209)

Returns the names of the columns in the DataFrame.

#### Returns

`string`[]

An array of column names.

***

### count()

> **count**(): `number`

Defined in: [DataFrame.ts:468](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L468)

Returns the number of rows in the DataFrame.

#### Returns

`number`

The count of rows in the DataFrame.

***

### dropCols()

> **dropCols**(`columns`): `DataFrame`

Defined in: [DataFrame.ts:574](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L574)

Drops the specified columns from the DataFrame.

#### Parameters

##### columns

`string`[]

An array of column names to be removed from the DataFrame.

#### Returns

`DataFrame`

A new DataFrame instance with the specified columns removed.

***

### fillNA()

> **fillNA**(`value`, `method`): `void`

Defined in: [DataFrame.ts:420](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L420)

Fills NA values in the dataframe with a specified value, forward fill, or backfill.

#### Parameters

##### value

`any` = `null`

The value to fill NA cells with (only used if method is 'value').

##### method

The method to use for filling NA cells: 'value', 'ffill', or 'bfill'.

`"value"` | `"ffill"` | `"bfill"`

#### Returns

`void`

***

### getDtypes()

> **getDtypes**(): `object`

Defined in: [DataFrame.ts:200](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L200)

Retrieves the data types of the DataFrame columns.

#### Returns

`object`

An object where the keys are column names and the values are their respective data types.

***

### join()

> **join**(`other`, `on`, `how`): `DataFrame`

Defined in: [DataFrame.ts:593](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L593)

Joins the current DataFrame with another DataFrame based on the specified columns and join type.

#### Parameters

##### other

`DataFrame`

The DataFrame to join with.

##### on

The column name or an array of column names to join on.

`string` | `string`[]

##### how

The type of join to perform. Can be 'inner', 'left' Defaults to 'inner'.

`"inner"` | `"left"`

#### Returns

`DataFrame`

A new DataFrame resulting from the join operation.

***

### max()

> **max**(`column`): `number`

Defined in: [DataFrame.ts:529](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L529)

Returns the maximum value in the specified column.

#### Parameters

##### column

`string`

The name of the column to find the maximum value in.

#### Returns

`number`

The maximum value in the column, or NaN if the column has no numeric values.

***

### mean()

> **mean**(`column`): `number`

Defined in: [DataFrame.ts:495](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L495)

Calculates the mean (average) of the specified column in the DataFrame.

#### Parameters

##### column

`string`

The name of the column for which to calculate the mean.

#### Returns

`number`

The mean of the column values. Returns NaN if the column has no numeric values.

***

### min()

> **min**(`column`): `number`

Defined in: [DataFrame.ts:513](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L513)

Calculates the minimum value in a specified column of the DataFrame.

#### Parameters

##### column

`string`

The name of the column to find the minimum value in.

#### Returns

`number`

The minimum value in the specified column. If the column contains no numeric values, returns NaN.

***

### plot()

> **plot**(`container`): `Promise`\<\{ `bar`: () => `void`; `line`: () => `void`; \}\>

Defined in: [DataFrame.ts:737](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L737)

Plots the DataFrame.
Currently, this method is not implemented.

#### Parameters

##### container

`string` = `"plotDiv"`

#### Returns

`Promise`\<\{ `bar`: () => `void`; `line`: () => `void`; \}\>

***

### print()

> **print**(`maxRows`, `index`): `void`

Defined in: [DataFrame.ts:688](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L688)

Prints the first 10 rows of the DataFrame in a tabular format.

#### Parameters

##### maxRows

`number` = `10`

##### index

`boolean` = `false`

#### Returns

`void`

***

### renameColumns()

> **renameColumns**(`renameMap`): `void`

Defined in: [DataFrame.ts:671](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L671)

Renames the columns of the DataFrame based on the provided rename map.

#### Parameters

##### renameMap

An object where the keys are the current column names and the values are the new column names.

#### Returns

`void`

#### Remarks

This method updates both the `columns` array and each row in the `data` to reflect the new column names.
If a column name in the `columns` array does not exist in the `renameMap`, it will remain unchanged.
Similarly, if a key in a row does not exist in the `renameMap`, it will remain unchanged.

#### Example

```typescript
const df = new DataFrame({
  columns: ['name', 'age'],
  data: [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 30 }
  ]
});

df.renameColumns({ name: 'fullName', age: 'years' });

console.log(df.columns); // ['fullName', 'years']
console.log(df.data); // [{ fullName: 'Alice', years: 25 }, { fullName: 'Bob', years: 30 }]
```

***

### selectCols()

> **selectCols**(`columns`): `DataFrame`

Defined in: [DataFrame.ts:544](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L544)

Selects specific columns from the DataFrame and returns a new DataFrame containing only those columns.

#### Parameters

##### columns

`string`[]

An array of column names to be selected.

#### Returns

`DataFrame`

A new DataFrame containing only the specified columns.

***

### selectRows()

> **selectRows**(`filter`): `DataFrame`

Defined in: [DataFrame.ts:561](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L561)

Selects rows from the DataFrame that match the specified filter criteria.

#### Parameters

##### filter

An object where the keys are column names and the values are the values to filter by.

#### Returns

`DataFrame`

A new DataFrame containing only the rows that match the filter criteria.

***

### toArray()

> **toArray**(`includeHeader`): `any`[][]

Defined in: [DataFrame.ts:406](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L406)

Converts the DataFrame into a 2D array.

#### Parameters

##### includeHeader

`boolean` = `true`

A boolean indicating whether to include the header row (column names) in the output array. Defaults to `true`.

#### Returns

`any`[][]

A 2D array representation of the DataFrame. If `includeHeader` is `true`, the first row will contain the column names.

***

### toJSON()

> **toJSON**(`records`): [`Row`](../type-aliases/Row.md)[] \| \{\[`key`: `string`\]: `any`[]; \}

Defined in: [DataFrame.ts:386](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L386)

Converts the DataFrame to a JSON representation.

#### Parameters

##### records

`boolean` = `true`

If true, returns an array of row objects (default). If false, returns an object with arrays for each column.

#### Returns

[`Row`](../type-aliases/Row.md)[] \| \{\[`key`: `string`\]: `any`[]; \}

An array of row objects if `records` is true, otherwise an object with arrays for each column.

***

### transpose()

> **transpose**(`keyColumn`, `keyLabel?`): `DataFrame`

Defined in: [DataFrame.ts:340](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L340)

Transposes the DataFrame by converting columns into rows based on a key column.

#### Parameters

##### keyColumn

`string`

The name of the column to use as the key for transposing.

##### keyLabel?

An optional new label for the key column in the transposed DataFrame.

`null` | `string`

#### Returns

`DataFrame`

A new DataFrame with the transposed data.

#### Throws

If the key column does not exist in the DataFrame.

#### Throws

If there are duplicate values in the key column.

#### Example

```ts
// Given a DataFrame with columns 'A', 'B', and 'C', and 'A' as the key column:
// A | B | C
// 1 | 2 | 3
// 4 | 5 | 6
// The transposed DataFrame will have columns 'A', '1', and '4':
// A | 1 | 4
// B | 2 | 5
// C | 3 | 6

const df = new DataFrame([
  { A: 1, B: 2, C: 3 },
  { A: 4, B: 5, C: 6 }
], ['A', 'B', 'C']);

const transposedDf = df.transpose('A');
console.log(transposedDf.data);
// Output:
// [
//   { A: 'B', 1: 2, 4: 5 },
//   { A: 'C', 1: 3, 4: 6 }
// ]
```

***

### unique()

> **unique**(`column`): `any`[]

Defined in: [DataFrame.ts:221](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L221)

Returns an array of unique values from the specified column in the DataFrame.

#### Parameters

##### column

`string`

The name of the column from which to extract unique values.

#### Returns

`any`[]

An array of unique values from the specified column.

#### Throws

Will throw an error if the specified column does not exist in the DataFrame.

***

### valueCount()

> **valueCount**(`column`): `number`

Defined in: [DataFrame.ts:479](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L479)

Counts the number of non-null, non-undefined, and numeric values in a specified column.

#### Parameters

##### column

`string`

The name of the column to count values in.

#### Returns

`number`

The count of valid values in the specified column.

***

### fromArray()

> `static` **fromArray**(`data`, `infer`): `DataFrame`

Defined in: [DataFrame.ts:96](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L96)

Creates a DataFrame from a 2D array.

#### Parameters

##### data

`any`[][]

A 2D array where each sub-array represents a row of data.

##### infer

`boolean` = `false`

A boolean indicating whether to infer column names or use the first row as column names.
               If false, the first row of the array is used as the column names.
               If true, column names are inferred as "col1", "col2", etc.

#### Returns

`DataFrame`

A new DataFrame instance.

***

### fromJSON()

> `static` **fromJSON**(`data`, `columns?`): `DataFrame`

Defined in: [DataFrame.ts:124](https://github.com/digital-codes/dfLib/blob/d7fa889a2995feebbd2a922f9c166df0e01886b9/src/DataFrame.ts#L124)

Creates a DataFrame instance from a JSON object or an array of rows.

#### Parameters

##### data

The input data which can be either an array of rows or an object where each key is a column name and each value is an array of column data.

[`Row`](../type-aliases/Row.md)[] | \{\[`key`: `string`\]: `any`[]; \}

##### columns?

`string`[]

Optional array of column names. If not provided, column names will be inferred from the keys of the input object.

#### Returns

`DataFrame`

A new DataFrame instance.
