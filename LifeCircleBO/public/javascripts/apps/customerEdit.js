
///----------------EDIT SUPPORT
var editPersonFormAdded = false;
function showEditCustomerPersonForm(dataItem){
	if(editPersonFormAdded){
		$("#editPersonCustomer").data("kendoWindow").open();
	    $("#editPersonCustomer").data("kendoWindow").center();
	    fillCustomerPersonForm(dataItem);
	    return;
	}
	
	editPersonFormAdded = true;
	
	$("#editPersonCustomer").kendoWindow({
        title: "Edit Person Customer",
        actions: ["Close"]
    });
	
	$("#nationalityEdit").kendoDropDownList({
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
        index: dataItem.nationality.countryId
    });
	
	$("#genderEdit").kendoDropDownList({
        dataTextField: "type",
        dataValueField: "type",
        optionLabel: "-Please Select-",
        dataSource: [{type:"Male"},{type:"Female"}],
        index: 0
    });
	
	$("#idNumberTypeEdit").kendoDropDownList({
		dataTextField: "type",
        dataValueField: "type",
		optionLabel: "-Please Select-",
		dataSource: [{type:"Identity"},{type:"Passport"}],
		index: 0
	});
	
	$("#personIsActiveEdit").kendoDropDownList({
		dataTextField: "type",
        dataValueField: "type",
		optionLabel: "-Please Select-",
		dataSource: [{type:"Active"},{type:"Not Active"}],
		index: 0
	});
	
	var maxDate = new Date();
	maxDate.setYear(maxDate.getYear()-18);
	
	var minDate = new Date();
	minDate.setYear(minDate.getYear()-70);
	
    $("#dobEdit").kendoDatePicker({
    	format: "yyyy-MM-dd",
    	max: maxDate,
        min: minDate
    });

    $("#editPersonCustomer").data("kendoWindow").open();
    $("#editPersonCustomer").data("kendoWindow").center();

    fillCustomerPersonForm(dataItem);
    
    $("#cancelEditPersonCustomer").click(function(e){
        $("#editPersonCustomerForm")[0].reset();
        $("#editPersonCustomer").data("kendoWindow").close();

    });

    $("#editPersonCustomerForm").submit(function(e){
        var validator = $("#editPersonCustomerForm").kendoValidator().data("kendoValidator");
        if (validator.validate()){
            var data = getFormData($("#editPersonCustomerForm"));
            $("#editPersonCustomerForm")[0].reset();
            $("#editPersonCustomer").data("kendoWindow").close();
            updateCustomer(data,"person");
        }
        e.preventDefault();
    });
}

var editCompanyFormAdded = false;
function showEditCustomerCompanyForm(dataItem){
	
	if(editCompanyFormAdded){
		$("#editCompanyCustomer").data("kendoWindow").open();
	    $("#editCompanyCustomer").data("kendoWindow").center();
	    fillCustomerCompanyForm(dataItem);
	    return;
	}
	
	editCompanyFormAdded = true;
	
	$("#editCompanyCustomer").kendoWindow({
        title: "Edit Company Customer",
        actions: ["Close"]
    });
	
	$("#countryRegisteredEdit").kendoDropDownList({
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
        index: dataItem.nationality.countryId
    });
	
	$("#companyIsActiveEdit").kendoDropDownList({
		dataTextField: "type",
        dataValueField: "type",
		optionLabel: "-Please Select-",
		dataSource: [{type:"Active"},{type:"Not Active"}],
		index: 0
	});

    $("#companyRegDateEdit").kendoDatePicker({
    	format: "yyyy-MM-dd"
    });

    $("#editCompanyCustomer").data("kendoWindow").open();
    $("#editCompanyCustomer").data("kendoWindow").center();
    fillCustomerCompanyForm(dataItem);
    
    $("#cancelEditCompanyCustomer").click(function(e){
        $("#editCompanyCustomerForm")[0].reset();
        $("#editCompanyCustomer").data("kendoWindow").close();

    });

    $("#editCompanyCustomerForm").submit(function(e){
        var validator = $("#editCompanyCustomerForm").kendoValidator().data("kendoValidator");
        if (validator.validate()){
            var data = getFormData($("#editCompanyCustomerForm"));
            $("#editCompanyCustomerForm")[0].reset();
            $("#editCompanyCustomer").data("kendoWindow").close();
            updateCustomer(data,"company");
        }
        e.preventDefault();
    });
}

var editContactFormAdded = false;
function showEditCustomerContactForm(dataItem,detailRow){
	
	if(editContactFormAdded){
		$("#editCustomerContactContainer").data("kendoWindow").open();
	    $("#editCustomerContactContainer").data("kendoWindow").center();
	    fillCustomerContactForm(dataItem);
	    return;
	}
	
	editContactFormAdded = true;
	
	$("#editCustomerContactContainer").kendoWindow({
        title: "Edit Customer Contact",
        actions: ["Close"]
    });
	
	$("#contactTypeEdit").kendoDropDownList({
        dataTextField: "value",
        dataValueField: "variableId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lookup/contactTypes"
                }
            }
        },
        value: dataItem.contactType.variableId
    });
	
	
	var contactTypeChangeHandler = function (e){
		console.log("Type selected >>"+this.value);
	}
	
	$("#contactTypeEdit").data("kendoDropDownList").bind("change",contactTypeChangeHandler);

    $("#editCustomerContactContainer").data("kendoWindow").open();
    $("#editCustomerContactContainer").data("kendoWindow").center();
    fillCustomerContactForm(dataItem);
    
    $("#cancelEditCustomerContact").click(function(e){
        $("#editCustomerContactForm")[0].reset();
        $("#editCustomerContactContainer").data("kendoWindow").close();

    });

    $("#editCustomerContactForm").submit(function(e){
        var validator = $("#editCustomerContactForm").kendoValidator().data("kendoValidator");
        if (validator.validate()){
            var data = getFormData($("#editCustomerContactForm"));
            $("#editCustomerContactForm")[0].reset();
            $("#editCustomerContactContainer").data("kendoWindow").close();
            updateCustomerDetail(data,"contact",detailRow);
        }
        e.preventDefault();
    });
}

var editRelationFormAdded = false;
function showEditCustomerRelationForm(dataItem,detailRow){
	if(editRelationFormAdded){
		$("#editCustomerRelationContainer").data("kendoWindow").open();
	    $("#editCustomerRelationContainer").data("kendoWindow").center();
	    fillCustomerRelationForm(dataItem);
	    return;
	}
	
	editRelationFormAdded = true;
	$("#editCustomerRelationContainer").kendoWindow({
        title: "Edit Customer Relation",
        actions: ["Close"]
    });
	
	$("#relationTypeEdit").kendoDropDownList({
        dataTextField: "value",
        dataValueField: "variableId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lookup/relationTypes"
                }
            }
        },
        value: dataItem.relationType.variableId
    });
	
	
	$("#relativeEdit").kendoAutoComplete({
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
	
    $("#editCustomerRelationContainer").data("kendoWindow").open();
    $("#editCustomerRelationContainer").data("kendoWindow").center();
    fillCustomerRelationForm(dataItem);
    
    $("#cancelEditCustomerRelation").click(function(e){
        $("#editCustomerRelationForm")[0].reset();
        $("#editCustomerRelationContainer").data("kendoWindow").close();

    });

    $("#editCustomerRelationForm").submit(function(e){
        var validator = $("#editCustomerRelationForm").kendoValidator().data("kendoValidator");
        if (validator.validate()){
            var data = getFormData($("#editCustomerRelationForm"));
            $("#editCustomerRelationForm")[0].reset();
            $("#editCustomerRelationContainer").data("kendoWindow").close();
            updateCustomerDetail(data,"relation",detailRow);
        }
        e.preventDefault();
    });
}


var editCustomerDocFormAdded = false;
function showEditCustomerDocForm(dataItem,detailRow){
	if(editCustomerDocFormAdded){
		$("#editCustomerDocContainer").data("kendoWindow").open();
	    $("#editCustomerDocContainer").data("kendoWindow").center();
	    fillCustomerDocForm(dataItem);
	    return;
	}
	
	editCustomerDocFormAdded = true;
	$("#editCustomerDocContainer").kendoWindow({
        title: "Edit Customer Document",
        actions: ["Close"]
    });
	
	$("#documentUrlEdit").kendoUpload({
        async: {
            saveUrl: "/customers/upload_doc_file/"+currentCustomer.customerId,
            removeUrl: "/customers/unupload_doc_file/"+currentCustomer.customerId,
            autoUpload: false
        },
        multiple: false,
        select: function (e){
        	setTimeout(function () {
                var kendoUploadButton = $(".k-upload-selected");
                kendoUploadButton.hide();
            }, 1);
        },
        files:[{name:dataItem.documentUrl, size:500,type:".pdf"}]
    });
	
	$("#documentTypeEdit").kendoDropDownList({
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
        value: dataItem.documentType.variableId
    });
	
	$("#documentDateEdit").kendoDatePicker({
    	format: "yyyy-MM-dd"
    });
	
    $("#editCustomerDocContainer").data("kendoWindow").open();
    $("#editCustomerDocContainer").data("kendoWindow").center();
    fillCustomerDocForm(dataItem);
    
    $("#cancelEditCustomerDoc").click(function(e){
        $("#editCustomerDocForm")[0].reset();
        $("#editCustomerDocContainer").data("kendoWindow").close();

    });

    $("#editCustomerDocForm").submit(function(e){
        var validator = $("#editCustomerDocForm").kendoValidator().data("kendoValidator");
        if (validator.validate()){
        	var kendoUploadButton = $(".k-upload-selected");
        	if (kendoUploadButton)
        		kendoUploadButton.click();
            var data = getFormData($("#editCustomerDocForm"));
            $("#editCustomerDocForm")[0].reset();
            $("#editCustomerDocContainer").data("kendoWindow").close();
            updateCustomerDetail(data,"document",detailRow);
        }
        e.preventDefault();
    });
}

/**
 * Ajax to update a customer
 * @param formData
 * @param type
 */
function updateCustomer(formData,type){
	$.ajax({
        url : "/customers/update_"+type,
        type : "POST",
        contentType : "application/json",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function (data){
            console.log(JSON.stringify(data));
            if (data.status==="Success"){
            	
            	var searchVal = type==='person'?formData.idNumber:formData.companyRegNo;
            	
            	//set search criteria
            	$("#customerSearchField").text(searchVal);
            	
            	//execute search
            	searchCustomers(searchVal);
            	
            	alert("Customer Created Successfully");
            }else{
                alert("Fail to save :"+data.message);
            }
        },
        error : function (){
            alert("Fail to save : Internal Error");
        }

    });
}

function updateCustomerDetail(formData,type,detailRow){
	$.ajax({
        url : "/customers/update_"+type,
        type : "POST",
        contentType : "application/json",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function (data){
        	console.log(JSON.stringify(data));
            if (data.status==="Success"){
            	reloadKendoGridOnDetailRow(type+"sGrid","/customer/load_"+type+"s/"+currentCustomer.customerId,4,detailRow);
            	if (type==="contact"){
                	detailRow.find(".editContactBtn").hide();
            	}else if (type=="relation"){
            		detailRow.find(".editRelationBtn").hide();
            	}else{
            		detailRow.find(".editCustomerDocBtn").hide();
            	}
            }else{
                alert("Fail to save :"+data.message);
            }
        },
        error : function (){
            alert("Fail to save : Internal Error");
        }

    });
}

//fill forms
function fillCustomerPersonForm(data){
	$("#companyPersonId").val(data.customerId);
	$("#firstnameEdit").val(data.name2);
	$("#lastnameEdit").val(data.name1);
	$("#idNumberEdit").val(data.identityNumber);
	if (data.identityType.value==="Identity"){
		$("#idNumberTypeEdit").data("kendoDropDownList").select(1);
	}else{
		$("#idNumberTypeEdit").data("kendoDropDownList").select(2);
	}
	
	$("#dobEdit").data("kendoDatePicker").value(kendo.parseDate(data.regDate, "yyyy-MM-dd"));
	
	$("#nationalityEdit").data("kendoDropDownList").select(data.nationality.countryId);
	
	if(data.genderId==1){
		$("#genderEdit").data("kendoDropDownList").select(1);
	}else{
		$("#genderEdit").data("kendoDropDownList").select(2);
	}
	if(data.active===true){
		$("#personIsActiveEdit").data("kendoDropDownList").select(1);
	}else{
		$("#personIsActiveEdit").data("kendoDropDownList").select(2);
	}
}

function fillCustomerCompanyForm(data){
	$("#companyCustomerId").val(data.customerId);
	$("#companyNameEdit").val(data.name1);
	$("#companyRegNoEdit").val(data.identityNumber);
	$("#companyRegDateEdit").data("kendoDatePicker").value(kendo.parseDate(data.regDate, "yyyy-MM-dd"));
	$("#countryRegisteredEdit").data("kendoDropDownList").select(data.nationality.countryId);
	$("#contactPersonEdit").val(data.contactPerson);
	if(data.active===true){
		$("#companyIsActiveEdit").data("kendoDropDownList").select(1);
	}else{
		$("#companyIsActiveEdit").data("kendoDropDownList").select(2);
	}
}

function fillCustomerContactForm(data){
	$("#contactCustomerEdit").val(currentCustomer.customerId);
	$("#contactIdEdit").val(data.contactId);
	$("#contactTypeEdit").data("kendoDropDownList").search(data.contactType.value);
	$("#contactDetailEdit").val(data.contactDetail);
}

function fillCustomerRelationForm(data){
	$("#relationIdEdit").val(data.relationId);
	$("#relationTypeEdit").data("kendoDropDownList").search(data.relationType.value);
	$("#relativeEdit").data("kendoAutoComplete").value(data.relative.name1+", "+data.relative.identityNumber);
	$("#relationDetailEdit").val(data.relationDetail);
}

function fillCustomerDocForm(data){
	$("#customerDocId").val(data.documentId);
	$("#documentRefNoEdit").val(data.documentRefNo);
	$("#documentTypeEdit").data("kendoDropDownList").value(data.documentType.variableId);
	$("#documentDateEdit").data("kendoDatePicker").value(kendo.parseDate(data.documentDate, "yyyy-MM-dd"));
	
}
