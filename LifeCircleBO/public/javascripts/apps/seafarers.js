var cocTypesDS = new kendo.data.DataSource({
	type: "json",pageSize: 10,
	transport: {read: "/lookup/cocTypes"}
}),
cocIssueTypesDS = new kendo.data.DataSource({
	type: "json",pageSize: 10,
	transport: {read: "/lookup/cocIssueTypes"}
}),
cocIssueCountriesDS = new kendo.data.DataSource({
	type: "json",pageSize: 10,
	transport: {read: "/lookup/countries"}
}),
cocConventionsDS = new kendo.data.DataSource({
	type: "json",pageSize: 10,
	transport: {read: "/lookup/cocConventions"}
}),
cocRegulationsDS = new kendo.data.DataSource({
	type: "json",pageSize: 10,
	transport: {read: "/lookup/cocRegulations"}
}),
documentTypesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/documentTypes"}
	}
});
function init (message){
	
	$("#seafarersTabstrip").kendoTabStrip();
	
	$("#seafarersGrid").kendoGrid({
        pageable: true,
        selectable : true,
        height: 500,
        toolbar: kendo.template($("#seafarerTemplate").html()),
        detailTemplate: kendo.template($("#seafarerCertificateTemplate").html()),
        detailInit: showSeafarerCertificates,
        columns: [
            { field: "passportPhoto",title:"Photo",template:"<img src='data:image/png;charset=utf-8;base64, #: passportPhoto #' alt='image' width='100' height='100'/>"},  
            { field: "customer", title:"Seafarer Name", template:"#= customer.name1# #= customer.name2 #"},
            { field: "employer.name1", title:"Employer"},
            { field: "seafarerType.value", title:"Seafarer Type"},
            { field: "registerDate",title:"Register Date"},
            { field: "seafarerStatus.value",title:"Status"}],
        change : function(){
            var row = this.select();
            var data = this.dataItem(row);
            currentSeafarer = data;
            console.log("Selected: " + data + " Text, [" + JSON.stringify(data) + "]");
            
            $("#seafarerCOCDetailsTab").show();
            reloadKendoGrid("seafarerCOCDetailsGrid","/seafarers/load_coc_details/"+currentSeafarer.seafarerId,10);
            
            $("#editSeafarerBtn").show();
        }

    });
	
	$("#seafarerCOCDetailsGrid").kendoGrid({
		pageable: true,
        selectable : true,
        toolbar : kendo.template($("#seafarerCocDetailsToolBarTemplate").html()),
        detailTemplate: kendo.template($("#seafarerCOCDetailGridTemplate").html()),
        detailInit: showSeafarerCOCDetailsSubGrid,
        columns : [
           {field:"cocType.value",title:"COC Type"},
           {field:"certificateNo",title:"Certificate No"},
           {field:"cocIssueType.value",title:"Issue Type"},
           {field:"cocIssueDate",title:"Issue Date"},
           {field:"cocExpireDate",title:"Expire Date"},
           {field:"cocIssueCountry.name",title:"Issue Country"},
           {field:"highestCoc",title:"Highest Coc"},
           {field:"approvalStatus.value",title:"Approval Status"},
           {field:"approvalDate",title:"Approval Date"}],
           change : function(){
               var row = this.select();
               var data = this.dataItem(row);
               currentSeafarerCOCDetail = data;
               console.log("Selected: " + data + " Text, [" + JSON.stringify(data) + "]");
               if (data.approvalDate!=null){
            	   $("#editCOCDetailBtn").hide();
       			   $("#approvalCOCDetailBtn").hide();
               }else{
            	   $("#editCOCDetailBtn").show();
       			   $("#approvalCOCDetailBtn").show();
               }
           }
	});
	
	$("#searchSeafarersBtn").click(function(e){
		searchSeafarers($("#seafarerSearchField").val());
	    e.preventDefault();
	});
	
	$("#seafarerSearchField").keydown(function(e){
	    if (e.keyCode==13){
	        searchSeafarers($("#seafarerSearchField").val());
	    }
	});
	
	$("#editSeafarerBtn").click(function(e){
		editSeafarer();
		e.preventDefault();
	});
	
	$("#addNewSeafarerBtn").click(function(e){
		addNewSeafarer();
	    e.preventDefault();
	});
	if (message!="0"){
		if(message==="-1"){
			alert("Failed to save Seafarer Record.");
		}else{
			$("#seafarerSearchField").val(message);
			reloadKendoGrid("seafarersGrid","/seafarers/search/"+message,4);
		}
	}
	
	attachSeafarerCOCDetailsToolBarActions();
}

function attachSeafarerCOCDetailsToolBarActions(){
	var createSeafarerCOCDetailSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#seafarer-coc-detail-form");
		var formData = getFormData(form);
		formData.seafarerId = currentSeafarer.seafarerId;
		
		sendAjaxPost("/seafarers/create_coc_detail",formData,function(data){
			reloadKendoGrid("seafarerCOCDetailsGrid","/seafarers/load_coc_details/"+currentSeafarer.seafarerId,10);
			$("#editCOCDetailBtn").hide();
			$("#approvalCOCDetailBtn").hide();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        
	    	alert("Seafarer COC Detail Added successfully.");
		});
	},
	updateSeafarerCOCDetailSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#seafarer-coc-detail-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/seafarers/update_coc_detail",formData,function(data){
			reloadKendoGrid("seafarerCOCDetailsGrid","/seafarers/load_coc_details/"+currentSeafarer.seafarerId,10);
			$("#editCOCDetailBtn").hide();
			$("#approvalCOCDetailBtn").hide();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        
	    	alert("Seafarer COC Detail Updated successfully.");
		});
	};
	
	$("#addCOCDetailBtn").click(function(e){
		e.preventDefault();
		display_popup(
				"seafarer-coc-detail-form",
				"seafarer-coc-detail-form-template",
				null,
				createSeafarerCOCDetailSubmitHandler,
				"Add Seafarer COC Detail",
				"500px"
			);
	});
	
	$("#editCOCDetailBtn").click(function(e){
		e.preventDefault();
		var viewmodel = kendo.observable({
			cocDetail : currentSeafarerCOCDetail,
		});
		display_popup(
				"seafarer-coc-detail-form",
				"seafarer-coc-detail-form-template",
				viewmodel,
				updateSeafarerCOCDetailSubmitHandler,
				"Edit Seafarer COC Detail",
				"500px"
			);
	});
	
	$("#approvalCOCDetailBtn").click(function(e){
		e.preventDefault();
		sendAjaxPost("/seafarers/approve_coc_detail",{cocId:currentSeafarerCOCDetail.cocId},function(data){
			reloadKendoGrid("seafarerCOCDetailsGrid","/seafarers/load_coc_details/"+currentSeafarer.seafarerId,10);
			$("#editCOCDetailBtn").hide();
			$("#approvalCOCDetailBtn").hide();
        	alert("Seafarer COC Detail approved successfully.");
    	});
	});
}

function searchSeafarers(criteria){
	console.log("Search Seafarers by "+criteria);
	
	reloadKendoGrid("seafarersGrid","/seafarers/search/"+criteria,4);
	$("#approveSeafarerBtn").hide();
	$("#seafarerCOCDetailsTab").hide();
}

var currentSeafarerDocument = null
function showSeafarerCertificates(e){
	var detailRow = e.detailRow;
	
	//initiate tabstrip on a detail
	detailRow.find(".seafarerCertificatesTabstrip").kendoTabStrip();
	
	detailRow.find(".documentsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/seafarers/load_seafarer_documents/"+e.data.seafarerId
            },
            paging: true,
            pageSize: 5
        },
        scrollable : false,
		pageable: true,
        selectable : true,
        height: 250,
        toolbar: kendo.template($("#documentsTemplate").html()),
        columns: [
	          { field: "documentType.value", title:"Document Type"},
	          { field: "documentUrl", title:"URL", template:'<a href="/dma/seafarers/download/'+e.data.seafarerId+'/#=documentId#" target="_blank">#= documentUrl #</a>'},
	          { field: "documentRefNo", title:"Doc Ref No." },
	          { field: "documentDate", title: "Doc Date"}],
	          change : function(){
	  			var row = this.select();
	  			var data = this.dataItem(row);
	  			currentSeafarerDocument = data;
	  			
	  			detailRow.find(".documentDeleteBtn").show();
	  		}
	});
	
	detailRow.find(".certificatesGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/seafarers/load_certificates/"+e.data.seafarerId
            },
            paging: true,
            pageSize: 4
        },
        scrollable : false,
		pageable: true,
        selectable : true,
        height: 250,
        columns: [
	          { field: "certificateType.description", title:"Certificate Type"},
	          { field: "certificateRefNo", title:"Certificate Reg No."},
	          { field: "applicationDate", title:"Application Date" },
	          { field: "issueCountry.name", title: "Issue Country"},
	          { field: "issuePlace", title: "Issue Place"},
	          { field: "expireDate", title: "Expire Date"},
	          { field: "approvalDate", title: "Approval Date"}]
        
	});
	if (e.data.approvalDate==null){
		attachSeafarerDocumentsToolBarActions(e);
	}
}

var addSeafarerFormAdded = false;
function addNewSeafarer(){
	if(addSeafarerFormAdded){
		$("#addNewSeafarer").data("kendoWindow").open();
	    $("#addNewSeafarer").data("kendoWindow").center();
	    return;
	}
	
	addSeafarerFormAdded = true;
	$("#addNewSeafarer").kendoWindow({
        title: "Add New Seafarer",
        actions: ["Close"]
    });
	
	$("#person").kendoAutoComplete({
        dataTextField: "name1",
        filter: "contains",
        minLength: 3,
        dataSource: {
            type: "json",
            pageSize: 10,
            transport: {
                read: "/seafarers/load_autocomplete_persons"
            }
        }
    });
	
	$("#employer").kendoAutoComplete({
        dataTextField: "name1",
        filter: "contains",
        minLength: 3,
        dataSource: {
            type: "json",
            pageSize: 10,
            transport: {
                read: "/customer/load_autocomplete_customers"
            }
        }
    });
	
	$("#seafarerStatus").kendoDropDownList({
        dataTextField: "value",
        dataValueField: "variableId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lookup/seafarerStatuses"
                }
            }
        },
        index: 0
    });
	
	$("#seafarerType").kendoDropDownList({
        dataTextField: "value",
        dataValueField: "variableId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lookup/seafarerTypes"
                }
            }
        },
        index: 0
    });
	
	
	$("#registerDate").kendoDatePicker({
    	format: "yyyy-MM-dd"
    });
	
    $("#addNewSeafarer").data("kendoWindow").open();
    $("#addNewSeafarer").data("kendoWindow").center();

    $("#cancelAddNewSeafarer").click(function(e){
        $("#addNewSeafarerForm")[0].reset();
        $("#addNewSeafarer").data("kendoWindow").close();

    });
}

var editSeafarerFormAdded = false;
function editSeafarer(){
	$("#seafarerId").val(currentSeafarer.seafarerId);
	if(editSeafarerFormAdded){
		$("#editSeafarer").data("kendoWindow").open();
	    $("#editSeafarer").data("kendoWindow").center();
	    return;
	}
	
	editSeafarerFormAdded = true;
	$("#editSeafarer").kendoWindow({
        title: "Edit Seafarer",
        actions: ["Close"]
    });
	
	$("#employerEdit").kendoAutoComplete({
        dataTextField: "name1",
        filter: "contains",
        minLength: 3,
        dataSource: {
            type: "json",
            pageSize: 10,
            transport: {
                read: "/customer/load_autocomplete_customers"
            }
        },
        value:currentSeafarer.employer.name1+","+currentSeafarer.employer.identityNumber
    });
	
	$("#seafarerStatusEdit").kendoDropDownList({
        dataTextField: "value",
        dataValueField: "variableId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lookup/seafarerStatuses"
                }
            }
        },
        value : currentSeafarer.seafarerStatus.variableId
    });
	
	$("#seafarerTypeEdit").kendoDropDownList({
        dataTextField: "value",
        dataValueField: "variableId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lookup/seafarerTypes"
                }
            }
        },
        value : currentSeafarer.seafarerType.variableId
    });
	
	$("#recordbookNoEdit").val(currentSeafarer.recordbookNo);
	
	$("#registerDateEdit").kendoDatePicker({
    	format: "yyyy-MM-dd",
    	value: currentSeafarer.registerDate
    });
	
    $("#editSeafarer").data("kendoWindow").open();
    $("#editSeafarer").data("kendoWindow").center();

    $("#cancelAddNewSeafarerEdit").click(function(e){
        $("#editSeafarerForm")[0].reset();
        $("#editSeafarer").data("kendoWindow").close();

    });
}


function saveSeafarer(formData){
	$.ajax({
        url : "/seafarers/create",
        type : "POST",
        contentType : "application/json",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function (data){
            console.log(JSON.stringify(data));
            if (data.status==="Success"){
            	
            	alert("Customer Created Successfully");
            }else{
                alert("Fail to save :"+data.message);
            }
        },
        error : function (){
            alert("Fail to save : Internal Error");
        }

    });
}

function showSeafarerCOCDetailsSubGrid(e){
	var detailRow = e.detailRow;

	detailRow.find(".seafarerCertificatesTabstrip").kendoTabStrip();
	
	var capacityDS = new kendo.data.DataSource({
        transport: {
            read:  {
                url: "/seafarers/load_coc_capacities/"+e.data.cocId,
                dataType: "json"
            },
            update: {
            	type: "POST",
                url: "/seafarers/update_coc_capacity",
                dataType: "json",
                contentType : "application/json"
            },
            create: {
            	type: "POST",
            	url: "/seafarers/create_coc_capacity",
                dataType: "json",
                contentType : "application/json"
            },
            parameterMap: function (model, operation) {
                if (operation !== "read" && model) {
                	console.log("Model "+kendo.stringify(model));
                	model.cocId = e.data.cocId;
                	return JSON.stringify(model);
                }
            }
        },
        pageSize: 20,
        schema: {
            model: {
                id: "capacityId",
                fields: {
                	capacityId: { editable: false, nullable: true },
                	capacity : { validation: { required: true } },
                	limitation : { validation: { required: true } }
                }
            }
        }
    });
	
	var functionDS = new kendo.data.DataSource({
        transport: {
            read:  {
                url: "/seafarers/load_coc_functions/"+e.data.cocId,
                dataType: "json"
            },
            update: {
            	type: "POST",
                url: "/seafarers/update_coc_function",
                dataType: "json",
                contentType : "application/json"
            },
            create: {
            	type: "POST",
            	url: "/seafarers/create_coc_function",
                dataType: "json",
                contentType : "application/json"
            },
            parameterMap: function (model, operation) {
                if (operation !== "read" && model) {
                	console.log("Model "+kendo.stringify(model));
                	model.cocId = e.data.cocId;
                	return JSON.stringify(model);
                }
            }
        },
        pageSize: 20,
        schema: {
            model: {
                id: "functionId",
                fields: {
                	functionId: { editable: false, nullable: true },
                	funct : { validation: { required: true } },
                	level : { validation: { required: true } },
                	limitation : { validation: { required: true } }
                }
            }
        }
    });
	

	var revalidationDS = new kendo.data.DataSource({
        transport: {
            read:  {
                url: "/seafarers/load_coc_revalidations/"+e.data.cocId,
                dataType: "json"
            },
            update: {
            	type: "POST",
                url: "/seafarers/update_coc_revalidation",
                dataType: "json",
                contentType : "application/json"
            },
            create: {
            	type: "POST",
            	url: "/seafarers/create_coc_revalidation",
                dataType: "json",
                contentType : "application/json"
            },
            parameterMap: function (model, operation) {
                if (operation !== "read" && model) {
                	console.log("Model "+kendo.stringify(model));
                	model.cocId = e.data.cocId;
                	return JSON.stringify(model);
                }
            }
        },
        pageSize: 20,
        schema: {
            model: {
                id: "revalidationId",
                fields: {
                	revalidationId: { editable: false, nullable: true },
                	revalidationDate : { validation: { required: true } },
                	newExpiryDate : { validation: { required: true } },
                	approvalStatus : {editable: false, nullable: true},
                	approvalDate : { editable: false, nullable: true },
                	approvedBy : { editable : false, nullable: true }
                }
            }
        }
    });
	
	detailRow.find(".cocCapacitiesGrid").kendoGrid({
		dataSource : capacityDS,
		toolbar: ["create"],
        selectable : true,
		columns: [
		            { field: "capacity", title:"Capacity"},
		            { field: "limitation",title:"Limitation"},
		            { command: ["edit"], title: "&nbsp;", width: "172px" }],
		        editable : "inline"
	});
	
	detailRow.find(".cocFunctionsGrid").kendoGrid({
		dataSource : functionDS,
		toolbar: ["create"],
        selectable : true,
		columns: [
		            { field: "funct", title:"Function"},
		            { field: "level", title:"Level"},
		            { field: "limitation",title:"Limitation"},
		            { command: ["edit"], title: "&nbsp;", width: "172px" }],
		        editable : "inline"
	});
	
	detailRow.find(".cocRevalidationsGrid").kendoGrid({
		dataSource : revalidationDS,
		toolbar: ["create"],
        selectable : true,
		columns: [
		            { field: "revalidationDate", title:"Revalidation Date", template:"#: kendo.toString(new Date(revalidationDate),'yyyy-MM-dd') #", editor: dateFieldEditor},
		            { field: "newExpiryDate", title:"New Expiry Date", template:"#: kendo.toString(new Date(revalidationDate),'yyyy-MM-dd') #" ,editor: dateFieldEditor},
		            { field: "approvalStatus",title:"Approval Status", template:"#= approvalStatus!=null? approvalStatus.value:''#"},
		            { field: "approvalDate",title:"Approval Date"},
		            { field: "approvedBy",title:"Approved By"},
		            { command: ["edit"], title: "&nbsp;", width: "172px" }],
		        editable : "inline",
		        change : function(){
		  			var row = this.select();
		  			var data = this.dataItem(row);
		  			currentSeafarerCOCRelavidation = data;
		  			
		  			if(currentSeafarerCOCRelavidation.approvalDate==null){
			  			detailRow.find(".approveRevalidationBtn").show();
		  			}else{
			  			detailRow.find(".approveRevalidationBtn").hide();
		  			}
		  		}
	});
	
	detailRow.find(".cocRevalidationsGrid").find(".k-toolbar").append("<a class='approveRevalidationBtn k-button' style='display:none;'>Approve</a>");

	detailRow.find(".approveRevalidationBtn").click(function(evt){
		evt.preventDefault();
		sendAjaxPost("/seafarers/approve_coc_revalidation",{revalidationId:currentSeafarerCOCRelavidation.revalidationId},function(data){
			var grid = detailRow.find(".cocRevalidationsGrid").data("kendoGrid");
			grid.dataSource.read();
			detailRow.find(".approveRevalidationBtn").hide();
        	alert("Seafarer COC Revalidation approved successfully.");
		});
	});
}

function dateFieldEditor(container, options) {
	$('<input required data-bind="value:' + options.field + '"/>')
    .appendTo(container)
    .kendoDatePicker({
    	format:"yyyy-MM-dd"
    });
}

function attachSeafarerDocumentsToolBarActions(e){
	var detailRow = e.detailRow;
	
	var submitDocumentHandler = function(evt){
		evt.preventDefault();
		
		var kendoUploadButton = $(".k-upload-selected");
    	if (kendoUploadButton)
    		kendoUploadButton.click();
	};
	
	detailRow.find(".documentDeleteBtn").click(function(evt){
		evt.preventDefault();
		sendAjaxPost("/seafarers/seafarer_doc_delete",{seafarerId:e.data.seafarerId,documentId:currentSeafarerDocument.documentId},function(data){
			var grid = detailRow.find(".documentsGrid").data("kendoGrid");
			grid.dataSource.read();
			detailRow.find(".documentDeleteBtn").hide();
			
        	alert("Seafarer Document deleted successfully.");
    	});
	});
	
	detailRow.find(".documentAddBtn").click(function(evt){
		evt.preventDefault();
		display_popup(
				"seafarer-document-form",
				"seafarer-document-form-template",
				null,
				submitDocumentHandler,
				"Add Seafarer Document",
				"500px"
		);
		
		initDocumentUploadWidget("/seafarers/seafarer_doc_upload/"+e.data.seafarerId,"seafarer-document-form",function(event){
			var grid = detailRow.find(".documentsGrid").data("kendoGrid");
			grid.dataSource.read();
			var form = $("#seafarer-document-form");
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        $("#current-form-window").data("kendoWindow").destroy();
	        detailRow.find(".documentDeleteBtn").hide();
	    	alert("Seafarer Document uploaded successfully.");
		});
	});
}

function initDocumentUploadWidget(uploadUrl,formId,successHandler){
	
	$("#documentUrl").kendoUpload({
        async: {
            saveUrl: uploadUrl,
            autoUpload: false
        },
        multiple: false,
        select: function (e){
        	setTimeout(function () {
                var kendoUploadButton = $(".k-upload-selected");
                kendoUploadButton.hide();
            }, 1);
        },
        upload : function(e){
        	var form = $("#"+formId+"");
    		var formData = getFormData(form);
    		formData.documentId = 0;
    		console.log("Upload form Data :"+kendo.stringify(formData));
    		e.data = formData;
        },
        error : function(e){
        	alert("Fail to save : Internal Error");
        },
        complete : successHandler,
        
    });
}
