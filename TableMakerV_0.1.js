// TableMakerV.js v0.1 | https://github.com/PeachPP/TableMaker | MIT license

function TableMakerV(TableOptions) {
	this.bodyHTMLText;

	this.TableOptions = JSON.parse(JSON.stringify(TableOptions));
	this.TableID = "TMK_" + this.TableOptions.targetID;
	
	this.TableData;

	TableMakerV.prototype.init = function() {
		this.TableData = JSON.parse(JSON.stringify(this.TableOptions.data));
		var opt = JSON.parse(JSON.stringify(this.TableOptions));

		let trs = "";
		
		if(! opt.thData) {
			this.TableData.forEach(function(element) {
				let eleKey = Object.keys(element);
				let tds = "";
				eleKey.forEach(function(key) {
					tds += "<td>" + element[key] + "</td>";
				});
				trs += "<tr>" + tds + "</tr>";
			});
		} else if(typeof opt.thData != undefined && opt.thData.length) {
			opt.thData.forEach(function(element) {
				let tds = "<td>" + element.label + "</td>";
				var header = element.header;
				var val = opt.data[header] || "";
				var formatType = element.formatType;
				if(formatType)
					val = TableMaker.prototype.formatType(formatType, val);
				tds += "<td>" + val + "</td>";

				trs += "<tr>" + tds + "</tr>";
			});
		}
		let tableStart = "<table id='" + this.TableID + "' class='" + (opt.class || "") + "'>";
		let body = "<tbody id='" + this.TableID + "_body'>" + trs + "</tbody>";
		let colgroup = opt.colgroup || "";
		let tableEnd = "</table>";

		this.bodyHTMLText = body;
		let innerHTML = tableStart + colgroup + body + tableEnd;
		let target = document.getElementById(opt.targetID);
		target.innerHTML = innerHTML;
	};
	TableMakerV.prototype.changeData = function(bodyData, thData) {
		this.TableOptions.data = JSON.parse(JSON.stringify(bodyData));
		if(thData)
			this.TableOptions.thData = JSON.parse(JSON.stringify(thData));
		this.init();
	};
	
	TableMakerV.prototype.formatType = function(type, value, customFnc) {
		switch(type) {
		case "number":
			if(! value) return 0;
			if(typeof value == "string")
				value = value.trim();
			else if(typeof value == "number")
				value = (value || "").toString();
			
			let val = value.split(".");
			
		    let val0 = val[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
		    let val1 = val[1] || "";
		    if(val1) val1 = "."+val1;
		    return val0 + val1;
		    
		    break;
	    case "date":
	    	if(value.length == null || value.length != 8) return "";
	    		return value.substring(0,4) + "-" + value.substring(4,6) + "-" + value.substring(6);
	    	break;
		}
	};
	this.init();
}