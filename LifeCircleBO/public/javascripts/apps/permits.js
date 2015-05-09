var customerAutocompleteDS = new kendo.data.DataSource({
	type: "json",pageSize: 10,
	transport: {read: "/customer/load_autocomplete_customers"}
}),
permitTypesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/dma/permits/load_permit_types"}
	}
}),
durationTypesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/durationTypes"}
	}
}),
documentTypesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/documentTypes"}
	}
}),
namibianPortsDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/registryPorts"}
    },
    filter: { field: "countryCode", operator: "eq", value: "na" }
});
function init(){
	$("#permits-tabstrip").kendoTabStrip();
	
	$("#applicationsGrid").kendoGrid({
		pageable: true, selectable : true, height: 500,
		toolbar: kendo.template($("#applications-grid-toolbar-template").html()),
		detailTemplate: kendo.template($("#applications-grid-detail-template").html()),
		detailInit: showPermitApplicationsDetail,
		columns : [
		    {title:"Customer", template:"#=customer.name1# #=customer.name2#"},
		    {title:"Agent", template:"#=agent.name1# #=agent.name2#"},
		    {title:"Permit Type", field:"permitType.permitName"},
		    {title:"Permit Details", field:"permitDetails", template:"<code>#= permitDetails #</code>"},
		    {title:"Application Date", field:"applicationDate"},
		    {title:"Application No", field:"applicationNo"},
		    {title:"Port Code", field:"portCode.description"},
		    {title:"Approval Status", field:"approvalStatus.value"}
		],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			currentPermitApplication = data;
			
			if(currentPermitApplication.approvalStatus.value==="PENDING"){
				$("#applicationEditBtn").show();
				$("#applicationApprovalBtn").show();
			}
		}
	});
	
	var durationTypeDropDownEditor = function(container, options){
		$('<input required data-bind="value:' + options.field + '"/>')
	    .appendTo(container)
	    .kendoDropDownList({
	        autoBind: false,
	        optionLabel: "-Please Select-",
	        dataTextField: "value",
	        dataValueField: "variableId",
	        dataSource: durationTypesDS
	    });
	}
	
	var flagDropDownEditor = function(container, options){
		$('<input required data-bind="value:' + options.field + '"/>')
	    .appendTo(container)
	    .kendoDropDownList({
	        autoBind: false,
	        optionLabel: "-Please Select-",
	        dataSource: ['YES','NO']
	    });
	}
	
	$("#permitTypesGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
            	read: {
                    url: "/dma/permits/load_permit_types",
                    dataType: "json"
                },
                update: {
                	type: "POST",
                    url: "/dma/permits/update_permit_type",
                    dataType: "json",
                    contentType : "application/json"
                },
                create: {
                	type: "POST",
                	url: "/dma/permits/create_permit_type",
                    dataType: "json",
                    contentType : "application/json"
                },
                parameterMap: function (model, operation) {
                    if (operation !== "read" && model) {
                    	console.log("Model "+kendo.stringify(model));
                    	return JSON.stringify(model);
                    }
                }
            },
            paging: true,
            pageSize: 20,
            schema: {
                model: {
                    id: "permitTypeId",
                    fields: {
                    	permitTypeId : {editable : false, nullable : false},
                    	permitName : {editable : true, validation:{required:true}},
                    	validPeriod : {editable : true, type: "number", validation: { required: true, min: 1} },
                    	durationType : {editable : true, validation:{required:true} },
                    	paidFor : {editable : true, validation:{required:true} }
                    }
                }
            }
        },
        pageable: true,selectable : true,
        toolbar: ["create"], editable:"inline",
		detailTemplate: kendo.template($("#permit-types-grid-toolbar-template").html()),
		detailInit: showPermitTypesDetail,
		columns : [
				    {title:"Permit Name", field:"permitName"},
				    {title:"Valid Period", field:"validPeriod"},
				    {title:"Duration Type", field:"durationType", template:"#=durationType.value#", editor: durationTypeDropDownEditor},
				    {title:"Paid For", field:"applicationNo", template:"#= paidFor? 'YES':'NO' #", editor: flagDropDownEditor},
				    { command: ["edit"], title: "&nbsp;", width: "172px" }
				]
	});
	
	attachApplicationsToolBarActions();
}

function attachApplicationsToolBarActions(){
	$("#searchBtn").click(function(e){
		e.preventDefault();
		searchApplications($("#searchField").val());
    });

    $("#searchField").keydown(function(e){
        if (e.keyCode==13){
        	searchApplications($("#searchField").val());
        }
    });
    
    var createApplicationSubmitHandler = function(e){
    	e.preventDefault();
		var form = $("#application-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/permits/create_permit_application",formData,function(data){
			searchApplications(formData.applicationNo);
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Permit Application Added successfully.");
		});
    },
    updateApplicationSubmitHandler = function(e){
    	e.preventDefault();
		var form = $("#application-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/permits/update_permit_application",formData,function(data){
			searchApplications(formData.applicationNo);
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Permit Application  successfully.");
		});
    }
    
    $("#applicationAddBtn").click(function(e){
    	e.preventDefault();
    	display_popup(
    			"application-form",
    			"application-form-template",
    			null,
    			createApplicationSubmitHandler,
    			"Add Permit Application",
    			"500px"
    		);
    });
    
    $("#applicationEditBtn").click(function(e){
    	e.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentPermitApplication,
    		customer : currentPermitApplication.customer.name1+", "+currentPermitApplication.customer.identityNumber,
    		agent : currentPermitApplication.agent.name1+", "+currentPermitApplication.agent.identityNumber
    	});
    	display_popup(
    			"application-form",
    			"application-form-template",
    			viewmodel,
    			updateApplicationSubmitHandler,
    			"Edit Permit Application",
    			"500px"
    		);
    });
    
    $("#applicationApprovalBtn").click(function(e){
    	e.preventDefault();
    	sendAjaxPost("/dma/permits/approve_permit_application",{applicationId:currentPermitApplication.applicationId},function(data){
    		searchApplications(currentPermitApplication.applicationNo);
        	alert("Permit Application approved successfully.");
    	});
    });
}

function searchApplications(value){
	reloadKendoGrid("applicationsGrid","/dma/permits/search_permit_applications/"+value,10);
	currentPermitApplication = null;
	
	$("#applicationEditBtn").hide();
	$("#applicationApprovalBtn").hide();
}

var currentPermitDocument = null,currentPermitDetail = null;
function showPermitApplicationsDetail(e){
	var detailRow = e.detailRow;
	
	detailRow.find(".applications-grid-detail-tabstrip").kendoTabStrip();
	
	detailRow.find(".permitsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/permits/load_permits/"+e.data.applicationId
            },
            paging: true,
            pageSize: 5
        },
        pageable: true,selectable : true,
		toolbar: kendo.template($("#permits-grid-toolbar-template").html()),
		columns: [
		          { field: "permitRefNo", title:"Permit Ref No"},
		          { field: "issueDate", title: "Issue Date"},
		          { field: "expireDate", title: "Expire Date"},
		          { field: "receiptNo", title: "Receipt No"},
		          { field: "receiptDate", title: "Receipt Date"},
		          { field: "issuedBy", title: "Issued By"}],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			currentPermitDetail = data;
			
			detailRow.find(".permitEditBtn").show();
		}
	});
	
	detailRow.find(".documentsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/permits/load_permits_documents/"+e.data.applicationId
            },
            paging: true,
            pageSize: 5
        },
        pageable: true,selectable : true,
		toolbar: kendo.template($("#documents-grid-toolbar-template").html()),
		columns: [
		          { field: "documentType.value", title:"Document Type"},
		          { field: "documentUrl", title:"URL", template:'<a href="/dma/permits/download/'+e.data.applicationId+'/#=documentId#" target="_blank">#= documentUrl #</a>'},
		          { field: "documentRefNo", title:"Doc Ref No." },
		          { field: "documentDate", title: "Doc Date"}],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			currentPermitDocument = data;
			
			detailRow.find(".documentDeleteBtn").show();
		}
	});
	
	if(currentPermitApplication.approvalStatus.value==="PENDING"){
		attachPermitsToolBarActions(e);
		attachPermitDocumentsToolBarActions(e);
	}
}

function attachPermitsToolBarActions(e){
	var detailRow = e.detailRow;
	
	var createPermitSubmitHandler = function(evt){
		evt.preventDefault();
		var form = $("#permit-form");
		var formData = getFormData(form);
		formData.applicationId = e.data.applicationId;
		
		sendAjaxPost("/dma/permits/create_permit",formData,function(data){
			var grid = detailRow.find(".permitsGrid").data("kendoGrid");
			grid.dataSource.read();
			detailRow.find(".permitEditBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Permit Added successfully.");
		});
	},
	updatePermitSubmitHandler = function(evt){
		evt.preventDefault();
		var form = $("#permit-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/permits/update_permit",formData,function(data){
			var grid = detailRow.find(".permitsGrid").data("kendoGrid");
			grid.dataSource.read();
			detailRow.find(".permitEditBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Permit Updated successfully.");
		});
	};
	
	detailRow.find(".permitAddBtn").click(function(evt){
    	evt.preventDefault();
    	display_popup(
    			"permit-form",
    			"permit-form-template",
    			null,
    			createPermitSubmitHandler,
    			"Add Permit",
    			"500px"
    		);
    });
	
	detailRow.find(".permitEditBtn").click(function(evt){
    	evt.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentPermitDetail
    	});
    	display_popup(
    			"permit-form",
    			"permit-form-template",
    			viewmodel,
    			updatePermitSubmitHandler,
    			"Edit Permit",
    			"500px"
    		);
    });
}

function attachPermitDocumentsToolBarActions(e){
	var detailRow = e.detailRow;
	
	var submitDocumentHandler = function(evt){
		evt.preventDefault();
		
		var kendoUploadButton = $(".k-upload-selected");
    	if (kendoUploadButton)
    		kendoUploadButton.click();
	};
	
	detailRow.find(".documentDeleteBtn").click(function(evt){
		evt.preventDefault();
		sendAjaxPost("/dma/permits/permit_doc_delete",{applicationId:e.data.applicationId,documentId:currentPermitDocument.documentId},function(data){
			var grid = detailRow.find(".documentsGrid").data("kendoGrid");
			grid.dataSource.read();
			detailRow.find(".documentDeleteBtn").hide();
			
        	alert("Permit Document deleted successfully.");
    	});
	});
	
	detailRow.find(".documentAddBtn").click(function(evt){
		evt.preventDefault();
		display_popup(
				"permit-document-form",
				"permit-document-form-template",
				null,
				submitDocumentHandler,
				"Add Permit Document",
				"500px"
		);
		
		initDocumentUploadWidget("/dma/permits/permit_doc_upload/"+e.data.applicationId,"permit-document-form",function(event){
			var grid = detailRow.find(".documentsGrid").data("kendoGrid");
			grid.dataSource.read();
			var form = $("#permit-document-form");
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        $("#current-form-window").data("kendoWindow").destroy();
	        detailRow.find(".documentDeleteBtn").hide();
	    	alert("Permit Document uploaded successfully.");
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

var currentPermitTemplate = null;
function showPermitTypesDetail(e){
	var detailRow = e.detailRow;
	
	detailRow.find(".templatesGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/permits/load_permit_templates/"+e.data.permitTypeId
            },
            paging: true,
            pageSize: 5
        },
        pageable: true,selectable : true,
		toolbar: kendo.template($("#permit-templates-grid-toolbar-template").html()),
		columns: [
		          { field: "templateFile", title:"Template File"},
		          { field: "templateText", title: "Template Text"}],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			currentPermitTemplate = data;
			
			detailRow.find(".templateEditBtn").show();
		}
	});
	
	var createPermitTemplateSubmitHandler = function(evt){
		evt.preventDefault();
		var form = $("#permit-template-form");
		var formData = getFormData(form);
		formData.permitTypeId = e.data.permitTypeId;
		
		sendAjaxPost("/dma/permits/create_permit_template",formData,function(data){
			var grid = detailRow.find(".templatesGrid").data("kendoGrid");
			grid.dataSource.read();
			detailRow.find(".templateEditBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Permit Template Added successfully.");
		});
	},
	updatePermitTemplateSubmitHandler = function(evt){
		evt.preventDefault();
		var form = $("#permit-template-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/permits/update_permit_template",formData,function(data){
			var grid = detailRow.find(".templatesGrid").data("kendoGrid");
			grid.dataSource.read();
			detailRow.find(".templateEditBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Permit Template Updated successfully.");
		});
	};
	
	detailRow.find(".templateAddBtn").click(function(evt){
    	evt.preventDefault();
    	display_popup(
    			"permit-template-form",
    			"permit-template-form-template",
    			null,
    			createPermitTemplateSubmitHandler,
    			"Add Permit Template",
    			"500px"
    		);
    });
	
	detailRow.find(".templateEditBtn").click(function(evt){
    	evt.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentPermitTemplate
    	});
    	display_popup(
    			"permit-template-form",
    			"permit-template-form-template",
    			viewmodel,
    			updatePermitTemplateSubmitHandler,
    			"Edit Permit Template",
    			"500px"
    		);
    });
}