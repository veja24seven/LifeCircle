var customerAutocompleteDS = new kendo.data.DataSource({
	type: "json",pageSize: 10,
	transport: {read: "/customer/load_autocomplete_customers"}
}),
facilityTypesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/facilityTypes"}
    }
}),
serviceTypesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/serviceTypes"}
    }
}),
townNamesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/townNames"}
    }
}), 
inspectionTypesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/inspectionTypes"}
    }
}), 
certificateTypesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/certificateTypes"}
    }
});
var currentFacility = null, currentFacilityCertificate = null, currentFacilityInspection = null;
function init () {
	
	$("#facilitiesGrid").kendoGrid({
        pageable: true,
        selectable : true,
        height: 500,
        toolbar: kendo.template($("#facilityTemplate").html()),
        detailTemplate: kendo.template($("#facilityCertificateTemplate").html()),
        detailInit: showFacilityCertificatesAndInspections,
        dataBound: function() {
            this.expandRow(this.tbody.find("tr.k-master-row").first());
        },
        columns: [
            { title:"Owner Name & Id",template:"#: owner.name1 #,#: owner.identityNumber #"},     
            { field: "facilityName", title:"Name"},
            { field: "regNo", title:"Reg No."},
            { field: "regDate", title:"Reg Date"},
            { field: "facilityType.value", title:"Facility Type"},
            { field: "serviceType.value",title:"Service Type"},
            { field: "townName.value",title:"Town Name"},
            { field: "confirmed",title:"Confirmed", template: "#= confirmed? 'YES':'NO' #"}],
        change : function(){
            var row = this.select();
            var data = this.dataItem(row);
            currentFacility = data;
            
            if(currentFacility.confirmed){
            	$("#editFacilityBtn").hide();
            	$("#confirmFacilityBtn").hide();
            }else{
            	$("#editFacilityBtn").show();
            	$("#confirmFacilityBtn").show();
            }
        }

    });
	
	attachFacilitiesToolBarActions();
}

function attachFacilitiesToolBarActions(){
	$("#searchFacilitiesBtn").click(function(e){
		searchFacilities($("#facilitySearchField").val());
	    e.preventDefault();
	});
	
	$("#facilitySearchField").keydown(function(e){
	    if (e.keyCode==13){
	        searchFacilities($("#facilitySearchField").val());
	    }
	});
	
	var createFacilitySubmitHandler = function(e){
		e.preventDefault();
		var form = $("#facility-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/clientmaster/facilities/create_facility",formData,function(data){
			searchFacilities(formData.owner.substring(1,formData.owner.indexOf(",")-1));
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        
	    	alert("Facility added successfully.");
		});
	},
	updateFacilitySubmitHandler = function(e){
		e.preventDefault();
		var form = $("#facility-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/clientmaster/facilities/update_facility",formData,function(data){
			searchFacilities(formData.owner.substring(1,formData.owner.indexOf(",")-1));
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        
	    	alert("Facility update successfully.");
		});
	};
	
	$("#addNewFacilityBtn").click(function(e){
		e.preventDefault();
		display_popup(
			"facility-form",
			"facility-form-template",
			null,
			createFacilitySubmitHandler,
			"Add Facility",
			"500px"
		);
	});
	
	$("#editFacilityBtn").click(function(e){
		e.preventDefault();
		var viewmodel = kendo.observable({
			facility : currentFacility,
			owner : currentFacility.owner.name1+", "+currentFacility.owner.identityNumber
		});
		display_popup(
			"facility-form",
			"facility-form-template",
			viewmodel,
			updateFacilitySubmitHandler,
			"Edit Facility",
			"500px"
		);
	});
	
	$("#confirmFacilityBtn").click(function(e){
		e.preventDefault();
		sendAjaxPost("/clientmaster/facilities/confirm_facility/"+currentFacility.facilityId,{},function(data){
			searchFacilities(currentFacility.owner.identityNumber);
			
        	alert("Facility confirmed successfully.");
    	});
	});
}

function searchFacilities(criteria){
	reloadKendoGrid("facilitiesGrid","/clientmaster/facilities/load_facilities/"+criteria,10);
	$("#editFacilityBtn").hide();
	$("#confirmFacilityBtn").hide();
}

function showFacilityCertificatesAndInspections(e){
	var detailRow = e.detailRow;
	
	//initiate tabstrip on a detail
	detailRow.find(".facilityCertificatesTabstrip").kendoTabStrip();
	
	detailRow.find(".facilityInspectionsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
            	read: "/clientmaster/facilities/load_inspections/"+e.data.facilityId
            },
            paging: true,
            pageSize: 10
        },
        scrollable : false,
		pageable: true,
        selectable : true,
        toolbar: kendo.template($("#facilityInspectionsTemplate").html()),
        columns: [
	          { field: "inspectionType.value", title:"Inspection Type"},
	          { field: "inspectionRefNo", title:"Inspection Ref No." },
	          { field: "inspectionDate", title:"Inspection Date" },
	          { field: "inspectionOutcome", title:"Inspection Outcome" },
	          { field: "confirmDate", title:"Confirm Date" }],
	    change : function(){
          var row = this.select();
          var data = this.dataItem(row);
          currentFacilityInspection = data;
          if (currentFacilityInspection.confirmed){
          	detailRow.find(".editFacilityInspectionBtn").hide();
          	detailRow.find(".confirmFacilityInspectionBtn").hide();
          }else{
          	detailRow.find(".editFacilityInspectionBtn").show();
          	detailRow.find(".confirmFacilityInspectionBtn").show();
          }
	    }
	});
	
	detailRow.find(".certificatesGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
            	read: "/clientmaster/facilities/load_certificates/"+e.data.facilityId
            },
            paging: true,
            pageSize: 10
        },
        scrollable : false,
		pageable: true,
        selectable : true,
        toolbar: kendo.template($("#facilityCertificatesTemplate").html()),
        columns: [
	          { field: "certificateType.value", title:"Certificate Type"},
	          { field: "certificateRefNo", title:"Certificate Ref No."},
	          { field: "applicationDate", title:"Application Date" },
	          { field: "issueDate", title: "Issue Date"},
	          { field: "expiryDate", title: "Expire Date"},
	          { field: "applicationDate", title: "Application Date"},
	          { field: "confirmDate", title:"Confirm Date"}],
  	    change : function(){
            var row = this.select();
            var data = this.dataItem(row);
            currentFacilityCertificate = data;
            if (currentFacilityCertificate.confirmed){
            	detailRow.find(".editFacilityCertificateBtn").hide();
            	detailRow.find(".confirmFacilityCertificateBtn").hide();
            }else{
            	detailRow.find(".editFacilityCertificateBtn").show();
            	detailRow.find(".confirmFacilityCertificateBtn").show();
            }
  	    }
        
	});
	
	attachFacilityCertificatesToolBarActions(e);
	
	attachFacilityInspectionsToolBarActions(e);
	
}

function attachFacilityCertificatesToolBarActions(e){
	var detailRow = e.detailRow;
	
	var submitAddFacilityCertificateHandler = function(evt){
		evt.preventDefault();
		var form = $("#facility-certificate-form");
		var formData = getFormData(form);
		formData.facilityId = e.data.facilityId;
		
		sendAjaxPost("/clientmaster/facilities/create_certificate",formData,function(data){
			var grid = detailRow.find(".certificatesGrid").data("kendoGrid");
			grid.dataSource.read();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();

	        detailRow.find(".editFacilityCertificateBtn").hide();
	        detailRow.find(".confirmFacilityCertificateBtn").hide();
	    	alert("Facility Certificate added successfully.");
		});
	},
	submitUpdateFacilityCertificateHandler = function(evt){
		evt.preventDefault();
		var form = $("#facility-certificate-form");
		var formData = getFormData(form);
		formData.facilityId = e.data.facilityId;
		
		sendAjaxPost("/clientmaster/facilities/update_certificate",formData,function(data){
			var grid = detailRow.find(".certificatesGrid").data("kendoGrid");
			grid.dataSource.read();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();

	        detailRow.find(".editFacilityCertificateBtn").hide();
	        detailRow.find(".confirmFacilityCertificateBtn").hide();
	    	alert("Facility Certificate updated successfully.");
		});
	};
	
	detailRow.find(".addNewFacilityCertificateBtn").click(function(evt){
		evt.preventDefault();
		display_popup(
			"facility-certificate-form",
			"facility-certificate-form-template",
			null,
			submitAddFacilityCertificateHandler,
			"Add Facility Certificate",
			"500px"
		);
    });
	
	detailRow.find(".editFacilityCertificateBtn").click(function(evt){
		evt.preventDefault();
		var viewModel = kendo.observable({
    		certificate : currentFacilityCertificate
    	});
		display_popup(
			"facility-certificate-form",
			"facility-certificate-form-template",
			viewModel,
			submitUpdateFacilityCertificateHandler,
			"Edit Facility Certificate",
			"500px"
		);
    });
	
	detailRow.find(".confirmFacilityCertificateBtn").click(function(evt){
		e.preventDefault();
		sendAjaxPost("/clientmaster/facilities/confirm_certificate/"+currentFacilityCertificate.certificateId,{},function(data){
			var grid = detailRow.find(".certificatesGrid").data("kendoGrid");
			grid.dataSource.read();
			
			detailRow.find(".editFacilityCertificateBtn").hide();
	        detailRow.find(".confirmFacilityCertificateBtn").hide();
        	alert("Facility Certificate confirmed successfully.");
    	});
	});
}

function attachFacilityInspectionsToolBarActions(e){
	var detailRow = e.detailRow;
	
	var submitAddFacilityInspectionHandler = function(evt){
		evt.preventDefault();
		var form = $("#facility-inspection-form");
		var formData = getFormData(form);
		formData.facilityId = e.data.facilityId;
		
		sendAjaxPost("/clientmaster/facilities/create_inspection",formData,function(data){
			var grid = detailRow.find(".facilityInspectionsGrid").data("kendoGrid");
			grid.dataSource.read();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();

	        detailRow.find(".editFacilityInspectionBtn").hide();
	        detailRow.find(".confirmFacilityInspectionBtn").hide();
	    	alert("Facility Inspection added successfully.");
		});
	},
	submitUpdateFacilityInspectionHandler = function(evt){
		evt.preventDefault();
		var form = $("#facility-inspection-form");
		var formData = getFormData(form);
		formData.facilityId = e.data.facilityId;
		
		sendAjaxPost("/clientmaster/facilities/update_inspection",formData,function(data){
			var grid = detailRow.find(".facilityInspectionsGrid").data("kendoGrid");
			grid.dataSource.read();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();

	        detailRow.find(".editFacilityInspectionBtn").hide();
	        detailRow.find(".confirmFacilityInspectionBtn").hide();
	    	alert("Facility Inspection updated successfully.");
		});
	};
	
	detailRow.find(".addNewFacilityInspectionBtn").click(function(evt){
		evt.preventDefault();
		display_popup(
			"facility-inspection-form",
			"facility-inspection-form-template",
			null,
			submitAddFacilityInspectionHandler,
			"Add Facility Inspection",
			"500px"
		);
    });
	
	detailRow.find(".editFacilityInspectionBtn").click(function(evt){
		evt.preventDefault();
		var viewModel = kendo.observable({
    		inspection : currentFacilityInspection
    	});
		display_popup(
			"facility-inspection-form",
			"facility-inspection-form-template",
			viewModel,
			submitUpdateFacilityInspectionHandler,
			"Edit Facility Inspection",
			"500px"
		);
    });
	
	detailRow.find(".confirmFacilityInspectionBtn").click(function(evt){
		e.preventDefault();
		sendAjaxPost("/clientmaster/facilities/confirm_inspection/"+currentFacilityInspection.inspectionId,{},function(data){
			var grid = detailRow.find(".facilityInspectionsGrid").data("kendoGrid");
			grid.dataSource.read();
			
			detailRow.find(".editFacilityInspectionBtn").hide();
	        detailRow.find(".confirmFacilityInspectionBtn").hide();
        	alert("Facility Inspection confirmed successfully.");
    	});
	});
}
