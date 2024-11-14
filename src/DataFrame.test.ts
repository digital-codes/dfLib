// src/DataFrame.test.ts
import DataFrame from './DataFrame';

describe('DataFrame', () => {
    let df: DataFrame;
    const jsonData = [
        { id: 1, name: 'Alice', age: 25 },
        { id: 2, name: 'Bob', age: null },
        { id: 3, name: 'Charlie', age: 30 }
    ];

    beforeEach(() => {
        df = new DataFrame(jsonData);
    });

    test('should initialize with JSON data', () => {
        expect(df.toJSON()).toStrictEqual(jsonData);
    });

    test('should initialize with array data and columns', () => {
        const arrayData = [
            [1, 'Alice', 25],
            [2, 'Bob', null],
            [3, 'Charlie', 30]
        ];
        const dfArray = new DataFrame(arrayData, ['id', 'name', 'age']);
        expect(dfArray.toJSON()).toStrictEqual(jsonData);
    });

    test('should throw error if initialized with array data without columns', () => {
        const arrayData = [
            [1, 'Alice', 25],
            [2, 'Bob', null]
        ];
        expect(() => new DataFrame(arrayData)).toThrow('Column names are required for 2D array data.');
    });

    // create from array with infer hdr option
    test('should initialize with array data and infer column names', () => {
        const arrayData = [
            [1, 'Alice', 25],
            [2, 'Bob', null],
            [3, 'Charlie', 30]
        ];
        const arrayData1 = [
            ["col1", "col2", "col3"],
            [1, 'Alice', 25],
            [2, 'Bob', null],
            [3, 'Charlie', 30]
        ];

        const dfArray = DataFrame.fromArray(arrayData, true);
        expect(dfArray.toArray()).toStrictEqual(arrayData1);
    });

    // create from array with default hdr option
    test('should initialize with array data and read column names from row0', () => {
        const arrayData = [
            ["X1", "X2", "X3"],
            [1, 'Alice', 25],
            [2, 'Bob', null],
            [3, 'Charlie', 30]
        ];

        const dfArray = DataFrame.fromArray(arrayData, false);
        expect(dfArray.toArray()).toStrictEqual(arrayData);
    });


    test('should detect types of columns', () => {
        expect(df.getDtypes()).toStrictEqual({ id: 'number', name: 'string', age: 'number' });
    });

    // src/DataFrame.test.ts

    describe('DataFrame fillNA method', () => {
        let df: DataFrame;

        beforeEach(() => {
            const jsonData = [
                { id: 1, value: 10 },
                { id: 2, value: null },
                { id: 3, value: null },
                { id: 4, value: 40 },
                { id: 5, value: null },
                { id: 6, value: 60 }
            ];
            df = new DataFrame(jsonData);
        });

        // Inside DataFrame.test.ts

        test('should fill NA with specified static value', () => {
            df.fillNA(0); // Modify df in place
            expect(df.toJSON()).toStrictEqual([
                { id: 1, value: 10 },
                { id: 2, value: 0 },
                { id: 3, value: 0 },
                { id: 4, value: 40 },
                { id: 5, value: 0 },
                { id: 6, value: 60 }
            ]);
        });

        test('should fill NA with forward fill (ffill)', () => {
            df.fillNA(null, 'ffill');
            expect(df.toJSON()).toStrictEqual([
                { id: 1, value: 10 },
                { id: 2, value: 10 },
                { id: 3, value: 10 },
                { id: 4, value: 40 },
                { id: 5, value: 40 },
                { id: 6, value: 60 }
            ]);
        });

        test('should fill NA with backfill (bfill)', () => {
            df.fillNA(null, 'bfill');
            expect(df.toJSON()).toStrictEqual([
                { id: 1, value: 10 },
                { id: 2, value: 40 },
                { id: 3, value: 40 },
                { id: 4, value: 40 },
                { id: 5, value: 60 },
                { id: 6, value: 60 }
            ]);
        });




    });

    test('should select specific columns', () => {
        const selected = df.selectCols(['id', 'name']);
        expect(selected.toJSON()).toStrictEqual([
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
            { id: 3, name: 'Charlie' }
        ]);
    });

    test('should drop specific columns', () => {
        const dropped = df.drop(['age']);
        expect(dropped.toJSON()).toStrictEqual([
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
            { id: 3, name: 'Charlie' }
        ]);
    });

    test('should join two dataframes with inner join', () => {
        const otherData = [{ id: 1, city: 'New York' }, { id: 2, city: 'Los Angeles' }];
        const otherDF = new DataFrame(otherData);
        const joinedDF = df.join(otherDF, 'id', 'inner');
        expect(joinedDF.toJSON()).toStrictEqual([
            { id: 1, name: 'Alice', age: 25, city: 'New York' },
            { id: 2, name: 'Bob', age: null, city: 'Los Angeles' }
        ]);
    });

    test('should join two dataframes with left join', () => {
        const otherData = [{ id: 1, city: 'New York' }];
        const otherDF = new DataFrame(otherData);
        const joinedDF = df.join(otherDF, 'id', 'left');
        expect(joinedDF.toJSON()).toStrictEqual([
            { id: 1, name: 'Alice', age: 25, city: 'New York' },
            { id: 2, name: 'Bob', age: null },
            { id: 3, name: 'Charlie', age: 30 }
        ]);
    });

    test('should join two dataframes with right join', () => {
        const otherData = [{ id: 1, city: 'New York' }, { id: 4, city: 'San Francisco' }];
        const otherDF = new DataFrame(otherData);
        const joinedDF = df.join(otherDF, 'id', 'right');
        expect(joinedDF.toJSON()).toStrictEqual([
            { id: 1, name: 'Alice', age: 25, city: 'New York' },
            { id: 4, city: 'San Francisco' }
        ]);
    });

    test('should join two dataframes with outer join', () => {
        const otherData = [{ id: 1, city: 'New York' }, { id: 4, city: 'San Francisco' }];
        const otherDF = new DataFrame(otherData);
        const joinedDF = df.join(otherDF, 'id', 'outer');
        expect(joinedDF.toJSON()).toStrictEqual([
            { id: 1, name: 'Alice', age: 25, city: 'New York' },
            { id: 2, name: 'Bob', age: null },
            { id: 3, name: 'Charlie', age: 30 },
            { id: 4, city: 'San Francisco' }
        ]);
    });

    const data1 = [
        { col1: 1, col2: 'A', value1: 100 },
        { col1: 2, col2: 'B', value1: 200 },
        { col1: 3, col2: 'C', value1: 300 },
        { col1: 4, col2: 'D', value1: 400 }
    ];

    const data2 = [
        { col1: 1, col2: 'A', value2: 10 },
        { col1: 2, col2: 'B', value2: 20 },
        { col1: 3, col2: 'X', value2: 30 },
        { col1: 4, col2: 'X', value2: 40 },
        { col1: 5, col2: 'E', value2: 50 }
    ];
    describe('DataFrame Join Operations with Multiple Criteria', () => {
        let df1: DataFrame;
        let df2: DataFrame;

        beforeEach(() => {
            df1 = new DataFrame(data1);
            df2 = new DataFrame(data2);
        });

        test('should perform an inner join on col1 and col2', () => {
            const joinedDF = df1.join(df2, ['col1', 'col2'], 'inner');
            expect(joinedDF.toJSON()).toEqual([
                { col1: 1, col2: 'A', value1: 100, value2: 10 },
                { col1: 2, col2: 'B', value1: 200, value2: 20 },
            ]);
        });

        test('should perform an outer join on col1 and col2', () => {
            const joinedDF = df1.join(df2, ['col1', 'col2'], 'outer');
            expect(joinedDF.toJSON()).toEqual([
                { col1: 1, col2: 'A', value1: 100, value2: 10 },
                { col1: 2, col2: 'B', value1: 200, value2: 20 },
                { col1: 3, col2: 'C', value1: 300 },
                { col1: 4, col2: 'D', value1: 400 },
                { col1: 3, col2: 'X', value2: 30 },
                { col1: 4, col2: 'X', value2: 40 },
                { col1: 5, col2: 'E', value2: 50 }
            ]);
        });
    });

    // src/DataFrame.test.ts

    describe('DataFrame toJSON and toArray methods', () => {
        let df: DataFrame;

        beforeEach(() => {
            const data = [
                { id: 1, name: 'Alice', age: 25 },
                { id: 2, name: 'Bob', age: 30 }
            ];
            df = new DataFrame(data);
        });

        describe('toJSON method', () => {
            test('should return row-oriented JSON by default (records = true)', () => {
                expect(df.toJSON()).toEqual([
                    { id: 1, name: 'Alice', age: 25 },
                    { id: 2, name: 'Bob', age: 30 }
                ]);
            });

            test('should return row-oriented JSON when records = true', () => {
                expect(df.toJSON(true)).toEqual([
                    { id: 1, name: 'Alice', age: 25 },
                    { id: 2, name: 'Bob', age: 30 }
                ]);
            });

            test('should return column-oriented JSON when records = false', () => {
                expect(df.toJSON(false)).toEqual({
                    id: [1, 2],
                    name: ['Alice', 'Bob'],
                    age: [25, 30]
                });
            });
        });

        describe('toArray method', () => {
            test('should return array of rows with header by default', () => {
                expect(df.toArray()).toStrictEqual([
                    ['id', 'name', 'age'],
                    [1, 'Alice', 25],
                    [2, 'Bob', 30]
                ]);
            });

            test('should return array of rows with header by with includeHeader=true', () => {
                expect(df.toArray(true)).toStrictEqual([
                    ['id', 'name', 'age'],
                    [1, 'Alice', 25],
                    [2, 'Bob', 30]
                ]);
            });

            test('should return array of rows without header by with includeHeader=false', () => {
                expect(df.toArray(false)).toStrictEqual([
                    [1, 'Alice', 25],
                    [2, 'Bob', 30]
                ]);
            });


            test('should return array of rows with specified columns only', () => {
                const selectedDF = df.selectCols(['id', 'age']);
                expect(selectedDF.toArray()).toEqual([
                    ['id', 'age'],
                    [1, 25],
                    [2, 30]
                ]);
            });
        });


    });

    describe('selectRows method with specific column values', () => {
        let df: DataFrame;

        beforeEach(() => {
            const data = [
                { id: 1, name: 'Alice', age: 25 },
                { id: 2, name: 'Bob', age: 30 },
                { id: 3, name: 'Alice', age: 35 },
                { id: 4, name: 'Alice', age: 25 }
            ];
            df = new DataFrame(data);
        });

        test('should select rows based on multiple column values', () => {
            const selectedDf = df.selectRows({ name: 'Alice', age: 25 });
            expect(selectedDf.toJSON()).toEqual([
                { id: 1, name: 'Alice', age: 25 },
                { id: 4, name: 'Alice', age: 25 }
            ]);
        });

        test('should select rows based on a single column value', () => {
            const selectedDf = df.selectRows({ age: 30 });
            expect(selectedDf.toJSON()).toEqual([
                { id: 2, name: 'Bob', age: 30 }
            ]);
        });

        test('should return an empty DataFrame if no rows match the criteria', () => {
            const selectedDf = df.selectRows({ name: 'Charlie', age: 25 });
            expect(selectedDf.toJSON()).toEqual([]);
        });

        test('should select rows based on all specified columns', () => {
            const selectedDf = df.selectRows({ id: 1, name: 'Alice', age: 25 });
            expect(selectedDf.toJSON()).toEqual([
                { id: 1, name: 'Alice', age: 25 }
            ]);
        });
    });


    describe('renameColumns method', () => {
        test('should rename one or more columns in the DataFrame', () => {
            const data = [
                { id: 1, name: 'Alice', age: 25 },
                { id: 2, name: 'Bob', age: 30 }
            ];
            const df = new DataFrame(data);

            df.renameColumns({ name: 'full_name', age: 'years' });

            expect(df.toJSON()).toEqual([
                { id: 1, full_name: 'Alice', years: 25 },
                { id: 2, full_name: 'Bob', years: 30 }
            ]);

            expect(df.columnNames()).toEqual(['id', 'full_name', 'years']);
        });
    });

    describe('DataFrame dtypes detection', () => {
        test('should detect types and set to undefined if NaN values are present', () => {
            const data = [
                { id: 1, name: 'Alice', age: 25 },
                { id: 2, name: 'Bob', age: NaN },
                { id: 3, name: 'Charlie', age: 30 }
            ];
            const df = new DataFrame(data);

            expect(df.getDtypes()).toEqual({
                id: 'number',
                name: 'string',
                age: undefined
            });
        });

        test('should detect types correctly when no NaN values are present', () => {
            const data = [
                { id: 1, name: 'Alice', age: 25 },
                { id: 2, name: 'Bob', age: 30 },
                { id: 3, name: 'Charlie', age: 35 }
            ];
            const df = new DataFrame(data);

            expect(df.getDtypes()).toEqual({
                id: 'number',
                name: 'string',
                age: 'number'
            });
        });

        test('should detect mixed types when column contains different data types', () => {
            const data = [
                { id: 1, name: 'Alice', mixed: 25 },
                { id: 2, name: 'Bob', mixed: 'hello' },
                { id: 3, name: 'Charlie', mixed: true }
            ];
            const df = new DataFrame(data);
            expect(df.getDtypes()).toEqual({
                id: 'number',
                name: 'string',
                mixed: 'mixed'
            });
        });
    });

    describe('getUniqueValues method', () => {
        let df: DataFrame;

        beforeEach(() => {
            const data = [
                { id: 1, name: 'Alice', age: 25 },
                { id: 2, name: 'Bob', age: 30 },
                { id: 3, name: 'Alice', age: 35 },
                { id: 4, name: 'Charlie', age: 30 }
            ];
            df = new DataFrame(data);
        });

        test('should return unique values for a specified column', () => {
            expect(df.unique('name')).toEqual(['Alice', 'Bob', 'Charlie']);
            expect(df.unique('age')).toEqual([25, 30, 35]);
        });

        test('should return an empty array for a column with all null values', () => {
            const nullData = [
                { id: 1, emptyCol: null },
                { id: 2, emptyCol: null }
            ];
            const dfWithNulls = new DataFrame(nullData);
            expect(dfWithNulls.unique('emptyCol')).toEqual([null]);
        });

        test('should throw an error if the column does not exist', () => {
            expect(() => df.unique('nonExistentColumn')).toThrow(
                'Column "nonExistentColumn" does not exist in the DataFrame'
            );
        });
    });


    describe('addColumn method', () => {
        let df: DataFrame;
      
        beforeEach(() => {
          const data = [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
            { id: 3, name: 'Charlie' }
          ];
          df = new DataFrame(data);
        });
      
        test('should add a new column with an array of values', () => {
          df.addColumn('age', [25, 30, 35]);
          expect(df.toJSON()).toEqual([
            { id: 1, name: 'Alice', age: 25 },
            { id: 2, name: 'Bob', age: 30 },
            { id: 3, name: 'Charlie', age: 35 }
          ]);
          // check dtypes
          expect(df.getDtypes()).toStrictEqual({ id: 'number', name: 'string', age: 'number' });
        });

          
        test('should add a new column with a single default value', () => {
          df.addColumn('country', 'USA');
          expect(df.toJSON()).toEqual([
            { id: 1, name: 'Alice', country: 'USA' },
            { id: 2, name: 'Bob', country: 'USA' },
            { id: 3, name: 'Charlie', country: 'USA' }
          ]);
          // check dtypes
          expect(df.getDtypes()).toStrictEqual({ id: 'number', name: 'string', country: 'string' });
        });
      
        test('should throw an error if column name already exists', () => {
          expect(() => df.addColumn('name', 'Test')).toThrow(
            'Column "name" already exists in the DataFrame'
          );
        });
      
        test('should throw an error if array length does not match number of rows', () => {
          expect(() => df.addColumn('age', [25, 30])).toThrow(
            'Length of values array (2) does not match the number of rows (3)'
          );
        });
      });
      


});