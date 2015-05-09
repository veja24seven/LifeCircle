function init(){
	$("#reports-tabstrip").kendoTabStrip();
	
	// Arrival Notices Schedule
	initializePortStateInspectionsReport();
	
	//Flag State Surveys/Inspections Per Port
	initializeFlagStateSurveyAndInspectionsPerPortReport();
	
	//Vessels IMO Report 
	initializeVesselsIMOReport();
	
	//Vessels Listing Reports
	initializeVesselsListingReport();
	
	//Vessel Ownership Report
	initializeVesselOwnershipReport();
	
	//Vessel Registrations & Deletions
	initializeVesselRegistryTurnover();
}

function initializeFlagStateSurveyAndInspectionsPerPortReport(){
	$("#flag-state-surveys-inspections-counts-grid").kendoGrid({
		toolbar: kendo.template($("#surveys-inspections-toolbar-template").html()),
		dataSource:{
			aggregate: [ { field: "luderitzPortCount", aggregate: "sum" },
                         { field: "walvisBayPortCount", aggregate: "sum" }]
		},
		selectable: "cell",
		columns: [
		    {field:"surveyType.description",title:"Survey Type", footerTemplate:"TOTALS"},
		    {field:"luderitzPortCount",title:"Luderitz Port",footerTemplate:"#=sum#"}, 
		    {field:"walvisBayPortCount",title:"Walvis Bay Port", footerTemplate:"#=sum#"},
		    {title:"TOTALS",template:"#= luderitzPortCount+walvisBayPortCount #"}
		    ],
		change : function(){
			var cell = this.select();
			var data = this.dataItem(cell.closest("tr"));
			$("#flag-state-surveys-container").show();
			
			var colIdx = cell.index();
			if (colIdx==1){
				var dataSource = new kendo.data.DataSource({
					data: data.luderitzPortVessels
				});
				$("#flag-state-surveys-grid").data("kendoGrid").setDataSource(dataSource);
			}else if (colIdx==2){
				var dataSource = new kendo.data.DataSource({
					data: data.walvisBayPortVessels
				});
				$("#flag-state-surveys-grid").data("kendoGrid").setDataSource(dataSource);
			}
		}
	});
	
	kendo.init($("#survey-inspections-toolbar"));
	
	$("#flag-state-surveys-grid").kendoGrid({
		pageable: true,
		columns: [  
		    {field:"vesselName",title:"Vessel Name", template:"<a href='/vessel/display/#= vesselId #' target='_blank'>#= vesselName #</a>"},
		    {field:"regNo",title:"Reg No."},
		    {field:"flagState.name",title:"Reg Country"},
		    {field:"vesselType.value",title:"Vessel Type"},
		    {field:"length",title:"Length"},
		    {field:"grossTonnage",title:"Gross Tonnage"},
		    {field:"owner.name1",title:"Vessel Owner"},
		    {field:"lastSurveyDate",title:"Last Survey Date"},
		    {title:"Last Survey Type",template:"#= lastSurveyType!=null? lastSurveyType.description:'' #"},
		    {field:"lastSurveyPort",title:"Last Survey Port"}]
	});
	
	var loadSurveyCountsHandler = function(result){
		var dataSource = new kendo.data.DataSource({
			data: result.data,
			aggregate: [ { field: "luderitzPortCount", aggregate: "sum" },
                         { field: "walvisBayPortCount", aggregate: "sum" }]
		});
		$("#flag-state-surveys-inspections-counts-grid").data("kendoGrid").setDataSource(dataSource);
	};
	
	$("#loadSurveyStatsReportBtn").click(function(e){
		e.preventDefault();
		var fromDate = $("#fromDate").val();
		var toDate = $("#toDate").val();
		sendAjaxPost("/vessels/reports/flag_state_surveys_report",{startDate:fromDate,endDate:toDate},loadSurveyCountsHandler);
	});
}

function initializePortStateInspectionsReport(){
	$("#port-state-inspections-counts-grid").kendoGrid({
		toolbar: kendo.template($("#port-state-inspections-toolbar-template").html()),
		dataSource:{
			aggregate: [ { field: "luderitzPortCount", aggregate: "sum" },
                         { field: "walvisBayPortCount", aggregate: "sum" }]
		},
		selectable: "cell",
		columns: [  
		    {field:"month",title:"Month", footerTemplate:"TOTALS"},
		    {field:"luderitzPortCount",title:"Luderitz Port",footerTemplate:"#=sum#"}, 
		    {field:"walvisBayPortCount",title:"Walvis Bay Port", footerTemplate:"#=sum#"},
		    {title:"TOTALS",template:"#= luderitzPortCount+walvisBayPortCount #"}],
			change : function(){
				var cell = this.select();
				var data = this.dataItem(cell.closest("tr"));
				$("#port-state-inspections-container").show();
				
				var colIdx = cell.index();
				if (colIdx==1){
					var dataSource = new kendo.data.DataSource({
						data: data.luderitzPortVessels
					});
					$("#port-state-inspections-grid").data("kendoGrid").setDataSource(dataSource);
				}else if (colIdx==2){
					var dataSource = new kendo.data.DataSource({
						data: data.walvisBayPortVessels
					});
					$("#port-state-inspections-grid").data("kendoGrid").setDataSource(dataSource);
				}
			}
	});
	
	kendo.init($("#port-state-inspections-toolbar"));
	
	$("#port-state-inspections-grid").kendoGrid({
		pageable: true,
		columns: [  
		    {field:"vesselName",title:"Vessel Name", template:"<a href='/vessel/display/#= vesselId #' target='_blank'>#= vesselName #</a>"},
		    {field:"regNo",title:"Reg No."},
		    {field:"flagState.name",title:"Reg Country"},
		    {field:"vesselType.value",title:"Vessel Type"},
		    {field:"length",title:"Length"},
		    {field:"grossTonnage",title:"Gross Tonnage"},
		    {field:"owner.name1",title:"Vessel Owner"},
		    {field:"lastSurveyDate",title:"Last Survey Date"},
		    {title:"Last Survey Type",template:"#= lastSurveyType!=null? lastSurveyType.description:'' #"},
		    {field:"lastSurveyPort",title:"Last Survey Port"}]
	});
	
	var loadInspectionCountsHandler = function (result){
		var dataSource = new kendo.data.DataSource({
			data: result.data,
			aggregate: [ { field: "luderitzPortCount", aggregate: "sum" },
                         { field: "walvisBayPortCount", aggregate: "sum" }]
		});
		$("#port-state-inspections-counts-grid").data("kendoGrid").setDataSource(dataSource);
	}
	
	$("#loadInspectionStatsReportBtn").click(function(e){
		e.preventDefault();
		var year = $("#yearSelectionDropDown").val();
		sendAjaxPost("/vessels/reports/port_state_inspection_report",{year:year},loadInspectionCountsHandler);
	});
}

function initializeVesselsIMOReport(){
	$("#vessels-imo-report-grid").kendoGrid({
		dataSource: {
			transport: {
            	read: {
                    url: "/vessels/reports/vessels_imo_report",
                    dataType: "json"
                }
			},
			pageSize: 50
		},
		pageable: true,
		toolbar: kendo.template($("#vessel-imo-report-toolbar-template").html()),
		columns: [  
				    {field:"vesselName",title:"Vessel Name",template:"<a href='/vessel/display/#=vesselId#' target='_blank'>#= vesselName #</a>"},
				    {field:"yearBuild",title:"Year Build"},
				    {field:"callSign",title:"Call Sign"},
				    {field:"length",title:"Length"},
				    {field:"grossTonnage",title:"Gross Tonnage"},
				    {field:"owner.name1",title:"Vessel Owner",template:"<a href='/customer/display/#=owner.customerId#' target='_blank'>#= owner.name1 # #= owner.name2 #</a>"},
				    {field:"regDate",title:"Registration Year"},
				    {field:"regNo",title:"Reg No."},
				    {field:"regPort.description",title:"Reg Port"},
				    {field:"lastInspectionDate",title:"Last Inspection Date"}]
	});
	
	$("#exportFileBtn").click(function(e){
		window.open(
				"/vessels/reports/vessels_imo_report_export",
				"_blank" // <- This is what makes it open in a new window.
		);
	});
}

function initializeVesselsListingReport(){
	$("#vessels-listing-report-grid").kendoGrid({
		pageable: true,
		toolbar: kendo.template($("#vessels-listing-report-toolbar-template").html()),
		columns: [  
		    {field:"vesselName",title:"Vessel Name",template:"<a href='/vessel/display/#=vesselId#' target='_blank'>#= vesselName #</a>"},
		    {field:"yearBuild",title:"Year Build"},
		    {field:"callSign",title:"Call Sign"},
		    {field:"length",title:"Length"},
		    {field:"grossTonnage",title:"Gross Tonnage"},
		    {field:"owner.name1",title:"Vessel Owner",template:"<a href='/customer/display/#=owner.customerId#' target='_blank'>#= owner.name1 # #= owner.name2 #</a>"},
		    {field:"regDate",title:"Registration Year"},
		    {field:"regNo",title:"Reg No."},
		    {field:"regPort.description",title:"Reg Port"},
		    {field:"lastInspectionDate",title:"Last Inspection Date"}]
	});
	
	kendo.init($("#vessels-listing-report-toolbar"));
	
	var loadVesselListingsHandler = function(result){
		var dataSource = new kendo.data.DataSource({data: result.data});
		$("#vessels-listing-report-grid").data("kendoGrid").setDataSource(dataSource);
	};
	
	var formData = getFormData($("#vessels-listing-toolbar-form"));
	sendAjaxPost("/vessels/reports/vessel_listing_report",formData,loadVesselListingsHandler);
	
	$("#loadVesselsBtn").click(function(e){
		e.preventDefault();
		var formData = getFormData($("#vessels-listing-toolbar-form"));
		sendAjaxPost("/vessels/reports/vessel_listing_report",formData,loadVesselListingsHandler);
	});
}

function initializeVesselOwnershipReport(){
	$("#vessel-ownership-owners-report-grid").kendoGrid({
		selectable: true,
		toolbar: kendo.template($("#vessel-ownership-report-toolbar-template").html()),
		columns: [  
		    {title:"Full Name",template:"#= name1 # #= name2 #"},
		    {field:"identityNumber",title:"ID No./Company Registration No."},
		    {field:"nationality.name",title:"Nationality"},
		    {title:"Contacts",
		    	template:"<ul>#for (var i=0,len=contacts.length; i<len; i++){# <li>${contacts[i].contactDetail}</li> #} #</ul>"}],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			$("#owner-vessels-grid-container").show();
			
			reloadKendoGrid("vessel-ownership-vessels-report-grid","/vessels/reports/load_owner_vessels/"+data.customerId,10);
		}
	});
	
	$("#vessel-ownership-vessels-report-grid").kendoGrid({
		pageable: true,
		columns: [  
		    {field:"vesselName",title:"Vessel Name", template:"<a href='/vessel/display/#= vesselId #' target='_blank'>#= vesselName #</a>"},
		    {field:"regNo",title:"Reg No."},
		    {field:"regDate",title:"Reg Date"},
		    {field:"flagState.name",title:"Reg Country"},
		    {field:"regPort.description",title:"Reg Port"},
		    {field:"vesselType.value",title:"Vessel Type"},
		    {field:"grossTonnage",title:"Gross Tonnage"},
		    {field:"length",title:"Length"},
		    {field:"vesselStatus.value",title:"Vessel Status"},
		    {field:"lastInspectionDate",title:"Last Inspection Date"}]
	});
	
	
	var onSearchHandler = function(value){
		reloadKendoGrid("vessel-ownership-owners-report-grid","/customers/search/"+value,2);
		$("#owner-vessels-grid-container").hide();
	};
	
	$("#searchCustomersBtn").bind("click",function(e){
		e.preventDefault();
		var searchVal = $("#customerSearchField").val();
		if (searchVal && searchVal.length>0){
			onSearchHandler(searchVal);
		}
	});
	
	$("#customerSearchField").bind("keydown",function(e){
		if (e.keyCode==13){
			var searchVal = $("#customerSearchField").val();
			if (searchVal && searchVal.length>0){
				onSearchHandler(searchVal);
			}
		}
	});
	
}

function initializeVesselRegistryTurnover(){
	$("#vessel-registry-turnover-stats-grid").kendoGrid({
		dataSource: {
			transport: {
            	read: {
                    url: "/vessels/reports/vessel_registry_turnover_stats",
                    dataType: "json"
                }
			},
			aggregate: [ { field: "totalRegistered", aggregate: "sum" },
                         { field: "totalDeleted", aggregate: "sum" },
                         { field: "totalGainOrLoss", aggregate: "sum" }]
		},
		selectable: "cell",
		columns: [
		    {field:"year",title:"YEAR", footerTemplate:"TOTAL",attributes: {"class":"k-group-cell"}},
		    {field:"totalRegistered",title:"TOTAL REGISTERED",footerTemplate:"#=sum#"}, 
		    {field:"totalDeleted",title:"TOTAL DELETED", footerTemplate:"#=sum#"},
		    {field:"totalGainOrLoss",title:"TOTAL GAIN/LOSS",attributes: {"class":"k-group-cell"}, footerTemplate:"#=sum#"},
		    {field:"cumulativeTotal",title:"CUMULATIVE TOTAL",attributes: {"class":"k-group-cell"}}
		    ],
			change : function(){
				var cell = this.select();
				var data = this.dataItem(cell.closest("tr"));
				$("#vessel-registry-turnover-grid-container").show();
				
				var colIdx = cell.index();
				var year = data.year==='BB/F'?'BBF':data.year;
				
				if (colIdx==1){
					reloadKendoGrid("vessel-registry-turnover-vessels-grid","/vessels/reports/vessel_reg_turnover/reg/"+year,10);
				}else if (colIdx==2){
					reloadKendoGrid("vessel-registry-turnover-vessels-grid","/vessels/reports/vessel_reg_turnover/del/"+year,10);
				}
			}
	});
	
	$("#vessel-registry-turnover-vessels-grid").kendoGrid({
		pageable: true,
		columns: [  
		    {field:"vesselName",title:"Vessel Name", template:"<a href='/vessel/display/#= vesselId #' target='_blank'>#= vesselName #</a>"},
		    {field:"regNo",title:"Reg No."},
		    {field:"regDate",title:"Reg Date"},
		    {field:"flagState.name",title:"Reg Country"},
		    {field:"regPort.description",title:"Reg Port"},
		    {field:"vesselType.value",title:"Vessel Type"},
		    {field:"grossTonnage",title:"Gross Tonnage"},
		    {field:"length",title:"Length"},
		    {field:"vesselStatus.value",title:"Vessel Status"},
		    {field:"lastInspectionDate",title:"Last Inspection Date"}]
	});
}

var portStateInspectionsYearFilterDS = new kendo.data.DataSource({
	data : [kendo.stringify((new Date()).getFullYear()),
	        kendo.stringify((new Date()).getFullYear()-1),
	        kendo.stringify((new Date()).getFullYear()-2),
	        kendo.stringify((new Date()).getFullYear()-3)]
});

var vesselRegTypesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/vesselRegTypes"}
    }
});

var registryPortsDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/registryPorts"}
    }
});

var vesselTypesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/vesselTypes"}
    }
});

var operationTypesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/operationTypes"}
    }
});

var licenceTypesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/licenceTypes"}
    }
});

var vesselStatusesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/vesselStatuses"}
    }
});
