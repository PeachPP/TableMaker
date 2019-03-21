/*
TableMaker.js v0.1 | https://github.com/PeachPP/TableMaker | MIT license
*/


function TableMaker(TableData) {
	TableMaker.prototype.headerDataArray = new Array();
	TableMaker.prototype.bodyDataArray;
	TableMaker.prototype.columns = new Array();
	TableMaker.prototype.bodyText;

	this.TableData = TableData;
	this.TableID = "TMK_" + TableData.targetID;
	
	const fn_makeHeader = (arr, i, depth) => {
		if(! i) {
			i = 0;
		}
		if(! depth) {
			depth = 0;
		}

		if(! arr[i].length) {
			this.headerDataArray[depth] = this.headerDataArray[depth] ? this.headerDataArray[depth] : "";
			
			let childColCount = fn_getChildColsCount(arr[i]);

			let rowspan		= arr[i].rowspan	?	" rowspan='"	+ arr[i].rowspan	+ "'" : "";
			let colspan		= arr[i].childCols	?	" colspan='"	+ childColCount		+ "'" : "";
			let styleClass	= arr[i].styleClass	?	" class='"		+ arr[i].styleClass	+ "'" : "";
			let name		= arr[i].name		?	" name='"		+ arr[i].name		+ "'" : "";
			let columnID	= arr[i].columnID	?	" id='"			+ arr[i].columnID	+ "'" : "";
			let columnWidth	= arr[i].width		?	" width='"		+ arr[i].width		+ "'" : "";
			let columnName	= arr[i].columnName;
			let htmlTxt		= "<th" + columnID + name + styleClass + rowspan + colspan + columnWidth + ">" + columnName + "</th>";
			this.headerDataArray[depth] += htmlTxt;

			if(! arr[i].childCols) {
				this.columns.push({"columnName" : columnName, "columnID"	: arr[i].columnID});
			}
		}

		if(arr[i].childCols) {
			fn_makeHeader(arr[i].childCols, 0, ++depth);
			
			depth--;
		}

		if(i < arr.length-1) {
			fn_makeHeader(arr, ++i, depth);
		}

		return this.headerDataArray;
	};

	TableMaker.prototype.getHeaderText = () => {
		let text = "";
		this.headerDataArray.forEach(element => {
			text += "<tr>" + element + "</tr>";
		});
		return text;
	};

	const fn_getChildColsCount = (obj) => {
		let count = 0;
		
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
		return count;
	};
	
	const fn_makeRowData = (bodyData) => {
		this.bodyDataArray = new Array();
		let text = "";

		for(let i = 0; i < bodyData.length; i++) {
			text += "<tr>";
				for(let j = 0; j < this.columns.length; j++) {
					let columnID = this.columns[j].columnID;
					let value = bodyData[i][columnID];
					let rowData = {"id": columnID, "value": value};
					this.bodyDataArray.push(rowData);

					text += "<td>";
						if(value) {
							text += value;
						}
					text += "</td>";
				}
			text += "</tr>";
		}
		this.bodyText = text;
		return this.bodyDataArray;
	};

	TableMaker.prototype.getBodyText = () => {
		return this.bodyText;
	};

	TableMaker.prototype.empty = () => {
		let table = document.getElementById(this.TableID);
		for(let i = 0; i < table.tBodies.length; i++) {
			table.tBodies[i].innerHTML = "";
		}
	};

	const fn_initialize = () => {
		if((! this.TableData.headerData) || (! this.TableData.bodyData)) {
			
		}
		fn_makeHeader(this.TableData.headerData);
		fn_makeRowData(this.TableData.bodyData);
		
		let thead = this.getHeaderText();
		let tbody = this.getBodyText();

		let text	 = "<table id='" + this.TableID + "' class='" + (this.TableData.tableClass || "") + "'>";
			text	+= "<thead class='" + (this.TableData.theadClass || "") + "'>";
			text	+= thead;
			text	+= "</thead>";
			text	+= "<tbody>";
			text	+= tbody;
			text	+= "</tbody></table>";
		
		document.getElementById(this.TableData.targetID).innerHTML = text;
	};

	fn_initialize();
};