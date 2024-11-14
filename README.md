# Minimal dataframe library in Typescript


## Use Cases

## Functions


### Export to Array

### Export to Json 

### Get Column Names

columnNames()

...


### Get distinct/unique values

unique()

### Get column

like
```
classes = df.getSeries(classId)

```

### Add column

like 
```     // Create a new column 'iso_datetime' based on the 'unix_timestamp' column
    df = df.withSeries('iso_datetime', df.getSeries('unix_seconds').select(unix_seconds => 
      new Date(unix_seconds * 1000).toISOString()
    )); 

```


