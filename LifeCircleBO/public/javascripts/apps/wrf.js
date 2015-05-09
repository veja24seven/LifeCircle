var namibianPortsDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/registryPorts"}
        },
        filter: { field: "countryCode", operator: "eq", value: "na" }
	}),
	wasteFacilityTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/wasteFacilityTypes"}
    	}
	}),
	serviceProviderTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/serviceProviderTypes"}
    	}
	}),
	customerAutocompleteDS = new kendo.data.DataSource({
		type: "json",pageSize: 10,
		transport: {read: "/customer/load_autocomplete_customers"}
	}),
	inspectionStatusesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/inspectionStatuses"}
        }
	}),
	surveyorsDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/surveyors"}
        }
	}),
	inspectionDeficiencyActionsDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/inspectionDeficiencyActions"}
        }
	});

var currentWasteFacility = null, currentInspection = null;
function init(){
	$("#wrf-tabstrip").kendoTabStrip();
	
	$("#wasteFacilitiesGrid").kendoGrid({
		pageable: true, selectable : true, height: 500,
		toolbar: kendo.template($("#waste-facilities-grid-toolbar-template").html()),
		detailTemplate: kendo.template($("#waste-facilities-grid-detail-template").html()),
		detailInit: showWasteFacilityDetail,
		columns : [
		    {title:"Owner", field:"owner.name1", template:"#= owner.name1 #, #= owner.identityNumber #"},
		    {title:"Facility Type", field:"wasteFacilityType.value"},
		    {title:"Service Provider Type", field:"serviceProviderType.value"},
		    {title:"Facility Port", field:"wasteFacilityPort.description"},
		    {title:"Facility Details", field:"wasteFacilityDetails"},
		    {title:"Location Details", field:"facilityLocationDetails"}
		],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			
			currentWasteFacility = data;
			
			$("#wasteFacilityEditBtn").show();
			
			$("#inspectionsTab").show();
			
			//$("#wrf-tabstrip").data("kendoTabStrip").select(1);
			
			$("#inspectionEditBtn").hide();
			

			reloadKendoGrid("inspectionsGrid","/dma/waste_reception_facility/load_waste_inspections/"+currentWasteFacility.wasteFacilityId,10);
		}
	});
	
	$("#inspectionsGrid").kendoGrid({
		pageable: true, selectable : true,
		toolbar: kendo.template($("#inspections-grid-toolbar-template").html()),
		detailTemplate: kendo.template($("#inspections-grid-detail-template").html()),
		detailInit: showInspectionDetail,
		columns : [
			{ field: "inspectionDate", title:"Date & Time", template:"#: kendo.toString(new Date(inspectionDate),'yyyy-MM-dd HH:mm') #"},
			{ field: "inspector.value",title:"Inspector"},
			{ field: "inspectionStatus.value",title:"Status"},
			{ field: "completionDate",title:"Completion Date"}
		],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			
			currentInspection = data;
			
			$("#inspectionEditBtn").show();
		}
	});
	
	attachWasteFacilitiesToolBarActions();
	
	attachWasteInspectionsToolBarActions();
}

function attachWasteFacilitiesToolBarActions(){
	$("#searchBtn").click(function(e){
		e.preventDefault();
		searchWasteFacilities($("#searchField").val());
    });

    $("#searchField").keydown(function(e){
        if (e.keyCode==13){
        	searchWasteFacilities($("#searchField").val());
        }
    });
    
	var createWasteFacilitySubmitHandler = function(e){
			e.preventDefault();
			var form = $("#waste-facility-form");
			var formData = getFormData(form);
			
			sendAjaxPost("/dma/waste_reception_facility/create_waste_facility_setup",formData,function(data){
				searchWasteFacilities(formData.owner.substring(0,formData.owner.indexOf(',')-1));
				
				form[0].reset();
				$("#current-form-window").data("kendoWindow").close();
				alert("Waste Facility Setup Added successfully.");
			});
		},
		updateWasteFacilitySubmitHandler = function(e){
			e.preventDefault();
			var form = $("#waste-facility-form");
			var formData = getFormData(form);
			
			sendAjaxPost("/dma/waste_reception_facility/update_waste_facility_setup",formData,function(data){
				searchWasteFacilities(currentWasteFacility.owner.identityNumber);
				
				form[0].reset();
				$("#current-form-window").data("kendoWindow").close();
				alert("Waste Facility Setup Updated successfully.");
			});
		};
	
	$("#wasteFacilityAddBtn").click(function(e){
    	e.preventDefault();
    	display_popup(
    			"waste-facility-form",
    			"waste-facility-form-template",
    			null,
    			createWasteFacilitySubmitHandler,
    			"Add Waste Facility Setup",
    			"500px"
    		);
    });
	
	$("#wasteFacilityEditBtn").click(function(e){
    	e.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentWasteFacility,
    		owner : currentWasteFacility.owner.name1+","+currentWasteFacility.owner.identityNumber,
    	});
    	display_popup(
    			"waste-facility-form",
    			"waste-facility-form-template",
    			viewmodel,
    			updateWasteFacilitySubmitHandler,
    			"Edit Waste Facility Setup",
    			"500px"
    		);
    });
}

function attachWasteInspectionsToolBarActions(){
	
	var createWasteInspectionSubmitHandler = function(e){
			e.preventDefault();
			var form = $("#waste-inspection-form");
			var formData = getFormData(form);
			formData.wasteFacilityId = currentWasteFacility.wasteFacilityId;
			
			sendAjaxPost("/dma/waste_reception_facility/create_waste_inspection",formData,function(data){
				reloadKendoGrid("inspectionsGrid","/dma/waste_reception_facility/load_waste_inspections/"+currentWasteFacility.wasteFacilityId,10);
				
				form[0].reset();
				$("#current-form-window").data("kendoWindow").close();
				alert("Waste Inspection Added successfully.");
			});
		},
		updateWasteInspectionSubmitHandler = function(e){
			e.preventDefault();
			var form = $("#waste-inspection-form");
			var formData = getFormData(form);
			
			sendAjaxPost("/dma/waste_reception_facility/update_waste_inspection",formData,function(data){
				reloadKendoGrid("inspectionsGrid","/dma/waste_reception_facility/load_waste_inspections/"+currentWasteFacility.wasteFacilityId,10);
				
				form[0].reset();
				$("#current-form-window").data("kendoWindow").close();
				alert("Waste Inspection Updated successfully.");
			});
		};
	
	$("#inspectionAddBtn").click(function(e){
    	e.preventDefault();
    	display_popup(
    			"waste-inspection-form",
    			"waste-inspection-form-template",
    			null,
    			createWasteInspectionSubmitHandler,
    			"Add Waste Inspection",
    			"500px"
    		);
    });
	
	$("#inspectionEditBtn").click(function(e){
    	e.preventDefault();
    	var viewmodel = kendo.observable({
    		inspectionDate : new Date(currentInspection.inspectionDate),
			inspection : currentInspection
    	});
    	display_popup(
    			"waste-inspection-form",
    			"waste-inspection-form-template",
    			viewmodel,
    			updateWasteInspectionSubmitHandler,
    			"Edit Waste Inspection",
    			"500px"
    		);
    });
}

function searchWasteFacilities(value){
	reloadKendoGrid("wasteFacilitiesGrid","/dma/waste_reception_facility/search_waste_facilities/"+value,10);
	
	currentWasteFacility = null;
	currentInspection = null;
	
	$("#wasteFacilityEditBtn").hide();

	$("#inspectionEditBtn").hide();
	$("#inspectionsTab").hide();
}

function showWasteFacilityDetail(e){
	currentWasteFacility = e.data;
	var detailRow = e.detailRow;
	
	detailRow.find(".wasteReceptionsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/waste_reception_facility/load_waste_receptions/"+e.data.wasteFacilityId
            },
            paging: true,
            pageSize: 5
        },
        pageable: true,selectable : true,
		toolbar: kendo.template($("#waste-receptions-grid-toolbar-template").html()),
		columns: [
		          { field: "wasteCategory.value", title:"Waste Category"},
		          { field: "wasteType.value", title:"Waste Type"},
		          { field: "wasteReceivable", title:"Waste Receivable", template:"#= wasteReceivable? 'YES':'NO' #" },
		          { field: "capacityVolume", title: "Capacity Volume"}],
		change : function (){
			var row = this.select();
			var data = this.dataItem(row);
			currentWasteReception = data;
			
			detailRow.find(".receptionEditBtn").show();
		}
	});
	
	attachWasteReceptionsToolBarActions(e);
}

function showInspectionDetail(e){
	currentInspection = e.data;
	
	var detailRow = e.detailRow;
	
	detailRow.find(".deficienciesGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/waste_reception_facility/load_inspection_deficiencies/"+e.data.inspectionId
            },
            paging: true,
            pageSize: 5
        },
        pageable: true,selectable : true,
		toolbar: kendo.template($("#inspection-deficiencies-grid-toolbar-template").html()),
		columns: [
		      { field: "actionTaken.value", title:"Action Taken"},
	          { field: "deficiencyDetails", title:"Deficiency Details" },
	          { field: "actionRemarks", title: "Action Remarks"}],
		change : function (){
			var row = this.select();
			var data = this.dataItem(row);
			currentInspectionDeficiency = data;
			
			detailRow.find(".deficiencyEditBtn").show();
		}
	});
	
	attachInspectionDeficiencyToolBarActions(e);
}

function attachWasteReceptionsToolBarActions(e){
	var detailRow = e.detailRow;
	
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
}

function attachInspectionDeficiencyToolBarActions(e){
	var detailRow = e.detailRow;
}