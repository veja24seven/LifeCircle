var namibianPortsDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/registryPorts"}
    },
    filter: { field: "countryCode", operator: "eq", value: "na" }
}),
registryPortsDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/registryPorts"}
    }
}),
arrivalStatusesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/arrivalStatuses"}
    }
}); 

function init(){
	$("#vesselArrivalNoticesTabstrip").kendoTabStrip();
	
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
            { command: { text: "Arrival Notices", click: showArrivalNotices }, title: " ", width: "150px" }],
        change : function(){
            var row = this.select();
            var data = this.dataItem(row);
            currentVessel = data;
            console.log("Selected: " + currentVessel + " Text, [" + JSON.stringify(currentVessel) + "]");
            $("#arrivalNoticesHeader").text("Vessel : "+currentVessel.vesselName+", "+currentVessel.regNo);

            reloadKendoGrid("arrivalNoticesGrid","/arrivalNotices/load/"+currentVessel.vesselId,10);
        }

    });
	
	$("#arrivalNoticesGrid").kendoGrid({
		pageable: true,
        selectable : true,
        toolbar: kendo.template($("#arrivalNoticesTemplate").html()),
        detailTemplate: kendo.template($("#arrivalNoticeDetailTemplate").html()),
        columns: [
                  { field: "owner.name1", title:"Vessel Owner", template: "#: owner.name1 #, #: owner.identityNumber #"},
                  { field: "arrivalPort.description", title:"Arrival Port"},
                  { field: "noticeDate", title:"Notice Date"},
                  { title:"Arrival Date & Time", template:"#: kendo.toString(new Date(arrivalDate),'yyyy-MM-dd HH:mm') #"},
                  { field: "visitDuration",title:"Visit Duration"},
                  { field: "arrivalStatus.value",title:"Status"},
                  { field: "statusDate",title:"Status Date"},
                  { field: "statusConfirmedBy",title:"Confirmed By"}],
	    change : function(){
	    	var row = this.select();
	    	var data = this.dataItem(row);
	    	console.log("Selected: " + data + " Text, [" + JSON.stringify(data) + "]");
	    	currentArrivalNotice = data;
	    	if (currentArrivalNotice.arrivalStatus.value.toUpperCase()==='PENDING'){
	    		$("#arrivalNoticeEditBtn").show();
	    	}else{
	    		$("#arrivalNoticeEditBtn").hide();
	    	}
    		$("#arrivalNoticeStatusBtn").show();
	    }
	});
	
	attachArrivalNoticesToolBarActions();
}

function attachArrivalNoticesToolBarActions(){
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
    
	var addArrivalNoticeSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#arrival-notice-form");
		var formData = getFormData(form);
		formData.vesselId = currentVessel.vesselId;
		
		sendAjaxPost("/arrivalNotices/create",formData,function(data){
			reloadKendoGrid("arrivalNoticesGrid","/arrivalNotices/load/"+currentVessel.vesselId,10);
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        
	    	alert("Arrival Notice added successfully.");
		});
	},
	updateArrivalNoticeSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#arrival-notice-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/arrivalNotices/update",formData,function(data){
			reloadKendoGrid("arrivalNoticesGrid","/arrivalNotices/load/"+currentVessel.vesselId,10);
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        
	    	alert("Arrival Notice updated successfully.");
		});
	},
	statusArrivalNoticeSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#arrival-notice-status-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/arrivalNotices/update_status",formData,function(data){
			reloadKendoGrid("arrivalNoticesGrid","/arrivalNotices/load/"+currentVessel.vesselId,10);
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        
	    	alert("Arrival Notice Status updated successfully.");
		});
	};
	
	$("#arrivalNoticeAddBtn").click(function(e){
		e.preventDefault();
		if (currentVessel!=null){
			display_popup(
				"arrival-notice-form",
				"arrival-notice-form-template",
				null,
				addArrivalNoticeSubmitHandler,
				"Add Arrival Notice",
				"500px"
			);
		}else{
			alert("Please select Vessel.");
		}
    });
	
	$("#arrivalNoticeEditBtn").click(function(e){
		e.preventDefault();
		var viewmodel = kendo.observable({
			notice : currentArrivalNotice,
			arrivalDate : new Date(currentArrivalNotice.arrivalDate)
		});
		display_popup(
			"arrival-notice-form",
			"arrival-notice-form-template",
			viewmodel,
			updateArrivalNoticeSubmitHandler,
			"Edit Arrival Notice",
			"500px"
		);
    });
	
	$("#arrivalNoticeStatusBtn").click(function(e){
		var viewmodel = kendo.observable({
			notice : currentArrivalNotice
		});
		display_popup(
			"arrival-notice-status-form",
			"arrival-notice-status-form-template",
			viewmodel,
			statusArrivalNoticeSubmitHandler,
			"Change Arrival Notice Status",
			"500px"
		);
    	e.preventDefault();
    });
}

function searchVessel(value){
	reloadKendoGrid("vesselsGrid","/vessels/search/namflag/"+value,10);
	currentVessel = null;
	$("#arrivalNoticeEditBtn").hide();
	$("#arrivalNoticeStatusBtn").hide()
	$("#arrivalNoticesHeader").text("Vessel : ");
	reloadKendoGrid("arrivalNoticesGrid","/arrivalNotices/load/0",10);
}

function showArrivalNotices(e){
	e.preventDefault();

    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    
    currentVessel = dataItem;
    
    $("#arrivalNoticesHeader").text("Vessel : "+dataItem.vesselName+", "+dataItem.regNo);
    var tabStrip = $("#vesselArrivalNoticesTabstrip").kendoTabStrip().data("kendoTabStrip");
    tabStrip.select(1); 

    reloadKendoGrid("arrivalNoticesGrid","/arrivalNotices/load/"+currentVessel.vesselId,10);
}