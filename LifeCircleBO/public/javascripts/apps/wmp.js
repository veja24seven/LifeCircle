var documentTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/documentTypes"}
    	}
	}),
	wmpTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/wmpTypes"}
    	}
	}),
	trackingActionsDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/trackingActions"}
    	}
	}),
	approvalStatusesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/approvalStatuses"}
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
	});

var currentApplication = null, currentApplicationDocument = null, currentApplicationTracking = null;
function init(){
	$("#wmp-tabstrip").kendoTabStrip();
	
	$("#wmpApplicationsGrid").kendoGrid({
		pageable: true, selectable : true, height: 500,
		toolbar: kendo.template($("#applications-grid-toolbar-template").html()),
		detailTemplate: kendo.template($("#applications-grid-detail-template").html()),
		detailInit: showApplicationDetail,
		columns : [
		    {title:"Vessel Name", field:"vessel.vesselName"},
		    {title:"Owner", field:"owner.name1"},
		    {title:"Application No", field:"applicationNo"},
		    {title:"Application Date", field:"applicationDate"},
		    {title:"WMP Type", field:"wmpType.value"},
		    {title:"Received Date", field:"receivedDate"},
		    {title:"Received By", field:"receivedBy"},
		    {title:"Received Office", field:"receivedOffice.value"},
		    {title:"Receipt No", field:"receiptNo"},
		    {title:"Receipt Date", field:"receiptDate"},
		    {title:"Owner Contacts", field:"ownerContacts"},
		    {title:"Status", field:"approvalStatus.value"}
		],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			
			currentApplication = data;
			
			if(currentApplication.approvalStatus.value!='PENDING'){
				$("#applicationEditBtn").hide();
			}else{
				$("#applicationEditBtn").show();
			}
			
			$("#applicationApprovalBtn").show();
		}
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
			
			sendAjaxPost("/dma/waste_management_plan/create_wmp_application",formData,function(data){
				searchApplications(formData.vessel.substring(1,formData.vessel.indexOf(",")-1));
				
				form[0].reset();
				$("#current-form-window").data("kendoWindow").close();
				alert("WMP Application Added successfully.");
			});
		},
		updateApplicationSubmitHandler = function(e){
			e.preventDefault();
			var form = $("#application-form");
			var formData = getFormData(form);
			
			sendAjaxPost("/dma/waste_management_plan/update_wmp_application",formData,function(data){
				searchApplications(formData.vessel.substring(1,formData.vessel.indexOf(",")-1));
				
				form[0].reset();
				$("#current-form-window").data("kendoWindow").close();
				alert("WMP Application Updated successfully.");
			});
		},
		approveApplicationSubmitHandler = function(e){
			e.preventDefault();
			var form = $("#application-approval-form");
			var formData = getFormData(form);
			
			sendAjaxPost("/dma/waste_management_plan/approval_wmp_application",formData,function(data){
				searchApplications(currentApplication.vessel.vesselName);
				
				form[0].reset();
				$("#current-form-window").data("kendoWindow").close();
				alert("WMP Application Updated successfully.");
			});
		};
		
	$("#applicationAddBtn").click(function(e){
    	e.preventDefault();
    	display_popup(
    			"application-form",
    			"application-form-template",
    			null,
    			createApplicationSubmitHandler,
    			"Add WMP Application",
    			"500px"
    		);
    });
	
	$("#applicationEditBtn").click(function(e){
    	e.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentApplication,
    		vessel : currentApplication.vessel.vesselName+", "+currentApplication.vessel.regNo
    	});
    	display_popup(
    			"application-form",
    			"application-form-template",
    			viewmodel,
    			updateApplicationSubmitHandler,
    			"Edit WMP Application",
    			"500px"
    		);
    });
	
	$("#applicationApprovalBtn").click(function(e){
		e.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentApplication
    	});
    	display_popup(
    			"application-approval-form",
    			"application-approval-form-template",
    			viewmodel,
    			approveApplicationSubmitHandler,
    			"WMP Application Approval",
    			"500px"
    		);
	});
}

function searchApplications(value){
	reloadKendoGrid("wmpApplicationsGrid","/dma/waste_management_plan/search_wmp_applications/"+value,10);
	
	currentApplication = null;
	$("#applicationEditBtn").hide();
	$("#applicationApprovalBtn").hide();
}

function showApplicationDetail(e){
	currentApplication = e.data;
	
	var detailRow = e.detailRow;
	
	detailRow.find(".applications-grid-detail-tabstrip").kendoTabStrip();
	
	detailRow.find(".trackingsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/waste_management_plan/load_application_trackings/"+e.data.applicationId
            },
            paging: true,
            pageSize: 5
        },
        pageable: true,selectable : true,
		toolbar: kendo.template($("#application-trackings-grid-toolbar-template").html()),
		columns: [
		          { field: "trackingDate", title:"Tracking Date"},
		          { field: "trackingAction.value", title:"Tracking Action"},
		          { field: "actionDate", title:"Action Date" },
		          { field: "actionRemarks", title: "Action Remarks"},
		          { field: "trackedBy", title: "Tracked By"}],
		change : function (){
			var row = this.select();
			var data = this.dataItem(row);
			currentApplicationTracking = data;
			
			detailRow.find(".trackingEditBtn").show();
		}
	});
	
	detailRow.find(".documentsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/waste_management_plan/load_application_documents/"+e.data.applicationId
            },
            paging: true,
            pageSize: 5
        },
		pageable: true,selectable : true,
		toolbar: kendo.template($("#application-documents-grid-toolbar-template").html()),
		columns: [
		          { field: "documentType.value", title:"Document Type"},
		          { field: "documentUrl", title:"URL", template:'<a href="/dma/pollution_control/wmp/applications/'+e.data.applicationId+'/#=documentId#" target="_blank">#= documentUrl #</a>'},
		          { field: "documentRefNo", title:"Doc Ref No." },
		          { field: "documentDate", title: "Doc Date"}],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			currentApplicationDocument = data;
			
			detailRow.find(".documentDeleteBtn").show();
		}
	});
	if(currentApplication.approvalStatus.value==='PENDING'){
		attachApplicationTrackingsToolBarActions(e);
		attachApplicationDocumentsToolBarActions(e);
	}
}

function attachApplicationTrackingsToolBarActions(e){
	var detailRow = e.detailRow;
	
	var createApplicationTrackingSubmitHandler = function(evt){
			evt.preventDefault();
			var form = $("#application-tracking-form");
			var formData = getFormData(form);
			formData.applicationId = e.data.applicationId;
			
			sendAjaxPost("/dma/waste_management_plan/create_application_tracking",formData,function(data){
				var grid = detailRow.find(".trackingsGrid").data("kendoGrid");
				grid.dataSource.read();
				
				form[0].reset();
				$("#current-form-window").data("kendoWindow").close();
				alert("Application Tracking Added successfully.");
			});
		},
		updateApplicationTrackingSubmitHandler = function(evt){
			evt.preventDefault();
			var form = $("#application-tracking-form");
			var formData = getFormData(form);
			
			sendAjaxPost("/dma/waste_management_plan/update_application_tracking",formData,function(data){
				var grid = detailRow.find(".trackingsGrid").data("kendoGrid");
				grid.dataSource.read();
				
				form[0].reset();
				$("#current-form-window").data("kendoWindow").close();
				alert("Application Tracking Updated successfully.");
			});
		};
		
	detailRow.find(".trackingAddBtn").click(function(evt){
    	evt.preventDefault();
    	display_popup(
    			"application-tracking-form",
    			"application-tracking-form-template",
    			null,
    			createApplicationTrackingSubmitHandler,
    			"Add Application Tracking",
    			"500px"
    		);
    });
	
	detailRow.find(".trackingEditBtn").click(function(evt){
    	evt.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentApplicationTracking
    	});
    	display_popup(
    			"application-tracking-form",
    			"application-tracking-form-template",
    			viewmodel,
    			updateApplicationTrackingSubmitHandler,
    			"Edit Application Tracking",
    			"500px"
    		);
    });
}

function attachApplicationDocumentsToolBarActions(e){
	var detailRow = e.detailRow;
	
	var submitDocumentHandler = function(evt){
		evt.preventDefault();
		
		var kendoUploadButton = $(".k-upload-selected");
    	if (kendoUploadButton)
    		kendoUploadButton.click();
	};
	
	detailRow.find(".documentDeleteBtn").click(function(evt){
		evt.preventDefault();
		sendAjaxPost("/dma/waste_management_plan/application_doc_delete",{applicationId:e.data.applicationId,documentId:currentApplicationDocument.documentId},function(data){
			var grid = detailRow.find(".documentsGrid").data("kendoGrid");
			grid.dataSource.read();
			detailRow.find(".documentDeleteBtn").hide();
			
        	alert("Application Document deleted successfully.");
    	});
	});
	
	detailRow.find(".documentAddBtn").click(function(evt){
		evt.preventDefault();
		display_popup(
				"application-document-form",
				"application-document-form-template",
				null,
				submitDocumentHandler,
				"Add Application Document",
				"500px"
		);
		
		initDocumentUploadWidget("/dma/waste_management_plan/application_doc_upload/"+e.data.applicationId,"application-document-form",function(event){
			var grid = detailRow.find(".documentsGrid").data("kendoGrid");
			grid.dataSource.read();
			var form = $("#application-document-form");
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        $("#current-form-window").data("kendoWindow").destroy();
	        detailRow.find(".documentDeleteBtn").hide();
	    	alert("Application Document uploaded successfully.");
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