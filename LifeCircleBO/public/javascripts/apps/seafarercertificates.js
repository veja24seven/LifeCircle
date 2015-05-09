function init (){
	
	$("#seafarersTabstrip").kendoTabStrip();
	
	$("#seafarersGrid").kendoGrid({
        pageable: true,
        selectable : true,
        height: 500,
        toolbar: kendo.template($("#seafarerTemplate").html()),
        detailTemplate: kendo.template($("#seafarerCertificateTemplate").html()),
        detailInit: showSeafarerCertificates,
        dataBound: function() {
            this.expandRow(this.tbody.find("tr.k-master-row").first());
        },
        columns: [
	          { field: "passportPhoto",title:"Photo",template:"<img src='data:image/png;charset=utf-8;base64, #: passportPhoto #' alt='image' width='100' height='100'/>"},     
	          { field: "employer.name1", title:"Employer"},
	          { field: "seafarerType.value", title:"Seafarer Type"},
	          { field: "registerDate",title:"Register Date"},
	          { field: "seafarerStatus.value",title:"Status"}],
        change : function(){
            var row = this.select();
            var data = this.dataItem(row);
            console.log("Selected: " + data + " Text, [" + JSON.stringify(data) + "]");
            currentSeafarer = data;
        }

    });
	
	$("#searchSeafarersBtn").click(function(e){
		searchSeafarers($("#seafarerSearchField").val());
	    e.preventDefault();
	});
	
	$("#seafarerSearchField").keydown(function(e){
	    if (e.keyCode==13){
	        searchSeafarers($("#seafarerSearchField").val());
	    }
	});
}

function searchSeafarers(criteria){
	console.log("Search Seafarers by "+criteria);
	
	reloadKendoGrid("seafarersGrid","/seafarers/search/"+criteria,4);
}

var certificateTypesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/certificateTypes"}
    }
}),
countriesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/countries"}
    }
}),
capacityTypesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/capacityTypes"}
    }
}),
cocApplicationsDS = null;

var currentSeafarerCertificate = null;
function showSeafarerCertificates(e){
	var detailRow = e.detailRow;
	
	currentSeafarer = e.data;
	
	detailRow.find(".certificatesGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/seafarers/load_certificates/"+e.data.seafarerId
            },
            paging: true,
            pageSize: 4
        },
        scrollable : false,
		pageable: true,
        selectable : true,
        toolbar: kendo.template($("#certificatesTemplate").html()),
        columns: [
	          { field: "certificateType.value", title:"Certificate Type"},
	          { field: "certificateRefNo", title:"Certificate Reg No."},
	          { template: "#= application.applicationDate #, #= application.applicationType #", title:"Application" },
	          { field: "capacityType.value", title: "Capacity Type"},
	          { field: "issueDate", title: "Issue Date"},
	          { field: "expireDate", title: "Expire Date"},
	          { field: "approvalStatus.value", title: "Approval Status"},
	          { field: "approvalRemarks", title:"Approval Remarks"}],
	          change : function(){
	              var row = this.select();
	              var data = this.dataItem(row);
	              console.log("Selected: " + data + " Text, [" + JSON.stringify(data) + "]");
	              currentSeafarerCertificate = data;
	              if (data.approvalDate==null){
	            	  detailRow.find(".editCertificateBtn").show();
	      			  detailRow.find(".approveCertificateBtn").show();
	              }else{
	            	  detailRow.find(".editCertificateBtn").hide();
	      			  detailRow.find(".approveCertificateBtn").hide();
	              }
	          }
        
	});
	
	initializeSeafarerCertificateToolBarActions(e);
}

function initializeSeafarerCertificateToolBarActions(e){
	var detailRow = e.detailRow;
	
	var submitAddSeafarerCertificateHandler = function(evt){
		var form = $("#seafarer-certificate-form");
		var formData = getFormData(form);
		formData.seafarer = currentSeafarer.seafarerId;
		
		sendAjaxPost("/seafarers/create_certificate",formData,function(data){
			var grid = detailRow.find(".certificatesGrid").data("kendoGrid");
			grid.dataSource.read();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();

	        detailRow.find(".editCertificateBtn").hide();
			detailRow.find(".approveCertificateBtn").hide();
			
	    	alert("Seafarer Certificate added successfully.");
		});
	};
	
	var submitEditSeafarerCertificateHandler = function(evt){
		var form = $("#seafarer-certificate-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/seafarers/update_certificate",formData,function(data){
			var grid = detailRow.find(".certificatesGrid").data("kendoGrid");
			grid.dataSource.read();
	    	form[0].reset();
	    	
	        $("#current-form-window").data("kendoWindow").close();
	        
	        detailRow.find(".editCertificateBtn").hide();
			detailRow.find(".approveCertificateBtn").hide();
			
	    	alert("Seafarer Certificate updated successfully.");
		});
	};
	
	var submitApprovalSeafarerCertificateHandler = function(evt){
		var form = $("#seafarer-certificate-approval-form");
		var formData = getFormData(form);
		formData.certificate = currentSeafarerCertificate.certificateId;
		
		sendAjaxPost("/seafarers/approve_certificate",formData,function(data){
			var grid = detailRow.find(".certificatesGrid").data("kendoGrid");
			grid.dataSource.read();
	    	form[0].reset();
	    	
	        $("#current-form-window").data("kendoWindow").close();
	        
	        detailRow.find(".editCertificateBtn").hide();
			detailRow.find(".approveCertificateBtn").hide();
			
	    	alert("Seafarer Certificate Approved successfully.");
		});
	};
	
	detailRow.find(".addNewCertificateBtn").click(function(evt){
		cocApplicationsDS = new kendo.data.DataSource({
			transport: {read: {dataType: "json",url: "/dma/seafarer_coc_applications/load_coc_applications/"+currentSeafarer.seafarerId}
		    }
		});
		evt.preventDefault();
    	display_popup(
			"seafarer-certificate-form",
			"seafarer-certificate-form-template",
			null,
			submitAddSeafarerCertificateHandler,
			"Add Seafarer Certificate",
			"500px"
		);
    });
	
	detailRow.find(".editCertificateBtn").click(function(evt){
		cocApplicationsDS = new kendo.data.DataSource({
			transport: {read: {dataType: "json",url: "/dma/seafarer_coc_applications/load_coc_applications/"+currentSeafarer.seafarerId}
		    }
		});
		evt.preventDefault();
    	var viewModel = kendo.observable({
    		seafarerId : currentSeafarer.seafarerId,
    		certificate : currentSeafarerCertificate
    	});
    	display_popup(
			"seafarer-certificate-form",
			"seafarer-certificate-form-template",
			viewModel,
			submitEditSeafarerCertificateHandler,
			"Edit Seafarer Certificate",
			"500px"
		);
    });
	
	detailRow.find(".approveCertificateBtn").click(function(e){
		e.preventDefault();
		display_popup(
				"seafarer-certificate-approval-form",
				"seafarer-certificate-approval-form-template",
				null,
				submitApprovalSeafarerCertificateHandler,
				"Seafarer Certificate Approval",
				"500px"
			);
	});
}