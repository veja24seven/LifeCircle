var customerAutocompleteDS = new kendo.data.DataSource({
		type: "json",pageSize: 10,
		transport: {read: "/customer/load_autocomplete_customers"}
	}),
	territoriesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/userTerritories"}
        }
	}),
	applicationTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/cocApplicationTypes"}
        }
	}),
	operationAreasDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/operationAreas"}
        }
	}),
	operationLevelsDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/operationLevels"}
        }
	}),
	safetyTrainingsDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/safetyTrainings"}
        }
	}),
	certificateTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/certificateTypes"}
        }
	}),
	capacityTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/capacityTypes"}
        }
	}),
	infoTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/cocApplicationInfoTypes"}
        }
	}),
	documentTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/documentTypes"}
		}
	});

function init(){
	$("#cocApplicationsGrid").kendoGrid({
		pageable: true,
        selectable : true,
        height: 500,
		toolbar: kendo.template($("#cocApplicationsGridToolBarTemplate").html()),
        detailTemplate: kendo.template($("#coc-application-detail-template").html()),
        detailInit: showCOCApplicationDetail,
		columns : [
			{title:"Customer", template:"<a href='/customer/display/#=customer.customerId#' target='_blank'>#= customer.name1 # #= customer.name2 #</a>"},
			{field:"applicationPlace",title:"Application Place"},
			{field:"applicationDate",title:"Application Date"},
			{field:"applicationType",title:"Application Type"},
			{field:"safetyTraining",title:"Safety Training"},
			{field:"seaExperience",title:"Experience", template: "#= seaExperience # months"},
			{field:"approvalStatus.value",title:"Approval Status"},
			{field:"approvedDate",title:"Approved Date"}
		],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			currentSeafarerCocApp = data;
			
			if (data.approvedDate!=null){
				$("#editCocApplicationBtn").hide();
				$("#approveCocApplicationBtn").hide();
			}else{
				$("#editCocApplicationBtn").show();
				$("#approveCocApplicationBtn").show();
			}
		}
	});
	
	attachCOCApplicationToolBarActions();
}

function attachCOCApplicationToolBarActions(){
	$("#cocApplicationSearchBtn").click(function(e){
		searchApplications($("#cocApplicationSearchField").val());
		e.preventDefault();
	});
	
	$("#cocApplicationSearchField").keydown(function(e){
        if (e.keyCode==13){
        	searchApplications($("#cocApplicationSearchField").val());
        }
    });
	
	var createCOCApplicationSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#coc-application-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/seafarer_coc_applications/create_coc_application",formData,function(data){
			searchApplications(formData.customer.substring(1,formData.customer.indexOf(",")-1));
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        
	    	alert("COC Application Added successfully.");
		});
	},
	updateCOCApplicationSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#coc-application-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/seafarer_coc_applications/update_coc_application",formData,function(data){
			searchApplications(formData.customer.substring(1,formData.customer.indexOf(",")-1));
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        
	    	alert("COC Application Updated successfully.");
		});
	};
	
	$("#addCocApplicationBtn").click(function(e){
		e.preventDefault();
		display_popup(
				"coc-application-form",
				"coc-application-form-template",
				null,
				createCOCApplicationSubmitHandler,
				"Add COC Application",
				"500px"
			);
	});
	
	$("#editCocApplicationBtn").click(function(e){
		e.preventDefault();
		var viewmodel = kendo.observable({
			application : currentSeafarerCocApp,
			customer : currentSeafarerCocApp.customer.name1+", "+currentSeafarerCocApp.customer.identityNumber
		});
		display_popup(
				"coc-application-form",
				"coc-application-form-template",
				viewmodel,
				updateCOCApplicationSubmitHandler,
				"Edit COC Application",
				"500px"
			);
	});
	
	$("#approveCocApplicationBtn").click(function(e){
		e.preventDefault();
		sendAjaxPost("/dma/seafarer_coc_applications/approve_coc_application/"+currentSeafarerCocApp.applicationId,{},function(data){
			searchApplications(currentSeafarerCocApp.customer.name1);
			
        	alert("COC Application approved successfully.");
    	});
	});
}

function searchApplications(criteria){
	reloadKendoGrid("cocApplicationsGrid","/dma/seafarer_coc_applications/search_coc_applications/"+criteria,10);
	$("#editCocApplicationBtn").hide();
	$("#approveCocApplicationBtn").hide();
}

var currentCOCApplicationInfo = null, currentCOCApplicationDocument = null;
function showCOCApplicationDetail(e){
	var detailRow = e.detailRow;
	
	currentSeafarerCocApp = e.data;
	
	detailRow.find(".coc-application-detail-tabstrip").kendoTabStrip();
	
	detailRow.find(".cocApplicationInfosGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
            	read: "/dma/seafarer_coc_applications/load_coc_application_infos/"+e.data.applicationId
            },
            paging: true,
            pageSize: 10
        },
        scrollable : false,
		pageable: true,
        selectable : true,
        toolbar: kendo.template($("#cocApplicationInfosTemplate").html()),
        columns: [
    	          { field: "infoType.value", title:"Info Type"},
    	          { field: "available", title:"Is Available" },
    	          { field: "infoDetail", title: "Info Detail"},
    	          { field: "checkedBy", title: "Checked By"},
    	          { field: "checkDate", title: "Checked Date"}],
              change : function(){
      	    	var row = this.select();
      	    	var data = this.dataItem(row);
      	    	currentCOCApplicationInfo = data;
      	    	detailRow.find(".editCOCApplicationInfoBtn").show();
      	    }
	});
	
	detailRow.find(".documentsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/seafarer_coc_applications/load_application_documents/"+e.data.applicationId
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
	          { field: "documentUrl", title:"URL", template:'<a href="/dma/seafarer_coc_applications/download/'+e.data.applicationId+'/#=documentId#" target="_blank">#= documentUrl #</a>'},
	          { field: "documentRefNo", title:"Doc Ref No." },
	          { field: "documentDate", title: "Doc Date"}],
	          change : function(){
	  			var row = this.select();
	  			var data = this.dataItem(row);
	  			currentCOCApplicationDocument = data;
	  			
	  			detailRow.find(".documentDeleteBtn").show();
	  		}
	});
	
	attachCOCApplicationInfosToolBarActions(e);
	attachCOCApplicationDocumentsToolBarActions(e);
}

function attachCOCApplicationInfosToolBarActions(e){
	var detailRow = e.detailRow;
	
	var submitAddCOCApplicationInfoHandler = function(evt){
		evt.preventDefault();
		var form = $("#coc-application-info-form");
		var formData = getFormData(form);
		formData.applicationId = e.data.applicationId;
		
		sendAjaxPost("/dma/seafarer_coc_applications/create_coc_application_info",formData,function(data){
			var grid = detailRow.find(".cocApplicationInfosGrid").data("kendoGrid");
			grid.dataSource.read();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();

	        detailRow.find(".editCOCApplicationInfoBtn").hide();
	    	alert("COCApplication Info added successfully.");
		});
	},
	submitEditCOCApplicationInfoHandler = function(evt){
		evt.preventDefault();
		var form = $("#coc-application-info-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/seafarer_coc_applications/update_coc_application_info",formData,function(data){
			var grid = detailRow.find(".cocApplicationInfosGrid").data("kendoGrid");
			grid.dataSource.read();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();

	        detailRow.find(".editCOCApplicationInfoBtn").hide();
	    	alert("COC Application Info updated successfully.");
		});
	};
	
	detailRow.find(".addCOCApplicationInfoBtn").click(function(evt){
		evt.preventDefault();
    	display_popup(
			"coc-application-info-form",
			"coc-application-info-form-template",
			null,
			submitAddCOCApplicationInfoHandler,
			"Add COC Application Info",
			"500px"
		);
    });
	
	detailRow.find(".editCOCApplicationInfoBtn").click(function(evt){
		evt.preventDefault();
    	var viewModel = kendo.observable({
    		info : currentCOCApplicationInfo
    	});
    	display_popup(
			"coc-application-info-form",
			"coc-application-info-form-template",
			viewModel,
			submitEditCOCApplicationInfoHandler,
			"Edit COC Application Info",
			"500px"
		);
    });
}

function attachCOCApplicationDocumentsToolBarActions(e){
	var detailRow = e.detailRow;
	
	var submitDocumentHandler = function(evt){
		evt.preventDefault();
		
		var kendoUploadButton = $(".k-upload-selected");
    	if (kendoUploadButton)
    		kendoUploadButton.click();
	};
	
	detailRow.find(".documentDeleteBtn").click(function(evt){
		evt.preventDefault();
		sendAjaxPost("/dma/seafarer_coc_applications/application_doc_delete",{applicationId:e.data.applicationId,documentId:currentCOCApplicationDocument.documentId},function(data){
			var grid = detailRow.find(".documentsGrid").data("kendoGrid");
			grid.dataSource.read();
			detailRow.find(".documentDeleteBtn").hide();
			
        	alert("COC Application Document deleted successfully.");
    	});
	});
	
	detailRow.find(".documentAddBtn").click(function(evt){
		evt.preventDefault();
		display_popup(
				"application-document-form",
				"application-document-form-template",
				null,
				submitDocumentHandler,
				"Add COC Application Document",
				"500px"
		);
		
		initDocumentUploadWidget("/dma/seafarer_coc_applications/application_doc_upload/"+e.data.applicationId,"application-document-form",function(event){
			var grid = detailRow.find(".documentsGrid").data("kendoGrid");
			grid.dataSource.read();
			var form = $("#application-document-form");
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        $("#current-form-window").data("kendoWindow").destroy();
	        detailRow.find(".documentDeleteBtn").hide();
	    	alert("COC Application Document uploaded successfully.");
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