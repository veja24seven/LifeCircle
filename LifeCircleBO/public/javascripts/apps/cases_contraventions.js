var vesselTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/vesselTypes"}
        }
	}),
	allPortsDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/registryPorts"}
        }
	}),
	countriesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/countries"}
        }
	}),
	namibianPortsDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/registryPorts"}
        },
        filter: { field: "countryCode", operator: "eq", value: "na" }
	}),
	controlTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/controlTypes"}
        }
	}),
	propellMethodsDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/propellMethods"}
        }
	}),
	voyageTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/voyageTypes"}
        }
	}),
	masterTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/masterTypes"}
        }
	}),
	documentTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/documentTypes"}
    	}
	}),
	offenceCategoriesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/offenceCategories"}
        }
	}),
	offenceTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/offenceTypes"}
        }
	}),
	offenceStatusesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/offenceStatuses"}
        },
        filter: { field: "value", operator: "neq", value: "PENDING" }
	}),
	fineTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/fineTypes"}
        }
	}),
	fineStatusesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/fineStatuses"}
        }
	});
var currentOffenderVessel = null, currentVesselVoyage = null, 
	currentOffenceDetail = null, currentOffenceDocument = null, 
	currentVesselDetention = null, currentOffenceFine = null;
function init(){
	$("#cases-tabstrip").kendoTabStrip();
	
	$("#vesselsGrid").kendoGrid({
		pageable: true, selectable : true,
		toolbar: kendo.template($("#vessels-grid-toolbar-template").html()),
		detailTemplate: kendo.template($("#vessels-grid-detail-template").html()),
		detailInit: showOffenderVesselsDetail,
		columns : [
		    {title:"Vessel Name", field:"vesselName"},
		    {title:"Vessel Reg No.", field:"vesselRegNo"},
		    {title:"Vessel Type", field:"vesselType.value"},
		    {title:"Registry Port", field:"registryPort.description"},
		    {title:"Registry Country", field:"registryCountry.name"},
		    {title:"Control Type", field:"controlType.value"},
		    {title:"Owner Name", field:"ownerName"},
		    {title:"Owner Nationality", field:"ownerNationality.name"}
		],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			currentOffenderVessel = data;
			
			$("#vesselEditBtn").show();
		}
	});
	
	$("#offencesGrid").kendoGrid({
		pageable: true, selectable : true,
		toolbar: kendo.template($("#offences-grid-toolbar-template").html()),
		detailTemplate: kendo.template($("#offences-grid-detail-template").html()),
		detailInit: showOffencesDetail,
		columns : [
		    {title:"Offence Ref No", field:"offenceRefNo"},
		    {title:"Offence Category", field:"offenceCategory.value"},
		    {title:"Offence Type", field:"offenceType.value"},
		    {title:"Offence Details", field:"offenceDetails"},
		    {title:"Relevant Law", field:"relevantLaw"},
		    {title:"Offence Port", field:"offencePort.description"},
		    {title:"Offence Status", field:"offenceStatus.value"},
		    {title:"Close Date", field:"closeDate"}
		],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			currentOffenceDetail = data;
			
			$("#vesselDetentionsReleasesTab").show();
			reloadKendoGrid("detentionsGrid","/dma/cases_contraventions/load_vessel_detentions/"+currentOffenderVessel.vesselId,10);
			$("#detentionReleaseBtn").hide();
			
			if(currentOffenceDetail.closeDate==null){
				$("#offenceEditBtn").show();
				$("#offenceCloseBtn").show();
			}
		}
	});
	
	attachVesselsToolBarActions();
	attachOffencesToolBarActions();
	attachVesselDetentionsToolBarActions();
}

function searchVessels(value){
	reloadKendoGrid("vesselsGrid","/dma/cases_contraventions/search_offender_vessels/"+value,10);
	currentOffenderVessel = null;
	
	$("#vesselEditBtn").hide();
	
	showVesselRelatedTabs(false);
}

function showVesselRelatedTabs(show){
	
	if(show){
		$("#offenceDetailsTab").show();
		
		reloadKendoGrid("offencesGrid","/dma/cases_contraventions/load_offences/"+currentOffenderVessel.vesselId,10);
		$("#offenceEditBtn").hide();
		$("#offenceCloseBtn").hide();
	}else{
		$("#offenceDetailsTab").hide();
	}
	$("#vesselDetentionsReleasesTab").hide();
	
}

function attachVesselsToolBarActions(){
	$("#searchBtn").click(function(e){
		e.preventDefault();
		searchVessels($("#searchField").val());
    });

    $("#searchField").keydown(function(e){
        if (e.keyCode==13){
        	searchVessels($("#searchField").val());
        }
    });
    
    var createVesselSubmitHandler = function(e){
    	e.preventDefault();
		var form = $("#vessel-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/cases_contraventions/create_offender_vessel",formData,function(data){
			searchVessels(formData.vesselRegNo);
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Offender Vessel Added successfully.");
		});
    },
    updateVesselSubmitHandler = function(e){
    	e.preventDefault();
		var form = $("#vessel-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/cases_contraventions/update_offender_vessel",formData,function(data){
			searchVessels(formData.vesselRegNo);
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Offender Vessel Updated successfully.");
		});
    };
    
    $("#vesselAddBtn").click(function(e){
    	e.preventDefault();
    	display_popup(
    			"vessel-form",
    			"vessel-form-template",
    			null,
    			createVesselSubmitHandler,
    			"Add Offender Vessel",
    			"500px"
    		);
    });
    
    $("#vesselEditBtn").click(function(e){
    	e.preventDefault();
    	var viewmodel = kendo.observable({
    		vessel : currentOffenderVessel
    	});
    	display_popup(
    			"vessel-form",
    			"vessel-form-template",
    			viewmodel,
    			updateVesselSubmitHandler,
    			"Edit Offender Vessel",
    			"500px"
    		);
    });
}

function attachOffencesToolBarActions(){
	var createOffenceSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#offence-form");
		var formData = getFormData(form);
		formData.voyageId = currentVesselVoyage.voyageId
		
		sendAjaxPost("/dma/cases_contraventions/create_offence_detail",formData,function(data){
			reloadKendoGrid("offencesGrid","/dma/cases_contraventions/load_offences/"+currentOffenderVessel.vesselId,10);
			$("#offenceEditBtn").hide();
			$("#offenceCloseBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Offence Detail Added successfully.");
		});
	},
	updateOffenceSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#offence-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/cases_contraventions/update_offence_detail",formData,function(data){
			reloadKendoGrid("offencesGrid","/dma/cases_contraventions/load_offences/"+currentOffenderVessel.vesselId,10);
			$("#offenceEditBtn").hide();
			$("#offenceCloseBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Offence Detail Updated successfully.");
		});
	},
	closeOffenceSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#offence-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/cases_contraventions/close_offence_detail",formData,function(data){
			reloadKendoGrid("offencesGrid","/dma/cases_contraventions/load_offences/"+currentOffenderVessel.vesselId,10);
			$("#offenceEditBtn").hide();
			$("#offenceCloseBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Offence Closed successfully.");
		});
	};
	
	$("#offenceAddBtn").click(function(e){
    	e.preventDefault();
    	display_popup(
    			"offence-form",
    			"offence-form-template",
    			null,
    			createOffenceSubmitHandler,
    			"Add Offence Detail",
    			"500px"
    		);
    });
	
	$("#offenceEditBtn").click(function(e){
    	e.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentOffenceDetail,
    		offenceInsidePort : currentOffenceDetail.offenceInsidePort? 'YES':'NO'
    	});
    	display_popup(
    			"offence-form",
    			"offence-form-template",
    			viewmodel,
    			updateOffenceSubmitHandler,
    			"Edit Offence Detail",
    			"500px"
    		);
    });
	
	$("#offenceCloseBtn").click(function(e){
    	e.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentOffenceDetail
    	});
    	display_popup(
    			"offence-close-form",
    			"offence-close-form-template",
    			viewmodel,
    			closeOffenceSubmitHandler,
    			"Close Offence",
    			"500px"
    		);
    });
}

function attachVesselDetentionsToolBarActions(){
	var createVesselDetentionSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#vessel-detention-form");
		var formData = getFormData(form);
		formData.offenceId = currentOffenceDetail.offenceId
	 	
		sendAjaxPost("/dma/cases_contraventions/create_vessel_detention",formData,function(data){
			reloadKendoGrid("detentionsGrid","/dma/cases_contraventions/load_vessel_detentions/"+currentOffenderVessel.vesselId,10);
			$("#detentionEditBtn").hide();
			$("#detentionReleaseBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Vessel Detention Added successfully.");
		});
	},
	updateVesselDetentionSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#vessel-detention-form");
		var formData = getFormData(form);
	 	
		sendAjaxPost("/dma/cases_contraventions/update_vessel_detention",formData,function(data){
			reloadKendoGrid("detentionsGrid","/dma/cases_contraventions/load_vessel_detentions/"+currentOffenderVessel.vesselId,10);
			$("#detentionEditBtn").hide();
			$("#detentionReleaseBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Vessel Detention Update successfully.");
		});
	},
	releaseVesselDetentionSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#detention-release-form");
		var formData = getFormData(form);
	 	
		sendAjaxPost("/dma/cases_contraventions/release_vessel_detention",formData,function(data){
			reloadKendoGrid("detentionsGrid","/dma/cases_contraventions/load_vessel_detentions/"+currentOffenderVessel.vesselId,10);
			$("#detentionEditBtn").hide();
			$("#detentionReleaseBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Vessel Detention released successfully.");
		});
	};
	
	$("#detentionAddBtn").click(function(e){
    	e.preventDefault();
    	display_popup(
    			"vessel-detention-form",
    			"vessel-detention-form-template",
    			null,
    			createVesselDetentionSubmitHandler,
    			"Add Vessel Detention",
    			"500px"
    		);
    });
	
	$("#detentionEditBtn").click(function(e){
    	e.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentVesselDetention
    	})
    	display_popup(
    			"vessel-detention-form",
    			"vessel-detention-form-template",
    			viewmodel,
    			updateVesselDetentionSubmitHandler,
    			"Edit Vessel Detention",
    			"500px"
    		);
    });
	
	$("#detentionReleaseBtn").click(function(e){
    	e.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentVesselDetention
    	})
    	display_popup(
    			"detention-release-form",
    			"detention-release-form-template",
    			viewmodel,
    			releaseVesselDetentionSubmitHandler,
    			"Release Detention",
    			"500px"
    		);
    });
}

function showOffenderVesselsDetail(e){
	currentOffenderVessel = e.data;
	
	var detailRow = e.detailRow;
	
	detailRow.find(".vessels-grid-detail-tabstrip").kendoTabStrip();

	detailRow.find(".voyagesGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/cases_contraventions/load_vessel_voyages/"+e.data.vesselId
            },
            paging: true,
            pageSize: 5
        },
        pageable: true,selectable : true,
		toolbar: kendo.template($("#voyages-grid-toolbar-template").html()),
		columns: [
		          { field: "masterName", title:"Master Name"},
		          { field: "masterType.value", title: "Master Type"},
		          { field: "masterNationality.name", title: "Nationality"},
		          { field: "masterAddress", title: "Address"},
		          { field: "masterContacts", title: "Contacts"},
		          { field: "voyageType.value", title: "Voyage Type"},
		          { field: "cargoDetails", title: "Cargo Detail"},
		          { field: "departurePort.description", title: "Departure Port"},
		          { field: "departureDate", title: "Departure Date"},
		          { field: "destinationPort.description", title: "destinationPort"}],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			currentVesselVoyage = data;
			
			detailRow.find(".voyageEditBtn").show();
			
			showVesselRelatedTabs(true);
		}
	});
	
	var createVesselVoyageSubmitHandler = function(evt){
		evt.preventDefault();
		var form = $("#voyage-form");
		var formData = getFormData(form);
		formData.vesselId = e.data.vesselId;
		
		sendAjaxPost("/dma/cases_contraventions/create_vessel_voyage",formData,function(data){
			var grid = detailRow.find(".voyagesGrid").data("kendoGrid");
			grid.dataSource.read();
			detailRow.find(".voyageEditBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Vessel Voyage Added successfully.");
		});
	},
	updateVesselVoyageSubmitHandler = function(evt){
		evt.preventDefault();
		var form = $("#voyage-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/cases_contraventions/update_vessel_voyage",formData,function(data){
			var grid = detailRow.find(".voyagesGrid").data("kendoGrid");
			grid.dataSource.read();
			detailRow.find(".voyageEditBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Vessel Voyage Updated successfully.");
		});
	};
	
	detailRow.find(".voyageAddBtn").click(function(evt){
    	evt.preventDefault();
    	display_popup(
    			"voyage-form",
    			"voyage-form-template",
    			null,
    			createVesselVoyageSubmitHandler,
    			"Add Vessel Voyage",
    			"500px"
    		);
    });
	
	detailRow.find(".voyageEditBtn").click(function(evt){
    	evt.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentVesselVoyage
    	});
    	display_popup(
    			"voyage-form",
    			"voyage-form-template",
    			viewmodel,
    			updateVesselVoyageSubmitHandler,
    			"Edit Vessel Voyage",
    			"500px"
    		);
    });
}

function showOffencesDetail(e){
	currentOffenceDetail = e.data;
	
	var detailRow = e.detailRow;
	
	detailRow.find(".offences-grid-detail-tabstrip").kendoTabStrip();	
	
	detailRow.find(".finesGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/cases_contraventions/load_offence_fines/"+e.data.offenceId
            },
            paging: true,
            pageSize: 5
        },
        pageable: true,selectable : true,
		toolbar: kendo.template($("#fines-grid-toolbar-template").html()),
		columns: [
		          { field: "fineType.value", title:"Fine Type"},
		          { field: "fineDetails", title:"Fine Details"},
		          { field: "fineAmount", title: "Fine Amount"},
		          { field: "fineDueDate", title:"Fine Due Date" },
		          { field: "fineStatus.value", title:"Fine Status" },
		          { field: "paymentDate", title:"Payment Date" },
		          { field: "paymentRefNo", title:"Payment Ref No" }],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			currentOffenceFine = data;
			
			detailRow.find(".fineEditBtn").show();
		}
	});
	
	detailRow.find(".documentsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/cases_contraventions/load_offence_documents/"+e.data.offenceId
            },
            paging: true,
            pageSize: 5
        },
        pageable: true,selectable : true,
		toolbar: kendo.template($("#documents-grid-toolbar-template").html()),
		columns: [
		          { field: "documentType.value", title:"Document Type"},
		          { field: "documentUrl", title:"URL", template:'<a href="/dma/cases_contraventions/download/'+e.data.offenceId+'/#=documentId#" target="_blank">#= documentUrl #</a>'},
		          { field: "documentRefNo", title:"Doc Ref No." },
		          { field: "documentDate", title: "Doc Date"}],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			currentEventDocument = data;
			
			detailRow.find(".documentDeleteBtn").show();
		}
	});
	
	if(currentOffenceDetail.closeDate==null){
		attachOffenceFinesToolBarActions(e);
		attachOffenceDocumentsToolBarActions(e);
	}
}

function attachOffenceFinesToolBarActions(e){
	var detailRow = e.detailRow;
	
	var createOffenceFineSubmitHandler = function(evt){
		evt.preventDefault();
		var form = $("#offence-fine-form");
		var formData = getFormData(form);
		formData.eventId = e.data.offenceId;
		
		sendAjaxPost("/dma/cases_contraventions/create_offence_fine",formData,function(data){
			var grid = detailRow.find(".finesGrid").data("kendoGrid");
			grid.dataSource.read();
			detailRow.find(".fineEditBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Offence Fine Added successfully.");
		});
	},
	updateOffenceFineSubmitHandler = function(evt){
		evt.preventDefault();
		var form = $("#offence-fine-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/cases_contraventions/update_offence_fine",formData,function(data){
			var grid = detailRow.find(".finesGrid").data("kendoGrid");
			grid.dataSource.read();
			detailRow.find(".fineEditBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Offence Fine Updated successfully.");
		});
	};
	
	detailRow.find(".fineAddBtn").click(function(evt){
    	evt.preventDefault();
    	display_popup(
    			"offence-fine-form",
    			"offence-fine-form-template",
    			null,
    			createOffenceFineSubmitHandler,
    			"Add Offence Fine",
    			"500px"
    		);
    });
	
	detailRow.find(".fineEditBtn").click(function(evt){
    	evt.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentOffenceFine
    	});
    	display_popup(
    			"offence-fine-form",
    			"offence-fine-form-template",
    			viewmodel,
    			updateOffenceFineSubmitHandler,
    			"Edit Offence Fine",
    			"500px"
    		);
    });
}

function attachOffenceDocumentsToolBarActions(e){
var detailRow = e.detailRow;
	
	var submitDocumentHandler = function(evt){
		evt.preventDefault();
		
		var kendoUploadButton = $(".k-upload-selected");
    	if (kendoUploadButton)
    		kendoUploadButton.click();
	};
	
	detailRow.find(".documentDeleteBtn").click(function(evt){
		evt.preventDefault();
		sendAjaxPost("/dma/cases_contraventions/offence_doc_delete",{eventId:e.data.offenceId,documentId:currentOffenceDocument.documentId},function(data){
			var grid = detailRow.find(".documentsGrid").data("kendoGrid");
			grid.dataSource.read();
			detailRow.find(".documentDeleteBtn").hide();
			
        	alert("Offence Document deleted successfully.");
    	});
	});
	
	detailRow.find(".documentAddBtn").click(function(evt){
		evt.preventDefault();
		display_popup(
				"offence-document-form",
				"offence-document-form-template",
				null,
				submitDocumentHandler,
				"Add Offence Document",
				"500px"
		);
		
		initDocumentUploadWidget("/dma/cases_contraventions/offence_doc_upload/"+e.data.offenceId,"offence-document-form",function(event){
			var grid = detailRow.find(".documentsGrid").data("kendoGrid");
			grid.dataSource.read();
			var form = $("#offence-document-form");
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        $("#current-form-window").data("kendoWindow").destroy();
	        detailRow.find(".documentDeleteBtn").hide();
	    	alert("Offence Document uploaded successfully.");
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
