/*
TableMaker.js v0.1 | https://github.com/PeachPP/TableMaker | MIT license
*/


function TableMaker(TableData) {
	TableMaker.prototype.headerDataArray = new Array();
	TableMaker.prototype.bodyDataArray;
	TableMaker.prototype.columns = new Array();
	TableMaker.prototype.bodyText;

	TableMaker.prototype.TableData = TableData;
	TableMaker.prototype.TableID = "TMK_" + TableData.targetID;
	
	const fn_makeHeader = (arr, i, depth) => {
		if(! i) {
			i = 0;
		}
		if(! depth) {
			depth = 0;
		}

		if(! arr[i].length) {
			TableMaker.prototype.headerDataArray[depth] = TableMaker.prototype.headerDataArray[depth] ? TableMaker.prototype.headerDataArray[depth] : "";
			
			let childColCount = fn_getChildColsCount(arr[i]);

			let rowspan		= arr[i].rowspan	?	" rowspan='"	+ arr[i].rowspan	+ "'" : "";
			let colspan		= arr[i].childCols	?	" colspan='"	+ childColCount		+ "'" : "";
			let styleClass	= arr[i].styleClass	?	" class='"		+ arr[i].styleClass	+ "'" : "";
			let name		= arr[i].name		?	" name='"		+ arr[i].name		+ "'" : "";
			let columnID	= arr[i].columnID	?	" id='"			+ arr[i].columnID	+ "'" : "";
			let columnWidth	= arr[i].width		?	" width='"		+ arr[i].width		+ "'" : "";
			let columnName	= arr[i].columnName;
			let htmlTxt		= "<th" + columnID + name + styleClass + rowspan + colspan + columnWidth + ">" + columnName + "</th>";
			TableMaker.prototype.headerDataArray[depth] += htmlTxt;

			if(! arr[i].childCols) {
				let cellClass	= arr[i].cellClass || "";
				TableMaker.prototype.columns.push({"columnName" : columnName, "columnID"	: arr[i].columnID, "cellClass"	: cellClass});
			}
		}

		if(arr[i].childCols) {
			fn_makeHeader(arr[i].childCols, 0, ++depth);
			
			depth--;
		}

		if(i < arr.length-1) {
			fn_makeHeader(arr, ++i, depth);
		}

		return TableMaker.prototype.headerDataArray;
	};

	TableMaker.prototype.getHeaderText = () => {
		let text = "";
		TableMaker.prototype.headerDataArray.forEach(element => {
			text += "<tr>" + element + "</tr>";
		});
		return text;
	};

	const fn_getChildColsCount = (obj) => {
		let count = 0;
		
		if(Array.isArray(obj)){
			count--;
			for(let i = 0; i < obj.length; i++) {
				count += fn_getChildColsCount(obj[i]);
			}
		} else {
			let children = obj.childCols || "";
			if(! children)
				return 1;
			else {
				count += children.length;
				for(let i = 0; i < children.length; i++) {
					if(children[i].childCols)
						count += fn_getChildColsCount(children[i].childCols);
				}
			}
		}
		return count;
	};
	
	const fn_makeRowData = (bodyData) => {
		TableMaker.prototype.bodyDataArray = new Array();
		let text = "";

		for(let i = 0; i < bodyData.length; i++) {
			text += "<tr>";
				for(let j = 0; j < TableMaker.prototype.columns.length; j++) {
					let columnID = TableMaker.prototype.columns[j].columnID;
					let value = bodyData[i][columnID];
					let rowData = {"id": columnID, "value": value};
					TableMaker.prototype.bodyDataArray.push(rowData);

					let cellClass = "";
					if(TableMaker.prototype.columns[j].cellClass) {
						cellClass = " class='" + TableMaker.prototype.columns[j].cellClass + "'";
					}
					text += "<td" + cellClass + ">";
						if(value) {
							text += value;
						}
					text += "</td>";
				}
			text += "</tr>";
		}
		TableMaker.prototype.bodyText = text;
		return TableMaker.prototype.bodyDataArray;
	};

	TableMaker.prototype.getBodyText = () => {
		return TableMaker.prototype.bodyText;
	};

	TableMaker.prototype.empty = () => {
		let table = document.getElementById(TableMaker.prototype.TableID);
		for(let i = 0; i < table.tBodies.length; i++) {
			table.tBodies[i].innerHTML = "";
		}
	};

	TableMaker.prototype.setBodyData = (bodyData) => {
		fn_makeRowData(bodyData);
		let tbody = TableMaker.prototype.getBodyText();
		document.getElementById(TableMaker.prototype.TableID).tBodies[0].innerHTML = "<tbody>" + tbody + "</tbody>";
	};

	const fn_initialize = () => {
		if((! TableMaker.prototype.TableData.headerData) || (! TableMaker.prototype.TableData.bodyData)) {
			
		}
		fn_makeHeader(TableMaker.prototype.TableData.headerData);
		fn_makeRowData(TableMaker.prototype.TableData.bodyData);
		
		let thead = TableMaker.prototype.getHeaderText();
		let tbody = TableMaker.prototype.getBodyText();

		let text	 = "<table id='" + TableMaker.prototype.TableID + "' class='" + (TableMaker.prototype.TableData.tableClass || "") + "'>";
			text	+= "<thead class='" + (TableMaker.prototype.TableData.theadClass || "") + "'>";
			text	+= thead;
			text	+= "</thead>";
			text	+= "<tbody>";
			text	+= tbody;
			text	+= "</tbody></table>";
		
		document.getElementById(TableMaker.prototype.TableData.targetID).innerHTML = text;
	};

	fn_initialize();
};