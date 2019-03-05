# TableMaker
TableMaker using Vanilla JS

## 사용법
```javascript
var headerData = [
  {columnName:"col1", columnID:"col1", rowspan:"2"},
  {columnName:"col2", childCols: [
    {columnName:"col2_1", columnID:"col2_1"},
    {columnName:"col2_2", columnID:"col2_2"}
  ]}
];

//data set by columnID
var bodyData = [
  {col1:"col1Data", col2_1:"col2_1Data", col2_2:"col2_2Data"}
];

var tableOptions = {
  targetID  : "div_content",  //HTML append target ID
  headerData: headerData,
  bodyData  : bodyData,
  tableClass: "myTable"       //CSS class
};

var tm = new TableMaker(tableOptions);
```
