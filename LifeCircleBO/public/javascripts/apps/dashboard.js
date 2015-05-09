function init(){
	$("#grid-one").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/dashboard/load_active_vessel_totals"
            }
        },
		toolbar: kendo.template($("#active-vessels-grid-toolbar-template").html()),
		columns : [
			{title:"Vessel Type", field:"type"},
			{title:"Total", field:"total"}
		]
	});
	
	$("#grid-two").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/dashboard/load_active_service_providers_totals"
            }
        },
		toolbar: kendo.template($("#active-service-providers-grid-toolbar-template").html()),
		columns : [
			{title:"Facility Type", field:"type"},
			{title:"Total", field:"total"}
		]
	});
	
	$("#grid-three").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/dashboard/load_active_seafarer_totals"
            }
        },
		toolbar: kendo.template($("#active-seafarers-grid-toolbar-template").html()),
		columns : [
			{title:"Seafarer Type", field:"type"},
			{title:"Total", field:"total"}
		]
	});
	
	$("#grid-four").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/dashboard/load_scheduled_vessel_arrivals"
            }
        },
		toolbar: kendo.template($("#arrival-vessels-grid-toolbar-template").html()),
		columns : [
			{title:"Date & Time", field:"arrivalDate", template:"#: kendo.toString(new Date(arrivalDate),'yyyy-MM-dd HH:mm') #"},
			{title:"Vessel", field:"vessel.vesselName"},
			{title:"Owner/Agent", field:"owner.name1", template:"#= owner.name1 # #= owner.name2 #"},
			{title:"At Port", field:"arrivalPort.description"},
			{title:"From Port", field:"previousPort"},
			{title:"To Port", field:"nextPort"},
			{title:"Status", field:"arrivalStatus.value"}
		]
	});
	
	$("#chart-one").kendoChart({
		dataSource: {
            transport: {
                read: {
                    url: "/dma/dashboard/arrivals_departures_totals",
                    dataType: "json"
                }
            }
        },
        title: {
            text: "Vessel Arrivals & Departures"
        },
        legend: {
            position: "top"
        },
        seriesDefaults: {
            type: "column"
        },
        series:
        [{
            field: "arrivals",
            name: "Arrivals"
        }, {
            field: "departures",
            name: "Departures"
        }],
        categoryAxis: {
            field: "month",
            labels: {
                rotation: -90
            },
            majorGridLines: {
                visible: false
            }
        },
        valueAxis: {
            labels: {
                format: "N0"
            },
            majorUnit: 1,
            line: {
                visible: false
            }
        },
        tooltip: {
            visible: true,
            format: "N0"
        }
	});
	
	$("#grid-five").kendoGrid({
		dataSource: {
			transport: {
            	read: {
                    url: "/vessels/reports/vessel_registry_turnover_stats",
                    dataType: "json"
                }
			}
		},
		toolbar: kendo.template($("#vessels-turnover-grid-toolbar-template").html()),
		columns: [
		    {field:"year",title:"Year"},
		    {field:"totalRegistered",title:"Registered"}, 
		    {field:"totalDeleted",title:"Deleted"},
		    {field:"totalGainOrLoss",title:"Gain/Loss"},
		    {field:"cumulativeTotal",title:"Cumulative"}
		    ]
	});
	
	$("#grid-six").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/dashboard/vessel_certificates"
            }
        },
		toolbar: kendo.template($("#vessel-certificates-grid-toolbar-template").html()),
		columns : [
			{title:"Certificate Type", field:"certificateType"},
			{title:"Expired", field:"expired"},
			{title:"Not Expired", field:"notExpired"},
			{title:"Total", field:"total"}
		]
	});
}