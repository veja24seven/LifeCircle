var customerAutocompleteDS = new kendo.data.DataSource({
		type: "json",pageSize: 10,
		transport: {read: "/customer/load_autocomplete_customers"}
	}),
	territoriesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/userTerritories"}
        }
	}),
	requestTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/requestTypes"}
        }
	}),
	prevRecordBookStatusesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/recordBookStatuses"}
        }
	}),
	certificateTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/certificateTypes"}
        }
	}),
	registryPortsDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/registryPorts"}
        },
        filter: { field: "countryCode", operator: "eq", value: "na" }
	}), 
	infoTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/requestInfoTypes"}
        }
	}), 
	vesselAutocompleteDS = new kendo.data.DataSource({
		type: "json",pageSize: 10,
		transport: {
			read: {
				type: "POST",
				url:"/vessel/load_autocomplete_vessels",
				dataType: "json",
				contentType: "application/json"
			},
			parameterMap: function(data, type) {
				console.log(kendo.stringify(data.filter));
				if (type == "read") {
					return kendo.stringify({vesselName:data.filter.filters[0].value});
				}
			}
		},
		serverFiltering: true,
	}),
	positionsDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/vesselPositions"}
        }
	}),
	voyageTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/voyageTypes"}
        }
	});

function init(){
	$("#recordBooksTabstrip").kendoTabStrip();
	
	$("#applicationsGrid").kendoGrid({
		pageable: true,
        selectable : true,
        height: 500,
        toolbar: kendo.template($("#applicationsTemplate").html()),
        detailTemplate: kendo.template($("#applicationDetailTemplate").html()),
        detailInit: showApplicationDetail,
		columns : [
		           {title:"Customer/Seafarer",template:"#: customer.name1 #,#: customer.identityNumber #"},
		           {title:"Request Type",field:"requestType.value"},
		           {title:"Certificate Type",field:"certificateType.value"},
		           {title:"Request Date",field:"requestDate"},
		           {title:"Prev Record Book",field:"prevRecordBook"},
		           {title:"Prev Book No",field:"prevRecordBookNo"},
		           {title:"Approved By",field:"approvedBy"},
		           {title:"Approve Date",field:"approvedDate"}
		          ],
	      change : function(){
	          var row = this.select();
	          var data = this.dataItem(row);
	          console.log("Selected: " + data + " Text, [" + JSON.stringify(data) + "]");
	          currentRequestApp = data;
	          
	          if(currentRequestApp.approvedDate==null){
	        	  $("#editApplicationBtn").show();
	        	  $("#approveApplicationBtn").show();	
	          }else{
	        	  $("#editApplicationBtn").hide();
	        	  $("#approveApplicationBtn").hide();
	          }
	      }
	});
	
	attachRequestApplicationToolBarActions();
}

function attachRequestApplicationToolBarActions(){
	$("#applicationSearchBtn").click(function(e){
		searchApplications($("#applicationSearchVal").val());
		e.preventDefault();
	});
	
	$("#applicationSearchVal").keydown(function(e){
        if (e.keyCode==13){
        	searchApplications($("#applicationSearchVal").val());
        }
    });
	
	var createRequestApplicationSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#request-application-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/seafarer_recordbook/create_application",formData,function(data){
			searchApplications(formData.customer.substring(1,formData.customer.indexOf(",")-1));
			$("#editApplicationBtn").hide();
			$("#approveApplicationBtn").hide();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        
	    	alert("Request Application Added successfully.");
		});
	},
	updateRequestApplicationSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#request-application-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/seafarer_recordbook/update_application",formData,function(data){
			searchApplications(formData.customer.substring(1,formData.customer.indexOf(",")-1));
			$("#editApplicationBtn").hide();
			$("#approveApplicationBtn").hide();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        
	    	alert("Request Application Updated successfully.");
		});
	};
	
	$("#addApplicationBtn").click(function(e){
		e.preventDefault();
		display_popup(
				"request-application-form",
				"request-application-form-template",
				null,
				createRequestApplicationSubmitHandler,
				"Add Request Application",
				"500px"
			);
	});
	
	$("#editApplicationBtn").click(function(e){
		e.preventDefault();
		var viewmodel = kendo.observable({
			application : currentRequestApp,
			customer : currentRequestApp.customer.name1+", "+currentRequestApp.customer.identityNumber
		});
		display_popup(
				"request-application-form",
				"request-application-form-template",
				viewmodel,
				updateRequestApplicationSubmitHandler,
				"Edit Request Application",
				"500px"
			);
	});
	
	$("#approveApplicationBtn").click(function(e){
		e.preventDefault();
		sendAjaxPost("/dma/seafarer_recordbook/approve_application/"+currentRequestApp.requestId,{},function(data){
			searchApplications(currentRequestApp.customer.name1);
			$("#editApplicationBtn").hide();
			$("#approveApplicationBtn").hide();
        	alert("Request Application approved successfully.");
    	});
	});
}

function searchApplications(criteria){
	reloadKendoGrid("applicationsGrid","/dma/seafarer_recordbook/search_applications/"+criteria,10);
	$("#approveApplicationBtn").hide();
}

var currentRecordBook = null,
	currentRequestInfo = null,
	currentServiceRecord = null;
function showApplicationDetail(e){
	var detailRow = e.detailRow;
	
	currentRequestApp = e.data;
	
	detailRow.find(".applicationDetailTabstrip").kendoTabStrip();
	
	detailRow.find(".recordbooksGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
            	read: "/dma/seafarer_recordbook/load_recordbooks/"+e.data.requestId
            },
            paging: true,
            pageSize: 10
        },
        scrollable : false,
		pageable: true,
        selectable : true,
        toolbar: kendo.template($("#recordBooksTemplate").html()),
        columns: [
    	          { field: "recordbookNo", title:"Record Book No."},
    	          { field: "issueDate", title:"Issue Date" },
    	          { field: "issuedBy", title: "Issued By"},
    	          { field: "portCode", title: "Port Code"}],
              change : function(){
      	    	var row = this.select();
      	    	var data = this.dataItem(row);
      	    	currentRecordBook = data;
      	    	detailRow.find(".editRecordbookBtn").show();
      	    }
	});
	
	detailRow.find(".requestInfosGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
            	read: "/dma/seafarer_recordbook/load_requestinfos/"+e.data.requestId
            },
            paging: true,
            pageSize: 10
        },
        scrollable : false,
		pageable: true,
        selectable : true,
        toolbar: kendo.template($("#requestInfosTemplate").html()),
        columns: [
    	          { field: "infoType.value", title:"Info Type"},
    	          { field: "available", title:"Is Available" },
    	          { field: "infoDetail", title: "Info Detail"},
    	          { field: "checkedBy", title: "Checked By"},
    	          { field: "checkDate", title: "Checked Date"}],
              change : function(){
      	    	var row = this.select();
      	    	var data = this.dataItem(row);
      	    	currentRequestInfo = data;
      	    	detailRow.find(".editRequestInfoBtn").show();
      	    }
	});
	
	detailRow.find(".serviceRecordsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
            	read: "/dma/seafarer_recordbook/load_servicerecords/"+e.data.requestId
            },
            paging: true,
            pageSize: 10
        },
        scrollable : false,
		pageable: true,
        selectable : true,
        toolbar: kendo.template($("#serviceRecordsTemplate").html()),
        columns: [
                  {title:"Vessel", template:"<a href='/vessel/display/#= vessel.vesselId #' target='_blank'>#= vessel.vesselName #</a>"},
    	          { field: "startDate", title:"Start Date"},
    	          { field: "endDate", title:"End Date" },
    	          { field: "position.positionDescription", title: "Position"},
    	          { field: "ability", title: "Ability"},
    	          { field: "conduct", title: "Conduct"},
    	          { field: "voyageType.value", title: "Voyage Type"},
    	          { field: "voyageDescription", title: "Voyage Description"}],
              change : function(){
      	    	var row = this.select();
      	    	var data = this.dataItem(row);
      	    	currentServiceRecord = data;
      	    	detailRow.find(".editServiceRecordBtn").show();
      	    }
	});
	
	attachRecordBooksToolBarActions(e);
	attachRequestInfosToolBarActions(e);
	attachServiceRecordsToolBarActions(e);
}

function attachRecordBooksToolBarActions(e){
	var detailRow = e.detailRow;
	
	var submitAddRecordBookHandler = function(evt){
		var form = $("#request-recordbook-form");
		var formData = getFormData(form);
		formData.requestId = e.data.requestId;
		
		sendAjaxPost("/dma/seafarer_recordbook/create_recordbook",formData,function(data){
			var grid = detailRow.find(".recordbooksGrid").data("kendoGrid");
			grid.dataSource.read();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();

	        detailRow.find(".editRecordbookBtn").hide();
	    	alert("Request Record Book added successfully.");
		});
	},
	submitEditRecordBookHandler = function(evt){
		var form = $("#request-recordbook-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/seafarer_recordbook/update_recordbook",formData,function(data){
			var grid = detailRow.find(".recordbooksGrid").data("kendoGrid");
			grid.dataSource.read();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();

	        detailRow.find(".editRecordbookBtn").hide();
	    	alert("Request Record Book updated successfully.");
		});
	};
	
	detailRow.find(".addRecordbookBtn").click(function(evt){
		evt.preventDefault();
    	display_popup(
			"request-recordbook-form",
			"request-recordbook-form-template",
			null,
			submitAddRecordBookHandler,
			"Add Request Record Book",
			"500px"
		);
    });
	
	detailRow.find(".editRecordbookBtn").click(function(evt){
		evt.preventDefault();
    	var viewModel = kendo.observable({
    		recordbook : currentRecordBook
    	});
    	display_popup(
			"request-recordbook-form",
			"request-recordbook-form-template",
			viewModel,
			submitEditRecordBookHandler,
			"Edit Request Record Book",
			"500px"
		);
    });
}


function attachRequestInfosToolBarActions(e){
	var detailRow = e.detailRow;
	
	var submitAddRequestInfoHandler = function(evt){
		var form = $("#request-info-form");
		var formData = getFormData(form);
		formData.requestId = e.data.requestId;
		
		sendAjaxPost("/dma/seafarer_recordbook/create_requestinfo",formData,function(data){
			var grid = detailRow.find(".requestInfosGrid").data("kendoGrid");
			grid.dataSource.read();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();

	        detailRow.find(".editRequestInfoBtn").hide();
	    	alert("Request Info added successfully.");
		});
	},
	submitEditRequestInfoHandler = function(evt){
		var form = $("#request-info-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/seafarer_recordbook/update_requestinfo",formData,function(data){
			var grid = detailRow.find(".requestInfosGrid").data("kendoGrid");
			grid.dataSource.read();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();

	        detailRow.find(".editRequestInfoBtn").hide();
	    	alert("Request Info updated successfully.");
		});
	};
	
	detailRow.find(".addRequestInfoBtn").click(function(evt){
		evt.preventDefault();
    	display_popup(
			"request-info-form",
			"request-info-form-template",
			null,
			submitAddRequestInfoHandler,
			"Add Request Info",
			"500px"
		);
    });
	
	detailRow.find(".editRequestInfoBtn").click(function(evt){
		evt.preventDefault();
    	var viewModel = kendo.observable({
    		info : currentRequestInfo
    	});
    	display_popup(
			"request-info-form",
			"request-info-form-template",
			viewModel,
			submitEditRequestInfoHandler,
			"Edit Request Info",
			"500px"
		);
    });
}


function attachServiceRecordsToolBarActions(e){
	var detailRow = e.detailRow;
	
	var submitAddServiceRecordHandler = function(evt){
		var form = $("#request-servicerecord-form");
		var formData = getFormData(form);
		formData.requestId = e.data.requestId;
		
		sendAjaxPost("/dma/seafarer_recordbook/create_servicerecord",formData,function(data){
			var grid = detailRow.find(".serviceRecordsGrid").data("kendoGrid");
			grid.dataSource.read();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();

	        detailRow.find(".editServiceRecordBtn").hide();
	    	alert("Request Service Record added successfully.");
		});
	},
	submitEditServiceRecordHandler = function(evt){
		var form = $("#request-servicerecord-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/seafarer_recordbook/update_servicerecord",formData,function(data){
			var grid = detailRow.find(".serviceRecordsGrid").data("kendoGrid");
			grid.dataSource.read();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();

	        detailRow.find(".editServiceRecordBtn").hide();
	    	alert("Request Service Record updated successfully.");
		});
	};
	
	detailRow.find(".addServiceRecordBtn").click(function(evt){
		evt.preventDefault();
    	display_popup(
			"request-servicerecord-form",
			"request-servicerecord-form-template",
			null,
			submitAddServiceRecordHandler,
			"Add Request Service Record",
			"500px"
		);
    });
	
	detailRow.find(".editServiceRecordBtn").click(function(evt){
		evt.preventDefault();
    	var viewModel = kendo.observable({
    		vessel : currentServiceRecord.vessel.vesselName+", "+currentServiceRecord.vessel.regNo,
    		servicerecord : currentServiceRecord
    	});
    	display_popup(
			"request-servicerecord-form",
			"request-servicerecord-form-template",
			viewModel,
			submitEditServiceRecordHandler,
			"Edit Request Service Record",
			"500px"
		);
    });
}
