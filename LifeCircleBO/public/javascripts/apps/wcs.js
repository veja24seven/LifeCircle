var vesselAutocompleteDS = new kendo.data.DataSource({
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
facilityAutocompleteDS = new kendo.data.DataSource({
	type: "json",pageSize: 10,
	transport: {
		read: {
			type: "POST",
			url:"/clientmaster/facilities/load_autocomplete_facilities",
			dataType: "json",
			contentType: "application/json"
		},
		parameterMap: function(data, type) {
			console.log(kendo.stringify(data.filter));
			if (type == "read") {
				return kendo.stringify({facilityName:data.filter.filters[0].value});
			}
		}
	},
	serverFiltering: true,
}),
inspectionSheetTypesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/inspectionSheetTypes"}
	}
}),
dataTypesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/dataTypes"}
	}
}),
surveyorsDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/surveyors"}
    }
}),
inspectionStatusesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/inspectionStatuses"}
    }
}),
inspectionPortsDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/registryPorts"}
    },
    filter: { field: "countryCode", operator: "eq", value: "na" }
}),
deficiencyActionsDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/inspectionDeficiencyActions"}
    }
}),
questionsDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/dma/waste_control_sheet/load_all_sheet_questions"}
    }
}),
optionsDS = new kendo.data.DataSource();

var currentInspectionSheet = null, currentInspectionQuestionResult = null,
	currentInspectionReport = null, currentSheetSection = null,
	currentSheetQuestion = null;
function init(){
	$("#wcs-tabstrip").kendoTabStrip();
	
	$("#inspectionsGrid").kendoGrid({
		pageable: true, selectable : true, height: 500,
		toolbar: kendo.template($("#inspections-grid-toolbar-template").html()),
		detailTemplate: kendo.template($("#inspections-grid-detail-template").html()),
		detailInit: showInspectionSheetDetail,
		columns : [
		    {title:"Vessel", field:"vessel.vesselName"},
		    {title:"Facility", field:"facility.facilityName"},
		    {title:"Owner", field:"owner.name1"},
		    {title:"Inspection Sheet Type", field:"inspectionSheetType.value"},
		    {title:"Inspection Sheet No", field:"inspectionSheetNo"},
		    {title:"Inspection Date", field:"inspectionDate", template:"#: kendo.toString(new Date(inspectionDate),'yyyy-MM-dd HH:mm') #"},
		    {title:"Inspection Status", field:"inspectionStatus.value"},
		    {title:"Completion Date", field:"completionDate"}
		],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			
			currentInspectionSheet = data;
			
			if(currentInspectionSheet.completionDate){
				$("#inspectionEditBtn").show();
			}else{
				$("#inspectionEditBtn").hide();
			}
		}
	});
	
	$("#sheetSectionsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/waste_control_sheet/load_sheet_sections"
            },
            paging: true,
            pageSize: 10
        },
		pageable: true, selectable : true, height: 500,
		toolbar: kendo.template($("#sections-grid-toolbar-template").html()),
		detailTemplate: kendo.template($("#sections-grid-detail-template").html()),
		detailInit: showSheetSectionDetail,
		columns : [
		    {title:"Inspection Sheet Type", field:"inspectionSheetType.value"},
		    {title:"Sheet Section Title", field:"sheetSectionTitle"},
		    {title:"Data Type", field:"dataType.value"},
		    {title:"Option 1", field:"option1Label"},
		    {title:"Option 2", field:"option2Label"},
		    {title:"Remarks", field:"remarksLabel"}
		],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			
			currentSheetSection = data;
			
			$("#sectionEditBtn").show();
		}
	});
	
	kendo.init($("#searchBy"));

	attachInspectionsToolBarActions();
	attachSheetSectionsToolBarActions();
}

function showInspectionSheetDetail(e){
	currentInspectionSheet = e.data;
	
	var detailRow = e.detailRow;
	
	detailRow.find(".inspections-grid-detail-tabstrip").kendoTabStrip();
	
	detailRow.find(".questionResultsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/waste_control_sheet/load_inspection_question_results/"+e.data.inspectionSheetId
            },
            paging: true,
            pageSize: 5
        },
        pageable: true,selectable : true,
		toolbar: kendo.template($("#question-results-grid-toolbar-template").html()),
		columns: [
		          { field: "question.questionTitle", title:"Question"},
		          { field: "option.optionTitle", title:"Option"},
		          { field: "option1Value", title:"Option 1 Value" },
		          { field: "option2Value", title: "Option 2 Value"},
		          { field: "remarksValue", title: "Remarks Value"}],
		change : function (){
			var row = this.select();
			var data = this.dataItem(row);
			currentInspectionQuestionResult = data;
			
			detailRow.find(".questionResultEditBtn").show();
		}
	});
	
	detailRow.find(".reportsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/waste_control_sheet/load_inspection_reports/"+e.data.inspectionSheetId
            },
            paging: true,
            pageSize: 5
        },
        pageable: true,selectable : true,
		toolbar: kendo.template($("#inspection-reports-grid-toolbar-template").html()),
		columns: [
		          { field: "deficiencyDetails", title:"Deficiency Details"},
		          { field: "actionTaken.value", title:"Action Taken"},
		          { field: "actionRemarks", title:"Action Remarks" }],
		change : function (){
			var row = this.select();
			var data = this.dataItem(row);
			currentInspectionReport = data;
			
			detailRow.find(".reportEditBtn").show();
		}
	});
	
	attachQuestionResultsToolBarActions(e);
	attachReportsToolBarActions(e);
}

function showSheetSectionDetail(e){
	currentSheetSection = e.data;
	
	var detailRow = e.detailRow;
	
	detailRow.find(".sections-grid-detail-tabstrip").kendoTabStrip();
	
	detailRow.find(".questionsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read:  {
	                url: "/dma/waste_control_sheet/load_sheet_questions/"+e.data.sheetSectionId,
	                dataType: "json"
	            }, 
	            update: {
	            	type: "POST",
	                url: "/dma/waste_control_sheet/update_sheet_question",
	                dataType: "json",
	                contentType : "application/json"
	            },
	            create: {
	            	type: "POST",
	            	url: "/dma/waste_control_sheet/create_sheet_question",
	                dataType: "json",
	                contentType : "application/json"
	            },
	            parameterMap: function (model, operation) {
	                if (operation !== "read" && model) {
	                		model.sheetSectionId = e.data.sheetSectionId;
	                	return JSON.stringify(model);
	                }
	                detailRow.find(".questionOptionsTab").hide();
	                currentSheetQuestion = null;
	            }
            },
            paging: true,
            pageSize: 5,
	        schema: {
	            model: {
	                id: "questionId",
	                fields: {
	                	questionId : { editable: false, nullable: true },
	                	sheetSectionId : { editable: false, nullable: false, defaultValue:e.data.sheetSectionId },
	                	questionTitle : { validation: { required: true } }
	                }
	            }
	        }
        },
        pageable: true,selectable : true,
		toolbar: ['create'],
		columns: [
		          { field: "questionId", title:"Question Id"},
		          { field: "questionTitle", title:"Question Title"},
		          { command: ["edit"], title: "&nbsp;", width: "172px" }],
		editable : "inline",
		change : function (){
			var row = this.select();
			var data = this.dataItem(row);
			currentSheetQuestion = data;
			
			detailRow.find(".questionOptionsTab").show();
		}
	});
	
	detailRow.find(".optionsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read:  {
	                url: "/dma/waste_control_sheet/load_sheet_question_options/"+currentSheetQuestion?currentSheetQuestion.questionId:0,
	                dataType: "json"
	            }, 
	            update: {
	            	type: "POST",
	                url: "/dma/waste_control_sheet/update_sheet_question_option",
	                dataType: "json",
	                contentType : "application/json"
	            },
	            create: {
	            	type: "POST",
	            	url: "/dma/waste_control_sheet/create_sheet_question_option",
	                dataType: "json",
	                contentType : "application/json"
	            },
	            parameterMap: function (model, operation) {
	                if (operation !== "read" && model) {
	                		model.questionId = currentSheetQuestion.questionId;
	                	return JSON.stringify(model);
	                }
	            }
            },
            paging: true,
            pageSize: 5,
	        schema: {
	            model: {
	                id: "questionId",
	                fields: {
	                	optionId : { editable: false, nullable: true },
	                	questionId : { editable: false, nullable: false, defaultValue:currentSheetQuestion?currentSheetQuestion.questionId:0 },
	                	optionTitle : { validation: { required: true } }
	                }
	            }
	        }
        },
        pageable: true,selectable : true,
		toolbar: ['create'],
		columns: [
		          { field: "optionId", title:"Question Id"},
		          { field: "optionTitle", title:"Question Title"},
		          { command: ["edit"], title: "&nbsp;", width: "172px" }],
		editable : "inline"
	});
}

function attachInspectionsToolBarActions(){
	$("#searchBtn").click(function(e){
		e.preventDefault();
		searchInspections($("#searchField").val());
    });

    $("#searchField").keydown(function(e){
        if (e.keyCode==13){
        	searchInspections($("#searchField").val());
        }
    });
    
    var createInspectionSubmitHandler = function(e){
    	e.preventDefault();
		var form = $("#inspection-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/waste_control_sheet/create_inspection_sheet",formData,function(data){
			searchInspections(formData.vessel.substring(1,formData.vessel.indexOf(",")-1));
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Inspection Sheet Added successfully.");
		});
    },
    updateInspectionSubmitHandler = function(e){
    	e.preventDefault();
		var form = $("#inspection-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/waste_control_sheet/update_inspection_sheet",formData,function(data){
			searchInspections(formData.vessel.substring(1,formData.vessel.indexOf(",")-1));
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Inspection Sheet Updated successfully.");
		});
    };
    
    $("#inspectionAddBtn").click(function(e){
    	e.preventDefault();
    	display_popup(
    			"inspection-form",
    			"inspection-form-template",
    			null,
    			createInspectionSubmitHandler,
    			"Add Inspection Sheet",
    			"500px"
    		);
    });
	
	$("#inspectionEditBtn").click(function(e){
    	e.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentInspectionSheet,
    		vessel : currentInspectionSheet.vessel.vesselName+", "+currentInspectionSheet.vessel.regNo,
    		facility : currentInspectionSheet.facility.facilityName+", "+currentInspectionSheet.facility.regNo,
    		inspectionDate : new Date(currentInspection.inspectionDate)
    	});
    	display_popup(
    			"inspection-form",
    			"inspection-form-template",
    			viewmodel,
    			updateInspectionSubmitHandler,
    			"Edit Inspection Sheet",
    			"500px"
    		);
    });
}

function attachSheetSectionsToolBarActions(){
	var createSheetSectionSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#sheet-section-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/waste_control_sheet/create_sheet_section",formData,function(data){
			var grid = $("#sectionsGrid").data("kendoGrid");
			grid.dataSource.read();
			currentSheetSection = null;
			
			$("#sectionEditBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Sheet Section Added successfully.");
		});
	},
	updateSheetSectionSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#sheet-section-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/waste_control_sheet/update_sheet_section",formData,function(data){
			var grid = $("#sectionsGrid").data("kendoGrid");
			grid.dataSource.read();
			currentSheetSection = null;
			
			$("#sectionEditBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Sheet Section Updated successfully.");
		});
	};
	
	$("#sectionAddBtn").click(function(e){
	   	e.preventDefault();
	   	display_popup(
    			"sheet-section-form",
    			"sheet-section-form-template",
    			null,
    			createSheetSectionSubmitHandler,
    			"Add Sheet Section",
    			"500px"
    		);
	});
	
	$("#sectionEditBtn").click(function(e){
	   	e.preventDefault();
	   	var viewmodel = kendo.observable({
    		dataItem : currentSheetSection
    	});
	   	display_popup(
    			"sheet-section-form",
    			"sheet-section-form-template",
    			viewmodel,
    			updateSheetSectionSubmitHandler,
    			"Edit Sheet Section",
    			"500px"
    		);
	});
}

function attachQuestionResultsToolBarActions(e){
	var detailRow = e.detailRow;
	
	var createQuestionResultSubmitHandler = function(evt){
		evt.preventDefault();
		var form = $("#question-result-form");
		var formData = getFormData(form);
		formData.inspectionSheetId = e.data.inspectionSheetId;
		
		sendAjaxPost("/dma/waste_control_sheet/create_inspection_question_result",formData,function(data){
			var grid = detailRow.find(".questionResultsGrid").data("kendoGrid");
			grid.dataSource.read();
			currentInspectionQuestionResult = null;

			detailRow.find(".questionResultEditBtn").hide();
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Inspection Question Result Added successfully.");
		});
	},updateQuestionResultSubmitHandler = function(evt){
		evt.preventDefault();
		var form = $("#question-result-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/waste_control_sheet/update_inspection_question_result",formData,function(data){
			var grid = detailRow.find(".questionResultsGrid").data("kendoGrid");
			grid.dataSource.read();
			currentInspectionQuestionResult = null;
			
			detailRow.find(".questionResultEditBtn").hide();
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Inspection Question Result Updated successfully.");
		});
	};
	
	detailRow.find(".questionResultAddBtn").click(function(evt){
    	evt.preventDefault();
    	display_popup(
    			"question-result-form",
    			"question-result-form-template",
    			null,
    			createQuestionResultSubmitHandler,
    			"Add Inspection Question Result",
    			"500px"
    		);
    	$("#question").data("kendoDropDownList").bind("select",function(e){
    		var dataItem = this.dataItem(e.item.index());
    		if(e.item.index()>=0){
    			optionsDS = new kendo.data.DataSource({
        			transport: {read: {dataType: "json",url: "/dma/waste_control_sheet/load_sheet_question_options/"+dataItem.questionId}
        		    }
        		});
    		}else{
    			optionsDS = new kendo.data.DataSource();
    		}
    		
    	});
    });
	
	detailRow.find(".questionResultEditBtn").click(function(evt){
    	evt.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentInspectionQuestionResult
    	});
    	display_popup(
    			"question-result-form",
    			"question-result-form-template",
    			viewmodel,
    			updateQuestionResultSubmitHandler,
    			"Edit Inspection Question Result",
    			"500px"
    		);
    });
}

function attachReportsToolBarActions(e){
	var detailRow = e.detailRow;
	
	var createInspectionReportSubmitHandler = function(evt){
		evt.preventDefault();
		var form = $("#inspection-report-form");
		var formData = getFormData(form);
		formData.inspectionSheetId = e.data.inspectionSheetId;
		
		sendAjaxPost("/dma/waste_control_sheet/create_inspection_report",formData,function(data){
			var grid = detailRow.find(".reportsGrid").data("kendoGrid");
			grid.dataSource.read();
			currentInspectionReport = null;

			detailRow.find(".reportEditBtn").hide();
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Inspection Report Added successfully.");
		});
	},updateInspectionReportSubmitHandler = function(evt){
		evt.preventDefault();
		var form = $("#inspection-report-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/waste_control_sheet/update_inspection_report",formData,function(data){
			var grid = detailRow.find(".reportsGrid").data("kendoGrid");
			grid.dataSource.read();
			currentInspectionReport = null;
			
			detailRow.find(".reportEditBtn").hide();
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Inspection Report Updated successfully.");
		});
	};
	
	detailRow.find(".reportAddBtn").click(function(evt){
    	evt.preventDefault();
    	display_popup(
    			"inspection-report-form",
    			"inspection-report-form-template",
    			null,
    			createInspectionReportSubmitHandler,
    			"Add Inspection Report",
    			"500px"
    		);
    });
	
	detailRow.find(".reportEditBtn").click(function(evt){
    	evt.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentInspectionReport
    	});
    	display_popup(
    			"inspection-report-form",
    			"inspection-report-form-template",
    			viewmodel,
    			updateInspectionReportSubmitHandler,
    			"Edit Inspection Report",
    			"500px"
    		);
    });
}

function searchInspections(value){
	var type = $("#searchBy").val();
	
	sendAjaxPost("/dma/waste_control_sheet/search_inspection_sheets",{criteriaType:type,criteriaValue:value},function(result){
		var dataSource = new kendo.data.DataSource({
	        data:result.data,
	        pageSize: 10
	    });

	    $("#inspectionsGrid").data("kendoGrid").setDataSource(dataSource);
	});
	
	currentInspectionSheet = null;
	$("#inspectionEditBtn").hide();
}