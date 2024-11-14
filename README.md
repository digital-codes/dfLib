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


## Install from Github

To install directly from GitHub, push your library to a GitHub repository and install it in your project by referencing the GitHub URL in package.json.

 * In the target project
> npm install git+https://github.com/digital-codes/dfLib.git

 * Alternatively, add the dependency directly to package.json:
> {
  "dependencies":  
    {
      "dfLib":  
        "git+https://github.com/digital-codes/dfLib.git"  
    }  
  }

