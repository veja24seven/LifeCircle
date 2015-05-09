/**
 * Created with IntelliJ IDEA.
 * User: Veli Khumalo
 * Date: 2013/10/19
 * Time: 10:31 PM
 * To change this template use File | Settings | File Templates.
 */

function init (){
	$("#vesselManningAndTransiresTabstrip").kendoTabStrip();
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
            { command: { text: "Mannings", click: showVesselMannings }, title: " ", width: "90px" }],
        change : function(){
            var row = this.select();
            var data = this.dataItem(row);
            currentVessel = data;
            console.log("Selected: " + currentVessel + " Text, [" + JSON.stringify(currentVessel) + "]");
            
            $("#manningsHeader").text("Vessel : "+dataItem.vesselName+", "+dataItem.regNo);
            reloadKendoGrid("manningsGrid","/vessels/mannings/load_vesselmannings/"+currentVessel.vesselId,10);
        }
    });
    
    $("#manningsGrid").kendoGrid({
        pageable: true,
        selectable : true,
        height: 500,
        toolbar: kendo.template($("#manninglistsTemplate").html()),
        detailTemplate: kendo.template($("#vesselManningDetailTemplate").html()),
        detailInit: showVesselManningDetail,
        columns: [
            { field: "position.positionDescription", title:"Position"},
            { field: "positionCoc.positionCocDescription", title:"Position COC"},
            { field: "minHeadCount",title:"Min Head Count"},
            { field: "actualHeadCount",title:"Actual Head Count"},
            { field: "positionConfirmed",title:"Confirmed", template:"#: positionConfirmed? 'YES': 'NO' #"},
            { field: "confirmDate",title:"Confirm Date"}],
        change : function(){
            var row = this.select();
            var data = this.dataItem(row);
            currentVesselManning = data;
            //showVesselDocs(data);
            if(currentVesselManning.positionConfirmed){
            	$("#editVesselManningBtn").hide();
            }else{
            	$("#editVesselManningBtn").show();
                $("#confirmVesselManningBtn").show();
            }
        }
    });
    
    $("#addNewVesselManningBtn").click(function(e){
    	e.preventDefault();
    	display_popup(
				"vessel-manning-form",
				"vessel-manning-form-template",
				null,
				addVesselManningSubmitHandler,
				"Add Vessel Manning",
				"420px"
		);
    });
    
    $("#editVesselManningBtn").click(function(e){
    	e.preventDefault();
    	var viewModel = kendo.observable({
    		vesselId : currentVessel.vesselId,
    		manning : currentVesselManning
    	});
    	display_popup(
				"vessel-manning-form",
				"vessel-manning-form-template",
				viewModel,
				editVesselManningSubmitHandler,
				"Edit Vessel Manning",
				"420px"
		);
    });
    
    $("#confirmVesselManningBtn").click(function(e){
    	e.preventDefault();
    	sendAjaxPost("/vessels/mannings/confirm_vesselmanning",{manningId:currentVesselManning.manningId},function(data){
    		reloadKendoGrid("manningsGrid","/vessels/mannings/load_vesselmannings/"+currentVessel.vesselId,10);
            $("#editVesselManningBtn").hide();
            $("#confirmVesselManningBtn").hide();
            
        	alert("Vessel Manning Confirmed successfully.");
    	});
    });
    
    initializeLookupDataSources();
}

function addVesselManningSubmitHandler(e){
	var form = $("#vessel-manning-form");
	var formData = getFormData(form);
	formData.vesselId = currentVessel.vesselId;
	sendAjaxPost("/vessels/mannings/create_vesselmanning",formData,function(data){
		reloadKendoGrid("manningsGrid","/vessels/mannings/load_vesselmannings/"+currentVessel.vesselId,10);
		
    	form[0].reset();
        $("#current-form-window").data("kendoWindow").close();
        $("#editVesselManningBtn").hide();
        $("#confirmVesselManningBtn").hide();
    	alert("Vessel Manning added successfully.");
	});
}

function editVesselManningSubmitHandler(e){
	var form = $("#vessel-manning-form");
	var formData = getFormData(form);
	sendAjaxPost("/vessels/mannings/update_vesselmanning",formData,function(data){
		reloadKendoGrid("manningsGrid","/vessels/mannings/load_vesselmannings/"+currentVessel.vesselId,10);
		
    	form[0].reset();
        $("#current-form-window").data("kendoWindow").close();
        $("#editVesselManningBtn").hide();
        $("#confirmVesselManningBtn").hide();
    	alert("Vessel Manning updated successfully.");
	});
}

var positionsDS = null, cocsDS = null, seafarerAutocompleteDS = null;
function initializeLookupDataSources(){
	positionsDS = new kendo.data.DataSource({
		type: "json",pageSize: 10,
		transport: {read: "/lookup/vesselPositions"}
	});
	
	cocsDS = new kendo.data.DataSource({
		type: "json",pageSize: 10,
		transport: {read: "/lookup/vesselPositionCocs"}
	});
	
	seafarerAutocompleteDS = new kendo.data.DataSource({
		type: "json",pageSize: 10,
		transport: {read: "/seafarers/load_autocomplete_seafarers"}
	});
}

function searchVessel(value){
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/vessels/search/namflag/"+value // the remote service url - Twitter API v1.1
            }
        },
        pageSize: 10
    });

    $("#vesselsGrid").data("kendoGrid").setDataSource(dataSource);
    dataSource.read();
}

function showVesselMannings(e){
	e.preventDefault();

    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    
    currentVessel = dataItem;
    
    $("#manningsHeader").text("Vessel : "+dataItem.vesselName+", "+dataItem.regNo);
    var tabStrip = $("#vesselManningAndTransiresTabstrip").kendoTabStrip().data("kendoTabStrip");
    tabStrip.select(1); 

    reloadKendoGrid("manningsGrid","/vessels/mannings/load_vesselmannings/"+currentVessel.vesselId,10);
    $("#editVesselManningBtn").hide();
    $("#confirmVesselManningBtn").hide();
    
}
var currentVesselTransire = null;
function showVesselManningDetail(e){
	var detailRow = e.detailRow;
	detailRow.find(".vesselTransiresGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
            	read: "/vessels/mannings/load_vesseltransires/"+e.data.manningId
            },
            paging: true,
            pageSize: 10
        },
        scrollable : false,
		pageable: true,
        selectable : true,
        height: 300,
        toolbar: kendo.template($("#vesselTransiresGridTemplate").html()),
        columns: [
              { field: "seafarer", title:"Seafarer", template:"#: seafarer.employer.name1 #"},
	          { field: "cocRefNo", title:"Coc Ref No."},
	          { field: "cocIssueDate", title:"Coc Issue Date"},
	          { field: "cocExpireDate", title:"Coc Expire Date" },
	          { field: "officerConfirmed", title: "Office Confirmed", template:"#: officerConfirmed? 'YES': 'NO' #"},
	          { field: "confirmDate", title: "Confirm Date"}],
	          change : function(){
	              var row = this.select();
	              var data = this.dataItem(row);
	              currentVesselTransire = data;
	              //showVesselDocs(data);
	              if(currentVesselTransire.officerConfirmed){
	            	  detailRow.find(".editVesselTransireBtn").hide();
	            	  detailRow.find(".confirmVesselTransireBtn").hide();
	              }else{
	            	  detailRow.find(".editVesselTransireBtn").show();
	            	  detailRow.find(".confirmVesselTransireBtn").show();
	              }
	          }
	});
	
	attachTransireActionEvents(e);
}

function attachTransireActionEvents(e){
	var detailRow = e.detailRow;
	
	var submitAddTransireHandler = function(evt){
		var form = $("#vessel-transire-form");
		var formData = getFormData(form);
		formData.manningId = e.data.manningId;
		
		sendAjaxPost("/vessels/mannings/create_vesseltransire",formData,function(data){
			reloadKendoGrid("manningsGrid","/vessels/mannings/load_vesselmannings/"+currentVessel.vesselId,10);
		    $("#editVesselManningBtn").hide();
		    $("#confirmVesselManningBtn").hide();
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	    	alert("Vessel Transire added successfully.");
		});
	};
	
	var submitEditTransireHandler = function(evt){
		var form = $("#vessel-transire-form");
		var formData = getFormData(form);
		sendAjaxPost("/vessels/mannings/update_vesseltransire",formData,function(data){
			var grid = detailRow.find(".vesselTransiresGrid").data("kendoGrid");
			grid.dataSource.read();
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        detailRow.find(".editVesselTransireBtn").hide();
	        detailRow.find(".confirmVesselTransireBtn").hide();
	    	alert("Vessel Transire updated successfully.");
		});
	};
	
	detailRow.find(".addNewVesselTransireBtn").click(function(evt){
		evt.preventDefault();
		display_popup(
				"vessel-transire-form",
				"vessel-transire-form-template",
				null,
				submitAddTransireHandler,
				"Add Vessel Transire",
				"420px"
		);
	});
	
	detailRow.find(".editVesselTransireBtn").click(function(evt){
		evt.preventDefault();
		var viewModel = kendo.observable({
			manningId : e.data.manningId,
			seafarer : currentVesselTransire.seafarer.employer.name1+", "+currentVesselTransire.seafarer.employer.identityNumber,
    		transire: currentVesselTransire
    	});
    	display_popup(
				"vessel-transire-form",
				"vessel-transire-form-template",
				viewModel,
				submitEditTransireHandler,
				"Edit Vessel Transire",
				"420px"
		);
	});
	
	detailRow.find(".confirmVesselTransireBtn").click(function(evt){
		evt.preventDefault();
    	sendAjaxPost("/vessels/mannings/confirm_vesseltransire",{transireId:currentVesselTransire.transireId},function(data){
    		var grid = detailRow.find(".vesselTransiresGrid").data("kendoGrid");
			grid.dataSource.read();
			
			detailRow.find(".editVesselTransireBtn").hide();
			detailRow.find(".confirmVesselTransireBtn").hide();
            
        	alert("Vessel Transire Confirmed successfully.");
    	});
	});
}