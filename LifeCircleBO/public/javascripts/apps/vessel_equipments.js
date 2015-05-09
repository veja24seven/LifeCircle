/**
 * Created with IntelliJ IDEA.
 * User: Harry
 * Date: 2013/10/19
 * Time: 10:31 PM
 * To change this template use File | Settings | File Templates.
 */

function init (){

	$("#vesselEquipmentsAndChecklistTabstrip").kendoTabStrip();
	
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
            { command: { text: "Manage Equipment", click: showVesselEquipment }, title: " ", width: "150px" }],
        change : function(){
            var row = this.select();
            var data = this.dataItem(row);
            currentVessel = data;
            console.log("Selected: " + currentVessel + " Text, [" + JSON.stringify(currentVessel) + "]");
            //showVesselDocs(data);
            $("#vesselEquipmentsHeader").text("Vessel : "+currentVessel.vesselName+", "+currentVessel.regNo);
            $("#vesselCheckListsHeader").text("Vessel : "+currentVessel.vesselName+", "+currentVessel.regNo);
            reloadKendoGrid("checklistsGrid","/vessels/equipments/load_equipment_checklists/"+currentVessel.vesselId,8);
        }

    });
    
    $("#equipmentsGrid").kendoGrid({
        pageable: true,
        selectable : true,
        toolbar: kendo.template($("#equipmentsTemplate").html()),
        detailTemplate: kendo.template($("#vesselEquipmentDatailTemplate").html()),
        detailInit: showVesselEquipmentDetail,
        columns: [
            { field: "equipmentHeader.equipmentName", title:"Equipment Name"},
            { field: "equipmentHeader.categoryName.value", title:"Category Name"},
            { field: "mandatory",title:"Is Mandatory", template:"#: mandatory?'YES':'NO' #"}],
        change : function(){
            var row = this.select();
            var data = this.dataItem(row);
            console.log("Selected: " + data + " Text, [" + JSON.stringify(data) + "]");
            //showVesselDocs(data);
            currentEquipment = data;
            $("#editEquipmentBtn").show();
        }

    });
    
    $("#checklistsGrid").kendoGrid({
    	pageable: true,
        selectable : true,
        toolbar: kendo.template($("#checklistsTemplate").html()),
        detailTemplate: kendo.template($("#vesselCheckListDatailTemplate").html()),
        detailInit: showChecklistComponentsDetail,
        columns: [
            { field: "listName", title:"List Name"},
            { field: "listDate", title:"List Date"},
            { field: "expiryDate",title:"Expiry Date"},
            { field: "validPeriod",title:"Valid Period"},
            { field: "surveyor.name1",title:"Survayor"},
            { field: "confirmed",title:"Is Confirmed", template: "#: confirmed?'YES':'NO' #"},
            { field: "confirmDate",title:"Confirmed Date"}],
        change : function(){
            var row = this.select();
            var data = this.dataItem(row);
            console.log("Selected: " + data + " Text, [" + JSON.stringify(data) + "]");
            //showVesselDocs(data);
            currentEquipmentChecklist = data;
            $("#editChecklistBtn").show();
            if (!currentEquipmentChecklist.confirmed){
            	$("#confirmChecklistBtn").show();
            }else{
            	$("#confirmChecklistBtn").hide();
            }
        }
    });
    
    $("#addNewEquipmentBtn").click(function(e){
    	display_popup(
				"vessel-equipment-form",
				"vessel-equipment-form-template",
				null,
				createVesselEquipmentSubmitHandler,
				"Add Vessel Equipment",
				"420px"
		);
        e.preventDefault();
    });
    
    $("#editEquipmentBtn").click(function(e){
    	var viewModel = kendo.observable({
    		vesselId : currentVessel.vesselId,
    		equipment : currentEquipment,
    		mandatory : currentEquipment.mandatory? 'YES':'NO'
    	});
    	display_popup(
				"vessel-equipment-form",
				"vessel-equipment-form-template",
				viewModel,
				updateVesselEquipmentSubmitHandler,
				"Edit Vessel Equipment",
				"420px"
		);
        e.preventDefault();
    });
    
    $("#addNewChecklistBtn").click(function(e){
    	display_popup(
				"equipment-checklist-form",
				"equipment-checklist-form-template",
				null,
				createEquipmentChecklistSubmitHandler,
				"Add Equipment Checklist",
				"420px"
		);
    	//showAddEquipmentChecklistForm();
    	e.preventDefault();
    });
    
    $("#editChecklistBtn").click(function(e){
    	var viewModel = kendo.observable({
    		vesselId : currentVessel.vesselId,
    		checklist : currentEquipmentChecklist,
    		surveyor : currentEquipmentChecklist.surveyor.name1+", "+currentEquipmentChecklist.surveyor.identityNumber 
    	});
    	display_popup(
				"equipment-checklist-form",
				"equipment-checklist-form-template",
				viewModel,
				updateEquipmentChecklistSubmitHandler,
				"Edit Equipment Checklist",
				"420px"
		);
    	e.preventDefault();
    });
    
    $("#confirmChecklistBtn").click(function(e){
    	e.preventDefault();
    	sendAjaxPost("/vessels/equipments/confirm_equipment_checklist",{checklistId:currentEquipmentChecklist.checkListId},function(data){
    		reloadKendoGrid("checklistsGrid","/vessels/equipments/load_equipment_checklists/"+currentVessel.vesselId,8);
    		$("#editChecklistBtn").hide();
    		$("#confirmChecklistBtn").hide();
        	alert("Equipment Checklist confirmed successfully.");
    	});
    });
    
    initializeLookupDataSources();
}

function searchVessel(value){
	reloadKendoGrid("vesselsGrid","/vessels/search/namflag/"+value,10);
}

function showVesselEquipment(e){
	e.preventDefault();

    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    
    currentVessel = dataItem;
    
    $("#vesselEquipmentsHeader").text("Vessel : "+dataItem.vesselName+", "+dataItem.regNo);
    var tabStrip = $("#vesselEquipmentsAndChecklistTabstrip").kendoTabStrip().data("kendoTabStrip");
    tabStrip.select(1); 
    
    reloadKendoGrid("equipmentsGrid","/vessels/equipments/load_vessel_equipments/"+currentVessel.vesselId,8);
    $("#editEquipmentBtn").hide();
}

function showVesselEquipmentDetail(e){
	var detailRow = e.detailRow;
	
	detailRow.find(".equipmentComponentsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
            	read: "/vessels/equipments/load_vessel_components/"+currentVessel.vesselId+"/"+e.data.equipmentHeader.equipmentId
            },
            paging: true,
            pageSize: 4
        },
        scrollable : false,
		pageable: true,
        selectable : true,
        toolbar: kendo.template($("#componentsTemplate").html()),
        columns: [
	          { field: "equipmentDetails.componentName", title:"Component Name"},
	          { field: "requiredQuantity", title:"Requiried Quantity" }],
	          change : function(){
	              var row = this.select();
	              var data = this.dataItem(row);
	              currentEquipmentComponent = data;
	              
	              detailRow.find(".editEquipmentComponentBtn").show();
	          }
	});
	
	attachVesselEquipmentComponentActionHandlers(e);
}

function attachVesselEquipmentComponentActionHandlers(e){
	var detailRow = e.detailRow;
	
	var submitAddEquipmentComponentHandler = function(evt){
		var form = $("#equipment-component-form");
		var formData = getFormData(form);
		formData.vessel = currentVessel.vesselId;
		
		sendAjaxPost("/vessels/equipments/add_equipment_component",formData,function(data){
			var grid = detailRow.find(".equipmentComponentsGrid").data("kendoGrid");
			grid.dataSource.read();
	        detailRow.find(".editEquipmentComponentBtn").hide();
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	    	alert("Vessel Equipment Detail added successfully.");
		});
	};
	
	var submitEditEquipmentComponentHandler = function(evt){
		var form = $("#equipment-component-form");
		var formData = getFormData(form);
		sendAjaxPost("/vessels/equipments/update_equipment_component",formData,function(data){
			var grid = detailRow.find(".equipmentComponentsGrid").data("kendoGrid");
			grid.dataSource.read();
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        detailRow.find(".editEquipmentComponentBtn").hide();
	    	alert("Vessel Equipment Detail updated successfully.");
		});
	};
	
	detailRow.find(".addNewEquipmentComponentBtn").click(function(evt){
		evt.preventDefault();
		equipmentComponentsDS = new kendo.data.DataSource({
			transport: {
	            read: {
	                dataType: "json",
	                url: "/vessels/equipments/load_components/"+currentEquipment.equipmentHeader.equipmentId
	            }
	        }
		});
		display_popup(
				"equipment-component-form",
				"equipment-component-form-template",
				null,
				submitAddEquipmentComponentHandler,
				"Add Vessel Equipment Component",
				"420px"
		);
	});
	
	detailRow.find(".editEquipmentComponentBtn").click(function(evt){
		evt.preventDefault();
		equipmentComponentsDS = new kendo.data.DataSource({
			transport: {
	            read: {
	                dataType: "json",
	                url: "/vessels/equipments/load_components/"+currentEquipment.equipmentHeader.equipmentId
	            }
	        }
		});
		var viewModel = kendo.observable({
			equipmentId : e.data.vesselEquipmentHeaderId,
			equipmentComponent : currentEquipmentComponent.vesselEquipmentDetailsId,
			component : currentEquipmentComponent.equipmentDetails,
			requiredQuantity : currentEquipmentComponent.requiredQuantity
    	});
    	display_popup(
				"equipment-component-form",
				"equipment-component-form-template",
				viewModel,
				submitEditEquipmentComponentHandler,
				"Edit Vessel Equipment Component",
				"420px"
		);
	});
}

var equipmentsDS = null, surveyorAutocompleteDS = null,
	equipmentComponentsDS = null;
function initializeLookupDataSources(){
	equipmentsDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/vessels/equipments/load_equipments"}
        }
	});
	
	surveyorAutocompleteDS = new kendo.data.DataSource({
		type: "json",pageSize: 10,
        transport: {read: "/customer/load_autocomplete_customers"}
	});
}

function createVesselEquipmentSubmitHandler(e){
	var form = $("#vessel-equipment-form");
	var formData = getFormData(form);
	formData.vessel = currentVessel.vesselId;
	
	sendAjaxPost("/vessels/equipments/add_vessel_equipment",formData,function(data){
		reloadKendoGrid("equipmentsGrid","/vessels/equipments/load_vessel_equipments/"+currentVessel.vesselId,8);
    	
    	form[0].reset();
        $("#current-form-window").data("kendoWindow").close();
        $("#editEquipmentBtn").hide();
    	alert("Vessel Equipment Added successfully.");
	});
}

function updateVesselEquipmentSubmitHandler(e){
	var form = $("#vessel-equipment-form");
	var formData = getFormData(form);
	
	sendAjaxPost("/vessels/equipments/update_vessel_equipment",formData,function(data){
		reloadKendoGrid("equipmentsGrid","/vessels/equipments/load_vessel_equipments/"+currentVessel.vesselId,8);
    	
    	form[0].reset();
        $("#current-form-window").data("kendoWindow").close();
        $("#editEquipmentBtn").hide();
    	alert("Vessel Equipment updated successfully.");
	});
}

function createEquipmentChecklistSubmitHandler(e){
	var form = $("#equipment-checklist-form");
	var formData = getFormData(form);
	formData.vessel = currentVessel.vesselId;
	
	sendAjaxPost("/vessels/equipments/add_equipment_checklist",formData,function(data){
		reloadKendoGrid("checklistsGrid","/vessels/equipments/load_equipment_checklists/"+currentVessel.vesselId,8);
		
    	form[0].reset();
        $("#current-form-window").data("kendoWindow").close();
        $("#editChecklistBtn").hide();
        $("#confirmChecklistBtn").hide();
    	alert("Equipment Checklist Added successfully.");
	});
}

function updateEquipmentChecklistSubmitHandler(e){
	var form = $("#equipment-checklist-form");
	var formData = getFormData(form);
	
	sendAjaxPost("/vessels/equipments/update_equipment_checklist",formData,function(data){
		reloadKendoGrid("checklistsGrid","/vessels/equipments/load_equipment_checklists/"+currentVessel.vesselId,8);
		
    	form[0].reset();
        $("#current-form-window").data("kendoWindow").close();
        $("#editChecklistBtn").hide();
        $("#confirmChecklistBtn").hide();
    	alert("Equipment Checklist updated successfully.");
	});
}

function showChecklistComponentsDetail(e){
	var detailRow = e.detailRow;
	
	detailRow.find(".checklistComponentsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
            	read: {
                    url: "/vessels/equipments/load_checklist_components/"+e.data.checkListId,
                    dataType: "json"
                },
                update: {
                	type: "POST",
                    url: "/vessels/equipments/update_checklist_item",
                    dataType: "json",
                    contentType : "application/json"
                },
                parameterMap: function (model, operation) {
                    if (operation !== "read" && model) {
                    	console.log("Model "+kendo.stringify(model));
                    	return JSON.stringify({entryId:model.entryId,actualQuantity:model.actualQuantity,
                    		working:model.working,available:model.available,auditComment:model.auditComment});
                    }
                }
            },
            paging: true,
            pageSize: 20,
            schema: {
                model: {
                    id: "entryId",
                    fields: {
                    	entryId : {editable : false, nullable : false},
                    	requiredQuantity : {type : "number",editable : false},
                    	actualQuantity : { type: "number", validation: { required: true, min: 0} },
                    	available : { type: "boolean" },
                    	working : { type: "boolean" },
                    	auditComment : {validation: { maxLength : 200, required: false } }
                    }
                }
            }
        },
        scrollable : false,
		pageable: true,
		groupable: true,
        selectable : true,
        editable: "inline",
        columns: [
	          { field: "equipmentHeader.equipmentName", title:"Equipment Name", editor:function(elem,opts){elem.text(opts.model.equipmentHeader.equipmentName)} },
	          { field: "equipmentDetails.componentName", title:"Component Name", editor:function(elem,opts){elem.text(opts.model.equipmentDetails.componentName)} },
	          { field: "requiredQuantity", title:"Required Quantity", editor:function(elem,opts){elem.text(opts.model.requiredQuantity)}},
	          { field: "actualQuantity", title:"Actual Quantity"},
	          { field: "available", title:"Is Available",template: "#= available?'YES':'NO' #"},
	          { field: "working", title:"Is Working",template: "#= working?'YES':'NO' #"},
	          { field: "auditComment", title:"Comment"},
	          { command: ["edit"], title: "&nbsp;", width: "100px"}]
	});
}

function nonEditableEditor(container, options){
	container.text(options.model.equipmentDetails);
}