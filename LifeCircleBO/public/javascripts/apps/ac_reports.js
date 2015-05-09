var registryPortsDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/registryPorts"}
    },
    filter: { field: "countryCode", operator: "eq", value: "na" }
}),
arrivalStatusesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/arrivalStatuses"}
    }
});

function init(){
	$("#reports-tabstrip").kendoTabStrip();
	
	// Arrival Notices Listing
	initializeArrivalNoticeListingReport();
	
	//Arrival Notices Schedule
	initializeArrivalNoticeScheduleReport();
	
	//Outward Clearances Listing
	initializeOutwardClearancesListingReport();
}

function initializeArrivalNoticeListingReport(){
	$("#arrival-notices-listing-grid").kendoGrid({
		pageable: true,
		toolbar: kendo.template($("#arrival-notice-listing-toolbar-template").html()),
		columns : [
		    {title:"Arrival Date", template:"#: kendo.toString(new Date(arrivalDate),'yyyy-MM-dd HH:mm') #"},
		    {title:"Vessel Name", template:"<a href='/vessel/display/#= vessel.vesselId #' target='_blank'>#= vessel.vesselName #</a>"},
		    {title:"Reg No", field:"vessel.regNo"},
		    {title:"Reg Country", field:"vessel.flagState.name"},
		    {title:"Vessel Owner", template:"<a href='/customer/display/#=owner.customerId#' target='_blank'>#= owner.name1 # #= owner.name2 #</a>"},
		    {title:"Gross Tonnage", field:"vessel.grossTonnage"},
		    {title:"Length", field:"vessel.length"},
		    {title:"Arrival Port", field:"arrivalPort.description"},
		    {title:"Previous Port", field:"previousPort"},
		    {title:"Next Port", field:"nextPort"},
		    {title:"Arrival Status", field:"arrivalStatus.value"}
		]
	});
	
	kendo.init($("#arrival-notice-listing-toolbar"));
	
	datesRangeHandler($("#fromDate0").data("kendoDatePicker"),$("#toDate0").data("kendoDatePicker"));
	
	var loadArrivalListingsHandler = function (result){
		var dataSource = new kendo.data.DataSource({
			data: result.data,
			pageSize: 50
		});
		$("#arrival-notices-listing-grid").data("kendoGrid").setDataSource(dataSource);
	};
	
	$("#arrival-notice-listing-toolbar-form").submit(function(e){
		e.preventDefault();
		var formData = getFormData($("#arrival-notice-listing-toolbar-form"));
		sendAjaxPost("/arrival_notices_outward_clearances/reports/arrival_listing_report",formData,loadArrivalListingsHandler);
	});
}

function initializeArrivalNoticeScheduleReport(){
	$("#arrival-notices-schedule-grid").kendoGrid({
		dataSource: {
			transport: {
            	read: {
                    url: "/arrival_notices_outward_clearances/reports/arrival_notices_schedule_report",
                    dataType: "json"
                }
			},
			pageable: {
				pageSize : 10,
				buttonCount: 2
			}
		},
		pageable: true,
		columns : [
		    {title:"Arrival Date & Time", template:"#: kendo.toString(new Date(arrivalDate),'yyyy-MM-dd HH:mm') #"},
		    {title:"Vessel Name", template:"<a href='/vessel/display/#= vessel.vesselId #' target='_blank'>#= vessel.vesselName #</a>"},
		    {title:"Reg No", field:"vessel.regNo"},
		    {title:"Vessel Type", field:"vessel.vesselType.value"},
		    {title:"Master Name", field:"shipMasterName"},
		    {title:"Previous Port", field:"previousPort"},
		    {title:"Arrival Port", field:"arrivalPort.description"},
		    {title:"Next Port", field:"nextPort"}
		]
	});
}

function initializeOutwardClearancesListingReport(){
	var showCrewList = function (e){
		e.preventDefault();
		var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
		var viewModel = kendo.observable({
			crewListDS : new kendo.data.DataSource({
	            transport: {
	            	read: "/outwardClearances/load_crew_list/"+dataItem.clearanceId
	            }
			})
    	});
		display_read_popup(
				"outward-clearance-crew-template",
				viewModel,
				"Crew List [Clearance Ref No: "+dataItem.clearanceRefNo+"]", 
				900);
	},
	showCertificates = function (e){
		e.preventDefault();
		var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
		var viewModel = kendo.observable({
			certificatesDS : new kendo.data.DataSource({
	            transport: {
	            	read: "/outwardClearances/load_certificates/"+dataItem.clearanceId
	            }
			})
    	});
		display_read_popup(
				"outward-clearance-certificates-template",
				viewModel,
				"Certificate List [Clearance Ref No: "+dataItem.clearanceRefNo+"]", 
				500);
	};
	
	$("#outward-clearance-listing-grid").kendoGrid({
		pageable: true,
		toolbar: kendo.template($("#outward-clearance-listing-toolbar-template").html()),
		columns : [
		    {title:"Clearance Date", field:"clearanceDate"},
		    {title:"Vessel Name", template:"<a href='/vessel/display/#= vessel.vesselId #' target='_blank'>#= vessel.vesselName #</a>"},
		    {title:"Reg No", field:"vessel.regNo"},
		    {title:"Reg Port", field:"vessel.regPort.description"},
		    {title:"Reg Country", field:"vessel.flagState.name"},
		    {title:"Vessel Owner", template:"<a href='/customer/display/#=vesselOwner.customerId#' target='_blank'>#= vesselOwner.name1 # #= vesselOwner.name2 #</a>"},
		    {title:"Vessel Type", field:"vessel.vesselType.value"},
		    {title:"Arrival Date", template:"#: kendo.toString(new Date(arrivalDate),'yyyy-MM-dd HH:mm') #"},
		    {title:"Depart Date", template:"#: kendo.toString(new Date(departDate),'yyyy-MM-dd HH:mm') #"},
		    {title:"Depart Port", field:"departPort.description"},
		    {title:"Visit Duration", field:"visitDuration"},
		    {title:"Next Port", field:"nextPort"},
		    { command: { text: "View Crew", click: showCrewList }, title: "Crew List"},
		    { command: { text: "View Certificates", click: showCertificates }, title: "Certificates List"}
		]
	});
	
	kendo.init($("#outward-clearance-listing-toolbar"));
	
	datesRangeHandler($("#fromDate1").data("kendoDatePicker"),$("#toDate1").data("kendoDatePicker"));
	
	var loadClearanceListingsHandler = function (result){
		var dataSource = new kendo.data.DataSource({
			data: result.data,
			pageSize: 50
		});
		$("#outward-clearance-listing-grid").data("kendoGrid").setDataSource(dataSource);
	};
	
	$("#outward-clearance-listing-toolbar-form").submit(function(e){
		e.preventDefault();
		var formData = getFormData($("#outward-clearance-listing-toolbar-form"));
		sendAjaxPost("/arrival_notices_outward_clearances/reports/clearance_listing_report",formData,loadClearanceListingsHandler);
	});
}