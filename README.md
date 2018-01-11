# divideRec
### use
### 1. npm i divide-rec

```
var divideRec = require("divide-rec");
var testArr = [
    {
        x:0,
        y:0
    },
    {
        x:0,
        y:200
    },
    {
        x:300,
        y:200
    },
    {
        x:300,
        y:0
    },
    {
        x:200,
        y:0
    },
    {
        x:200,
        y:100
    },
    {
        x:100,
        y:100
    },
    {
        x:100,
        y:0
    },
];
divideRec(testArr);
/*[ [ { x: 0, y: 0 },
    { x: 0, y: 100 },
    { x: 100, y: 100 },
    { x: 100, y: 0 } ],
  [ { x: 200, y: 0 },
    { x: 200, y: 100 },
    { x: 300, y: 100 },
    { x: 300, y: 0 } ],
  [ { x: 0, y: 100 },
    { x: 0, y: 200 },
    { x: 300, y: 200 },
    { x: 300, y: 100 } ] ]*/
 ```

