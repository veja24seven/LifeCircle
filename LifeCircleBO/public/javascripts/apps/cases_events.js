var eventTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/eventTypes"}
		}
	}),
	eventCategoriesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/eventCategories"}
		}
	}),
	factTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/factTypes"}
		}
	}),
	pollutionTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/pollutionTypes"}
		}
	}),
	documentTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/documentTypes"}
    	}
	}),
	namibianPortsDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/registryPorts"}
        },
        filter: { field: "countryCode", operator: "eq", value: "na" }
	}),
	allPortsDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/registryPorts"}
        }
	}),
	vesselTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/vesselTypes"}
        }
	}),
	countriesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/countries"}
        }
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
	damageTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/damageTypes"}
        }
	}),
	masterTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/masterTypes"}
        }
	}),
	identityTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/identityTypes"}
        }
	}),
	seafarerTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/seafarerTypes"}
        }
	}),
	propertyTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/propertyTypes"}
        }
	}),
	investigationTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/investigationTypes"}
        }
	}),
	completionStatusesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/investigationCompletionStatuses"}
        }
	}),
	injuryTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/injuryTypes"}
        }
	}),
	affectedVesselsDS = null;

var currentEventDetail = null, currentEventDocument = null, 
	currentEventFact = null, currentEventPollution = null,
	currentAffectedPerson = null, currentAffectedVessel = null,
	currentAffectedProperty = null, currentEventInvestigation = null,
	currentVesselMaster = null;
function init(){
	$("#cases-tabstrip").kendoTabStrip();
	
	$("#eventsGrid").kendoGrid({
		pageable: true, selectable : true, height: 500,
		toolbar: kendo.template($("#events-grid-toolbar-template").html()),
		detailTemplate: kendo.template($("#events-grid-detail-template").html()),
		detailInit: showEventsDetail,
		columns : [
		    {title:"Event Ref No.", field:"eventRefNo"},
		    {title:"Event Category", field:"eventCategory.value"},
		    {title:"Event Type", field:"eventType.value"},
		    {title:"Description", field:"eventDescription"},
		    {title:"Event Date", field:"eventDate"},
		    {title:"Event Port", field:"eventPort.description"},
		    {title:"Report Date", field:"eventReportDate", template:"#: kendo.toString(new Date(eventReportDate),'yyyy-MM-dd HH:mm') #"},
		    {title:"Event Status", field:"eventStatus.value"}
		],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			currentEventDetail = data;
			
			$("#eventEditBtn").show();
			
			showEventRelatedTabs(true);
		}
	});
	
	$("#vesselsGrid").kendoGrid({
		pageable: true, selectable : true,
		toolbar: kendo.template($("#vessels-grid-toolbar-template").html()),
		detailTemplate: kendo.template($("#vessels-grid-detail-template").html()),
		detailInit: showAffectedVesselsDetail,
		columns : [
		    {title:"Vessel Name", field:"vesselName"},
		    {title:"Vessel Reg No.", field:"vesselRegNo"},
		    {title:"Vessel Type", field:"vesselType.value"},
		    {title:"Reg Port", field:"registryPort.description"},
		    {title:"Control Type", field:"controlType.value"},
		    {title:"Total Crew", field:"totalCrew"},
		    {title:"Voyage Type", field:"voyageType.value"},
		    {title:"Damage Type", field:"damageType.value"}
		],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			currentAffectedVessel = data;
			
			$("#vesselEditBtn").show();
		}
	});
	
	$("#personsGrid").kendoGrid({
		pageable: true, selectable : true,
		toolbar: kendo.template($("#persons-grid-toolbar-template").html()),
		columns : [
		    {title:"Person Name", field:"personName"},
		    {title:"Identity Type", field:"identityType.value"},
		    {title:"Identity No.", field:"identityNumber"},
		    {title:"Seafarer Type", field:"seafarerType.value"},
		    {title:"Nationality", field:"nationality.name"},
		    {title:"Injury Type", field:"injuryType.value"},
		    {title:"Injury Details", field:"injuryDetails"}
		],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			currentAffectedPerson = data;
			
			$("#personEditBtn").show();
		}
	});
	
	$("#propertiesGrid").kendoGrid({
		pageable: true, selectable : true,
		toolbar: kendo.template($("#properties-grid-toolbar-template").html()),
		columns : [
		    {title:"Property Name", field:"propertyName"},
		    {title:"propertyType", field:"propertyType.value"},
		    {title:"Property No.", field:"propertyNo"},
		    {title:"Property Owner", field:"propertyOwner"},
		    {title:"Property Value", field:"propertyValue"},
		    {title:"Damage Type", field:"damageType.value"},
		    {title:"Damage Details", field:"damageDetails"}
		],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			currentAffectedProperty = data;
			
			$("#personEditBtn").show();
		}
	});

	$("#investigationsGrid").kendoGrid({
		pageable: true, selectable : true,
		toolbar: kendo.template($("#investigations-grid-toolbar-template").html()),
		columns : [
		    {title:"Investigation Team", field:"investigationTeam"},
		    {title:"Investigation Type", field:"investigationType.value"},
		    {title:"Investigation Date", field:"investigationDate"},
		    {title:"Status", field:"completionStatus.value"},
		    {title:"Findings", field:"investigationFindings"}
		],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			currentEventInvestigation = data;
			
			$("#investigationEditBtn").show();
		}
	});
	
	attachEventsToolBarActions();
	
	attachVesselsToolBarActions();
	
	attachPersonsToolBarActions();
	
	attachPropertiesToolBarActions();
	
	attachInvestigationsToolBarActions();
}

function attachEventsToolBarActions(){
	$("#searchBtn").click(function(e){
		e.preventDefault();
		searchEvents($("#searchField").val());
    });

    $("#searchField").keydown(function(e){
        if (e.keyCode==13){
        	searchEvents($("#searchField").val());
        }
    });
    
    var createEventSubmitHandler = function (e){
	    	e.preventDefault();
			var form = $("#event-form");
			var formData = getFormData(form);
			
			sendAjaxPost("/dma/cases_events/create_event_detail",formData,function(data){
				searchEvents(formData.eventRefNo);
				
				form[0].reset();
				$("#current-form-window").data("kendoWindow").close();
				alert("Event Detail Added successfully.");
			});
    	},
    	updateEventSubmitHandler = function (e){
    		e.preventDefault();
			var form = $("#event-form");
			var formData = getFormData(form);
			
			sendAjaxPost("/dma/cases_events/update_event_detail",formData,function(data){
				searchEvents(formData.eventRefNo);
				
				form[0].reset();
				$("#current-form-window").data("kendoWindow").close();
				alert("Event Detail Updated successfully.");
			});
    	};
	
	$("#eventAddBtn").click(function(e){
    	e.preventDefault();
    	display_popup(
    			"event-form",
    			"event-form-template",
    			null,
    			createEventSubmitHandler,
    			"Add Event Detail",
    			"500px"
    		);
    });
	
	$("#eventEditBtn").click(function(e){
    	e.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentEventDetail,
    		eventInsidePort : currentEventDetail.eventInsidePort? 'YES':'NO',
    		eventAvoidable : currentEventDetail.eventAvoidable? 'YES':'NO'
    	});
    	display_popup(
    			"event-form",
    			"event-form-template",
    			viewmodel,
    			updateEventSubmitHandler,
    			"Edit Event Detail",
    			"500px"
    		);
    });
}

function attachVesselsToolBarActions(){
	
	var createVesselSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#vessel-form");
		var formData = getFormData(form);
		formData.eventId = currentEventDetail.eventId;
		
		sendAjaxPost("/dma/cases_events/create_affected_vessel",formData,function(data){
			reloadKendoGrid("vesselsGrid","/dma/cases_events/load_affected_vessels/"+currentEventDetail.eventId,10);
			currentAffectedVessel = null;
			
			$("#vesselEditBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Affected Vessel Added successfully.");
		});
	},
	updateVesselSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#vessel-form");
		var formData = getFormData(form);
		formData.eventId = currentEventDetail.eventId;
		
		sendAjaxPost("/dma/cases_events/update_affected_vessel",formData,function(data){
			reloadKendoGrid("vesselsGrid","/dma/cases_events/load_affected_vessels/"+currentEventDetail.eventId,10);
			currentAffectedVessel = null;
			
			$("#vesselEditBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Affected Vessel Updated successfully.");
		});
	};
	
	$("#vesselAddBtn").click(function(e){
    	e.preventDefault();
    	display_popup(
    			"vessel-form",
    			"vessel-form-template",
    			null,
    			createVesselSubmitHandler,
    			"Add Affected Vessel",
    			"1020px"
    		);
    });
	
	$("#vesselEditBtn").click(function(e){
    	e.preventDefault();
    	var viewmodel = kendo.observable({
    		vessel : currentAffectedVessel
    	});
    	display_popup(
    			"vessel-form",
    			"vessel-form-template",
    			viewmodel,
    			updateVesselSubmitHandler,
    			"Edit Affected Vessel",
    			"1020px"
    		);
    });
}

function attachPersonsToolBarActions(){

	var createPersonSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#person-form");
		var formData = getFormData(form);
		formData.eventId = currentEventDetail.eventId;
		
		sendAjaxPost("/dma/cases_events/create_affected_person",formData,function(data){
			reloadKendoGrid("personsGrid","/dma/cases_events/load_affected_persons/"+currentEventDetail.eventId,10);
			currentAffectedPerson = null;
			
			$("#personEditBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Affected Person Added successfully.");
		});
	},
	updatePersonSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#person-form");
		var formData = getFormData(form);
		formData.eventId = currentEventDetail.eventId;
		
		sendAjaxPost("/dma/cases_events/update_affected_person",formData,function(data){
			reloadKendoGrid("personsGrid","/dma/cases_events/load_affected_persons/"+currentEventDetail.eventId,10);
			currentAffectedPerson = null;
			
			$("#personEditBtn").hide();
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Affected Person Updated successfully.");
		});
	};
	
	$("#personAddBtn").click(function(e){
    	e.preventDefault();
    	affectedVesselsDS = $("#vesselsGrid").data("kendoGrid").dataSource;
    	display_popup(
    			"person-form",
    			"person-form-template",
    			null,
    			createPersonSubmitHandler,
    			"Add Affected Person",
    			"500px"
    		);
    });
	
	$("#personEditBtn").click(function(e){
    	e.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentAffectedPerson
    	});
    	affectedVesselsDS = $("#vesselsGrid").data("kendoGrid").dataSource;
    	display_popup(
    			"person-form",
    			"person-form-template",
    			viewmodel,
    			updatePersonSubmitHandler,
    			"Edit Affected Person",
    			"500px"
    		);
    });
}

function attachPropertiesToolBarActions(){
	var createPropertySubmitHandler = function(e){
		e.preventDefault();
		var form = $("#property-form");
		var formData = getFormData(form);
		formData.eventId = currentEventDetail.eventId;
		
		sendAjaxPost("/dma/cases_events/create_affected_property",formData,function(data){
			reloadKendoGrid("propertiesGrid","/dma/cases_events/load_affected_properties/"+currentEventDetail.eventId,10);
			currentAffectedProperty = null;
			
			$("#propertyEditBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Affected Property Added successfully.");
		});
	},
	updatePropertySubmitHandler = function(e){
		e.preventDefault();
		var form = $("#property-form");
		var formData = getFormData(form);
		formData.eventId = currentEventDetail.eventId;
		
		sendAjaxPost("/dma/cases_events/update_affected_property",formData,function(data){
			reloadKendoGrid("propertiesGrid","/dma/cases_events/load_affected_properties/"+currentEventDetail.eventId,10);
			currentAffectedProperty = null;
			
			$("#propertyEditBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Affected Property Updated successfully.");
		});
	};
	
	$("#propertyAddBtn").click(function(e){
    	e.preventDefault();
    	affectedVesselsDS = $("#vesselsGrid").data("kendoGrid").dataSource;
    	display_popup(
    			"property-form",
    			"property-form-template",
    			null,
    			createPropertySubmitHandler,
    			"Add Affected Property",
    			"500px"
    		);
    });
	
	$("#propertyEditBtn").click(function(e){
    	e.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentAffectedProperty
    	});
    	affectedVesselsDS = $("#vesselsGrid").data("kendoGrid").dataSource;
    	display_popup(
    			"property-form",
    			"property-form-template",
    			viewmodel,
    			updatePropertySubmitHandler,
    			"Edit Affected Property",
    			"500px"
    		);
    });
}

function attachInvestigationsToolBarActions(){
	var createPropertySubmitHandler = function(e){
		e.preventDefault();
		var form = $("#investigation-form");
		var formData = getFormData(form);
		formData.eventId = currentEventDetail.eventId;
		
		sendAjaxPost("/dma/cases_events/create_event_investigation",formData,function(data){
			reloadKendoGrid("investigationsGrid","/dma/cases_events/load_event_investigations/"+currentEventDetail.eventId,10);
			currentEventInvestigation = null;
			
			$("#investigationEditBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Event Investigation Added successfully.");
		});
	},
	updatePropertySubmitHandler = function(e){
		e.preventDefault();
		var form = $("#investigation-form");
		var formData = getFormData(form);
		formData.eventId = currentEventDetail.eventId;
		
		sendAjaxPost("/dma/cases_events/update_event_investigation",formData,function(data){
			reloadKendoGrid("investigationsGrid","/dma/cases_events/load_event_investigations/"+currentEventDetail.eventId,10);
			currentEventInvestigation = null;
			
			$("#investigationEditBtn").hide();
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Event Investigation Updated successfully.");
		});
	};
	
	$("#investigationAddBtn").click(function(e){
    	e.preventDefault();
    	display_popup(
    			"investigation-form",
    			"investigation-form-template",
    			null,
    			createPropertySubmitHandler,
    			"Add Event Investigation",
    			"500px"
    		);
    });
	
	$("#investigationEditBtn").click(function(e){
    	e.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentAffectedProperty
    	});
    	display_popup(
    			"investigation-form",
    			"investigation-form-template",
    			viewmodel,
    			updatePropertySubmitHandler,
    			"Edit Event Investigation",
    			"500px"
    		);
    });
}

function searchEvents(value){
	reloadKendoGrid("eventsGrid","/dma/cases_events/search_events/"+value,10);
	currentEventDetail = null;
	
	$("#eventEditBtn").hide();
	//$("#eventStatusChangeBtn").hide();
	showEventRelatedTabs(false);
}

function showEventRelatedTabs(show){
	
	if(show){
		$("#affectedVesselsTab").show();
		$("#affectedPersonsTab").show();
		$("#affectedPropertiesTab").show();
		$("#eventInvestigationsTab").show();
		reloadKendoGrid("vesselsGrid","/dma/cases_events/load_affected_vessels/"+currentEventDetail.eventId,10);
		reloadKendoGrid("personsGrid","/dma/cases_events/load_affected_persons/"+currentEventDetail.eventId,10);
		reloadKendoGrid("propertiesGrid","/dma/cases_events/load_affected_properties/"+currentEventDetail.eventId,10);
		reloadKendoGrid("investigationsGrid","/dma/cases_events/load_event_investigations/"+currentEventDetail.eventId,10);
	}else{
		$("#affectedVesselsTab").hide();
		$("#affectedPersonsTab").hide();
		$("#affectedPropertiesTab").hide();
		$("#eventInvestigationsTab").hide();
	}
	
}

function showAffectedVesselsDetail(e){
	currentAffectedVessel = e.data;
	
	var detailRow = e.detailRow;
	
	detailRow.find(".vessels-grid-detail-tabstrip").kendoTabStrip();
	
	detailRow.find(".mastersGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/cases_events/load_vessel_masters/"+e.data.vesselId
            },
            paging: true,
            pageSize: 5
        },
        pageable: true,selectable : true,
		toolbar: kendo.template($("#masters-grid-toolbar-template").html()),
		columns: [
		          { field: "masterName", title:"Master Name"},
		          { field: "masterType.value", title: "Master Type"},
		          { field: "identityNumber", title: "Identity No"},
		          { field: "masterNationality.name", title: "Nationality"},
		          { field: "certificateNo", title: "Cert No"},
		          { field: "certificateIssueDate", title: "Cert Issue Date"},
		          { field: "masterAddress", title: "Address"},
		          { field: "masterContacts", title: "Contacts"}],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			currentVesselMaster = data;
			
			detailRow.find(".masterEditBtn").show();
		}
	});
	
	var createVesselMasterSubmitHandler = function(evt){
		evt.preventDefault();
		var form = $("#vessel-master-form");
		var formData = getFormData(form);
		formData.vesselId = e.data.vesselId;
		
		sendAjaxPost("/dma/cases_events/create_vessel_master",formData,function(data){
			var grid = detailRow.find(".mastersGrid").data("kendoGrid");
			grid.dataSource.read();
			detailRow.find(".masterEditBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Vessel Master Added successfully.");
		});
	},
	updateVesselMasterSubmitHandler = function(evt){
		evt.preventDefault();
		var form = $("#vessel-master-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/cases_events/update_vessel_master",formData,function(data){
			var grid = detailRow.find(".mastersGrid").data("kendoGrid");
			grid.dataSource.read();
			detailRow.find(".masterEditBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Vessel Master Updated successfully.");
		});
	};
	
	detailRow.find(".masterAddBtn").click(function(evt){
    	evt.preventDefault();
    	display_popup(
    			"vessel-master-form",
    			"vessel-master-form-template",
    			null,
    			createVesselMasterSubmitHandler,
    			"Add Vessel Master",
    			"500px"
    		);
    });
	
	detailRow.find(".masterEditBtn").click(function(evt){
    	evt.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentVesselMaster
    	});
    	display_popup(
    			"vessel-master-form",
    			"vessel-master-form-template",
    			viewmodel,
    			updateVesselMasterSubmitHandler,
    			"Edit Vessel Master",
    			"500px"
    		);
    });
}

function showEventsDetail(e){
	currentEventDetail = e.data;
	
	var detailRow = e.detailRow;
	
	detailRow.find(".events-grid-detail-tabstrip").kendoTabStrip();
	
	detailRow.find(".factsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/cases_events/load_event_facts/"+e.data.eventId
            },
            paging: true,
            pageSize: 5
        },
        pageable: true,selectable : true,
		toolbar: kendo.template($("#facts-grid-toolbar-template").html()),
		columns: [
		          { field: "factType.value", title:"Fact Type"},
		          { field: "factDetails", title: "Fact Details"}],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			currentEventFact = data;
			
			detailRow.find(".factEditBtn").show();
		}
	});
	
	detailRow.find(".pollutionsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/cases_events/load_event_pollutions/"+e.data.eventId
            },
            paging: true,
            pageSize: 5
        },
        pageable: true,selectable : true,
		toolbar: kendo.template($("#pollutions-grid-toolbar-template").html()),
		columns: [
		          { field: "pollutionType.value", title:"Pollution Type"},
		          { field: "pollutionDetails", title:"Pollution Details"},
		          { field: "damageDetails", title: "Damage Details"},
		          { field: "amountSpilled", title:"Amount Spilled" }],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			currentEventPollution = data;
			
			detailRow.find(".pollutionEditBtn").show();
		}
	});
	
	detailRow.find(".documentsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/cases_events/load_event_documents/"+e.data.eventId
            },
            paging: true,
            pageSize: 5
        },
        pageable: true,selectable : true,
		toolbar: kendo.template($("#documents-grid-toolbar-template").html()),
		columns: [
		          { field: "documentType.value", title:"Document Type"},
		          { field: "documentUrl", title:"URL", template:'<a href="/dma/cases_events/download/'+e.data.eventId+'/#=documentId#" target="_blank">#= documentUrl #</a>'},
		          { field: "documentRefNo", title:"Doc Ref No." },
		          { field: "documentDate", title: "Doc Date"}],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			currentEventDocument = data;
			
			detailRow.find(".documentDeleteBtn").show();
		}
	});
	
	if(currentEventDetail.eventStatus.value==='PENDING'){
		attachEventFactsToolBarActions(e);
		attachEventPollutionsToolBarActions(e);
		attachEventDocumentsToolBarActions(e);
	}
}

function attachEventFactsToolBarActions(e){
	var detailRow = e.detailRow;
	
	var createEventFactSubmitHandler = function(evt){
		evt.preventDefault();
		var form = $("#event-fact-form");
		var formData = getFormData(form);
		formData.eventId = e.data.eventId;
		
		sendAjaxPost("/dma/cases_events/create_event_fact",formData,function(data){
			var grid = detailRow.find(".factsGrid").data("kendoGrid");
			grid.dataSource.read();
			detailRow.find(".factEditBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Event Fact Added successfully.");
		});
	},
	updateEventFactSubmitHandler = function(evt){
		evt.preventDefault();
		var form = $("#event-fact-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/cases_events/update_event_fact",formData,function(data){
			var grid = detailRow.find(".factsGrid").data("kendoGrid");
			grid.dataSource.read();
			detailRow.find(".factEditBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Event Fact Updated successfully.");
		});
	};
	
	detailRow.find(".factAddBtn").click(function(evt){
    	evt.preventDefault();
    	display_popup(
    			"event-fact-form",
    			"event-fact-form-template",
    			null,
    			createEventFactSubmitHandler,
    			"Add Event Fact",
    			"500px"
    		);
    });
	
	detailRow.find(".factEditBtn").click(function(evt){
    	evt.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentEventFact
    	});
    	display_popup(
    			"event-fact-form",
    			"event-fact-form-template",
    			viewmodel,
    			updateEventFactSubmitHandler,
    			"Edit Event Fact",
    			"500px"
    		);
    });
}

function attachEventPollutionsToolBarActions(e){
	var detailRow = e.detailRow;
	
	var createEventPollutionSubmitHandler = function(evt){
		evt.preventDefault();
		var form = $("#event-pollution-form");
		var formData = getFormData(form);
		formData.eventId = e.data.eventId;
		
		sendAjaxPost("/dma/cases_events/create_event_pollution",formData,function(data){
			var grid = detailRow.find(".pollutionsGrid").data("kendoGrid");
			grid.dataSource.read();
			detailRow.find(".pollutionEditBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Event Pollution Added successfully.");
		});
	},
	updateEventPollutionSubmitHandler = function(evt){
		evt.preventDefault();
		var form = $("#event-pollution-form");
		var formData = getFormData(form);
		formData.eventId = e.data.eventId;
		
		sendAjaxPost("/dma/cases_events/update_event_pollution",formData,function(data){
			var grid = detailRow.find(".pollutionsGrid").data("kendoGrid");
			grid.dataSource.read();
			detailRow.find(".pollutionEditBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Event Pollution Updated successfully.");
		});
	};
	
	detailRow.find(".pollutionAddBtn").click(function(evt){
    	evt.preventDefault();
    	display_popup(
    			"event-pollution-form",
    			"event-pollution-form-template",
    			null,
    			createEventPollutionSubmitHandler,
    			"Add Event Pollution",
    			"500px"
    		);
    });
	
	detailRow.find(".pollutionEditBtn").click(function(evt){
    	evt.preventDefault();
    	var viewmodel = kendo.observable({
    		dataItem : currentEventPollution
    	});
    	display_popup(
    			"event-pollution-form",
    			"event-pollution-form-template",
    			viewmodel,
    			updateEventPollutionSubmitHandler,
    			"Edit Event Pollution",
    			"500px"
    		);
    });
}

function attachEventDocumentsToolBarActions(e){
	var detailRow = e.detailRow;
	
	var submitDocumentHandler = function(evt){
		evt.preventDefault();
		
		var kendoUploadButton = $(".k-upload-selected");
    	if (kendoUploadButton)
    		kendoUploadButton.click();
	};
	
	detailRow.find(".documentDeleteBtn").click(function(evt){
		evt.preventDefault();
		sendAjaxPost("/dma/cases_events/event_doc_delete",{eventId:e.data.eventId,documentId:currentEventDocument.documentId},function(data){
			var grid = detailRow.find(".documentsGrid").data("kendoGrid");
			grid.dataSource.read();
			detailRow.find(".documentDeleteBtn").hide();
			
        	alert("Event Document deleted successfully.");
    	});
	});
	
	detailRow.find(".documentAddBtn").click(function(evt){
		evt.preventDefault();
		display_popup(
				"event-document-form",
				"event-document-form-template",
				null,
				submitDocumentHandler,
				"Add Event Document",
				"500px"
		);
		
		initDocumentUploadWidget("/dma/cases_events/event_doc_upload/"+e.data.eventId,"event-document-form",function(event){
			var grid = detailRow.find(".documentsGrid").data("kendoGrid");
			grid.dataSource.read();
			var form = $("#event-document-form");
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        $("#current-form-window").data("kendoWindow").destroy();
	        detailRow.find(".documentDeleteBtn").hide();
	    	alert("Event Document uploaded successfully.");
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