var customerAutocompleteDS = new kendo.data.DataSource({
	type: "json",pageSize: 10,
	transport: {read: "/customer/load_autocomplete_customers"}
}),
registryPortsDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/registryPorts"}
    }
}),
seafarerAutocompleteDS = new kendo.data.DataSource({
	type: "json",pageSize: 10,
	transport: {read: "/seafarers/load_autocomplete_seafarers"}
}),
positionsDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/vesselPositions"}
    }
}),
certificateTypesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/certificateTypes"}
    }
});
function init(){
	$("#outwardClearancesTabstrip").kendoTabStrip();
	
	$("#vesselsGrid").kendoGrid({
        pageable: true,
        selectable : true,
        height: 500,
        toolbar: kendo.template($("#vesselsTemplate").html()),
        columns: [
            { field: "owner.name1", title:"Owner"},
            { field: "regNo", title:"Reg #"},
            { field: "vesselName",title:"Name", template:"<a href='/vessel/display/#= vesselId #' target='_blank'>#= vesselName #</a>"},
            { field: "regType.value",title:"Reg. Type"},
            { field: "vesselType.value",title:"Vessel Type"},
            { field: "regPort.description",title:"Reg Port"},
            { field: "regDate",title:"Reg Date"},
            { field: "flagState.name",title:"Flag State"},
            { command: { text: "Outward Clearances", click: showOutwardClearances }, title: " ", width: "150px" }],
        change : function(){
            var row = this.select();
            var data = this.dataItem(row);
            currentVessel = data;
            console.log("Selected: " + currentVessel + " Text, [" + JSON.stringify(currentVessel) + "]");
            $("#outwardClearancesHeader").text("Vessel : "+currentVessel.vesselName+", "+currentVessel.regNo);
            reloadKendoGrid("outwardClearancesGrid","/outwardClearances/load_clearances/"+currentVessel.vesselId,10);
            
            $("#inspectionsHeader").text("Vessel : "+currentVessel.vesselName+", "+currentVessel.regNo);
            reloadKendoGrid("inspectionsGrid","/surveys/load_inspections/"+currentVessel.vesselId,10);
        }

    });
	
	$("#outwardClearancesGrid").kendoGrid({
		pageable: true,
        selectable : true,
        toolbar: kendo.template($("#outwardClearanceTemplate").html()),
        detailTemplate: kendo.template($("#outwardClearanceDetailTemplate").html()),
        detailInit : showOutwardClearanceDetail,
        columns: [
                  { field: "vesselOwner.name1", title:"Vessel Owner", template: "#: vesselOwner.name1 #, #: vesselOwner.identityNumber #"},
                  { field: "arrivalDate", title:"Arrival Date",template:"#: kendo.toString(new Date(arrivalDate),'yyyy-MM-dd HH:mm') #"},
                  { field: "clearanceDate", title:"Clearance Date"},
                  { field: "departDate",title:"Depart Date",template:"#: kendo.toString(new Date(departDate),'yyyy-MM-dd HH:mm') #"},
                  { field: "departPort.description",title:"Depart Port"},
                  { field: "nextPort",title:"Next Port"},
                  { field: "clearanceRefNo",title:"Clearance Ref No"},
                  { field: "clearedBy",title:"Cleared By"},
                  { field: "confirmedDate",title:"Confirmed Date"},
                  { field: "confirmedBy",title:"Confirmed By"}],
	    change : function(){
	    	var row = this.select();
	    	var data = this.dataItem(row);
	    	console.log("Selected: " + data + " Text, [" + JSON.stringify(data) + "]");
	    	currentOutwardClearance = data;
	    	if (currentOutwardClearance.confirmed){
	    		$("#clearanceEditBtn").hide();
	    		$("#clearanceConfirmBtn").hide();
	    	}else{
	    		$("#clearanceEditBtn").show();
	    		$("#clearanceConfirmBtn").show();
	    	}
	    }
	});
	
	$("#inspectionsGrid").kendoGrid({
		pageable: true,
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
                  { title:"Approval Status",template:"#= approvalStatus? approvalStatus.value:'' #"}]
	});
	
    attachOutwardClearancesToolBarActions();
}

function attachOutwardClearancesToolBarActions(){
	$("#searchVesselsBtn").click(function(e){
		var value = $("#vesselSearch").val();
		searchVessel(value);
        e.preventDefault();
    });

    $("#vesselSearch").keydown(function(e){
        if (e.keyCode==13){
        	var value = $("#vesselSearch").val();
        	searchVessel(value);
        }
    });
    
    var addOutwardClearamceSubmitHandler = function (e){
    	e.preventDefault();
    	var form = $("#outward-clearance-form");
		var formData = getFormData(form);
		formData.vesselId = currentVessel.vesselId;
		
		sendAjaxPost("/outwardClearances/create_clearance",formData,function(data){
			reloadKendoGrid("outwardClearancesGrid","/outwardClearances/load_clearances/"+currentVessel.vesselId,10);
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        $("#clearanceEditBtn").hide();
    		$("#clearanceConfirmBtn").hide();
	    	alert("Outward Clearance added successfully.");
		});
    },
    updateOutwardClearamceSubmitHandler = function(e){
    	e.preventDefault();
    	var form = $("#outward-clearance-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/outwardClearances/update_clearance",formData,function(data){
			reloadKendoGrid("outwardClearancesGrid","/outwardClearances/load_clearances/"+currentVessel.vesselId,10);
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        $("#clearanceEditBtn").hide();
    		$("#clearanceConfirmBtn").hide();
	    	alert("Outward Clearance updated successfully.");
		});
    };
    
    $("#clearanceAddBtn").click(function(e){
		e.preventDefault();
		if (currentVessel!=null){
			display_popup(
				"outward-clearance-form",
				"outward-clearance-form-template",
				null,
				addOutwardClearamceSubmitHandler,
				"Add Outward Clearance",
				"500px"
			);
			$("#vesselOwner").data("kendoAutoComplete").value(currentVessel.owner.name1+", "+currentVessel.owner.identityNumber);
		}else{
			alert("Please select Vessel.");
		}
    });
    
    $("#clearanceEditBtn").click(function(e){
    	e.preventDefault();
    	var viewmodel = kendo.observable({
			clearance : currentOutwardClearance,
			vesselOwner : currentOutwardClearance.vesselOwner.name1+", "+currentOutwardClearance.vesselOwner.identityNumber,
			departDate : new Date(currentOutwardClearance.departDate)
		});
    	display_popup(
			"outward-clearance-form",
			"outward-clearance-form-template",
			viewmodel,
			updateOutwardClearamceSubmitHandler,
			"Edit Outward Clearance",
			"500px"
		);
    });
    $("#clearanceConfirmBtn").click(function(e){
    	e.preventDefault();
		sendAjaxPost("/outwardClearances/confirm_clearance",{clearanceId:currentOutwardClearance.clearanceId},function(data){
			reloadKendoGrid("outwardClearancesGrid","/outwardClearances/load_clearances/"+currentVessel.vesselId,10);
			$("#clearanceEditBtn").hide();
    		$("#clearanceConfirmBtn").hide();
        	alert("Outward Clearance confirmed successfully.");
    	});
    });
}

function searchVessel(value){
	reloadKendoGrid("vesselsGrid","/vessels/search/arrived/"+value,10);
	currentVessel = null;
	$("#clearanceEditBtn").hide();
	$("#clearanceConfirmBtn").hide();
	$("#outwardClearancesHeader").text("Vessel : ");
	reloadKendoGrid("outwardClearancesGrid","/outwardClearances/load_clearances/0",10);
}

function showOutwardClearances(e){
	e.preventDefault();

    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    
    currentVessel = dataItem;
    
    $("#outwardClearancesHeader").text("Vessel : "+dataItem.vesselName+", "+dataItem.regNo);
    var tabStrip = $("#outwardClearancesTabstrip").kendoTabStrip().data("kendoTabStrip");
    tabStrip.select(1); 

    reloadKendoGrid("outwardClearancesGrid","/outwardClearances/load_clearances/"+currentVessel.vesselId,10);
    
    $("#inspectionsHeader").text("Vessel : "+currentVessel.vesselName+", "+currentVessel.regNo);
    reloadKendoGrid("inspectionsGrid","/surveys/load_inspections/"+currentVessel.vesselId,10);
}

function showInspectionDetail(e){
	var detailRow = e.detailRow;
	
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
        columns: [
	          { field: "actionTaken.value", title:"Action Taken"},
	          { field: "deficiencyDetails", title:"Deficiency Details" },
	          { field: "actionRemarks", title: "Action Remarks"}]
	});
}

var currentCrew = null,currentCertificate = null;
function showOutwardClearanceDetail(e){
	var detailRow = e.detailRow;
	
	detailRow.find(".outwardClearanceDetailTabStrip").kendoTabStrip();
	
	detailRow.find(".crewListGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
            	read: "/outwardClearances/load_crew_list/"+e.data.clearanceId
            },
            paging: true,
            pageSize: 10
        },
        scrollable : false,
		pageable: true,
        selectable : true,
        toolbar: kendo.template($("#crewListToolBarTemplate").html()),
		columns : [
		    {field:"seafarer",title:"Seafarer", template:"#= seafarer.customer.name1 #,#= seafarer.customer.name2 #"},
		    {field:"position.positionDescription",title:"Position"},
		    {field:"nationality.name",title:"Nationality"},
		    {field:"safetyCertificateNo",title:"Safety Certificate No"},
		    {field:"safetyCertificateDate",title:"Safety Certificate Date"},
		    {field:"healthCertificateNo",title:"Health Certificate No"},
		    {field:"healthCertificateDate",title:"Health Certificate Date"}
		],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			currentCrew = data;
			if(!e.data.confirmed){
				detailRow.find(".editCrewBtn").show();
			}else{
				detailRow.find(".editCrewBtn").hide();
			}
		}
	});
	
	detailRow.find(".certificatesGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
            	read: "/outwardClearances/load_certificates/"+e.data.clearanceId
            },
            paging: true,
            pageSize: 10
        },
        scrollable : false,
		pageable: true,
        selectable : true,
        toolbar: kendo.template($("#certificatesToolBarTemplate").html()),
		columns : [
		    {field:"certificateType.value",title:"Certificate Type"},
		    {field:"certificateRefNo",title:"Certificate Ref No"},
		    {field:"expiryDate",title:"Expire Date"},
		    {field:"extensionDate",title:"Extension Date"}
		],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			currentCertificate = data;
			if(!e.data.confirmed){
				detailRow.find(".editCertificateBtn").show();
			}else{
				detailRow.find(".editCertificateBtn").hide();
			}
		}
	});
	
	if(!e.data.confirmed){
		detailRow.find(".addCrewBtn").show();
		detailRow.find(".addCertificateBtn").show();
	}else{
		detailRow.find(".addCrewBtn").hide();
		detailRow.find(".addCertificateBtn").hide();
	}
	
	attachCrewListToolBarActions(e);
	
	attachCertificatesToolBarActions(e);
}

function attachCrewListToolBarActions(e){
	var detailRow = e.detailRow;
	
	var submitAddCrewHandler = function(evt){
		evt.preventDefault();
		var form = $("#oc-crew-form");
		var formData = getFormData(form);
		formData.clearanceId = e.data.clearanceId;
		
		sendAjaxPost("/outwardClearances/create_crew",formData,function(data){
			var grid = detailRow.find(".crewListGrid").data("kendoGrid");
			grid.dataSource.read();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();

	        detailRow.find(".editCrewBtn").hide();
	    	alert("Crew added successfully.");
		});
	},
	submitEditCrewHandler = function(evt){
		evt.preventDefault();
		var form = $("#oc-crew-form");
		var formData = getFormData(form);
		formData.clearanceId = e.data.clearanceId;
		
		sendAjaxPost("/outwardClearances/update_crew",formData,function(data){
			var grid = detailRow.find(".crewListGrid").data("kendoGrid");
			grid.dataSource.read();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();

	        detailRow.find(".editCrewBtn").hide();
	    	alert("Crew updated successfully.");
		});
	};
	
	detailRow.find(".addCrewBtn").click(function(evt){
		evt.preventDefault();
    	display_popup(
			"oc-crew-form",
			"oc-crew-form-template",
			null,
			submitAddCrewHandler,
			"Add Crew",
			"500px"
		);
    });
	
	detailRow.find(".editCrewBtn").click(function(evt){
		evt.preventDefault();
		var viewModel = kendo.observable({
    		entity : currentCrew,
    		seafarer : currentCrew.seafarer.customer.name1+", "+currentCrew.seafarer.customer.identityNumber
    	});
    	display_popup(
			"oc-crew-form",
			"oc-crew-form-template",
			viewModel,
			submitEditCrewHandler,
			"Edit Crew",
			"500px"
		);
    });
}

function attachCertificatesToolBarActions(e){
	var detailRow = e.detailRow;
	
	var submitAddCertificateHandler = function(evt){
		evt.preventDefault();
		var form = $("#oc-certificate-form");
		var formData = getFormData(form);
		formData.clearanceId = e.data.clearanceId;
		
		sendAjaxPost("/outwardClearances/create_certificate",formData,function(data){
			var grid = detailRow.find(".certificatesGrid").data("kendoGrid");
			grid.dataSource.read();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();

	        detailRow.find(".editCrewBtn").hide();
	    	alert("Certificate added successfully.");
		});
	},
	submitEditCertificateHandler = function(evt){
		evt.preventDefault();
		var form = $("#oc-certificate-form");
		var formData = getFormData(form);
		formData.clearanceId = e.data.clearanceId;
		
		sendAjaxPost("/outwardClearances/update_certificate",formData,function(data){
			var grid = detailRow.find(".certificatesGrid").data("kendoGrid");
			grid.dataSource.read();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();

	        detailRow.find(".editCrewBtn").hide();
	    	alert("Certificate updated successfully.");
		});
	};
	
	detailRow.find(".addCertificateBtn").click(function(evt){
		evt.preventDefault();
    	display_popup(
			"oc-certificate-form",
			"oc-certificate-form-template",
			null,
			submitAddCertificateHandler,
			"Add Certificate",
			"500px"
		);
    });
	
	detailRow.find(".editCertificateBtn").click(function(evt){
		evt.preventDefault();
		var viewModel = kendo.observable({
    		entity : currentCertificate
    	});
    	display_popup(
			"oc-certificate-form",
			"oc-certificate-form-template",
			viewModel,
			submitEditCertificateHandler,
			"Edit Certificate",
			"500px"
		);
    });
}