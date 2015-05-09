function init () {
	$("#vesselEndorsementsTabstrip").kendoTabStrip();
	
	$("#vesselsGrid").kendoGrid({
        pageable: true,
        selectable : true,
        height: 500,
        toolbar: kendo.template($("#vesselsTemplate").html()),
        detailTemplate: kendo.template($("#vesselDetailTemplate").html()),
        columns: [
            { field: "owner.name1", title:"Owner"},
            { field: "regNo", title:"Reg #"},
            { field: "vesselName",title:"Name"},
            { field: "regType.value",title:"Reg. Type"},
            { field: "vesselType.value",title:"Vessel Type"},
            { field: "regPort.description",title:"Reg Port"},
            { field: "regDate",title:"Reg Date"},
            { field: "flagState.name",title:"Flag State"},
            { command: { text: "Endorsements", click: showEndorsements }, title: " ", width: "140px" }],
        change : function(){
            var row = this.select();
            var data = this.dataItem(row);
            currentVessel = data;
            console.log("Selected: " + currentVessel + " Text, [" + JSON.stringify(currentVessel) + "]");
            $("#endorsementsHeader").text("Vessel : "+currentVessel.vesselName+", "+currentVessel.regNo);

            reloadKendoGrid("endorsementsGrid","/endorsements/load/"+currentVessel.vesselId,10);
        }

    });
	
	$("#endorsementsGrid").kendoGrid({
		pageable: true,
        selectable : true,
        toolbar: kendo.template($("#endorsementsTemplate").html()),
        detailTemplate: kendo.template($("#endorsementDetailTemplate").html()),
        detailInit: showEndorsementDetail,
        columns: [
                  { field: "owner.name1", title:"Vessel Owner", template: "#: owner.name1 #, #: owner.identityNumber #"},
                  { field: "transactionType.value", title:"Type"},
                  { field: "transactionDate",title:"Date & Time", template:"#: kendo.toString(new Date(transactionDate),'yyyy-MM-dd HH:mm') #"},
                  { field: "transactionSymbol",title:"Symbol"},
                  { field: "transactionDescription",title:"Description"},
                  { field: "interestAffected.value",title:"Interest Affected"},
                  { field: "approvalStatus.value",title:"Approval Status"},
                  { field: "approvalDate",title:"Approval Date"}],
	    change : function(){
	    	var row = this.select();
	    	var data = this.dataItem(row);
	    	console.log("Selected: " + data + " Text, [" + JSON.stringify(data) + "]");
	    	currentEndorsement = data;
	    	if (currentEndorsement.approvalStatus.value==='PENDING'){
	    		$("#endorsementEditBtn").show();
	    		$("#endorsementApproveBtn").show();
		    	$("#endorsementDenyBtn").show();
	    	}else {
	    		$("#endorsementEditBtn").hide();
	    		$("#endorsementApproveBtn").hide();
		    	$("#endorsementDenyBtn").hide();
	    	}
	    	
	    	
	    }
	});
	$("#endorsementAddBtn").click(function(e){
		e.preventDefault();
		if (currentVessel!=null){
			display_popup(
					"vessel-endorsement-form",
					"vessel-endorsement-form-template",
					null,
					createVesselEndorsementSubmitHandler,
					"Add Vessel Endorsement",
					"500px"
			);
			addTransactionTypeChangeHandler();
		}else{
			alert("Please select Vessel.");
		}
    });
	
	$("#endorsementEditBtn").click(function(e){
		e.preventDefault();
		if (currentVessel!=null){
			var viewmodel = kendo.observable({
				vesselId : currentVessel.vesselId,
				endorsement: currentEndorsement,
				endorsementDate : new Date(currentEndorsement.transactionDate)
			});
			display_popup(
					"vessel-endorsement-form",
					"vessel-endorsement-form-template",
					viewmodel,
					updateVesselEndorsementSubmitHandler,
					"Edit Vessel Endorsement",
					"500px"
			);
			showNewValue(viewmodel);
			addTransactionTypeChangeHandler();
		}else{
			alert("Please select Vessel.");
		}
    });
	
	$("#searchVesselsBtn").click(function(e){
        searchVessel($("#vesselSearch").val());
        e.preventDefault();
    });
	$("#endorsementApproveBtn").click(function(e){
        updateEndorsementApproveStatus(currentEndorsement.vesselEndorsementId,"approve");
        e.preventDefault();
    });
	$("#endorsementDenyBtn").click(function(e){
		updateEndorsementApproveStatus(currentEndorsement.vesselEndorsementId,"deny");
        e.preventDefault();
    });
	
	initializeLookupDataSources();
}

function showNewValue(model){
	var dataItem = currentEndorsement;
	if (dataItem.newValue!=null){
		$("#newValueInputLabel").show();
		$("#newValueInputContainer").show();
	}
	if(dataItem.transactionType.value==='Change of Vessel Owner'){
		$("#newValueInputContainer").append(kendo.template($("#endorsement-vesselowner-field-template").html()));
		kendo.bind($("#newValue"),model);
	}else if(dataItem.transactionType.value==='Change of Vessel Name'){
		$("#newValueInputContainer").append(kendo.template($("#endorsement-vesselname-field-template").html()));
		kendo.bind($("#newValue"),model);
	}else if(dataItem.transactionType.value==='Change of Vessel Type'){
		$("#newValueInputContainer").append(kendo.template($("#endorsement-vesseltype-field-template").html()));
		kendo.bind($("#newValue"),model);
	}else if(dataItem.transactionType.value==='Change of Operation Type'){
		$("#newValueInputContainer").append(kendo.template($("#endorsement-operationtype-field-template").html()));
		kendo.bind($("#newValue"),model);
	}else{
		$("#newValueInputLabel").hide();
		$("#newValueInputContainer").hide();
	}
}

function addTransactionTypeChangeHandler(){
	$("#transactionType").data("kendoDropDownList").bind("select",function(e){
		var dataItem = this.dataItem(e.item.index());
		console.log("event :: select (" + dataItem.value + ")");
		$("#newValueInputContainer").empty();
		$("#newValueInputLabel").show();
		$("#newValueInputContainer").show();
		
		if(dataItem.value==='Change of Vessel Owner'){
			$("#newValueInputContainer").append(kendo.template($("#endorsement-vesselowner-field-template").html()));
			kendo.init($("#newValue"));
		}else if(dataItem.value==='Change of Vessel Name'){
			$("#newValueInputContainer").append(kendo.template($("#endorsement-vesselname-field-template").html()));
			kendo.init($("#newValue"));
		}else if(dataItem.value==='Change of Vessel Type'){
			$("#newValueInputContainer").append(kendo.template($("#endorsement-vesseltype-field-template").html()));
			kendo.init($("#newValue"));
		}else if(dataItem.value==='Change of Operation Type'){
			$("#newValueInputContainer").append(kendo.template($("#endorsement-operationtype-field-template").html()));
			kendo.init($("#newValue"));
		}else{
			$("#newValueInputLabel").hide();
			$("#newValueInputContainer").hide();
		}
	});
}

/**
 * Search Vessels function
 * @param value
 */
function searchVessel(value){
	reloadKendoGrid("vesselsGrid","/vessels/search/namflag/"+value,10);
}

var transactionTypesDS = null, interestAffectedDS = null, 
	attributeTypesDS = null, vesselTypesDS = null,
	operationTypesDS = null, customerAutocompleteDS = null;
function initializeLookupDataSources(){
	transactionTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/transactionTypes"}
        }
	});
	
	interestAffectedDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/interestAffectedVars"}
        }
	});
	
	attributeTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/endorsementAttributeTypes"}
        }
	}); 
	
	vesselTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/vesselTypes"}
        }
	});
	
	operationTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/operationTypes"}
        }
	});
	
	customerAutocompleteDS = new kendo.data.DataSource({
		type: "json",pageSize: 10,
		transport: {read: "/customer/load_autocomplete_customers"}
	});
}

function showEndorsements(e){
	e.preventDefault();

    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    
    currentVessel = dataItem;
    
    $("#endorsementsHeader").text("Vessel : "+dataItem.vesselName+", "+dataItem.regNo);
    var tabStrip = $("#vesselEndorsementsTabstrip").kendoTabStrip().data("kendoTabStrip");
    tabStrip.select(1); 

    $("#endorsementsGrid").data("kendoGrid").dataSource.read();
    
}

function createVesselEndorsementSubmitHandler(e){
	var form = $("#vessel-endorsement-form");
	var formData = getFormData(form);
	formData.vessel = currentVessel.vesselId;
	
	sendAjaxPost("/endorsements/create",formData,function(data){
		reloadKendoGrid("endorsementsGrid","/endorsements/load/"+currentVessel.vesselId,10);
		$("#endorsementEditBtn").hide();
		$("#endorsementApproveBtn").hide();
    	$("#endorsementDenyBtn").hide();
		
    	
    	form[0].reset();
        $("#current-form-window").data("kendoWindow").close();
        
    	alert("Vessel Endorsement Added successfully.");
	});
}

function updateVesselEndorsementSubmitHandler(e){
	var form = $("#vessel-endorsement-form");
	var formData = getFormData(form);
	formData.vessel = currentVessel.vesselId;
	
	sendAjaxPost("/endorsements/update",formData,function(data){
		reloadKendoGrid("endorsementsGrid","/endorsements/load/"+currentVessel.vesselId,4);
		$("#endorsementEditBtn").hide();
		$("#endorsementApproveBtn").hide();
    	$("#endorsementDenyBtn").hide();
		
    	
    	form[0].reset();
        $("#current-form-window").data("kendoWindow").close();
        
    	alert("Vessel Endorsement Updated successfully.");
	});
}

function updateEndorsementApproveStatus(id,status){
	$.ajax({
        url : "/endorsements/update_approval",
        type : "POST",
        contentType : "application/json",
        dataType : "json",
        data : JSON.stringify({endorsementId:id,status:status}),
        success : function (data){
        	console.log(JSON.stringify(data));
            if (data.status==="Success"){
            	reloadKendoGrid("endorsementsGrid","/endorsements/load/"+currentVessel.vesselId,10);
            	$("#endorsementApproveBtn").hide();
		    	$("#endorsementDenyBtn").hide();
            }else{
                alert("Fail to save :"+data.message);
            }
        },
        error : function (){
            alert("Fail to save : Internal Error");
        }

    });
}

var currentAttribute = null;
function showEndorsementDetail(e){
	
	var detailRow = e.detailRow;
	
	//initiate grids
	detailRow.find(".endorsementAttributesGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
            	read: "/endorsements/load_attributes/"+e.data.vesselEndorsementId
            },
            paging: true,
            pageSize: 10
        },
        scrollable : false,
		pageable: true,
        selectable : true,
        toolbar: kendo.template($("#endorsementAttributesTemplate").html()),
        columns: [
	          { field: "attributeType.value", title:"Information Type"},
	          { field: "attributeValue", title:"Information Value"},
	          { field: "dateCreated", title:"Date Added" },
	          { field: "createdBy", title: "Added By"}],
	          change : function(){
	              var row = this.select();
	              var data = this.dataItem(row);
	              currentAttribute = data;
	              detailRow.find(".attributeEditBtn").show();
	          }
        
	});
	detailRow.find(".attributeAddBtn").click(function(evt){
		evt.preventDefault();
		display_popup(
				"endorsement-attribute-form",
				"endorsement-attribute-form-template",
				null,
				submitCreateAttributeHandler,
				"Add Additional Info",
				"410px"
		);
	});
	
	detailRow.find(".attributeEditBtn").click(function(evt){
		evt.preventDefault();
		var viewModel = kendo.observable({
			attribute : currentAttribute
		});
		display_popup(
				"endorsement-attribute-form",
				"endorsement-attribute-form-template",
				viewModel,
				submitUpdateAttributeHandler,
				"Edit Additional Info",
				"410px"
		);
	});
	
	var submitCreateAttributeHandler = function(evt){
		evt.preventDefault();
		var form = $("#endorsement-attribute-form");
		var formData = getFormData(form);
		formData.endorsement = e.data.vesselEndorsementId;
		
		sendAjaxPost("/endorsements/create_attribute",formData,function(data){
			var grid = detailRow.find(".endorsementAttributesGrid").data("kendoGrid");
			grid.dataSource.read();
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        detailRow.find(".attributeEditBtn").hide();
	    	alert("Endorsement Addictional Info added successfully.");
		});
	}
	
	var submitUpdateAttributeHandler = function(evt){
		evt.preventDefault();
		var form = $("#endorsement-attribute-form");
		var formData = getFormData(form);
		formData.endorsement = e.data.vesselEndorsementId;
		
		sendAjaxPost("/endorsements/update_attribute",formData,function(data){
			var grid = detailRow.find(".endorsementAttributesGrid").data("kendoGrid");
			grid.dataSource.read();
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        detailRow.find(".attributeEditBtn").hide();
	    	alert("Endorsement Addictional Info updated successfully.");
		});
	}
}