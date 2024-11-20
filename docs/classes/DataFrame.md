[**dflib v0.1.6**](../README.md) • **Docs**

***

[dflib v0.1.6](../globals.md) / DataFrame

# Class: DataFrame

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

### new DataFrame()

> **new DataFrame**(`data`, `columns`?): [`DataFrame`](DataFrame.md)

Constructs a new DataFrame instance.

#### Parameters

• **data**: [`Row`](../type-aliases/Row.md)[] \| `any`[][]

The data to be stored in the DataFrame. It can be either an array of rows (objects) or a 2D array.

• **columns?**: `string`[]

Optional. The column names for the DataFrame. Required if `data` is a 2D array.

#### Returns

[`DataFrame`](DataFrame.md)

#### Throws

If `data` is a 2D array and `columns` are not provided.

#### Defined in

[DataFrame.ts:51](https://github.com/digital-codes/dfLib/blob/9f232f4cc1f3539c99ad776edaa33ea88bb07965/src/DataFrame.ts#L51)

## Methods

### addColumn()

> **addColumn**(`columnName`, `values`): `void`

Adds a new column to the DataFrame.

#### Parameters

• **columnName**: `string`

The name of the new column to be added.

• **values**: `any`

An array of values or a single value to populate the new column.
                If an array is provided, its length must match the number of rows in the DataFrame.
                If a single value is provided, it will be assigned to all rows.

#### Returns

`void`

#### Throws

If the column name already exists in the DataFrame.

#### Throws

If the length of the values array does not match the number of rows in the DataFrame.

#### Defined in

[DataFrame.ts:241](https://github.com/digital-codes/dfLib/blob/9f232f4cc1f3539c99ad776edaa33ea88bb07965/src/DataFrame.ts#L241)

***

### addRow()

> **addRow**(`newRow`): `void`

Adds a new row of data to the DataFrame.
Fills missing keys in the row with `null`.
If the row contains new keys, updates the DataFrame to include those keys.

#### Parameters

• **newRow**: [`Row`](../type-aliases/Row.md)

An object representing the new row to add.

#### Returns

`void`

#### Defined in

[DataFrame.ts:276](https://github.com/digital-codes/dfLib/blob/9f232f4cc1f3539c99ad776edaa33ea88bb07965/src/DataFrame.ts#L276)

***

### columnNames()

> **columnNames**(): `string`[]

Returns the names of the columns in the DataFrame.

#### Returns

`string`[]

An array of column names.

#### Defined in

[DataFrame.ts:208](https://github.com/digital-codes/dfLib/blob/9f232f4cc1f3539c99ad776edaa33ea88bb07965/src/DataFrame.ts#L208)

***

### count()

> **count**(): `number`

Returns the number of rows in the DataFrame.

#### Returns

`number`

The count of rows in the DataFrame.

#### Defined in

[DataFrame.ts:467](https://github.com/digital-codes/dfLib/blob/9f232f4cc1f3539c99ad776edaa33ea88bb07965/src/DataFrame.ts#L467)

***

### dropCols()

> **dropCols**(`columns`): [`DataFrame`](DataFrame.md)

Drops the specified columns from the DataFrame.

#### Parameters

• **columns**: `string`[]

An array of column names to be removed from the DataFrame.

#### Returns

[`DataFrame`](DataFrame.md)

A new DataFrame instance with the specified columns removed.

#### Defined in

[DataFrame.ts:573](https://github.com/digital-codes/dfLib/blob/9f232f4cc1f3539c99ad776edaa33ea88bb07965/src/DataFrame.ts#L573)

***

### fillNA()

> **fillNA**(`value`, `method`): `void`

Fills NA values in the dataframe with a specified value, forward fill, or backfill.

#### Parameters

• **value**: `any` = `null`

The value to fill NA cells with (only used if method is 'value').

• **method**: `"value"` \| `"ffill"` \| `"bfill"` = `"value"`

The method to use for filling NA cells: 'value', 'ffill', or 'bfill'.

#### Returns

`void`

#### Defined in

[DataFrame.ts:419](https://github.com/digital-codes/dfLib/blob/9f232f4cc1f3539c99ad776edaa33ea88bb07965/src/DataFrame.ts#L419)

***

### getDtypes()

> **getDtypes**(): `object`

Retrieves the data types of the DataFrame columns.

#### Returns

`object`

An object where the keys are column names and the values are their respective data types.

#### Defined in

[DataFrame.ts:199](https://github.com/digital-codes/dfLib/blob/9f232f4cc1f3539c99ad776edaa33ea88bb07965/src/DataFrame.ts#L199)

***

### join()

> **join**(`other`, `on`, `how`): [`DataFrame`](DataFrame.md)

Joins the current DataFrame with another DataFrame based on the specified columns and join type.

#### Parameters

• **other**: [`DataFrame`](DataFrame.md)

The DataFrame to join with.

• **on**: `string` \| `string`[]

The column name or an array of column names to join on.

• **how**: `"inner"` \| `"left"` = `"inner"`

The type of join to perform. Can be 'inner', 'left' Defaults to 'inner'.

#### Returns

[`DataFrame`](DataFrame.md)

A new DataFrame resulting from the join operation.

#### Defined in

[DataFrame.ts:592](https://github.com/digital-codes/dfLib/blob/9f232f4cc1f3539c99ad776edaa33ea88bb07965/src/DataFrame.ts#L592)

***

### max()

> **max**(`column`): `number`

Returns the maximum value in the specified column.

#### Parameters

• **column**: `string`

The name of the column to find the maximum value in.

#### Returns

`number`

The maximum value in the column, or NaN if the column has no numeric values.

#### Defined in

[DataFrame.ts:528](https://github.com/digital-codes/dfLib/blob/9f232f4cc1f3539c99ad776edaa33ea88bb07965/src/DataFrame.ts#L528)

***

### mean()

> **mean**(`column`): `number`

Calculates the mean (average) of the specified column in the DataFrame.

#### Parameters

• **column**: `string`

The name of the column for which to calculate the mean.

#### Returns

`number`

The mean of the column values. Returns NaN if the column has no numeric values.

#### Defined in

[DataFrame.ts:494](https://github.com/digital-codes/dfLib/blob/9f232f4cc1f3539c99ad776edaa33ea88bb07965/src/DataFrame.ts#L494)

***

### min()

> **min**(`column`): `number`

Calculates the minimum value in a specified column of the DataFrame.

#### Parameters

• **column**: `string`

The name of the column to find the minimum value in.

#### Returns

`number`

The minimum value in the specified column. If the column contains no numeric values, returns NaN.

#### Defined in

[DataFrame.ts:512](https://github.com/digital-codes/dfLib/blob/9f232f4cc1f3539c99ad776edaa33ea88bb07965/src/DataFrame.ts#L512)

***

### renameColumns()

> **renameColumns**(`renameMap`): `void`

Renames the columns of the DataFrame based on the provided rename map.

#### Parameters

• **renameMap**

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

#### Defined in

[DataFrame.ts:670](https://github.com/digital-codes/dfLib/blob/9f232f4cc1f3539c99ad776edaa33ea88bb07965/src/DataFrame.ts#L670)

***

### selectCols()

> **selectCols**(`columns`): [`DataFrame`](DataFrame.md)

Selects specific columns from the DataFrame and returns a new DataFrame containing only those columns.

#### Parameters

• **columns**: `string`[]

An array of column names to be selected.

#### Returns

[`DataFrame`](DataFrame.md)

A new DataFrame containing only the specified columns.

#### Defined in

[DataFrame.ts:543](https://github.com/digital-codes/dfLib/blob/9f232f4cc1f3539c99ad776edaa33ea88bb07965/src/DataFrame.ts#L543)

***

### selectRows()

> **selectRows**(`filter`): [`DataFrame`](DataFrame.md)

Selects rows from the DataFrame that match the specified filter criteria.

#### Parameters

• **filter**

An object where the keys are column names and the values are the values to filter by.

#### Returns

[`DataFrame`](DataFrame.md)

A new DataFrame containing only the rows that match the filter criteria.

#### Defined in

[DataFrame.ts:560](https://github.com/digital-codes/dfLib/blob/9f232f4cc1f3539c99ad776edaa33ea88bb07965/src/DataFrame.ts#L560)

***

### toArray()

> **toArray**(`includeHeader`): `any`[][]

Converts the DataFrame into a 2D array.

#### Parameters

• **includeHeader**: `boolean` = `true`

A boolean indicating whether to include the header row (column names) in the output array. Defaults to `true`.

#### Returns

`any`[][]

A 2D array representation of the DataFrame. If `includeHeader` is `true`, the first row will contain the column names.

#### Defined in

[DataFrame.ts:405](https://github.com/digital-codes/dfLib/blob/9f232f4cc1f3539c99ad776edaa33ea88bb07965/src/DataFrame.ts#L405)

***

### toJSON()

> **toJSON**(`records`): [`Row`](../type-aliases/Row.md)[] \| `object`

Converts the DataFrame to a JSON representation.

#### Parameters

• **records**: `boolean` = `true`

If true, returns an array of row objects (default). If false, returns an object with arrays for each column.

#### Returns

[`Row`](../type-aliases/Row.md)[] \| `object`

An array of row objects if `records` is true, otherwise an object with arrays for each column.

#### Defined in

[DataFrame.ts:385](https://github.com/digital-codes/dfLib/blob/9f232f4cc1f3539c99ad776edaa33ea88bb07965/src/DataFrame.ts#L385)

***

### transpose()

> **transpose**(`keyColumn`, `keyLabel`?): [`DataFrame`](DataFrame.md)

Transposes the DataFrame by converting columns into rows based on a key column.

#### Parameters

• **keyColumn**: `string`

The name of the column to use as the key for transposing.

• **keyLabel?**: `null` \| `string` = `null`

An optional new label for the key column in the transposed DataFrame.

#### Returns

[`DataFrame`](DataFrame.md)

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

#### Defined in

[DataFrame.ts:339](https://github.com/digital-codes/dfLib/blob/9f232f4cc1f3539c99ad776edaa33ea88bb07965/src/DataFrame.ts#L339)

***

### unique()

> **unique**(`column`): `any`[]

Returns an array of unique values from the specified column in the DataFrame.

#### Parameters

• **column**: `string`

The name of the column from which to extract unique values.

#### Returns

`any`[]

An array of unique values from the specified column.

#### Throws

Will throw an error if the specified column does not exist in the DataFrame.

#### Defined in

[DataFrame.ts:220](https://github.com/digital-codes/dfLib/blob/9f232f4cc1f3539c99ad776edaa33ea88bb07965/src/DataFrame.ts#L220)

***

### valueCount()

> **valueCount**(`column`): `number`

Counts the number of non-null, non-undefined, and numeric values in a specified column.

#### Parameters

• **column**: `string`

The name of the column to count values in.

#### Returns

`number`

The count of valid values in the specified column.

#### Defined in

[DataFrame.ts:478](https://github.com/digital-codes/dfLib/blob/9f232f4cc1f3539c99ad776edaa33ea88bb07965/src/DataFrame.ts#L478)

***

### fromArray()

> `static` **fromArray**(`data`, `infer`): [`DataFrame`](DataFrame.md)

Creates a DataFrame from a 2D array.

#### Parameters

• **data**: `any`[][]

A 2D array where each sub-array represents a row of data.

• **infer**: `boolean` = `false`

A boolean indicating whether to infer column names or use the first row as column names.
               If false, the first row of the array is used as the column names.
               If true, column names are inferred as "col1", "col2", etc.

#### Returns

[`DataFrame`](DataFrame.md)

A new DataFrame instance.

#### Defined in

[DataFrame.ts:96](https://github.com/digital-codes/dfLib/blob/9f232f4cc1f3539c99ad776edaa33ea88bb07965/src/DataFrame.ts#L96)

***

### fromJSON()

> `static` **fromJSON**(`data`, `columns`?): [`DataFrame`](DataFrame.md)

Creates a DataFrame instance from a JSON object or an array of rows.

#### Parameters

• **data**: [`Row`](../type-aliases/Row.md)[] \| `object`

The input data which can be either an array of rows or an object where each key is a column name and each value is an array of column data.

• **columns?**: `string`[]

Optional array of column names. If not provided, column names will be inferred from the keys of the input object.

#### Returns

[`DataFrame`](DataFrame.md)

A new DataFrame instance.

#### Defined in

[DataFrame.ts:123](https://github.com/digital-codes/dfLib/blob/9f232f4cc1f3539c99ad776edaa33ea88bb07965/src/DataFrame.ts#L123)
