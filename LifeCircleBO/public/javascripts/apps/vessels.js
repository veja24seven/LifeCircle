/**
 * Created with IntelliJ IDEA.
 * User: Harry
 * Date: 2013/10/19
 * Time: 10:31 PM
 * To change this template use File | Settings | File Templates.
 */

function init (){

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
            if(!currentVessel.deleted)
            	$("#editVesselBtn").show();
            else
            	$("#editVesselBtn").hide();
        }
    });
    
    $("#editVesselBtn").click(function(e){
    	showEditVesselForm(currentVessel);
        e.preventDefault();
    });
}

function searchVessel(value){
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/vessels/search/"+value // the remote service url - Twitter API v1.1
            }
        },
        pageSize: 4
    });

    $("#vesselsGrid").data("kendoGrid").setDataSource(dataSource);
    dataSource.read();
    
    $("#editVesselBtn").hide();
}

function saveVessel(formData){
    $.ajax({
        url : "/vessels/create",
        type : "POST",
        contentType : "application/json",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function (data){
            console.log(JSON.stringify(data));
            
            if (data.status==="Success"){
            	searchVessel(formData.vesselName);
            	$("#vesselSearch").text(formData.vesselName);
            	$("#addNewVesselForm")[0].reset();
                $("#addNewVessel").data("kendoWindow").close();
            	alert("Vessel created successfully.");
            }else{
            	//searchVessel(formData.vesselName);
            	//$("#vesselSearch").text(formData.vesselName);
            	alert(data.message);
            }

        },
        error : function (){
            alert("Fail to save : Internal Error");
        }
    });
}

var vesselFormAdded = false;

function addNewRecord (){
	
	if(vesselFormAdded){
		$("#addNewVessel").data("kendoWindow").open();
	    $("#addNewVessel").data("kendoWindow").center();
	    return;
	}
	
	vesselFormAdded = true;
	
    $("#addNewVessel").kendoWindow({
        title: "Add New Vessel",
        actions: ["Close"]
    });

    //$("#company").val(currentOwner.companyId);

    $("#vesselType").kendoDropDownList({
        dataTextField: "value",
        dataValueField: "variableId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lookup/vesselTypes"
                }
            }
        }
    });
    
    $("#vesselRegDate").kendoDatePicker({
    	format: "yyyy-MM-dd"
    });
    
    $("#approvalDate").kendoDatePicker({
    	format: "yyyy-MM-dd"
    });
    

    $("#vesselFlagState").kendoDropDownList({
        dataTextField: "name",
        dataValueField: "countryId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lookup/countries"
                }
            }
        },
        index: 0
    });
    
    $("#countryBuild").kendoDropDownList({
        dataTextField: "name",
        dataValueField: "countryId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lookup/countries"
                }
            }
        },
        index: 0
    });
    
    $("#vesselRegType").kendoDropDownList({
        dataTextField: "value",
        dataValueField: "variableId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lookup/vesselRegTypes"
                }
            }
        },
        select : function (e){
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
    });
    

    $("#registryPort").kendoDropDownList({
        dataTextField: "description",
        dataValueField: "registryPortId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lookup/registryPorts"
                }
            }
        },
        index: 0
    });
    
    $("#builderName").kendoAutoComplete({
        dataTextField: "builderName",
        filter: "contains",
        minLength: 3,
        dataSource: {
            type: "json",
            pageSize: 10,
            transport: {
                read: "/vessels/builders/auto_complete"
            }
        }
    });
    
    $("#materialType").kendoDropDownList({
        dataTextField: "value",
        dataValueField: "variableId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lookup/materialTypes"
                }
            }
        }
    });
    
    $("#vesselMake").kendoDropDownList({
        dataTextField: "value",
        dataValueField: "variableId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lookup/vesselMakes"
                }
            }
        }
    });
    
    $("#operationType").kendoDropDownList({
        dataTextField: "value",
        dataValueField: "variableId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lookup/operationTypes"
                }
            }
        }
    });
    
    $("#propellMethod").kendoDropDownList({
        dataTextField: "value",
        dataValueField: "variableId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lookup/propellMethods"
                }
            }
        }
    });
    
    $("#tonnageType").kendoDropDownList({
        dataTextField: "value",
        dataValueField: "variableId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lookup/tonnageTypes"
                }
            }
        }
    });
    
    $("#licenceType").kendoDropDownList({
        dataTextField: "value",
        dataValueField: "variableId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lookup/licenceTypes"
                }
            }
        }
    });
    
    $("#approvalStatus").kendoDropDownList({
        dataTextField: "value",
        dataValueField: "variableId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lookup/approvalStatuses"
                }
            }
        }
    });
    
    $("#owner").kendoAutoComplete({
        dataTextField: "name1",
        filter: "contains",
        minLength: 3,
        dataSource: {
            type: "json",
            pageSize: 10,
            transport: {
                read: "/customer/load_autocomplete_customers"
            }
        }
    });
    
    $("#vesselLength").kendoNumericTextBox({
    	format: "#.00 m"
    });

    $("#vesselWidth").kendoNumericTextBox({
    	format: "#.00 m"
    });
    
    $("#vesselDepth").kendoNumericTextBox({
    	format: "#.00 m"
    });
    
    $("#grossTonnage").kendoNumericTextBox({
        decimals: 3,format: "#.00 t"
    });
    
    $("#netTonnage").kendoNumericTextBox({
        decimals: 3,format: "#.00 t"
    });
    
    $("#noOfDecks").kendoNumericTextBox();
    

    $("#noOfBulkHeads").kendoNumericTextBox();

    $("#noOfEngines").kendoNumericTextBox();
    

    $("#cylinderPerEngine").kendoNumericTextBox();

    $("#addNewVessel").data("kendoWindow").open();
    $("#addNewVessel").data("kendoWindow").center();

    $("#cancelAddNewVessel").click(function(e){
        $("#addNewVesselForm")[0].reset();
        $("#addNewVessel").data("kendoWindow").close();

    });

    $("#addNewVesselForm").submit(function(e){
        var validator = $("#addNewVesselForm").kendoValidator().data("kendoValidator");
        if (validator.validate()){
            var data = getFormData($("#addNewVesselForm"));
            saveVessel(data);
        }
        e.preventDefault();
    });

}

var vesselAttributeFormAdded = false;

function addNewAttributeRecord(vesselId,detailRow){
	$("#attributeVessel").val(vesselId);
	
	if(vesselAttributeFormAdded){
		$("#addNewAttribute").data("kendoWindow").open();
	    $("#addNewAttribute").data("kendoWindow").center();
	    return;
	}
	
	vesselAttributeFormAdded = true;
	
	$("#addNewAttribute").kendoWindow({
        title: "Add New Vessel Attribute",
        actions: ["Close"]
    });
	
	$("#vesselAttributeType").kendoDropDownList({
        dataTextField: "value",
        dataValueField: "variableId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lookup/attributeTypes"
                }
            }
        },
        index: 0
    });
	
	$("#addNewAttribute").data("kendoWindow").open();
    $("#addNewAttribute").data("kendoWindow").center();

    $("#cancelAddNewAttribute").click(function(e){
        $("#addNewAttributeForm")[0].reset();
        $("#addNewAttribute").data("kendoWindow").close();

    });

    $("#addNewAttributeForm").submit(function(e){
        var validator = $("#addNewAttributeForm").kendoValidator().data("kendoValidator");
        if (validator.validate()){
            var data = getFormData($("#addNewAttributeForm"));
            
            saveAttribute(data,detailRow);
        }
        e.preventDefault();
    });
}

var vesselDocFormAdded = false;
function addNewVesselDocumentRecord (vesselId,detailRow){
	$("#documentVessel").val(vesselId);
	if(vesselDocFormAdded){
		$("#addNewVesselDoc").data("kendoWindow").open();
	    $("#addNewVesselDoc").data("kendoWindow").center();
	    return;
	}
	
	vesselDocFormAdded = true;
	
    $("#addNewVesselDoc").kendoWindow({
        title: "Add New Vessel Document",
        actions: ["Close"]
    });
    
    $("#documentType").kendoDropDownList({
        dataTextField: "value",
        dataValueField: "variableId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lookup/documentTypes"
                }
            }
        },
        index: 0
    });
    
    $("#documentUrl").kendoUpload({
        async: {
            saveUrl: "/vessels/upload_doc_file/"+vesselId,
            removeUrl: "/vessels/unupload_doc_file/"+vesselId,
            autoUpload: false
        },
        multiple: false,
        select: function (e){
        	setTimeout(function () {
                var kendoUploadButton = $(".k-upload-selected");
                kendoUploadButton.hide();
            }, 1);
        }
    });

    $("#addNewVesselDoc").data("kendoWindow").open();
    $("#addNewVesselDoc").data("kendoWindow").center();

    $("#cancelAddNewVesselDoc").click(function(e){
        $("#addNewVesselDocForm")[0].reset();
        $("#addNewVesselDoc").data("kendoWindow").close();

    });

    $("#addNewVesselDocForm").submit(function(e){
        var validator = $("#addNewVesselDocForm").kendoValidator().data("kendoValidator");
        if (validator.validate()){
        	var kendoUploadButton = $(".k-upload-selected");
        	if (kendoUploadButton)
        		kendoUploadButton.click();
            var data = getFormData($("#addNewVesselDocForm"));

            saveVesselDoc(data,detailRow);
        }
        e.preventDefault();
    });

}

var vesselOperatorFormAdded = false;
function addNewOperatorRecord (vesselId,detailRow){
	$("#operatorVessel").val(vesselId);
	
	if(vesselOperatorFormAdded){
		
		$("#addNewOperator").data("kendoWindow").open();
	    $("#addNewOperator").data("kendoWindow").center();
	    return;
	}
	
	vesselOperatorFormAdded = true;
	
    $("#addNewOperator").kendoWindow({
        title: "Add New Operator/Agent",
        actions: ["Close"]
    });
    
    $("#agent").kendoAutoComplete({
        dataTextField: "name1",
        filter: "contains",
        minLength: 3,
        dataSource: {
            type: "json",
            pageSize: 10,
            transport: {
                read: "/customer/load_autocomplete_customers"
            }
        }
    });

    $("#agentType").kendoDropDownList({
        dataTextField: "value",
        dataValueField: "variableId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lookup/agentTypes"
                }
            }
        },
        index: 0
    });
    
    $("#startDate").kendoDatePicker({
    	format: "yyyy-MM-dd"
    });
    

    $("#endDate").kendoDatePicker({
    	format: "yyyy-MM-dd"
    });

    $("#addNewOperator").data("kendoWindow").open();
    $("#addNewOperator").data("kendoWindow").center();

    $("#cancelAddNewOperator").click(function(e){
        $("#addNewOperatorForm")[0].reset();
        $("#addNewOperator").data("kendoWindow").close();

    });

    $("#addNewOperatorForm").submit(function(e){
        var validator = $("#addNewOperatorForm").kendoValidator().data("kendoValidator");
        if (validator.validate()){
            var data = getFormData($("#addNewOperatorForm"));

            saveVesselOperator(data,detailRow);
        }
        e.preventDefault();
    });

}

var vesselCertificateFormAdded = false;
function addNewCertificateRecord (vesselId,detailRow){
	$("#certificateVessel").val(vesselId);
	if(vesselCertificateFormAdded){
		$("#addNewCertificate").data("kendoWindow").open();
	    $("#addNewCertificate").data("kendoWindow").center();
	    return;
	}
	
	vesselCertificateFormAdded = true;
	
    $("#addNewCertificate").kendoWindow({
        title: "Add New Mandatory Certificate",
        actions: ["Close"]
    });
    
    $("#certificateType").kendoDropDownList({
        dataTextField: "value",
        dataValueField: "variableId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lookup/certificateTypes"
                }
            }
        },
        index: 0
    });
    
    $("#mandatory").kendoDropDownList({
        dataTextField: "type",
        dataValueField: "type",
        optionLabel: "-Please Select-",
        dataSource: [{type:"Yes"},{type:"No"}],
        index: 0
    });
    
    $("#addNewCertificate").data("kendoWindow").open();
    $("#addNewCertificate").data("kendoWindow").center();

    $("#cancelAddNewCertificate").click(function(e){
        $("#addNewCertificateForm")[0].reset();
        $("#addNewCertificate").data("kendoWindow").close();

    });

    $("#addNewCertificateForm").submit(function(e){
        var validator = $("#addNewCertificateForm").kendoValidator().data("kendoValidator");
        if (validator.validate()){
            var data = getFormData($("#addNewCertificateForm"));
            saveVesselCertificate(data,detailRow);
        }
        e.preventDefault();
    });

}

function saveAttribute(formData,detailRow){
    $.ajax({
        url : "/attributes/create",
        type : "POST",
        contentType : "application/json",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function (data){
            console.log(JSON.stringify(data));
            var grid = detailRow.find(".attributesGrid").data("kendoGrid");
            if (data.status==="Success"){
            	$("#addNewAttributeForm")[0].reset();
                $("#addNewAttribute").data("kendoWindow").close();
                grid.dataSource.read();
            }else{
                grid.dataSource.read();
                alert("Fail to save :"+data.message);
            }

        },
        error : function (){
            alert("Fail to save : Internal Error");
        }

    });
}

function saveVesselDoc(formData,detailRow){
    $.ajax({
        url : "/documents/create",
        type : "POST",
        contentType : "application/json",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function (data){
            console.log(JSON.stringify(data));
            var grid = detailRow.find(".documentsGrid").data("kendoGrid");
            if (data.status==="Success"){
            	$("#addNewVesselDocForm")[0].reset();
                $("#addNewVesselDoc").data("kendoWindow").close();
                grid.dataSource.read();
            }else{
                grid.dataSource.read();
                alert("Fail to save :"+data.message);
            }

        },
        error : function (){
            alert("Fail to save : Internal Error");
        }

    });
}

function saveVesselCertificate(formData,detailRow){
	$.ajax({
        url : "/vessel_certificates/create",
        type : "POST",
        contentType : "application/json",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function (data){
            console.log(JSON.stringify(data));
            var grid = detailRow.find(".certificatesGrid").data("kendoGrid");
            if (data.status==="Success"){
            	$("#addNewCertificateForm")[0].reset();
                $("#addNewCertificate").data("kendoWindow").close();
                grid.dataSource.read();
            }else{
                grid.dataSource.read();
                alert("Fail to save :"+data.message);
            }

        },
        error : function (){
            alert("Fail to save : Internal Error");
        }

    });
}

function saveVesselOperator(formData,detailRow){
    $.ajax({
        url : "/operators/create",
        type : "POST",
        contentType : "application/json",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function (data){
            console.log(JSON.stringify(data));
            var grid = detailRow.find(".operatorsGrid").data("kendoGrid");
            if (data.status==="Success"){
            	$("#addNewOperatorForm")[0].reset();
                $("#addNewOperator").data("kendoWindow").close();
                grid.dataSource.read();
            }else{
                grid.dataSource.read();
                alert("Fail to save :"+data.message);
            }

        },
        error : function (){
            alert("Fail to save : Internal Error");
        }
    });
}

function showVesselDetail(e){
	var detailRow = e.detailRow;
	
	//initiate tabstrip on a detail
	detailRow.find(".vesselDetailTabstrip").kendoTabStrip();
	
	//initiate grids
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
	          { field: "attributeType.value", title:"Attribute Type"},
	          { field: "attributeName", title:"Name" }]
        
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
	          { field: "documentUrl", title:"URL",template:'<a href="/dma/vessels/download/'+e.data.vesselId+'/#=documentUrl#" target="_blank">#= documentUrl #</a>'},
	          { field: "documentRefNo", title:"Doc Ref No." },
	          { field: "documentDate", title: "Doc Date"}]
        
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
	          { field: "agentDescr",title: "Agent Description"}]
        
	});

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
	          { field: "issuedBy",title: "Issued By"}]
        
	});
	//bind action events
	if(!e.data.deleted){
		detailRow.find(".addNewAttributeBtn").click(function(evt){
			addNewAttributeRecord(e.data.vesselId,detailRow);
	        evt.preventDefault();
	    });
		detailRow.find(".addNewVesselDocBtn").click(function(evt){
			addNewVesselDocumentRecord(e.data.vesselId,detailRow);
	        evt.preventDefault();
	    });
		detailRow.find(".addNewOperatorBtn").click(function(evt){
			addNewOperatorRecord(e.data.vesselId,detailRow);
	        evt.preventDefault();
	    });
		detailRow.find(".addNewCertificateBtn").click(function(evt){
			addNewCertificateRecord(e.data.vesselId,detailRow);
	        evt.preventDefault();
	    });
		detailRow.find(".downloadBtn").attr("href", "/vessels/download/vessel_certificate/"+e.data.vesselId);
	}else{
		
		detailRow.find(".addNewAttributeBtn,.addNewVesselDocBtn,.addNewOperatorBtn,.addNewCertificateBtn")
		.click(function(){
			alert("Selected Vessel is deleted and can no longer be edited.");
		});
	}
}

function showVesselFullDetails(e){
var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
	
	var wnd = $("<div/>")
    .kendoWindow({
        title: "Vessel Details",
        modal: true,
        visible: false,
        resizable: false,
        width: '900px',
        actions: ["Close","Maximize"]
    }).data("kendoWindow");
    var detailsTemplate = kendo.template($("#vesselDetailDisplayTemplate").html());
	wnd.bind("close",function(e){
		wnd.destroy();
	});
	
	wnd.content(detailsTemplate(dataItem));
    appentDetailTableWithExtraData(dataItem);
    wnd.center().open();
}

function appentDetailTableWithExtraData(dataItem){
	var divContainer = $("#vesselDetailDisplayContainer");
	
	var tableStr = "<table class='detail-table'><tbody>";
	$.ajax({
        url : "/vessels/load_attributes/"+dataItem.vesselId,
        type : "GET",
        dataType : "json",
        success : function (data){
        	
        	if (data!=null && data.length>0){
        		var thTitle = "<tr><th colspan='4'>Additional Info</th></tr>"
        		$.each(data, function(i, item) {
        			thTitle += "<tr><td><h4>Info Type</h4></td>";
        			thTitle += "<td><label>"+item.attributeType.value+"</label></td>";
        			thTitle += "<td><h4>Info Value</h4></td>";
        			thTitle += "<td><label>"+item.attributeName+"</label></td></tr>";
        		});
        		tableStr += thTitle+"</tbody></table>";
        		divContainer.append(tableStr);
        	}
        }
    });
	
	tableStr = "<table class='detail-table'><tbody>";
	if (dataItem.documents!=null && dataItem.documents.length>0){
		var thTitle = "<tr><th colspan='4'>Vessel Documents</th></tr>"
		$.each(dataItem.documents, function(i, item) {
			thTitle += "<tr><td><h4>Document Type</h4></td>";
			thTitle += "<td><label>"+item.documentType.value+"</label></td>";
			thTitle += "<td><h4>Document URL</h4></td>";
			thTitle += "<td><label><a href='/dma/customers/download/"+dataItem.customerId+"/"+item.documentUrl+"'>"+item.documentUrl+"</a></label></td></tr>";
		});
		tableStr += thTitle+"</tbody></table>";
		divContainer.append(tableStr);
	}
	
	tableStr = "<table class='detail-table'><tbody>";
	$.ajax({
        url : "/vessels/load_certificates/"+dataItem.vesselId,
        type : "GET",
        dataType : "json",
        success : function (data){
        	
        	if (data!=null && data.length>0){
        		var thTitle = "<tr><th colspan='6'>Mandatory Certificates</th></tr>"
        		$.each(data, function(i, item) {
        			thTitle += "<tr><td><h4>Certificate Type</h4></td>";
        			thTitle += "<td><label>"+item.certificateType.value+"</label></td>";
        			thTitle += "<td><h4>Issue Date</h4></td>";
        			thTitle += "<td><label>"+item.issueDate+"</label></td>";
        			thTitle += "<td><h4>Expire Date</h4></td>";
        			thTitle += "<td><label>"+item.expireDate+"</label></td></tr>";
        		});
        		tableStr += thTitle+"</tbody></table>";
        		divContainer.append(tableStr);
        	}
        }
    });
	
	tableStr = "<table class='detail-table'><tbody>";
	$.ajax({
        url : "/vessels/load_operators/"+dataItem.vesselId,
        type : "GET",
        dataType : "json",
        success : function (data){
        	
        	if (data!=null && data.length>0){
        		var thTitle = "<tr><th colspan='6'>Vessel Operators</th></tr>"
        		$.each(data, function(i, item) {
        			thTitle += "<tr><td><h4>Operator</h4></td>";
        			thTitle += "<td><label>"+item.agent.name1+" "+item.agent.name2+"</label></td>";
        			thTitle += "<td><h4>Agent Type</h4></td>";
        			thTitle += "<td><label>"+item.agentType.value+"</label></td>";
        			thTitle += "<td><h4>Description</h4></td>";
        			thTitle += "<td><label>"+item.agentDescr+"</label></td></tr>";
        		});
        		tableStr += thTitle+"</tbody></table>";
        		divContainer.append(tableStr);
        	}
        }
    });
}