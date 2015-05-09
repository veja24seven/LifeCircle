/**
* Initialize Customer Grid
*/
function init(){
	$("#vesselSurveysTabstrip").kendoTabStrip();
	
	$("#vesselsGrid").kendoGrid({
        pageable: true,
        selectable : true,
        height: 500,
        toolbar: kendo.template($("#vesselsTemplate").html()),
        detailTemplate: kendo.template($("#vesselDetailTemplate").html()),
        columns: [
            { field: "owner.name1", title:"Owner"},
            { field: "regNo", title:"Reg #"},
            { field: "vesselName",title:"Name", template:"<a href='/vessel/display/#= vesselId #' target='_blank'>#= vesselName #</a>"},
            { field: "regType.value",title:"Reg. Type"},
            { field: "vesselType.value",title:"Vessel Type"},
            { field: "regPort.description",title:"Reg Port"},
            { field: "regDate",title:"Reg Date"},
            { field: "flagState.name",title:"Flag State"},
            { command: { text: "Surveys", click: showSurveys }, title: " ", width: "90px" }],
        change : function(){
            var row = this.select();
            var data = this.dataItem(row);
            currentVessel = data;
            
            
            console.log("Selected: " + currentVessel + " Text, [" + JSON.stringify(currentVessel) + "]");
            $("#surveysHeader").text("Vessel : "+currentVessel.vesselName+", "+currentVessel.regNo);
            reloadKendoGrid("surveysGrid","/surveys/load/"+currentVessel.vesselId,10);
            $("#surveyEditBtn").hide();
    		$("#surveyApproveBtn").hide();
            
            $("#inspectionsHeader").text("Vessel : "+currentVessel.vesselName+", "+currentVessel.regNo);
            reloadKendoGrid("inspectionsGrid","/surveys/load_inspections/"+currentVessel.vesselId,10);
            $("#inspectionEditBtn").hide();
        }

    });
	
	$("#surveysGrid").kendoGrid({
		pageable: true,
        selectable : true,
        toolbar: kendo.template($("#surveysTemplate").html()),
        detailTemplate: kendo.template($("#surveyDetailTemplate").html()),
        detailInit: showSurveyDetail,
        columns: [
                  { field: "vesselType.value", title:"Vessel Type"},
                  { field: "surveyRefNo", title:"Survey Ref No."},
                  { field: "requestDate",title:"Request Date"},
                  { field: "surveyType.description",title:"Survey Type"},
                  { field: "surveyDate",title:"Survey Date"},
                  { field: "portCode.value",title:"Port Code"},
                  { field: "surveyor.value",title:"Surveyor"},
                  { field: "surveyOutcome.value",title:"Outcome"},
                  { field: "surveyComments",title:"Comments"},
                  { field: "approvalStatus.value",title:"Approval Status"},
                  { command: { text: "View", click: showSurveyFullDetails }, title: " "}],
	    change : function(){
	    	var row = this.select();
	    	var data = this.dataItem(row);
	    	console.log("Selected: " + data + " Text, [" + JSON.stringify(data) + "]");
	    	currentSurvey = data;
	    	if (currentSurvey.approvalDate==null){
	    		$("#surveyEditBtn").show();
	    		$("#surveyApproveBtn").show();
	    	}else{
	    		$("#surveyEditBtn").hide();
	    		$("#surveyApproveBtn").hide();
	    	}
	    }
	});
	
	$("#inspectionsGrid").kendoGrid({
		pageable: true,
        selectable : true,
        toolbar: kendo.template($("#inspectionsTemplate").html()),
        detailTemplate: kendo.template($("#inspectionDetailTemplate").html()),
        detailInit: showInspectionDetail,
        columns: [
                  { field: "inspectionDate", title:"Date & Time", template:"#: kendo.toString(new Date(inspectionDate),'yyyy-MM-dd HH:mm') #"},
                  { field: "inspectionPort.description", title:"Port"},
                  { field: "inspector.value",title:"Inspector"},
                  { field: "inspectionStatus.value",title:"Status"},
                  { field: "completionDate",title:"Completion Date"},
                  { field: "inspectionOutcome.value",title:"Outcome"},
                  { field: "completionRemarks",title:"Remarks"},
                  { title:"Approval Status",template:"#= approvalStatus? approvalStatus.value:'' #"},
                  { command: { text: "View", click: showInspectionFullDetails }, title: " "}],
	    change : function(){
	    	var row = this.select();
	    	var data = this.dataItem(row);
	    	console.log("Selected: " + data + " Text, [" + JSON.stringify(data) + "]");
	    	currentInspection = data;
	    	if (currentInspection.approvalDate==null){
	    		$("#inspectionEditBtn").show();
				$("#inspectionApproveBtn").show();
	    	}else{
	    		$("#inspectionEditBtn").hide();
				$("#inspectionApproveBtn").hide();
	    	}
	    	
	    }
	});
	
	attachSurveyToolBarActions();
	
	attachInspectionToolBarActions();
	
    initializeLookupDataSources();
}

function attachSurveyToolBarActions(){
	$("#surveyAddBtn").click(function(e){
		e.preventDefault();
		if (currentVessel!=null){
			display_popup(
				"vessel-survey-form",
				"vessel-survey-form-template",
				null,
				createVesselSurveySubmitHandler,
				"Add Vessel Survey",
				"500px"
			);
		}else{
			alert("Please select Vessel.");
		}
    });
	
	$("#surveyEditBtn").click(function(e){
		e.preventDefault();
		var viewmodel = kendo.observable({
			vesselId : currentVessel.vesselId,
			survey : currentSurvey
		});
		display_popup(
			"vessel-survey-form",
			"vessel-survey-form-template",
			viewmodel,
			updateVesselSurveySubmitHandler,
			"Edit Vessel Survey",
			"500px"
		);
    });
	
	$("#surveyApproveBtn").click(function(e){
		e.preventDefault();
		sendAjaxPost("/surveys/approve",{survey:currentSurvey.surveyId},function(data){
			reloadKendoGrid("surveysGrid","/surveys/load/"+currentVessel.vesselId,10);
			$("#surveyApproveBtn").hide();
			$("#surveyEditBtn").hide();
        	alert("Vessel Survey approved successfully.");
    	});
	});
}

function attachInspectionToolBarActions(){
	$("#inspectionAddBtn").click(function(e){
		if (currentVessel!=null){
			display_popup(
				"vessel-inspection-form",
				"vessel-inspection-form-template",
				null,
				createVesselInspectionSubmitHandler,
				"Add Vessel Inspection",
				"500px"
			);
		}else{
			alert("Please select Vessel.");
		}
	});
	
	$("#inspectionEditBtn").click(function(e){
		var viewmodel = kendo.observable({
			vesselId : currentVessel.vesselId,
			inspectionDate : new Date(currentInspection.inspectionDate),
			inspection : currentInspection
		});
		display_popup(
			"vessel-inspection-form",
			"vessel-inspection-form-template",
			viewmodel,
			updateVesselInspectionSubmitHandler,
			"Edit Vessel Inspection",
			"500px"
		);
	});
	
	$("#inspectionApproveBtn").click(function(e){
		e.preventDefault();
		sendAjaxPost("/surveys/approve_inspection",{inspection:currentInspection.inspectionId},function(data){
			reloadKendoGrid("inspectionsGrid","/surveys/load_inspections/"+currentVessel.vesselId,10);
			$("#inspectionEditBtn").hide();
			$("#inspectionApproveBtn").hide();
        	alert("Vessel Inspection approved successfully.");
    	});
	});
}

function searchVessel(value){
	reloadKendoGrid("vesselsGrid","/vessels/search/vessel/"+value,10);
}

var surveyTypesDS = null, portCodesDS = null, surveyorsDS = null, surveyOutcomesDS = null,
	auditOutcomesDS = null, certificateTypesDS = null, documentTypesDS = null,
	inspectionPortsDS = null, inspectionStatusesDS = null, inspectionOutcomesDS = null;
	inspectionDeficiencyActionsDS = null, certificateTypesDS = null,
	documentTypesDS = null; 
function initializeLookupDataSources(){
	surveyTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/surveyTypes"}
        }
	});
	
	portCodesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/portCodes"}
        }
	});
	
	surveyorsDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/surveyors"}
        }
	});
	
	surveyOutcomesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/surveyOutcomes"}
        }
	});
	
	auditOutcomesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/auditOutcomes"}
        }
	}); 
	
	inspectionPortsDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/registryPorts"}
        },
        filter: { field: "countryCode", operator: "eq", value: "na" }
	}); 
	
	inspectionStatusesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/inspectionStatuses"}
        }
	}); 
	
	inspectionOutcomesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/inspectionOutcomes"}
        }
	}); 
	
	inspectionDeficiencyActionsDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/inspectionDeficiencyActions"}
        }
	}); 
	
	certificateTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/surveyCertificateTypes"}
        }
	}); 
	
	documentTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/documentTypes"}
        }
	});  
}

function showSurveys(e){
	e.preventDefault();

    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    
    currentVessel = dataItem;
    
    $("#surveysHeader").text("Vessel : "+dataItem.vesselName+", "+dataItem.regNo);
    var tabStrip = $("#vesselSurveysTabstrip").kendoTabStrip().data("kendoTabStrip");
    tabStrip.select(1); 

    $("#surveysHeader").text("Vessel : "+currentVessel.vesselName+", "+currentVessel.regNo);
    reloadKendoGrid("surveysGrid","/surveys/load/"+currentVessel.vesselId,10);
    $("#surveyEditBtn").hide();
	$("#surveyApproveBtn").hide();
    
    $("#inspectionsHeader").text("Vessel : "+currentVessel.vesselName+", "+currentVessel.regNo);
    reloadKendoGrid("inspectionsGrid","/surveys/load_inspections/"+currentVessel.vesselId,10);
    $("#inspectionEditBtn").hide();
}

function createVesselSurveySubmitHandler(e){
	var form = $("#vessel-survey-form");
	var formData = getFormData(form);
	formData.vessel = currentVessel.vesselId;
	
	sendAjaxPost("/surveys/create",formData,function(data){
		reloadKendoGrid("surveysGrid","/surveys/load/"+currentVessel.vesselId,10);
		$("#surveyEditBtn").hide();
		$("#surveyApproveBtn").hide();
		
    	form[0].reset();
        $("#current-form-window").data("kendoWindow").close();
        
    	alert("Vessel Survey Added successfully.");
	});
}

function updateVesselSurveySubmitHandler(e){
	var form = $("#vessel-survey-form");
	var formData = getFormData(form);
	formData.vessel = currentVessel.vesselId;
	
	sendAjaxPost("/surveys/update",formData,function(data){
		reloadKendoGrid("surveysGrid","/surveys/load/"+currentVessel.vesselId,10);
		$("#surveyEditBtn").hide();
		$("#surveyApproveBtn").hide();
		
    	form[0].reset();
        $("#current-form-window").data("kendoWindow").close();
        
    	alert("Vessel Survey Updated successfully.");
	});
}

function createVesselInspectionSubmitHandler(e){
	var form = $("#vessel-inspection-form");
	var formData = getFormData(form);
	formData.vessel = currentVessel.vesselId;
	
	sendAjaxPost("/surveys/create_inspection",formData,function(data){
		reloadKendoGrid("inspectionsGrid","/surveys/load_inspections/"+currentVessel.vesselId,10);
		$("#inspectionEditBtn").hide();
		
    	form[0].reset();
        $("#current-form-window").data("kendoWindow").close();
        
    	alert("Vessel Inspection Added successfully.");
	});
}

function updateVesselInspectionSubmitHandler(e){
	var form = $("#vessel-inspection-form");
	var formData = getFormData(form);
	
	sendAjaxPost("/surveys/update_inspection",formData,function(data){
		reloadKendoGrid("inspectionsGrid","/surveys/load_inspections/"+currentVessel.vesselId,10);
		$("#inspectionEditBtn").hide();
		
    	form[0].reset();
        $("#current-form-window").data("kendoWindow").close();
        
    	alert("Vessel Inspection Updated successfully.");
	});
}

var currentSurveyAudit = null, currentSurveyCertificate = null, currentSurveyDocument = null;
function showSurveyDetail(e){
	
	var detailRow = e.detailRow;
	
	currentSurvey = e.data;
	
	//initiate tabstrip on a detail
	detailRow.find(".surveyDetailTabstrip").kendoTabStrip();
	
	//initiate grids
	detailRow.find(".auditsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
            	read: "/surveys/load_audits/"+e.data.surveyId
            },
            paging: true,
            pageSize: 10
        },
        scrollable : false,
		pageable: true,
        selectable : true,
        toolbar: kendo.template($("#auditsTemplate").html()),
        columns: [
	          { field: "auditRefNo", title:"Ref No."},
	          { field: "auditDate", title:"Audit Date" },
	          { field: "surveyor.value", title: "Surveyor"},
	          { field: "auditOutcome.value", title: "Outcome"},
	          { field: "auditComments", title: "Comments"}],
          change : function(){
  	    	var row = this.select();
  	    	var data = this.dataItem(row);
  	    	currentSurveyAudit = data;
  	    	detailRow.find(".auditEditBtn").show();
  	    }
        
	});
	
	detailRow.find(".certificatesGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
            	read: "/surveys/load_certificates/"+e.data.surveyId
            },
            paging: true,
            pageSize: 10
        },
        scrollable : false,
		pageable: true,
        selectable : true,
        toolbar: kendo.template($("#certificatesTemplate").html()),
        columns: [
	          { field: "certificateType.description", title:"Type"},
	          { field: "certificateRefNo", title:"Ref No."},
	          { field: "issueDate", title:"Issue Date" },
	          { field: "expireDate", title: "Expire Date"},
	          { field: "issuedBy", title: "Issued By"},
	          { field:"receiptRefNo",title: "Receipt Ref No."},//receiptNo
	          { field: "receiptPayInDate", title: "Receipt Payed In Date"}, //receiptDate
	          { field: "printed", title: "Printed", template:"#= printed? 'YES':'NO' #"},
	          { command: { text: "Print", click: function(e){} }, title: " ", width: "150px" }],
	          change : function(){
	    	    	var row = this.select();
	    	    	var data = this.dataItem(row);
	    	    	currentSurveyCertificate = data;
	    	    	detailRow.find(".certificateEditBtn").show();
	    	    }
        
	});
	
	detailRow.find(".documentsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/surveys/load_documents/"+e.data.surveyId
            },
            paging: true,
            pageSize: 10
        },
        scrollable : false,
		pageable: true,
        selectable : true,
        toolbar: kendo.template($("#documentsTemplate").html()),
        columns: [
	          { field: "documentType.value", title:"Document Type"},
	          { field: "documentUrl", title:"URL",template:'<a href="/dma/surveys/download/'+e.data.surveyId+'/#=documentUrl#" target="_blank">#= documentUrl #</a>'},
	          { field: "documentRefNo", title:"Doc Ref No." },
	          { field: "documentDate", title: "Doc Date"}],
	          change : function(){
	    	    	var row = this.select();
	    	    	var data = this.dataItem(row);
	    	    	currentSurveyDocument = data;
	    	    	detailRow.find(".documentEditBtn").show();
	    	    }
        
	});
	//bind action events
	attachSurveyAuditsToolBarActions(e);
	
	attachSurveyCertificatesToolBarActions(e);
	
	attachDocumentActionEvents(e);
}

function attachSurveyAuditsToolBarActions(e){
	var detailRow = e.detailRow;
	
	var submitAddSurveyAuditHandler = function(evt){
		var form = $("#survey-audit-form");
		var formData = getFormData(form);
		formData.survey = currentSurvey.surveyId;
		
		sendAjaxPost("/surveys/create_audit",formData,function(data){
			var grid = detailRow.find(".auditsGrid").data("kendoGrid");
			grid.dataSource.read();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();

	        detailRow.find(".auditEditBtn").hide();
	    	alert("Survey Audit added successfully.");
		});
	};
	
	var submitEditSurveyAuditHandler = function(evt){
		var form = $("#survey-audit-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/surveys/update_audit",formData,function(data){
			var grid = detailRow.find(".auditsGrid").data("kendoGrid");
			grid.dataSource.read();
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        
	        detailRow.find(".auditEditBtn").hide();
	    	alert("Survey Audit updated successfully.");
		});
	};
	
	detailRow.find(".auditAddBtn").click(function(evt){
		evt.preventDefault();
    	display_popup(
			"survey-audit-form",
			"survey-audit-form-template",
			null,
			submitAddSurveyAuditHandler,
			"Add Survey Audit",
			"500px"
		);
    });
	
	detailRow.find(".auditEditBtn").click(function(evt){
		evt.preventDefault();
    	var viewModel = kendo.observable({
    		surveyId : currentSurvey.surveyId,
    		audit : currentSurveyAudit
    	});
    	display_popup(
			"survey-audit-form",
			"survey-audit-form-template",
			viewModel,
			submitEditSurveyAuditHandler,
			"Edit Survey Audit",
			"500px"
		);
    });
}

function attachSurveyCertificatesToolBarActions(e){
	var detailRow = e.detailRow;
	
	var submitAddSurveyCertificateHandler = function(evt){
		var form = $("#survey-certificate-form");
		var formData = getFormData(form);
		formData.survey = currentSurvey.surveyId;
		
		sendAjaxPost("/surveys/create_certificate",formData,function(data){
			var grid = detailRow.find(".certificatesGrid").data("kendoGrid");
			grid.dataSource.read();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();

	        detailRow.find(".certificateEditBtn").hide();
	    	alert("Survey Certificate added successfully.");
		});
	};
	
	var submitEditSurveyCertificateHandler = function(evt){
		var form = $("#survey-certificate-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/surveys/update_certificate",formData,function(data){
			var grid = detailRow.find(".certificatesGrid").data("kendoGrid");
			grid.dataSource.read();
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        
	        detailRow.find(".certificateEditBtn").hide();
	    	alert("Survey Certificate updated successfully.");
		});
	};
	
	detailRow.find(".certificateAddBtn").click(function(evt){
		evt.preventDefault();
    	display_popup(
			"survey-certificate-form",
			"survey-certificate-form-template",
			null,
			submitAddSurveyCertificateHandler,
			"Add Survey Certificate",
			"500px"
		);
    });
	
	detailRow.find(".certificateEditBtn").click(function(evt){
		evt.preventDefault();
    	var viewModel = kendo.observable({
    		surveyId : currentSurvey.surveyId,
    		certificate : currentSurveyCertificate
    	});
    	display_popup(
			"survey-certificate-form",
			"survey-certificate-form-template",
			viewModel,
			submitEditSurveyCertificateHandler,
			"Edit Survey Certificate",
			"500px"
		);
    });
}


function attachDocumentActionEvents(e){
	var detailRow = e.detailRow;
	
	var submitAddDocumentHandler = function(evt){
		var form = $("#survey-document-form");
		var formData = getFormData(form);
		formData.survey = currentSurvey.surveyId;
		$("#documentUrl").data("kendoUpload").bind
		var kendoUploadButton = $(".k-upload-selected");
    	if (kendoUploadButton)
    		kendoUploadButton.click();
    	
	};
	
	var submitEditDocumentHandler = function(evt){
		var form = $("#survey-document-form");
		var formData = getFormData(form);
		
		var kendoUploadButton = $(".k-upload-selected");
    	if (kendoUploadButton)
    		kendoUploadButton.click();
    	
	};
	
	detailRow.find(".documentAddBtn").click(function(evt){
		evt.preventDefault();
    	display_popup(
			"survey-document-form",
			"survey-document-form-template",
			null,
			submitAddDocumentHandler,
			"Add Survey Document",
			"500px"
		);
    	initVesselDocumentUploadWidget(true,function(event){
    		var grid = detailRow.find(".documentsGrid").data("kendoGrid");
			grid.dataSource.read();
			var form = $("#survey-document-form");
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        $("#current-form-window").data("kendoWindow").destroy();
	        detailRow.find(".documentEditBtn").hide();
	    	alert("Survey Document uploaded successfully.");
    	});
    });
	
	detailRow.find(".documentEditBtn").click(function(evt){
		evt.preventDefault();
    	var viewModel = kendo.observable({
    		surveyId : currentSurvey.surveyId,
    		document: currentSurveyDocument
    	});
    	display_popup(
				"survey-document-form",
				"survey-document-form-template",
				viewModel,
				submitEditDocumentHandler,
				"Edit Survey Document",
				"500px"
		);
    	initVesselDocumentUploadWidget(false,function(event){
    		var grid = detailRow.find(".documentsGrid").data("kendoGrid");
			grid.dataSource.read();
			var form = $("#survey-document-form");
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        $("#current-form-window").data("kendoWindow").destroy();
	        detailRow.find(".documentEditBtn").hide();
	    	alert("Survey Document updated successfully.");
    	});
    });
}


function initVesselDocumentUploadWidget(addnew,successHandler){
	var files = addnew?[]:[{name:currentDocument.documentUrl, size:500,type:".pdf"}];
	
	$("#documentUrl").kendoUpload({
        async: {
            saveUrl: "/surveys/upload_doc_file/"+currentSurvey.surveyId,
            removeUrl: "/surveys/unupload_doc_file/"+currentSurvey.surveyId,
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
        	var form = $("#survey-document-form");
    		var formData = getFormData(form);
    		formData.documentId = addnew? 0:currentDocument.documentId;
    		console.log("Upload form Data :"+kendo.stringify(formData));
    		e.data = formData;
        },
        error : function(e){
        	alert("Fail to save : Internal Error");
        },
        complete : successHandler,
        
        files:files
    });
}

var currentInspectionDeficiency = null;
function showInspectionDetail(e){
	var detailRow = e.detailRow;
	
	currentInspection = e.data;
	
	//initiate grids
	detailRow.find(".inspectionDeficienciesGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
            	read: "/surveys/load_inspection_deficiencies/"+e.data.inspectionId
            },
            paging: true,
            pageSize: 10
        },
        scrollable : false,
		pageable: true,
        selectable : true,
        toolbar: kendo.template($("#inspectionDeficienciesTemplate").html()),
        columns: [
	          { field: "actionTaken.value", title:"Action Taken"},
	          { field: "deficiencyDetails", title:"Deficiency Details" },
	          { field: "actionRemarks", title: "Action Remarks"}],
          change : function(){
  	    	var row = this.select();
  	    	var data = this.dataItem(row);
  	    	currentInspectionDeficiency = data;
  	    	detailRow.find(".deficiencyEditBtn").show();
  	    }
        
	});
	
	attachInspectionDeficiencyToolBarActions(e);
}

function attachInspectionDeficiencyToolBarActions(e){
	var detailRow = e.detailRow;
	
	var submitAddInspectionDeficiencyHandler = function(evt){
		var form = $("#inspection-deficiency-form");
		var formData = getFormData(form);
		formData.inspection = currentInspection.inspectionId;
		
		sendAjaxPost("/surveys/create_inspection_deficiency",formData,function(data){
			var grid = detailRow.find(".inspectionDeficienciesGrid").data("kendoGrid");
			grid.dataSource.read();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();

	        detailRow.find(".deficiencyEditBtn").hide();
	    	alert("Inspection Deficiency added successfully.");
		});
	};
	
	var submitEditInspectionDeficiencyHandler = function(evt){
		var form = $("#inspection-deficiency-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/surveys/update_inspection_deficiency",formData,function(data){
			var grid = detailRow.find(".inspectionDeficienciesGrid").data("kendoGrid");
			grid.dataSource.read();
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        
	        detailRow.find(".deficiencyEditBtn").hide();
	    	alert("Inspection Deficiency updated successfully.");
		});
	};
	
	detailRow.find(".deficiencyAddBtn").click(function(evt){
		evt.preventDefault();
    	display_popup(
			"inspection-deficiency-form",
			"inspection-deficiency-form-template",
			null,
			submitAddInspectionDeficiencyHandler,
			"Add Inspection Deficiency Report",
			"500px"
		);
    });
	
	detailRow.find(".deficiencyEditBtn").click(function(evt){
		evt.preventDefault();
    	var viewModel = kendo.observable({
    		inspectionId : currentInspection.inspectionId,
    		deficiency : currentInspectionDeficiency
    	});
    	display_popup(
			"inspection-deficiency-form",
			"inspection-deficiency-form-template",
			viewModel,
			submitEditInspectionDeficiencyHandler,
			"Edit Inspection Deficiency Report",
			"500px"
		);
    });
}

function showSurveyFullDetails(e){
	var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
	
	window.open(
			"/survey/display/"+dataItem.surveyId,
			"_blank" // <- This is what makes it open in a new window.
	);
}

function showInspectionFullDetails(e){
	var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
	
	window.open(
			"/inspection/display/"+dataItem.inspectionId,
			"_blank" // <- This is what makes it open in a new window.
	);
}
