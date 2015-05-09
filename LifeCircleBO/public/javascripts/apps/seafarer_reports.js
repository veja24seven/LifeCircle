var seafarerTypesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/seafarerTypes"}
    }
}),
nationalitiesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/countries"}
    }
}),
cocTypesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/cocTypes"}
    }
}),
seafarerStatusesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/seafarerStatuses"}
    }
});

function init(){
	$("#reports-tabstrip").kendoTabStrip();
	
	// Seafarer Certificates Report
	initializeSeafarerCertificatesReport();
	
	//Seafarer COC Printout
	initializeSeafarerCOCPrintout();
	
	//Seafarer Listing
	initializeSeafarerListing();
}

function initializeSeafarerCertificatesReport(){
	
	$("#seafarer-certificate-detail-grid").kendoGrid({
		toolbar: kendo.template($("#seafarer-toolbar-template").html()),
		selectable : "true",
		columns : [
		   {title:"Passport Photo", template: "<img src='data:image/png;charset=utf-8;base64, #: data.seafarer.passportPhoto #' alt='image' width='100' height='100'/>", width:"120px"},
		   {title:"Seafarer Detail", template: "<a href='/customer/display/#:customer.customerId#' target='_blank'><span class='title'>#: customer.name1 # #: customer.name2 #</span></a>" +
		   		"<a href='/customer/display/#:seafarer.employer.customerId#' target='_blank'><span class='description'>Employer : #: seafarer.employer.name1 #, #= seafarer.employer.identityNumber #</span></a>" +
		   		"<span class='description'>#: customer.identityType.value # : #= customer.identityNumber #</span>" +
		   		"<span class='description'>Nationality: #: customer.nationality.name #</span>"},
		   {title:"Contacts", template:"<ul style='list-style:none;'>#for (var i=0,len=customer.contacts.length; i<len; i++){# <li>${customer.contacts[i].contactType.value} : ${customer.contacts[i].contactDetail}</li> #} #</ul>"}
		],
		change : function(){
			var row = this.select();
			var data = this.dataItem(row);
			$("#exportPdfSeafarersBtn").show();
			$("#seafarer-certificates-container").show();
			var ds = new kendo.data.DataSource({
				data : data.certificates,pageSize: 10
			});
			
			$("#seafarer-certificates-grid").data("kendoGrid").setDataSource(ds);
		}
	});
	
	$("#seafarer-certificates-grid").kendoGrid({
		pageable: true,
		columns : [
			{ field: "certificateType.value", title:"Certificate Type"},
			{ field: "certificateRefNo", title:"Certificate Reg No."},
			{ field: "application.applicationType", title:"Application Type" },
			{ field: "application.applicationPlace", title:"Application Place" },
			{ field: "capacityType.value", title: "Capacity Type"},
			{ field: "issueDate", title: "Issue Date"},
			{ field: "expireDate", title: "Expire Date"}
		]
	});
	
	var exportReportHandler = function (e){
		e.preventDefault();
		var grid = $("#seafarer-certificate-detail-grid").data("kendoGrid");
		var row = grid.select();
		var data = grid.dataItem(row);
		if (data!=null) {
			window.open(
					"/seafarer_reports/seafarer_certificates_export/"+data.seafarer.seafarerId,
					"_blank" // <- This is what makes it open in a new window.
			);
		}
	};
	
	$("#seafarerSearchField").bind("keydown",function(e){
		if (e.keyCode==13){
			var criteria = $("#seafarerSearchField").val();
			if (criteria && criteria.length>0){
				reloadKendoGrid("seafarer-certificate-detail-grid","/seafarer_reports/search_seafarer/"+criteria,10);
			}
		}
	});
	
	$("#searchSeafarersBtn").click(function(e){
		e.preventDefault();
		var criteria = $("#seafarerSearchField").val();
		if (criteria && criteria.length>0){
			reloadKendoGrid("seafarer-certificate-detail-grid","/seafarer_reports/search_seafarer/"+criteria,10);
		}
	});
	
	$("#exportPdfSeafarersBtn").click(exportReportHandler);
}

function initializeSeafarerCOCPrintout(){
	
	var showSeafarerDetail = function (e){
		e.preventDefault();
		var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
		var viewModel = kendo.observable({
			seafarer : dataItem.seafarer,
			cocDetail : dataItem.cocDetail,
			cocFunctions : dataItem.cocFunctions,
			cocCapacities : dataItem.cocCapacities
    	});
		display_read_popup(
				"seafarer-demographic-detail-template",
				viewModel,
				"Seafarer Demographic Details", 
				900);
	}
	
	$("#seafarer-coc-details-grid").kendoGrid({
		toolbar: kendo.template($("#seafarer-coc-details-toolbar-template").html()),
		selectable : true,pageable: true,
		columns : [
		    {title:"Seafarer Name", template:"<a href='/customer/display/#=seafarer.customer.customerId#' target='_blank'>#= seafarer.customer.name1 # #= seafarer.customer.name2 #</a>"},
		    {field:"cocDetail.cocType.value",title:"COC Type"},
		    {field:"cocDetail.certificateNo",title:"Certificate No"},
		    {field:"cocDetail.cocIssueType.value",title:"COC Issue Type"},
		    {field:"cocDetail.cocIssueDate",title:"COC Issue Date"},
		    {field:"cocDetail.cocIssueCountry.name",title:"COC Issue Country"},
		    {field:"cocDetail.cocExpireDate",title:"Expire Date"},
		    {field:"cocDetail.extendedExpiryDate",title:"Revalidation Date"},
		    { command: { text: "View Detail", click: showSeafarerDetail }, title: " "}
		]
	});
	
	$("#seafarerCocDetailSearchField").bind("keydown",function(e){
		if (e.keyCode==13){
			var criteria = $("#seafarerCocDetailSearchField").val();
			if (criteria && criteria.length>0){
				reloadKendoGrid("seafarer-coc-details-grid","/seafarer_reports/search_seafarer_coc_printout/"+criteria,10);
			}
		}
	});
	
	$("#searchSeafarerCocDetailsBtn").click(function(e){
		e.preventDefault();
		var criteria = $("#seafarerCocDetailSearchField").val();
		if (criteria && criteria.length>0){
			reloadKendoGrid("seafarer-coc-details-grid","/seafarer_reports/search_seafarer_coc_printout/"+criteria,10);
		}
	});
}

function initializeSeafarerListing(){
	var showSeafarerDetail = function (e){
		e.preventDefault();
		var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
		var viewModel = kendo.observable({
			seafarer : dataItem,
			certificates : new kendo.data.DataSource({
				transport: {
	                read: "/seafarers/load_certificates/"+dataItem.seafarerId
	            },
	            paging: true,
	            pageSize: 4
			})
    	});
		display_read_popup(
				"seafarer-detail-template",
				viewModel,
				"Seafarer Details", 
				900);
	}
	
	$("#seafarer-listing-grid").kendoGrid({
		toolbar: kendo.template($("#seafarer-listing-toolbar-template").html()),
		selectable : true, pageable : true,
		columns : [
		    {title:"Seafarer Name", field:"customer", template:"<a href='/customer/display/#= customer.customerId #' target='_blank'>#= customer.name1 # #= customer.name2 #</a>"},
		    {title:"Record Book No", field:"recordbookNo"},
		    {title:"Reg Date", field:"customer.regDate"},
		    {title:"Seafarer Type", field:"seafarerType.value"},
		    {title:"Nationality", field:"customer.nationality.name"},
		    {title:"Employer", template:"<a href='/customer/display/#= employer.customerId #' target='_blank'>#= employer.name1 # #= employer.name2 #</a>"},
		    {title:"Seafarer Status", field:"seafarerStatus.value"},
		    { command: { text: "View Detail", click: showSeafarerDetail }, title: " "}
		]
	});
	
	kendo.init($("#seafarer-listing-toolbar"));
	
	var loadSeafarerListingsHandler = function (result){
		var dataSource = new kendo.data.DataSource({
			data : result.data, pageSize:50
		});
		
		$("#seafarer-listing-grid").data("kendoGrid").setDataSource(dataSource);
	}
	
	$("#seafarer-listing-toolbar-form").submit(function(e){
		e.preventDefault();
		var formData = getFormData($("#seafarer-listing-toolbar-form"));
		sendAjaxPost("/seafarer_reports/load_seafarer_listing",formData,loadSeafarerListingsHandler);
	});
	
	
}


