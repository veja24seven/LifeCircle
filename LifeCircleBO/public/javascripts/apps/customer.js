var documentTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/documentTypes"}
        }
	}); 
/**
* Initialize Customer Grid
*/
function init(){
	$("#customersGrid").kendoGrid({
        pageable: true,
        selectable : true,
        height: 500,
        toolbar: kendo.template($("#customerTemplate").html()),
        detailTemplate: kendo.template($("#customerDetailTemplate").html()),
        detailInit: showCustomerDetail,
        columns: [
            { field: "identity[0].identityNumber", title:"ID Number"},
            { field: "firstname", title:"Name"},
            { field: "surname", title:"Surname"},
            { field: "dateOfBirth", title:"DOB"},
            { field: "nationality.name",title:"Nationality"},
            { field: "gender.value",title:"Gender"},
            { command: { text: "View", click: showCustomerFullDetails }, title: " ", width: "100px" }],
        change : function(){
            var row = this.select();
            var data = this.dataItem(row);
            console.log("Selected: " + data + " Text, [" + JSON.stringify(data) + "]");
            currentCustomer = data;
            //showVesselDocs(data);
            $("#editCustomerBtn").show();
            
            if(currentCustomer.active){
            	$("#activateCustomerBtn").hide();
            	$("#deactivateCustomerBtn").show();
            }else{
            	$("#activateCustomerBtn").show();
            	$("#deactivateCustomerBtn").hide();
            }
        }

    });
	
	kendo.init($("#customerGridTool"));
	
	$("#editCustomerBtn").click(function(e){
		if (currentCustomer.customerType.value==="Person")
			showEditCustomerPersonForm(currentCustomer);
		else
			showEditCustomerCompanyForm(currentCustomer);
		e.preventDefault();
	});
	
	$("#activateCustomerBtn").click(function(e){
		e.preventDefault();
		toggleCustomerActiveStatus("activate");
	});
	$("#deactivateCustomerBtn").click(function(e){
		e.preventDefault();
		toggleCustomerActiveStatus("deactivate");
	});
}

var addPersonFormAdded = false;
/**
 * Create a Popup that will show a Add Person Form
 */
function addNewPersonCustomer(){
	if(addPersonFormAdded){
		$("#addNewPersonCustomer").data("kendoWindow").open();
	    $("#addNewPersonCustomer").data("kendoWindow").center();
	    return;
	}
	
	addPersonFormAdded = true;
	
	$("#addNewPersonCustomer").kendoWindow({
        title: "Add New Person Customer",
        actions: ["Close"],
        modal: true
    });
	
	$("#nationality").kendoDropDownList({
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
	
	$("#gender").kendoDropDownList({
        dataTextField: "type",
        dataValueField: "type",
        optionLabel: "-Please Select-",
        dataSource: [{type:"Male"},{type:"Female"}],
        index: 0
    });
	
	$("#idNumberType").kendoDropDownList({
		dataTextField: "type",
        dataValueField: "type",
		optionLabel: "-Please Select-",
		dataSource: [{type:"Identity"},{type:"Passport"}],
		index: 0
	});
	
	$("#personIsActive").kendoDropDownList({
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
	
    $("#dob").kendoDatePicker({
    	format: "yyyy-MM-dd",
    	max: maxDate,
        min: minDate
    });

    $("#addNewPersonCustomer").data("kendoWindow").open();
    $("#addNewPersonCustomer").data("kendoWindow").center();
    
    //set kendo date picker width
    $("#dob").closest("span.k-datepicker").width(200);

    $("#cancelAddNewPersonCustomer").click(function(e){
        $("#addNewPersonCustomerForm")[0].reset();
        $("#addNewPersonCustomer").data("kendoWindow").close();

    });

    $("#addNewPersonCustomerForm").submit(function(e){
        var validator = $("#addNewPersonCustomerForm").kendoValidator().data("kendoValidator");
        if (validator.validate()){
            var data = getFormData($("#addNewPersonCustomerForm"));
            
            saveCustomer(data,"person");
        }
        e.preventDefault();
    });
}

var addCompanyFormAdded = false;
/**
 * Create a Popup that will show a Add Company Form
 */
function addNewCompanyCustomer(){
	if(addCompanyFormAdded){
		$("#addNewCompanyCustomer").data("kendoWindow").open();
	    $("#addNewCompanyCustomer").data("kendoWindow").center();
	    return;
	}
	
	addCompanyFormAdded = true;
	
	$("#addNewCompanyCustomer").kendoWindow({
        title: "Add New Company Customer",
        actions: ["Close"],
        modal: true
    });
	
	$("#countryRegistered").kendoDropDownList({
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
	
	$("#companyIsActive").kendoDropDownList({
		dataTextField: "type",
        dataValueField: "type",
		optionLabel: "-Please Select-",
		dataSource: [{type:"Active"},{type:"Not Active"}],
		index: 0
	});

    $("#companyRegDate").kendoDatePicker({
    	format: "yyyy-MM-dd"
    });

    $("#addNewCompanyCustomer").data("kendoWindow").open();
    $("#addNewCompanyCustomer").data("kendoWindow").center();
    
    //set kendo date picker width
    $("#companyRegDate").closest("span.k-datepicker").width(200);
    
    $("#cancelAddNewCompanyCustomer").click(function(e){
        $("#addNewCompanyCustomerForm")[0].reset();
        $("#addNewCompanyCustomer").data("kendoWindow").close();

    });

    $("#addNewCompanyCustomerForm").submit(function(e){
        var validator = $("#addNewCompanyCustomerForm").kendoValidator().data("kendoValidator");
        if (validator.validate()){
            var data = getFormData($("#addNewCompanyCustomerForm"));
            saveCustomer(data,"company");
        }
        e.preventDefault();
    });
}

/**
 * Search Customers by value
 * @param value
 */
function searchCustomers(value){
	sendAjaxPost("/lifecircle/admin/search_persons",{criteria:value},function(result){
		var dataSource = new kendo.data.DataSource({
	        data : result.data,
	        pageSize: 10
	    });

	    $("#customersGrid").data("kendoGrid").setDataSource(dataSource);
	});
	
	$("#editCustomerBtn").hide();
    $("#activateCustomerBtn").hide();
	$("#deactivateCustomerBtn").hide();
}

//----------------AJAX
/**
 * Create Customer ajax request, this must refresh the Customer grid on success
 */
function saveCustomer(formData,type){
	$.ajax({
        url : "/customers/create_"+type,
        type : "POST",
        contentType : "application/json",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function (data){
            console.log(JSON.stringify(data));
            if (data.status==="Success"){
            	
            	var searchVal = type==='person'?formData.idNumber:formData.companyRegNo;
            	
            	if(type==='person'){
            		$("#addNewPersonCustomerForm")[0].reset();
                    $("#addNewPersonCustomer").data("kendoWindow").close();
            	}else{
            		$("#addNewCompanyCustomerForm")[0].reset();
                    $("#addNewCompanyCustomer").data("kendoWindow").close();
            	}
            	//set search criteria
            	$("#customerSearchField").val(searchVal);
            	
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

/**
 * Show Customer Detail on a Grid
 * @param e
 */
function showCustomerDetail(e){
	var detailRow = e.detailRow;
	
	//initiate tabstrip on a detail
	detailRow.find(".customerDetailTabstrip").kendoTabStrip();
	
	//initiate grids
	detailRow.find(".contactsGrid").kendoGrid({
		dataSource: e.data.contacts,
        scrollable : false,
		pageable: true,
        selectable : true,
        height: 300,
        toolbar: kendo.template($("#contactsTemplate").html()),
        columns: [
	          { field: "contactType.value", title:"Contact Type"},
	          { field: "contactValue", title:"Contact"}],
	      change : function(){
	          var row = this.select();
	          var data = this.dataItem(row);
	          currentContact = data;
	          detailRow.find(".editContactBtn").show();
	      }
        
	});
	
	detailRow.find(".documentsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/customer/load_documents/"+e.data.customerId
            },
            paging: true,
            pageSize: 4
        },
        scrollable : false,
		pageable: true,
        selectable : true,
        height: 300,
        toolbar: kendo.template($("#documentsTemplate").html()),
        columns: [
	          { field: "documentType.value", title:"Document Type"},
	          { field: "documentUrl", title:"URL", template:'<a href="/dma/customers/download/'+e.data.customerId+'/#=documentId#" target="_blank">#= documentUrl #</a>'},
	          { field: "documentRefNo", title:"Doc Ref No." },
	          { field: "documentDate", title: "Doc Date"}],
	      change : function (){
	    	var row = this.select();
	        var data = this.dataItem(row);
	    	currentDoc = data;
	    	detailRow.find(".editCustomerDocBtn").show();
	      }
	          
        
	});
	
	detailRow.find(".relationsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/customer/load_relations/"+e.data.customerId
            },
            paging: true,
            pageSize: 4
        },
        scrollable : false,
		pageable: true,
        selectable : true,
        height: 300,
        toolbar: kendo.template($("#relationsTemplate").html()),
        columns: [
	          { field: "relationType.value", title:"Relation Type"},
	          { field: "relative.name1", title:"Relative"},
	          { field: "relationDetail", title:"Datail" },
	          { field: "dateCreated", title: "Date Added"}],
	    change : function (){
	    	var row = this.select();
	        var data = this.dataItem(row);
	        currentRelation = data;
	    	detailRow.find(".editRelationBtn").show();
	    }
        
	});
	if(e.data.active){
		
		//bind action events
		detailRow.find(".addNewContactBtn").click(function(evt){
	    	addNewCustomerContact(e.data.customerId,detailRow);
	        evt.preventDefault();
	    });
		detailRow.find(".editContactBtn").click(function(evt){
			showEditCustomerContactForm(currentContact,detailRow);
			evt.preventDefault();
		});
		
		detailRow.find(".addNewRelationBtn").click(function(evt){
	    	addNewCustomerRelative(e.data.customerId,detailRow);
	        evt.preventDefault();
	    });
		detailRow.find(".editRelationBtn").click(function(evt){
			showEditCustomerRelationForm(currentRelation,detailRow);
	        evt.preventDefault();
	    });
		
		attachDocumentsToolBarActionHandlers(e);
	}else{
		detailRow.find(".addNewContactBtn,.editContactBtn,.editCustomerDocBtn,.addNewDocumentBtn,.addNewRelationBtn,.editRelationBtn")
		.click(function(){
			alert("Selected Customer is inactive and can no longer be edited.");
		});
	}
}

function attachDocumentsToolBarActionHandlers(e){
	var detailRow = e.detailRow;
	var submitAddDocumentHandler = function(evt){
		evt.preventDefault();
		
		var kendoUploadButton = $(".k-upload-selected");
    	if (kendoUploadButton)
    		kendoUploadButton.click();
    	
	};
	
	var submitEditDocumentHandler = function(evt){
		evt.preventDefault();
		
		var kendoUploadButton = $(".k-upload-selected");
    	if (kendoUploadButton)
    		kendoUploadButton.click();
    	
	};
	detailRow.find(".addNewDocumentBtn").click(function(evt){
		evt.preventDefault();
		display_popup(
				"document-form",
				"document-form-template",
				null,
				submitAddDocumentHandler,
				"Add Document",
				"500px"
		);
		initDocumentUploadWidget(true,e.data.customerId,0,function(event){
			var grid = detailRow.find(".documentsGrid").data("kendoGrid");
			grid.dataSource.read();
			var form = $("#document-form");
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        $("#current-form-window").data("kendoWindow").destroy();
	        detailRow.find(".editCustomerDocBtn").hide();
	    	alert(" Document uploaded successfully.");
		});
    });

	detailRow.find(".editCustomerDocBtn").click(function(evt){
		evt.preventDefault();
		var viewModel = kendo.observable({
    		document: currentDoc
    	});
		display_popup(
				"document-form",
				"document-form-template",
				null,
				submitEditDocumentHandler,
				"Edit Document",
				"500px"
		);
		initDocumentUploadWidget(false,e.data.customerId,currentDoc.documentId,function(event){
			var grid = detailRow.find(".documentsGrid").data("kendoGrid");
			grid.dataSource.read();
			var form = $("#document-form");
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        $("#current-form-window").data("kendoWindow").destroy();
	        detailRow.find(".editCustomerDocBtn").hide();
	    	alert(" Document uploaded successfully.");
		});
	});
}

//----------------Customer Detail Form Handlers
var addContactFormAdded = false;
/**
 * Show Customer Contact Form
 */
function addNewCustomerContact(customerId,detailRow){
	$("#contactCustomer").val(customerId);
	if(addContactFormAdded){
		$("#addCustomerContactContainer").data("kendoWindow").open();
	    $("#addCustomerContactContainer").data("kendoWindow").center();
	    return;
	}
	
	addContactFormAdded = true;
	
	$("#addCustomerContactContainer").kendoWindow({
        title: "Add New Customer Contact",
        actions: ["Close"],
        modal: true
    });
	
	$("#contactType").kendoDropDownList({
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
        select: function (e){
        	
        },
        index: 0
    });
	
	$("#contactType").closest("span.k-dropdown").width(200);
	
	var contactTypeChangeHandler = function (e){
		console.log("Type selected >>"+this.value);
	}
	
	$("#contactType").data("kendoDropDownList").bind("change",contactTypeChangeHandler);

    $("#addCustomerContactContainer").data("kendoWindow").open();
    $("#addCustomerContactContainer").data("kendoWindow").center();
    
    $("#cancelAddCustomerContact").click(function(e){
        $("#addCustomerContactForm")[0].reset();
        $("#addCustomerContactContainer").data("kendoWindow").close();

    });

    $("#addCustomerContactForm").submit(function(e){
        var validator = $("#addCustomerContactForm").kendoValidator().data("kendoValidator");
        if (validator.validate()){
            var data = getFormData($("#addCustomerContactForm"));
            $("#addCustomerContactForm")[0].reset();
            $("#addCustomerContactContainer").data("kendoWindow").close();
            saveCustomerDetail(data,"contact",detailRow);
        }
        e.preventDefault();
    });
}

var addRelationFormAdded = false;
/**
 * Show Customer Relative Form
 */
function addNewCustomerRelative(customerId,detailRow){
	$("#relationCustomer").val(customerId);
	if(addRelationFormAdded){
		$("#addCustomerRelationContainer").data("kendoWindow").open();
	    $("#addCustomerRelationContainer").data("kendoWindow").center();
	    return;
	}
	
	addRelationFormAdded = true;
	$("#addCustomerRelationContainer").kendoWindow({
        title: "Add New Customer Relation",
        actions: ["Close"],
        modal: true
    });
	
	$("#relationType").kendoDropDownList({
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
        index: 0
    });
	

	$("#relationType").closest("span.k-dropdown").width(200);
	
	$("#relative").kendoAutoComplete({
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
	
	$("#relative").closest("span.k-autocomplete").width(200);
	
    $("#addCustomerRelationContainer").data("kendoWindow").open();
    $("#addCustomerRelationContainer").data("kendoWindow").center();
    
    $("#cancelAddCustomerRelation").click(function(e){
        $("#addCustomerRelationForm")[0].reset();
        $("#addCustomerRelationContainer").data("kendoWindow").close();

    });

    $("#addCustomerRelationForm").submit(function(e){
        var validator = $("#addCustomerRelationForm").kendoValidator().data("kendoValidator");
        if (validator.validate()){
            var data = getFormData($("#addCustomerRelationForm"));
            $("#addCustomerRelationForm")[0].reset();
            $("#addCustomerRelationContainer").data("kendoWindow").close();
            saveCustomerDetail(data,"relation",detailRow);
        }
        e.preventDefault();
    });
} 

//------------------AJAX
/**
 * Ajax function to save customer contact
 */
function saveCustomerDetail(formData,detail,detailRow){
	$.ajax({
        url : "/customers/create_"+detail,
        type : "POST",
        contentType : "application/json",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function (data){
        	console.log(JSON.stringify(data));
            if (data.status==="Success"){
            	reloadKendoGridOnDetailRow(detail+"sGrid","/customer/load_"+detail+"s/"+formData.customer,4,detailRow);
            }else{
                alert("Fail to save :"+data.message);
            }
        },
        error : function (){
            alert("Fail to save : Internal Error");
        }

    });
}

function toggleCustomerActiveStatus(status){
	$.ajax({
        url : "/customers/toggle_status/"+status+"/"+currentCustomer.customerId,
        type : "GET",
        contentType : "application/json",
        success : function (data){
            console.log(JSON.stringify(data));
            if (data.status==="Success"){
            	var searchVal = currentCustomer.regNo;
            	
            	//set search criteria
            	$("#customerSearchField").text(searchVal);
            	
            	//execute search
            	searchCustomers(searchVal);
            	
            	alert("Customer "+status+"d Successfully");
            }
        }
    });
}

function initDocumentUploadWidget(addnew,entityId,documentId,successHandler){
	var files = addnew?[]:[{name:currentDocument.documentUrl, size:500,type:".pdf"}];
	
	$("#documentUrl").kendoUpload({
        async: {
            saveUrl: "/customers/upload_doc_file/"+entityId,
            removeUrl: "/customers/unupload_doc_file/"+entityId,
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
        	var form = $("#document-form");
    		var formData = getFormData(form);
    		formData.documentId = addnew? 0:documentId;
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

function showCustomerFullDetails(e){
	var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
	
	window.open(
			"/person/display/"+dataItem.personId,
			"_blank" // <- This is what makes it open in a new window.
	);
}