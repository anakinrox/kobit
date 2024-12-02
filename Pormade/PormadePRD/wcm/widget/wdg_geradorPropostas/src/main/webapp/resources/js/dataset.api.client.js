var DATASET_API = {
		async:true,
		
		datasetCall: function (datasetData,successCallBack,instancia) {
			var dataset = "";
	    	if(datasetData){
		    	var _this = this;
		    	var _start = new Date();
		    	
		    	$.ajax({
					url: '/api/public/ecm/dataset/datasets',
					dataType: 'json',
					contentType: 'application/json',
					type: "POST",
					async: _this.async,
		            data: JSON.stringify(datasetData),
		            success:function(data, status, xhr){
		            	console.debug("DATASET_API-SUCCESS-time:" + (new Date() - _start));
		            	dataset = data.content;		  
		            	successCallBack(dataset,instancia);
		            },
					fail: function(xhr, status, error){
						console.debug("DATASET_API-FAIL-time:" + (new Date() - _start));
						dataset = xhr;
					}
		    	});
	    	}
	    	return dataset;
	    },
}

var DatasetVO = function(name, fields, constraints, order){
	this.name = (name) ? name : "";
	this.fields = (fields) ? fields : [""];
	this.constraints = (constraints) ? constraints : [];//ConstraintVO
	this.order = (order) ? order : [""];
}
var ConstraintVO = function(field, initialValue, finalValue, type, likeSearch){
	this._field = (field) ? field : "";
	this._initialValue = (initialValue) ? initialValue : "";
	this._finalValue = (finalValue) ? finalValue : "";
	this._type = (type) ? type : 0;//type of the constraint (0 - MUST, 1 - SHOULD, 2 - MUST_NOT)
	this._likeSearch = (likeSearch == undefined) ? false : likeSearch;
}