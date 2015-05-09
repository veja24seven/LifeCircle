var programTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/programTypes"}
        }
	}),
	programStatusesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/programStatuses"}
        }
	}),
	measureTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/measureTypes"}
        }
	}),
	activityStatusesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/activityStatuses"}
        }
	}),
	activityTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/activityTypes"}
        }
	}),
	activityPortsDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/registryPorts"}
	    },
	    filter: { field: "countryCode", operator: "eq", value: "na" }
	}),
	documentTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/documentTypes"}
        }
	});
var currentProgram = null,currentProgramObjective = null, currentProgramActivity = null, currentActivityDocument = null;

function init(){
	$("#pullution-campaign-programs-tabstrip").kendoTabStrip();
	
	$("#programsGrid").kendoGrid({
		pageable: true, selectable : true, height: 500,
		toolbar: kendo.template($("#programs-grid-toolbar-template").html()),
		detailTemplate: kendo.template($("#programs-grid-detail-template").html()),
		detailInit: showProgramDetail,
		columns : [
		    { title:"Program Name", field:"programName"},
		    { title:"Program Reg No.", field:"programRegNo"},
		    { title:"Program Type", field:"programType.value"},
		    { title:"Start Date", field:"startDate"},
		    { title:"End Date", field:"endDate"},
		    { title:"Program Status", field:"programStatus.value"},
		    { title:"Program Details", field:"programDetails"}
		],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			
			currentProgram = data;
			
			$("#programEditBtn").show();
		}
	});
	
	$("#programActivitiesGrid").kendoGrid({
		pageable: true, selectable : true,
		toolbar: kendo.template($("#program-activities-grid-toolbar-template").html()),
		detailTemplate: kendo.template($("#program-activities-grid-detail-template").html()),
		detailInit: showProgramActivityDetail,
		columns : [
				    { title:"Activity Type", field:"activityType.value"},
				    { title:"Activity Ref No.", field:"activityRefNo"},
				    { title:"Start Date", field:"activityStartDate"},
				    { title:"End Date", field:"activityEndDate"},
				    { title:"Owner", field:"activityOwner"},
				    { title:"Score", field:"activityScore"},
				    { title:"Port", field:"activityPort.description"},
				    { title:"Status", field:"activityStatus.value"},
				    { title:"Outcome", field:"activityOutcome"}
				  ],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			currentProgramActivity = data;
			
			if(currentProgram.programStatus.value==='Open'){
				$("#activityEditBtn").show();
			}else{
				$("#activityEditBtn").hide();
			}
		}
	});
	
	attachProgramsToolBarActions();
	attachProgramActivitiesToolBarActions();
}

function attachProgramsToolBarActions(){
	$("#searchProgramsBtn").click(function(e){
		searchPrograms($("#programSearchField").val());
        e.preventDefault();
    });

    $("#programSearchField").keydown(function(e){
        if (e.keyCode==13){
        	searchPrograms($("#programSearchField").val());
        }
    });
    
    var createProgramSubmitHandler = function (e){
    		e.preventDefault();
    		var form = $("#program-form");
    		var formData = getFormData(form);
    		
    		sendAjaxPost("/dma/pollution_campaign_programs/create_program",formData,function(data){
    			searchPrograms(formData.programRegNo);
    			
    			form[0].reset();
    			$("#current-form-window").data("kendoWindow").close();
    			alert("Program Added successfully.");
    		});
    	},
    	updateProgramSubmitHandler = function (e){
    		e.preventDefault();
    		var form = $("#program-form");
    		var formData = getFormData(form);
    		
    		sendAjaxPost("/dma/pollution_campaign_programs/update_program",formData,function(data){
    			searchPrograms(formData.programRegNo);
    			
    			form[0].reset();
    			$("#current-form-window").data("kendoWindow").close();
    			alert("Program Updated successfully.");
    		});
    	}
    
    $("#programAddBtn").click(function(e){
    	e.preventDefault();
    	display_popup(
    			"program-form",
    			"program-form-template",
    			null,
    			createProgramSubmitHandler,
    			"Add Program",
    			"500px"
    		);
    });
    
    $("#programEditBtn").click(function(e){
    	e.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentProgram
    	});
    	display_popup(
    			"program-form",
    			"program-form-template",
    			viewmodel,
    			updateProgramSubmitHandler,
    			"Edit Program",
    			"500px"
    		);
    });
}

function initializeProgramActivitiesTab(){
	$("#programActivitiesTab").show();
	loadProgramActivities();
}

function attachProgramActivitiesToolBarActions(){
	var createProgramActivitySubmitHandler = function(e){
			e.preventDefault();
			var form = $("#program-activity-form");
			var formData = getFormData(form);
			formData.objectiveId = currentProgramObjective.objectiveId;
			
			sendAjaxPost("/dma/pollution_campaign_programs/create_program_activity",formData,function(data){
				loadProgramActivities();
				form[0].reset();
				$("#current-form-window").data("kendoWindow").close();
				alert("Program Activity Added successfully.");
			});
		},
		updateProgramActivitySubmitHandler = function(e){
			e.preventDefault();
			var form = $("#program-activity-form");
			var formData = getFormData(form);
			
			sendAjaxPost("/dma/pollution_campaign_programs/update_program_activity",formData,function(data){
				loadProgramActivities();
				form[0].reset();
				$("#current-form-window").data("kendoWindow").close();
				alert("Program Activity Updated successfully.");
			});
		};
	$("#activityAddBtn").click(function(e){
    	e.preventDefault();
    	display_popup(
    			"program-activity-form",
    			"program-activity-form-template",
    			null,
    			createProgramActivitySubmitHandler,
    			"Add Program Activity",
    			"500px"
    		);
    });
	
	$("#activityEditBtn").click(function(e){
    	e.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentProgramActivity
    	});
    	display_popup(
    			"program-activity-form",
    			"program-activity-form-template",
    			viewmodel,
    			updateProgramActivitySubmitHandler,
    			"Edit Program Activity",
    			"500px"
    		);
    	/*$("#activityStatus").data("kendoDropDownList").bind("select",function(e){
    		var dataItem = this.dataItem(e.item.index());
    		if(dataItem.value!='Open'){
    			$("#activityOutcome").attribute("required","required");
    		}else{
    			$("#activityOutcome").attribute("required","required");
    		}
    	});*/
    });
}

function searchPrograms(value){
	reloadKendoGrid("programsGrid","/dma/pollution_campaign_programs/search_programs/"+value,10);
	
	currentProgram = null;
	$("#programEditBtn").hide();
	
	$("#programActivitiesTab").hide();
}

function loadProgramActivities(){
	reloadKendoGrid("programActivitiesGrid","/dma/pollution_campaign_programs/load_program_activities/"+currentProgramObjective.objectiveId,10);
	
	if(currentProgram.programStatus.value==='Open'){
		$("#activityAddBtn").show();
	}else{
		$("#activityAddBtn").hide();
	}
	$("#activityEditBtn").hide();
}

function showProgramDetail(e){
	//very important to hide this tab
	$("#programActivitiesTab").hide();
	
	var detailRow = e.detailRow;
	
	var columnDropDownEditor = function (container, options){
		$('<input required data-bind="value:' + options.field + '"/>')
	    .appendTo(container)
	    .kendoDropDownList({
	        autoBind: false,
	        dataTextField: "value",
	        dataValueField: "variableId",
	        optionLabel: "-Please Select-",
	        dataSource: measureTypesDS
	    });
	},
	textAreaEditor = function (container, options){
		$('<textarea required rows="4" maxlength="500" style="width: 200px;" data-bind="value:' + options.field + '" class="k-textbox"></textarea>')
		.appendTo(container);
	};
	
	
	detailRow.find(".programObjectivesGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
            	read: {
            		url : "/dma/pollution_campaign_programs/load_program_objectives/"+e.data.programId,
            		dataType : "json"
            	},
            	create : {
            		type: "POST",
            		url: "/dma/pollution_campaign_programs/create_program_objective",
            		dataType : "json",
            		contentType : "application/json"
            	},
            	update : {
            		type: "POST",
            		url: "/dma/pollution_campaign_programs/update_program_objective",
            		dataType : "json",
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
            pageSize: 10,
            schema : {
            	model : {
            		id : "objectiveId",
            		fields : {
            			objectiveId : { editable:false, nullable:false },
            			programId : { editable:false, nullable:false, defaultValue: e.data.programId },
            			targetScore : { type:"number", validation:{ required:true,min:0 } },
            			measureType : { validation:{ required:true } },
            			objectiveDetails : { validation:{ required:true } }
            		}
            	}
            }
        },
        toolbar: ["create"],
        selectable : true,
        columns : [
            { title:"Target Score", field:"targetScore"},
            { title:"Measure Type", field:"measureType", template:"#= measureType.value #", editor:columnDropDownEditor},
            { title:"Objective Details", field:"objectiveDetails", editor: textAreaEditor},
            { command: ["edit"], title: "&nbsp;", width: "172px" }
        ],
        change : function (){
        	var row = this.select();
			var data = this.dataItem(row);
			currentProgramObjective = data;
			
			initializeProgramActivitiesTab();
        },
        editable : "inline"
	});
}

function showProgramActivityDetail(e){
	var detailRow = e.detailRow;
	
	detailRow.find(".activityDocumentsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/pollution_campaign_programs/load_activity_documents/"+e.data.activityId
            },
            paging: true,
            pageSize: 5
        },
		pageable: true,selectable : true,
		toolbar: kendo.template($("#activity-documents-grid-toolbar-template").html()),
		columns: [
		          { field: "documentType.value", title:"Document Type"},
		          { field: "documentUrl", title:"URL", template:'<a href="/dma/pollution_control/pollution_campain_programs/activities/'+e.data.activityId+'/#=documentId#" target="_blank">#= documentUrl #</a>'},
		          { field: "documentRefNo", title:"Doc Ref No." },
		          { field: "documentDate", title: "Doc Date"}],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			currentActivityDocument = data;
			
			detailRow.find(".documentEditBtn").hide();
		}
	});
	
	var submitDocumentHandler = function(evt){
		evt.preventDefault();
		
		var kendoUploadButton = $(".k-upload-selected");
    	if (kendoUploadButton)
    		kendoUploadButton.click();
	};
	
	detailRow.find(".documentAddBtn").click(function(evt){
		evt.preventDefault();
		display_popup(
				"activity-document-form",
				"activity-document-form-template",
				null,
				submitDocumentHandler,
				"Add Activity Document",
				"500px"
		);
		
		initDocumentUploadWidget(true,null,"/dma/pollution_campaign_programs/activity_doc_upload/"+e.data.activityId,"activity-document-form",function(event){
			var grid = detailRow.find(".activityDocumentsGrid").data("kendoGrid");
			grid.dataSource.read();
			var form = $("#activity-document-form");
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        $("#current-form-window").data("kendoWindow").destroy();
	        detailRow.find(".documentEditBtn").hide();
	    	alert("Activity Document uploaded successfully.");
		});
	});
	
	detailRow.find(".documentEditBtn").click(function(evt){
		evt.preventDefault();
		var viewModel = kendo.observable({
    		document: currentActivityDocument
    	});
		display_popup(
				"activity-document-form",
				"activity-document-form-template",
				viewModel,
				submitDocumentHandler,
				"Edit Activity Document",
				"500px"
		);
		
		initDocumentUploadWidget(false,currentActivityDocument.documentUrl,"/dma/pollution_campaign_programs/activity_doc_upload/"+e.data.activityId,"activity-document-form",function(event){
			var grid = detailRow.find(".activityDocumentsGrid").data("kendoGrid");
			grid.dataSource.read();
			var form = $("#activity-document-form");
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        $("#current-form-window").data("kendoWindow").destroy();
	        detailRow.find(".documentEditBtn").hide();
	    	alert("Activity Document uploaded successfully.");
		});
	});
}

function initDocumentUploadWidget(addnew,documentUrl,uploadUrl,formId,successHandler){
	var files = addnew?[]:[{name:currentActivityDocument.documentUrl, size:500,type:".pdf"}];
	
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
    		if(addnew){
    			formData.documentId = 0;
    		}
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