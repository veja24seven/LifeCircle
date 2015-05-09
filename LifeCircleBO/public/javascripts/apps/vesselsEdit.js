var vesselEditFormAdded = false;
function showEditVesselForm (dataItem) {
	$("#vesselId").val(currentVessel.vesselId);
	
	if(vesselEditFormAdded){
		$("#editVessel").data("kendoWindow").open();
	    $("#editVessel").data("kendoWindow").center();
	    fillVesselForm (dataItem);
	    return;
	}
	
	vesselEditFormAdded = true;
	
    $("#editVessel").kendoWindow({
        title: "Edit Vessel",
        actions: ["Close"]
    });

    $("#vesselTypeEdit").kendoDropDownList({
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
        },
        value: dataItem.vesselType.variableId
    });
    
    $("#vesselRegDateEdit").kendoDatePicker({
    	format: "yyyy-MM-dd"
    });
    
    $("#approvalDateEdit").kendoDatePicker({
    	format: "yyyy-MM-dd"
    });
    

    $("#vesselFlagStateEdit").kendoDropDownList({
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
        value: dataItem.flagState.countryId
    });
    
    $("#vesselRegTypeEdit").kendoDropDownList({
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
        value: dataItem.regType.variableId,
        select : function (e){
        	var item = this.dataItem(e.item.index());
        	if (dataItem.value==="FLAG STATE"){
        		console.log("REG STATE SELECTED "+item.value);
            	
            	var dropdownlist = $("#vesselFlagStateEdit").data("kendoDropDownList");
            	dropdownlist.select(1);
            	dropdownlist.readonly();
            	var dataSource = $("#registryPortEdit").data("kendoDropDownList").dataSource;
            	dataSource.filter( { field: "countryCode", operator: "eq", value: "na" });
            	$("#registryPortEdit").data("kendoDropDownList").refresh();
            	$("#vesselFlagStateEdit").data("kendoDropDownList").refresh();
            	
        	}else{

        		console.log("REG STATE SELECTED "+item.value);
        		var dropdownlist = $("#vesselFlagStateEdit").data("kendoDropDownList");
        		dropdownlist.select(dataitem.flagState.countryId);
            	dropdownlist.readonly(false);
            	var dataSource = $("#registryPortEdit").data("kendoDropDownList").dataSource;
            	dataSource.filter([]);
            	$("#registryPortEdit").data("kendoDropDownList").refresh();
            	$("#vesselFlagStateEdit").data("kendoDropDownList").refresh();
        	}
        }
    });
    

    $("#registryPortEdit").kendoDropDownList({
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
        value: dataItem.regPort.registryPortId
    });
    
    $("#builderNameEdit").kendoAutoComplete({
        dataTextField: "builderName",
        filter: "contains",
        minLength: 3,
        dataSource: {
            type: "json",
            pageSize: 10,
            transport: {
                read: "/vessels/builders/auto_complete"
            }
        },
        value : dataItem.builderName
    });
    
    $("#materialTypeEdit").kendoDropDownList({
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
        },
        value: dataItem.materialType.variableId
    });
    
    $("#vesselMakeEdit").kendoDropDownList({
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
        },
        value: dataItem.make.variableId
    });
    
    $("#countryBuildEdit").kendoDropDownList({
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
        value: dataItem.countryBuild.countryId
    });
    
    $("#operationTypeEdit").kendoDropDownList({
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
        },
        value: dataItem.operationType.variableId
    });
    
    $("#propellMethodEdit").kendoDropDownList({
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
        },
        value: dataItem.propellMethod.variableId
    });
    
    $("#tonnageTypeEdit").kendoDropDownList({
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
        },
        value: dataItem.tonnageType.variableId
    });
    
    $("#licenceTypeEdit").kendoDropDownList({
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
        },
        value: dataItem.licenceType.variableId
    });
    
    $("#approvalStatusEdit").kendoDropDownList({
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
        },
        value: dataItem.approvalStatus.variableId
    });
    
    $("#ownerEdit").kendoAutoComplete({
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
    
    $("#vesselLengthEdit").kendoNumericTextBox({
    	format: "#.00 m"
    });

    $("#vesselWidthEdit").kendoNumericTextBox({
    	format: "#.00 m"
    });
    
    $("#vesselDepthEdit").kendoNumericTextBox({
    	format: "#.00 m"
    });
    
    $("#grossTonnageEdit").kendoNumericTextBox({
        decimals: 3,format: "#.00 t"
    });
    
    $("#netTonnageEdit").kendoNumericTextBox({
        decimals: 3,format: "#.00 t"
    });
    
    $("#noOfDecksEdit").kendoNumericTextBox();
    

    $("#noOfBulkHeadsEdit").kendoNumericTextBox();

    $("#noOfEnginesEdit").kendoNumericTextBox();
    

    $("#cylinderPerEngineEdit").kendoNumericTextBox();

    $("#editVessel").data("kendoWindow").open();
    $("#editVessel").data("kendoWindow").center();
    
    fillVesselForm (dataItem);
    
    $("#cancelEditVessel").click(function(e){
        $("#editVesselForm")[0].reset();
        $("#editVessel").data("kendoWindow").close();

    });

    $("#editVesselForm").submit(function(e){
        var validator = $("#editVesselForm").kendoValidator().data("kendoValidator");
        if (validator.validate()){
            var data = getFormData($("#editVesselForm"));
            updateVessel(data);
        }
        e.preventDefault();
    });
}

//-------FILL METHODS
function fillVesselForm (data){
	$("#vesselId").val(data.vesselId);
	$("#ownerEdit").data("kendoAutoComplete").value(data.owner.name1+", "+data.owner.identityNumber);
	$("#builderNameEdit").data("kendoAutoComplete").value(data.builderName);
	$("#vesselNameEdit").val(data.vesselName);
	$("#vesselRegNoEdit").val(data.regNo);
	$("#vesselRegDateEdit").data("kendoDatePicker").value(kendo.parseDate(data.regDate, "yyyy-MM-dd"));
	$("#vesselRegTypeEdit").data("kendoDropDownList").search(data.regType.value);
	$("#vesselTypeEdit").data("kendoDropDownList").search(data.vesselType.value);
	$("#vesselFlagStateEdit").data("kendoDropDownList").search(data.flagState.name);
	$("#registryPortEdit").data("kendoDropDownList").search(data.regPort.description);
	$("#licenceTypeEdit").data("kendoDropDownList").search(data.licenceType.value);
	$("#vesselLengthEdit").data("kendoNumericTextBox").value(data.length);
	$("#vesselWidthEdit").data("kendoNumericTextBox").value(data.width);
	$("#vesselDepthEdit").data("kendoNumericTextBox").value(data.depth);
	$("#callSignEdit").val(data.callSign);
	$("#imoNoEdit").val(data.imoNo);
	$("#yearBuildEdit").val(data.yearBuild);
	$("#placeBuildEdit").val(data.placeBuild);
	$("#materialTypeEdit").data("kendoDropDownList").search(data.materialType.value);
	$("#vesselMakeEdit").data("kendoDropDownList").search(data.make.value);
	$("#vesselModelEdit").val(data.model);
	$("#operationTypeEdit").data("kendoDropDownList").search(data.operationType.value);
	$("#propellMethodEdit").data("kendoDropDownList").search(data.propellMethod.value);
	$("#noOfDecksEdit").data("kendoNumericTextBox").value(data.noOfDecks);
	$("#noOfBulkHeadsEdit").data("kendoNumericTextBox").value(data.noOfBulkHeads);
	$("#tonnageTypeEdit").data("kendoDropDownList").search(data.tonnageType.value);
	$("#grossTonnageEdit").data("kendoNumericTextBox").value(data.grossTonnage);
	$("#netTonnageEdit").data("kendoNumericTextBox").value(data.netTonnage);
	$("#driveTypeEdit").val(data.driveType);
	$("#boreAndStrokeEdit").val(data.boreAndStroke);
	$("#noOfEnginesEdit").data("kendoNumericTextBox").value(data.noOfEngines);
	$("#cylinderPerEngineEdit").data("kendoNumericTextBox").value(data.cylinderPerEngine);
	
}

//------ AJAX Calls
function updateVessel (formData){
	$.ajax({
        url : "/vessels/update",
        type : "POST",
        contentType : "application/json",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function (data){
            console.log(JSON.stringify(data));
            
            if (data.status==="Success"){
            	$("#editVesselForm")[0].reset();
                $("#editVessel").data("kendoWindow").close();
            	searchVessel(formData.vesselName);
            	$("#vesselSearch").text(formData.vesselName);
            }else{
            	searchVessel(formData.vesselName);
            	$("#vesselSearch").text(formData.vesselName);
            }

        },
        error : function (){
            alert("Fail to save : Internal Error");
        }
    });
}