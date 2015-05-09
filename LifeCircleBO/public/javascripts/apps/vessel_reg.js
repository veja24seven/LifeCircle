function init(){
	console.log("initialize vessel widgets.");
	
	$("#vesselsGrid").kendoGrid({
        pageable: true,
        selectable : true,
        height: 500,
        toolbar: kendo.template($("#vesselsTemplate").html()),
        detailTemplate: kendo.template($("#vesselDetailTemplate").html()),
        detailInit: showVesselDetail,
        columns: [
            { field: "owner.name1", title:"Owner"},
            { field: "regNo", title:"Reg #"},
            { field: "vesselName",title:"Name"},
            { field: "regType.value",title:"Reg. Type"},
            { field: "vesselType.value",title:"Vessel Type"},
            { field: "regPort.description",title:"Reg Port"},
            { field: "regDate",title:"Reg Date"},
            { field: "flagState.name",title:"Flag State"},
            { command: { text: "View", click: showVesselFullDetails }, title: " ", width: "100px" }],
        change : function(){
            var row = this.select();
            var data = this.dataItem(row);
            currentVessel = data;
            console.log("Selected: " + currentVessel + " Text, [" + JSON.stringify(currentVessel) + "]");
            updateVesselActionBar(true);
        }
    });
	
	kendo.init($("#vesselSearchBy"));
	
	$("#addNewVesselBtn").click(function(e){
		e.preventDefault();
		display_popup(
				"vessel-header-form",
				"vessel-header-form-template",
				null,
				createVesselSubmitHandler,
				"Add Vessel Header",
				"1020px"
		);
		$("#vesselRegType").data("kendoDropDownList").bind("select", regTypeSelectHandler);
    });
	
    $("#editVesselBtn").click(function(e){
    	e.preventDefault();
    	display_popup(
				"vessel-header-form",
				"vessel-header-form-template",
				getVesselObservableModel(currentVessel),
				updateVesselSubmitHandler,
				"Edit Vessel Header",
				"1020px"
		);
        
    });
    
    $("#addVesselDetailBtn").click(function(e){
    	e.preventDefault();
    	var viewModel = currentVessel.vesselDetail!=null? getVesselDetailObservableModel(currentVessel):null;
    	var formTitle = viewModel!=null? "Edit Vessel Detail":"Add Vessel Detail";
    	var submitHandler = viewModel!=null? updateVesselDetailSubmitHandler:createVesselDetailSubmitHandler;
    	display_popup(
				"vessel-detail-form",
				"vessel-detail-form-template",
				viewModel,
				submitHandler,
				formTitle,
				"1020px"
		);
    	if(viewModel==null)
    		$("#vesselId").val(currentVessel.vesselId);
    });
    
    $("#approvalVesselBtn").click(function(e){
    	e.preventDefault();
    	sendAjaxPost("/vessels/approve_vessel_header",{vesselId:currentVessel.vesselId},function(data){
    		$("#vesselSearchBy").data("kendoDropDownList").select(0);
        	$("#vesselSearch").text(currentVessel.vesselName);
        	searchVessel(currentVessel.vesselName);
        	alert("Vessel approved successfully.");
    	});
    });
    
    $("#searchVesselsBtn").click(function(e){
        searchVessel($("#vesselSearch").val());
        e.preventDefault();
    });

    $("#vesselSearch").keydown(function(e){
        if (e.keyCode==13){
            searchVessel($("#vesselSearch").val());
        }
    });
    
    initializeLookupDataSources();
}

function updateVesselActionBar(selected){
	if(selected){
		if(!currentVessel.deleted)
        	$("#editVesselBtn").show();
        else
        	$("#editVesselBtn").hide();
        if (currentVessel.namFlag && !currentVessel.deleted){
        	
        	if(currentVessel.approvalStatus.value==='APPROVED'){
        		$("#editVesselBtn").hide();
        		$("#approvalVesselBtn").hide();
        		$("#addVesselDetailBtn").hide();
        	}else{
        		$("#editVesselBtn").show();
        		if (currentVessel.vesselDetail==null){
        			$("#approvalVesselBtn").hide();
            		$("#addVesselDetailBtn").text("Add Detail")
            		$("#addVesselDetailBtn").show();
            		
            	}else{
            		$("#approvalVesselBtn").show();
            		$("#addVesselDetailBtn").text("Edit Detail")
            		$("#addVesselDetailBtn").show();
            	}
        	}
        }else if (!currentVessel.namFlag &&!currentVessel.deleted){
        	$("#editVesselBtn").show();
        	$("#addVesselDetailBtn").hide();
        	$("#approvalVesselBtn").hide();
        }
        
	}else{
		$("#editVesselBtn").hide();
		$("#addVesselDetailBtn").hide();
		$("#approvalVesselBtn").hide();
	}
}

function regTypeSelectHandler(e){
	var dataItem = this.dataItem(e.item.index());
	if (dataItem.value==="FLAG STATE"){
		console.log("REG STATE SELECTED "+dataItem.value);
    	
    	var dropdownlist = $("#vesselFlagState").data("kendoDropDownList");
    	dropdownlist.select(1);
    	
    	dropdownlist.readonly();
    	var dataSource = $("#registryPort").data("kendoDropDownList").dataSource;
    	dataSource.filter( { field: "countryCode", operator: "eq", value: "na" });
    	$("#registryPort").data("kendoDropDownList").refresh();
    	$("#vesselFlagState").data("kendoDropDownList").refresh();
    	
    	sendAjaxGet("/vessels/generate_vessel_reg_no",function(data){
    		$("#vesselRegNo").val(data);
    	});
    	
	}else{

		console.log("REG STATE SELECTED "+dataItem.value);
		var dropdownlist = $("#vesselFlagState").data("kendoDropDownList");
		dropdownlist.select(0);
    	dropdownlist.readonly(false);
    	var dataSource = $("#registryPort").data("kendoDropDownList").dataSource;
    	dataSource.filter([]);
    	$("#registryPort").data("kendoDropDownList").refresh();
    	$("#vesselFlagState").data("kendoDropDownList").refresh();
	}
}

function createVesselSubmitHandler(e){
	var form = $("#vessel-header-form");
	var formData = getFormData(form);
	
	sendAjaxPost("/vessels/create_vessel_header",formData,function(data){
		$("#vesselSearchBy").data("kendoDropDownList").select(0);
    	$("#vesselSearch").text(formData.vesselName);
    	searchVessel(formData.vesselName);
    	form[0].reset();
        $("#current-form-window").data("kendoWindow").close();
        
    	alert("Vessel created successfully.");
	});
}

function createVesselDetailSubmitHandler(e){
	var form = $("#vessel-detail-form");
	var formData = getFormData(form);
	
	formData.vesselId = currentVessel.vesselId;
	sendAjaxPost("/vessels/create_vessel_detail",formData,function(data){
		$("#vesselSearchBy").data("kendoDropDownList").select(0);
    	$("#vesselSearch").text(currentVessel.vesselName);
    	searchVessel(currentVessel.vesselName);
    	form[0].reset();
        $("#current-form-window").data("kendoWindow").close();
        
    	alert("Vessel Detail created successfully.");
	});
}

function updateVesselDetailSubmitHandler(e){
	var form = $("#vessel-detail-form");
	var formData = getFormData(form);
	
	sendAjaxPost("/vessels/update_vessel_detail",formData,function(data){
		$("#vesselSearchBy").data("kendoDropDownList").select(0);
    	$("#vesselSearch").text(currentVessel.vesselName);
    	searchVessel(currentVessel.vesselName);
    	form[0].reset();
        $("#current-form-window").data("kendoWindow").close();
        
    	alert("Vessel Detail created successfully.");
	});
}

function updateVesselSubmitHandler(e){
	var form = $("#vessel-header-form");
	var formData = getFormData(form);
	
	sendAjaxPost("/vessels/update_vessel_header",formData,function(data){
		$("#vesselSearchBy").data("kendoDropDownList").select(0);
    	$("#vesselSearch").text(formData.vesselName);
    	searchVessel(formData.vesselName);
    	form[0].reset();
        $("#current-form-window").data("kendoWindow").close();
        
    	alert("Vessel update successfully.");
	});
}

function getVesselObservableModel(vessel){
	return kendo.observable({
		owner : vessel.owner.name1+","+vessel.owner.identityNumber,
	    vessel: vessel
	});
}

function getVesselDetailObservableModel(vessel){
	return kendo.observable({
		vesselId : vessel.vesselId,
		vesselDetail: vessel.vesselDetail
	});
}

var customerAutocompleteDS = null, vesselSizeTypesDS = null, 
	vesselRegTypesDS = null, vesselTypesDS = null, operationTypesDS = null,
	licenceTypesDS = null, countriesDS = null, registryPortsDS = null,
	vesselMakesDS = null, properOfficersDS = null, builderNamesDS = null,
	materialTypesDS = null, propellMethodsDS = null, tonnageTypesDS = null,
	attributeTypesDS = null, agentTypesDS = null,certificateTypesDS = null,
	documentTypesDS = null;
function initializeLookupDataSources(){
	customerAutocompleteDS = new kendo.data.DataSource({
		type: "json",pageSize: 10,
		transport: {read: "/customer/load_autocomplete_customers"}
	});
	
	vesselSizeTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/vesselSizeTypes"}
        }
	});
	
	vesselRegTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/vesselRegTypes"}
        }
	});
	
	vesselTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/vesselTypes"}
        }
	});
	
	operationTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/operationTypes"}
        }
	});
	
	licenceTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/licenceTypes"}
        }
	});
	
	countriesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/countries"}
        }
	});
	
	registryPortsDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/registryPorts"}
        }
	});
	
	vesselMakesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/vesselMakes"}
        }
	});
	
	properOfficersDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/vesselProperOfficers"}
        }
	});
	
	builderNamesDS = new kendo.data.DataSource({
		type: "json",pageSize: 10,
		transport: {read: "/vessels/builders/auto_complete"}
	});
	
	materialTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/materialTypes"}
        }
	}); 
	
	propellMethodsDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/propellMethods"}
        }
	});  
	
	tonnageTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/tonnageTypes"}
        }
	}); 
	
	attributeTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/attributeTypes"}
        }
	}); 
	
	agentTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/agentTypes"}
        }
	});  
	
	certificateTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/certificateTypes"}
        }
	});  
	
	documentTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/documentTypes"}
        }
	});   
}

function searchVessel(searchCriteria){
	var searchBy = $("#vesselSearchBy").data("kendoDropDownList").value();
	reloadKendoGrid("vesselsGrid","/vessels/search/"+searchBy+"/"+searchCriteria,10);
	updateVesselActionBar(false);
}

function showVesselDetail(e){
	var detailRow = e.detailRow;
	var vessel = e.data;
	//initiate tabstrip on a detail
	var tabStrip = detailRow.find(".vesselDetailTabstrip").kendoTabStrip().data("kendoTabStrip");
	
	if(vessel.vesselDetail==null){
		var documentsTab = detailRow.find(".documentsTab");
		var attributesTab = detailRow.find(".attributesTab");
		var operatorsTab = detailRow.find(".operatorsTab");
		tabStrip.remove(documentsTab);
		tabStrip.remove(attributesTab);
		tabStrip.remove(operatorsTab);
	}else{
		var template = kendo.template($("#vesselDetailListViewTemplate").html());
		detailRow.find(".vessel-details").append(template(vessel));
		loadVesselDetailGrids(e);
	}
	
	detailRow.find(".certificatesGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/vessels/load_certificates/"+e.data.vesselId
            },
            paging: true,
            pageSize: 4
        },
        scrollable : false,
		pageable: true,
        selectable : true,
        height: 300,
        toolbar: kendo.template($("#certificatesTemplate").html()),
        columns: [
	          { field: "certificateType.value", title:"Certificate Type"},
	          { field: "mandatory", title:"Is Mandatory"},
	          { field: "issueDate", title:"Issue Date" },
	          { field: "expireDate", title: "Expire Date"},
	          { field: "issuedBy",title: "Issued By"}],
		      change : function(){
		          var row = this.select();
		          var data = this.dataItem(row);
		          currentCertificate = data;
		          detailRow.find(".editCertificateBtn").show();
		      }
        
	});
	
	attachCertificateActionEvents(e);
}

var currentAttribute = null, currentOperator = null, currentCertificate= null, currentDocument = null;
function loadVesselDetailGrids(e){
	var detailRow = e.detailRow;
	
	currentVessel = e.data;
	
	detailRow.find(".attributesGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
            	read: "/vessels/load_attributes/"+e.data.vesselId
            },
            paging: true,
            pageSize: 4
        },
        scrollable : false,
		pageable: true,
        selectable : true,
        height: 200,
        toolbar: kendo.template($("#attributesTemplate").html()),
        columns: [
	          { field: "attributeId", title:"ID #"},
	          { field: "attributeType.value", title:"Information Type"},
	          { field: "attributeName", title:"Information Value" }],
	      change : function(){
	          var row = this.select();
	          var data = this.dataItem(row);
	          currentAttribute = data;
	          detailRow.find(".editAttributeBtn").show();
	      }
        
	});
	
	detailRow.find(".documentsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/documents/load/"+e.data.vesselId
            },
            paging: true,
            pageSize: 4
        },
        scrollable : false,
		pageable: true,
        selectable : true,
        height: 200,
        toolbar: kendo.template($("#vesselDocsTemplate").html()),
        columns: [
	          { field: "documentType.value", title:"Document Type"},
	          { field: "documentUrl", title:"URL",template:'<a href="/dma/vessels/download/'+e.data.vesselId+'/#=documentId#" target="_blank">#= documentUrl #</a>'},
	          { field: "documentRefNo", title:"Doc Ref No." },
	          { field: "documentDate", title: "Doc Date"}],
		      change : function(){
		          var row = this.select();
		          var data = this.dataItem(row);
		          currentDocument = data;
		          detailRow.find(".editDocumentBtn").show();
		      }
        
	});
	
	detailRow.find(".operatorsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/vessels/load_operators/"+e.data.vesselId
            },
            paging: true,
            pageSize: 4
        },
        scrollable : false,
		pageable: true,
        selectable : true,
        height: 300,
        toolbar: kendo.template($("#operatorsTemplate").html()),
        columns: [
	          { field: "agent.name1", title:"Agent"},
	          { field: "agentType.value", title:"Agent Type"},
	          { field: "startDate", title:"Start Date" },
	          { field: "endDate", title: "End Date"},
	          { field: "agentDescr",title: "Agent Description"}],
		      change : function(){
		          var row = this.select();
		          var data = this.dataItem(row);
		          currentOperator = data;
		          detailRow.find(".editOperatorBtn").show();
		      }
        
	});
	
	//bind action events
	if(e.data.deleted){
		detailRow.find(".addNewAttributeBtn,.addNewDocumentBtn,.addNewOperatorBtn")
		.click(function(){
			alert("Selected Vessel is already deleted hence can no longer be edited.");
		});
		detailRow.find(".downloadBtn")
		.click(function(event){
			event.preventDefault();
			alert("Selected Vessel is already deleted hence can no longer print Registry Report.");
		});
	}else{
		attachAttributeActionEvents(e);
		attachOperatorActionEvents(e);
		attachDocumentActionEvents(e);
		detailRow.find(".downloadBtn").attr("href", "/vessels/download/vessel_certificate/"+e.data.vesselId);
	}
}

function attachAttributeActionEvents(e){
	var detailRow = e.detailRow;
	
	var submitAddAttributeHandler = function(evt){
		var form = $("#vessel-attribute-form");
		var formData = getFormData(form);
		formData.vesselId = currentVessel.vesselId;
		sendAjaxPost("/attributes/create",formData,function(data){
			var grid = detailRow.find(".attributesGrid").data("kendoGrid");
			grid.dataSource.read();
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();

	        detailRow.find(".editAttributeBtn").hide();
	    	alert("Vessel Additional Info added successfully.");
		});
	};
	
	var submitEditAttributeHandler = function(evt){
		var form = $("#vessel-attribute-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/attributes/update",formData,function(data){
			var grid = detailRow.find(".attributesGrid").data("kendoGrid");
			grid.dataSource.read();
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        
	        detailRow.find(".editAttributeBtn").hide();
	    	alert("Vessel Additional Info updated successfully.");
		});
	};
	
	detailRow.find(".addNewAttributeBtn").click(function(evt){
		evt.preventDefault();
    	display_popup(
				"vessel-attribute-form",
				"vessel-attribute-form-template",
				null,
				submitAddAttributeHandler,
				"Add Additional Info",
				"410px"
		);
    });
	
	detailRow.find(".editAttributeBtn").click(function(evt){
		evt.preventDefault();
    	var viewModel = kendo.observable({
    		vesselId : currentVessel.vesselId,
    		attribute: currentAttribute
    	});
    	display_popup(
				"vessel-attribute-form",
				"vessel-attribute-form-template",
				viewModel,
				submitEditAttributeHandler,
				"Edit Additional Info",
				"410px"
		);
    });
}


function attachOperatorActionEvents(e){
	var detailRow = e.detailRow;
	
	var submitAddOperatorHandler = function(evt){
		var form = $("#vessel-operator-form");
		var formData = getFormData(form);
		formData.vesselId = currentVessel.vesselId;
		sendAjaxPost("/operators/create",formData,function(data){
			var grid = detailRow.find(".operatorsGrid").data("kendoGrid");
			grid.dataSource.read();
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        
	        detailRow.find(".editOperatorBtn").hide();
	    	alert("Vessel Operator added successfully.");
		});
	};
	
	var submitEditOperatorHandler = function(evt){
		var form = $("#vessel-operator-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/operators/update",formData,function(data){
			var grid = detailRow.find(".operatorsGrid").data("kendoGrid");
			grid.dataSource.read();
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        
	        detailRow.find(".editOperatorBtn").hide();
	    	alert("Vessel Operator updated successfully.");
		});
	};
	
	detailRow.find(".addNewOperatorBtn").click(function(evt){
		evt.preventDefault();
    	display_popup(
				"vessel-operator-form",
				"vessel-operator-form-template",
				null,
				submitAddOperatorHandler,
				"Add Operator",
				"410px"
		);
    });
	
	detailRow.find(".editOperatorBtn").click(function(evt){
		evt.preventDefault();
    	var viewModel = kendo.observable({
    		vesselId : currentVessel.vesselId,
    		operatorAgentName : currentOperator.agent.name1+","+currentOperator.agent.identityNumber,
    		operator: currentOperator
    	});
    	display_popup(
				"vessel-operator-form",
				"vessel-operator-form-template",
				viewModel,
				submitEditOperatorHandler,
				"Edit Operator",
				"410px"
		);
    });
}

function attachCertificateActionEvents(e){
	var detailRow = e.detailRow;
	
	var submitAddCertificateHandler = function(evt){
		var form = $("#vessel-certificate-form");
		var formData = getFormData(form);
		formData.vesselId = currentVessel.vesselId;
		sendAjaxPost("/vessel_certificates/create",formData,function(data){
			var grid = detailRow.find(".certificatesGrid").data("kendoGrid");
			grid.dataSource.read();
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        detailRow.find(".editCertificateBtn").hide();
	    	alert("Vessel Certificate added successfully.");
		});
	};
	
	var submitEditCertificateHandler = function(evt){
		var form = $("#vessel-certificate-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/vessel_certificates/update",formData,function(data){
			var grid = detailRow.find(".certificatesGrid").data("kendoGrid");
			grid.dataSource.read();
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        detailRow.find(".editCertificateBtn").hide();
	    	alert("Vessel Certificate updated successfully.");
		});
	};
	
	detailRow.find(".addNewCertificateBtn").click(function(evt){
		evt.preventDefault();
    	display_popup(
				"vessel-certificate-form",
				"vessel-certificate-form-template",
				null,
				submitAddCertificateHandler,
				"Add Certificate",
				"410px"
		);
    });
	
	detailRow.find(".editCertificateBtn").click(function(evt){
		evt.preventDefault();
    	var viewModel = kendo.observable({
    		vesselId : currentVessel.vesselId,
    		certificate: currentCertificate,
    		isMandatory: currentCertificate.mandatory? "YES":"NO"
    	});
    	display_popup(
				"vessel-certificate-form",
				"vessel-certificate-form-template",
				viewModel,
				submitEditCertificateHandler,
				"Edit Certificate",
				"410px"
		);
    });
}


function attachDocumentActionEvents(e){
	var detailRow = e.detailRow;
	
	var submitAddDocumentHandler = function(evt){
		var form = $("#vessel-document-form");
		var formData = getFormData(form);
		formData.vesselId = currentVessel.vesselId;
		$("#documentUrl").data("kendoUpload").bind
		var kendoUploadButton = $(".k-upload-selected");
    	if (kendoUploadButton)
    		kendoUploadButton.click();
    	
	};
	
	var submitEditDocumentHandler = function(evt){
		var form = $("#vessel-document-form");
		var formData = getFormData(form);
		
		var kendoUploadButton = $(".k-upload-selected");
    	if (kendoUploadButton)
    		kendoUploadButton.click();
    	
	};
	
	detailRow.find(".addNewDocumentBtn").click(function(evt){
		evt.preventDefault();
    	display_popup(
				"vessel-document-form",
				"vessel-document-form-template",
				null,
				submitAddDocumentHandler,
				"Add Document",
				"410px"
		);
    	initVesselDocumentUploadWidget(true,function(event){
    		var grid = detailRow.find(".documentsGrid").data("kendoGrid");
			grid.dataSource.read();
			var form = $("#vessel-document-form");
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        $("#current-form-window").data("kendoWindow").destroy();
	        detailRow.find(".editDocumentBtn").hide();
	    	alert("Vessel Document uploaded successfully.");
    	});
    });
	
	detailRow.find(".editDocumentBtn").click(function(evt){
		evt.preventDefault();
    	var viewModel = kendo.observable({
    		vesselId : currentVessel.vesselId,
    		document: currentDocument
    	});
    	display_popup(
				"vessel-document-form",
				"vessel-document-form-template",
				viewModel,
				submitEditDocumentHandler,
				"Edit Document",
				"410px"
		);
    	initVesselDocumentUploadWidget(false,function(event){
    		var grid = detailRow.find(".documentsGrid").data("kendoGrid");
			grid.dataSource.read();
			var form = $("#vessel-document-form");
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        $("#current-form-window").data("kendoWindow").destroy();
	        detailRow.find(".editDocumentBtn").hide();
	    	alert("Vessel Document updated successfully.");
    	});
    });
}

function initVesselDocumentUploadWidget(addnew,successHandler){
	var files = addnew?[]:[{name:currentDocument.documentUrl, size:500,type:".pdf"}];
	
	$("#documentUrl").kendoUpload({
        async: {
            saveUrl: "/vessels/upload_doc_file/"+currentVessel.vesselId,
            removeUrl: "/vessels/unupload_doc_file/"+currentVessel.vesselId,
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
        	var form = $("#vessel-document-form");
    		var formData = getFormData(form);
    		formData.documentId = addnew? 0:currentDocument.documentId;
    		console.log("Upload form Data :"+kendo.stringify(formData));
    		e.data = formData;
        },
        error : function(e){
        	alert("Fail to save : Internal Error");
        },
        complete : successHandler,
        
        files:files
    });
}

function showVesselFullDetails(e){
	var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
	
	window.open(
			"/vessel/display/"+dataItem.vesselId,
			"_blank" // <- This is what makes it open in a new window.
	);
}
