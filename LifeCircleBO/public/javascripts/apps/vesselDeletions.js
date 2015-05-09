var deletionConditionsDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/deletionConditions"}
        }
	}),
	territoriesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/userTerritories"}
        }
	});

function init(){
	$("#vesselVesselDeletionsTabstrip").kendoTabStrip();
	
	$("#vesselsGrid").kendoGrid({
        pageable: true,
        selectable : true,
        height: 500,
        toolbar: kendo.template($("#vesselsTemplate").html()),
        detailTemplate: kendo.template($("#vesselDetailTemplate").html()),
        //detailInit: showVesselDetail,
        columns: [
            { field: "owner.name1", title:"Owner"},
            { field: "regNo", title:"Reg #"},
            { field: "vesselName",title:"Name"},
            { field: "regType.value",title:"Reg. Type"},
            { field: "vesselType.value",title:"Vessel Type"},
            { field: "regPort.description",title:"Reg Port"},
            { field: "regDate",title:"Reg Date"},
            { field: "flagState.name",title:"Flag State"},
            { command: { text: "Deletion", click: showDeletion }, title: " ", width: "150px" }],
        change : function(){
            var row = this.select();
            var data = this.dataItem(row);
            currentVessel = data;
            console.log("Selected: " + currentVessel + " Text, [" + JSON.stringify(currentVessel) + "]");
            
            $("#vesselDeletionsHeader").text("Vessel : "+currentVessel.vesselName+", "+currentVessel.regNo);
            reloadKendoGrid("vesselDeletionsGrid","/vesselDeletions/load/"+currentVessel.vesselId,10);
        	$("#vesselDeletionConfirmBtn").hide();
        	$("#vesselDeletionCertificatePrintBtn").hide();
        }

    });
	
	$("#vesselDeletionsGrid").kendoGrid({
		pageable: true,
        selectable : true,
        toolbar: kendo.template($("#vesselDeletionTemplate").html()),
      //  detailTemplate: kendo.template($("#arrivalNolTemplate").html()),
        columns: [
                  { field: "owner.name1", title:"Vessel Owner", template: "#: owner.name1 #, #: owner.identityNumber #"},
                  { field: "deletionCondition.value", title:"Deletion Condition"},
                  { field: "entryDate", title:"Entry Date"},
                  { field: "deletionDate",title:"Deletion Date"},
                  { field: "deletionComment",title:"Deletion Comments"},
                  { field: "deletionPlace",title:"Deletion Place"},
                  { field: "confirmed",title:"Confirmed",template:"#if(confirmed){# YES #}else{# NO #}#"},
                  { field: "confirmedDate",title:"Confirm Date"},
                  { field: "confirmedBy",title:"Confirmed By"}],
                  
	    change : function(){
	    	var row = this.select();
	    	var data = this.dataItem(row);
	    	console.log("Selected: " + data + " Text, [" + JSON.stringify(data) + "]");
	    	currentVesselDeletion = data;
	    	if (!currentVesselDeletion.confirmed){
	    		$("#vesselDeletionConfirmBtn").show();
	        	$("#vesselDeletionCertificatePrintBtn").hide();
	        	$("#vesselDeletionEditBtn").show();
	    	}else{
	        	$("#vesselDeletionEditBtn").hide();
	    		$("#vesselDeletionConfirmBtn").hide();
	    		$("#vesselDeletionCertificatePrintBtn").show();
	    	}
	    }
	});

	
	$("#searchVesselsBtn").click(function(e){
		var value = $("#vesselSearch").val();
        reloadKendoGrid("vesselsGrid","/vessels/search/namflag/"+value,4);
        e.preventDefault();
    });

    $("#vesselSearch").keydown(function(e){
        if (e.keyCode==13){
        	var value = $("#vesselSearch").val();
            reloadKendoGrid("vesselsGrid","/vessels/search/namflag/"+value,10);
        }
    });
    
    $("#vesselDeletionAddBtn").click(function(e){
    	display_popup(
				"vessel-deletion-form",
				"vessel-deletion-form-template",
				null,
				createVesselDeletionSubmitHandler,
				"Add Vessel Deletion",
				"420px"
		);
        e.preventDefault();
    });
    
    $("#vesselDeletionEditBtn").click(function(e){
    	var viewModel = kendo.observable({
    		vesselId : currentVessel.vesselId,
    		deletion: currentVesselDeletion
    	});
    	display_popup(
				"vessel-deletion-form",
				"vessel-deletion-form-template",
				viewModel,
				editVesselDeletionSubmitHandler,
				"Edit Vessel Deletion",
				"420px"
		);
        e.preventDefault();
    });
    
    $("#vesselDeletionConfirmBtn").click(function(e){
    	showVesselDeletionConfirmWindow();
    	e.preventDefault();
    });
    
    $("#vesselDeletionCertificatePrintBtn").click(function(e){
    	window.open('/vessels/download/vessel_deletion_certificate/'+currentVesselDeletion.deletionId,'_blank');
    	
    });
}

function createVesselDeletionSubmitHandler(e){
	var form = $("#vessel-deletion-form");
	var formData = getFormData(form);
	formData.vessel = currentVessel.vesselId;
	
	sendAjaxPost("/vesselDeletions/create",formData,function(data){
		reloadKendoGrid("vesselDeletionsGrid","/vesselDeletions/load/"+currentVessel.vesselId,10);
    	$("#vesselDeletionConfirmBtn").hide();
    	$("#vesselDeletionEditBtn").hide();
    	$("#vesselDeletionCertificatePrintBtn").hide();
    	
    	form[0].reset();
        $("#current-form-window").data("kendoWindow").close();
        
    	alert("Vessel Deletion Added successfully.");
	});
}


function editVesselDeletionSubmitHandler(e){
	var form = $("#vessel-deletion-form");
	var formData = getFormData(form);
	
	sendAjaxPost("/vesselDeletions/update",formData,function(data){
		reloadKendoGrid("vesselDeletionsGrid","/vesselDeletions/load/"+currentVessel.vesselId,10);
    	$("#vesselDeletionConfirmBtn").hide();
    	$("#vesselDeletionEditBtn").hide();
    	$("#vesselDeletionCertificatePrintBtn").hide();
    	
    	form[0].reset();
        $("#current-form-window").data("kendoWindow").close();
        
    	alert("Vessel Deletion Updated successfully.");
	});
}

function confirmVesselDeletion(){
	$.ajax({
        url : "/vesselDeletions/confirm/"+currentVesselDeletion.deletionId,
        type : "POST",
        contentType : "application/json",
        dataType : "json",
        data : JSON.stringify({}),
        success : function (data){
        	console.log(JSON.stringify(data));
            if (data.status==="Success"){
            	reloadKendoGrid("vesselDeletionsGrid","/vesselDeletions/load/"+currentVessel.vesselId,10);
            	$("#vesselDeletionConfirmBtn").hide();
            	$("#vesselDeletionEditBtn").hide();
            	alert("Vessel deletion confirmed successfully.");
            }else{
                alert("Fail to save :"+data.message);
            }
        },
        error : function (){
            alert("Fail to save : Internal Error");
        }

    });

}

function showDeletion(e){
	
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    
    currentVessel = dataItem;
    
    $("#vesselDeletionsHeader").text("Vessel : "+dataItem.vesselName+", "+dataItem.regNo);
    var tabStrip = $("#vesselVesselDeletionsTabstrip").kendoTabStrip().data("kendoTabStrip");
    tabStrip.select(1); 

    reloadKendoGrid("vesselDeletionsGrid","/vesselDeletions/load/"+currentVessel.vesselId,10);
	
    $("#vesselDeletionConfirmBtn").hide();
    $("#vesselDeletionEditBtn").hide();
	$("#vesselDeletionCertificatePrintBtn").hide();
    e.preventDefault();
}

function showVesselDeletionConfirmWindow(){
	var kendoWindow = $("<div />").kendoWindow({
        title: "Confirm Deletion",
        resizable: false,
        modal: true
    });

	kendoWindow.data("kendoWindow")
	    .content($("#delete-confirmation").html())
	    .center().open();
	
	kendoWindow
	    .find(".delete-confirm,.delete-cancel")
	        .click(function() {
	            if ($(this).hasClass("delete-confirm")) {
	            	confirmVesselDeletion();
	            }
	            
	            kendoWindow.data("kendoWindow").close();
	        })
	        .end();
}



