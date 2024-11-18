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


    test('should select specific columns', () => {
        const selected = df.selectCols(['id', 'name']);
        expect(selected.toJSON()).toStrictEqual([
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
            { id: 3, name: 'Charlie' }
        ]);
    });

    test('should drop specific columns', () => {
        const dropped = df.dropCols(['age']);
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
            { id: 2, name: 'Bob', age: null, city: null },
            { id: 3, name: 'Charlie', age: 30, city: null }
        ]);
    });

    test('should join two dataframes with right join', () => {
        const otherData = [{ id: 1, city: 'New York' }, { id: 4, city: 'San Francisco' }];
        const otherDF = new DataFrame(otherData);
        const joinedDF = df.join(otherDF, 'id', 'right');
        expect(joinedDF.toJSON()).toStrictEqual([
            { id: 1, name: 'Alice', age: 25, city: 'New York' },
            { id: 4, name: null, age: null, city: 'San Francisco' }
        ]);
    });

    test('should join two dataframes with outer join', () => {
        const otherData = [{ id: 1, city: 'New York' }, { id: 4, city: 'San Francisco' }];
        const otherDF = new DataFrame(otherData);
        const joinedDF = df.join(otherDF, 'id', 'outer');
        expect(joinedDF.toJSON()).toStrictEqual([
            { id: 1, name: 'Alice', age: 25, city: 'New York' },
            { id: 2, name: 'Bob', age: null, city:null },
            { id: 3, name: 'Charlie', age: 30, city:null },
            { id: 4, city: 'San Francisco',age:null, name:null }
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
                { col1: 3, col2: 'C', value1: 300, value2: null },
                { col1: 4, col2: 'D', value1: 400, value2: null  },
                { col1: 3, col2: 'X', value2: 30, value1: null  },
                { col1: 4, col2: 'X', value2: 40, value1: null  },
                { col1: 5, col2: 'E', value2: 50, value1: null  }
            ]);
        });
    });

    // constructor from json arrays
    describe('DataFrame from json array via constructor', () => {
        let df: DataFrame;
        const jsonIn = {
            id: [1,2,3],
            name:["Alice", null, "Charlie"],
            age: [null, null, 30]
        }

        const jsonOut = [
            { id: 1, name: 'Alice', age: null },
            { id: 2,  age: null, name: null },
            { id: 3, name: 'Charlie', age: 30 }
        ];
        
        beforeEach(() => {
            df = DataFrame.fromJSON(jsonIn);
        });

        test('should find all column names', () => {
            expect(df.columnNames()).toEqual(['id', 'name', 'age']);
        });

        test('should include missing', () => {
            expect(df.toJSON()).toEqual(jsonOut);
        });
    })

    // constructor from 2d arrays
    describe('DataFrame from table via constructor', () => {
        let df: DataFrame;

        const arrayData = [
            ["X1", "X2", "X3"],
            [1, 'Alice', 25],
            [2, 'Bob', null],
            [3, 'Charlie', 30]
        ];

        const jsonOut = [
            { X1: 1, X2: 'Alice', X3: 25 },
            { X1: 2,  X3: null, X2: "Bob" },
            { X1: 3, X2: 'Charlie', X3: 30 }
        ];
        
        df = new DataFrame(arrayData.slice(1), arrayData[0] as string[]);

        expect(df.toArray()).toStrictEqual(arrayData);
        expect(df.toJSON()).toStrictEqual(jsonOut);
    })

    // constructor from 2d arrays with empty cells
    describe('DataFrame from table with empty cells via constructor', () => {
        let df: DataFrame;

        const arrayIn = [
            ["X1", "X2", "X3"],
            [1, 'Alice', 25],
            [2, , null],
            [3, 'Charlie', 30]
        ];

        const arrayOut = [
            ["X1", "X2", "X3"],
            [1, 'Alice', 25],
            [2, null , null],
            [3, 'Charlie', 30]
        ];

        const jsonOut = [
            { X1: 1, X2: 'Alice', X3: 25 },
            { X1: 2,  X3: null, X2: null },
            { X1: 3, X2: 'Charlie', X3: 30 }
        ];
        
        df = new DataFrame(arrayIn.slice(1), arrayIn[0] as string[]);

        expect(df.toArray()).toStrictEqual(arrayOut);
        expect(df.toJSON()).toStrictEqual(jsonOut);
    })

    
    


    // handle missing values on constructor
    describe('DataFrame contructor with missing values', () => {
        let df: DataFrame;
        const jsonIn = [
            { id: 1, name: 'Alice' },
            { id: 2,  age: null },
            { id: 3, name: 'Charlie', age: 30 }
        ];

        const jsonOut = [
            { id: 1, name: 'Alice', age: null },
            { id: 2,  age: null, name: null },
            { id: 3, name: 'Charlie', age: 30 }
        ];
        
        beforeEach(() => {
            df = new DataFrame(jsonIn);
        });

        test('should find all column names', () => {
            expect(df.columnNames()).toEqual(['id', 'name', 'age']);
        });

        test('should include missing', () => {
            expect(df.toJSON()).toEqual(jsonOut);
        });
    })
    


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


    describe('DataFrame statistical methods', () => {
        let df: DataFrame;

        beforeEach(() => {
            const data = [
                { id: 1, name: 'Alice', age: 25 },
                { id: 2, name: 'Bob', age: 30 },
                { id: 3, name: 'Charlie', age: 35 },
                { id: 4, name: 'Diana', age: null },
                { id: 5, name: 'Eve', age: NaN }
            ];
            df = new DataFrame(data);
        });

        test('count should return the number of rows', () => {
            expect(df.count()).toBe(5);
        });

        test('count should return the number of valid values in the column', () => {
            expect(df.valueCount('age')).toBe(3);
        });

        test('mean should calculate the average of numeric values in the column', () => {
            expect(df.mean('age')).toBe(30);
        });

        test('min should return the minimum value in the column', () => {
            expect(df.min('age')).toBe(25);
        });

        test('max should return the maximum value in the column', () => {
            expect(df.max('age')).toBe(35);
        });

        test('count, mean, min, max should return NaN for a non-numeric column', () => {
            expect(df.valueCount('name')).toBe(0);
            expect(df.mean('name')).toBeNaN();
            expect(df.min('name')).toBeNaN();
            expect(df.max('name')).toBeNaN();
        });
    });

    describe('DataFrame transpose method', () => {
        test('should transpose DataFrame on a given column with unique values', () => {
          const data = [
            { year: 2020, revenue: 100, profit: 20 },
            { year: 2021, revenue: 150, profit: 30 },
            { year: 2022, revenue: 200, profit: 50 }
          ];
          const df = new DataFrame(data);
      
          const transposedDf = df.transpose('year');
          const expectedData = [
            { year: 'revenue', 2020: 100, 2021: 150, 2022: 200 },
            { year: 'profit', 2020: 20, 2021: 30, 2022: 50 }
          ];
      
          expect(transposedDf.toJSON()).toEqual(expectedData);
        });
      
        test('should throw an error if key column has duplicate values', () => {
          const data = [
            { year: 2020, revenue: 100, profit: 20 },
            { year: 2020, revenue: 150, profit: 30 },
            { year: 2021, revenue: 200, profit: 50 }
          ];
          const df = new DataFrame(data);
      
          expect(() => df.transpose('year')).toThrow(
            'Duplicate values found in column "year". Each key must be unique for transposing.'
          );
        });
      
        test('should throw an error if key column does not exist', () => {
          const data = [
            { year: 2020, revenue: 100, profit: 20 },
            { year: 2021, revenue: 150, profit: 30 }
          ];
          const df = new DataFrame(data);
      
          expect(() => df.transpose('nonexistentColumn')).toThrow(
            'Column "nonexistentColumn" does not exist in the DataFrame'
          );
        });
      
        test('should transpose DataFrame with relabeling ', () => {
          const data = [
            { month: 'Jan', sales: 500, expenses: 300 },
            { month: 'Feb', sales: 600, expenses: 350 },
            { month: 'Mar', sales: 550, expenses: 320 }
          ];
          const df = new DataFrame(data);
      
          const transposedDf = df.transpose('month',"lbl");
          const expectedData = [
            { lbl: 'sales', Jan: 500, Feb: 600, Mar: 550 },
            { lbl: 'expenses', Jan: 300, Feb: 350, Mar: 320 }
          ];
          expect(transposedDf.toJSON()).toEqual(expectedData);
          const expectedArray = [
            ["lbl", "Jan", "Feb", "Mar"],
            ["sales", 500, 600, 550],
            ["expenses", 300, 350, 320]
          ];
          expect(transposedDf.toArray()).toEqual(expectedArray);

        });

  
    });
      

});
