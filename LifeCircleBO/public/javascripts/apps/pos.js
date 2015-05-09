var customerAutocompleteDS = new kendo.data.DataSource({
		type: "json",pageSize: 10,
		transport: {read: "/customer/load_autocomplete_customers"}
	}),
	ownerTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/ownerTypes"}
        }
	}),
	tellersDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/tellers"}
        }
	}),
	accountsAutocompleteDS = new kendo.data.DataSource({
		type: "json",pageSize: 10,
		transport: {read: "/dma/pos/load_autocomplete_accounts"}
	}),
	accountStatusesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/accountStatuses"}
        },
        filter: { field: "value", operator: "neq", value: "PENDING" }
	}),
	invoiceStatusesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/invoiceStatuses"}
        },
        filter: { field: "value", operator: "neq", value: "PENDING" }
	}),
	tillsDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/tills"}
        }
	}),
	itemsDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/posInvoiceItems"}
        }
	}),
	vatTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/vatTypes"}
        }
	}),
	receiptsDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/receipts"}
        }
	}),
	mopTypesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lookup/mopTypes"}
        }
	});
var currentAccount = null, currentInvoice = null, currentInvoiceItem, currentReceipt = null;
function init()
{
	$("#posTabstrip").kendoTabStrip();
	
	$("#accountsGrid").kendoGrid({
        pageable: true,
        selectable : true,
        height: 500,
        toolbar: kendo.template($("#accountsTemplate").html()),
        //detailTemplate: kendo.template($("#facilityCertificateTemplate").html()),
        //detailInit: showFacilityCertificatesAndInspections,
        columns: [
            { title:"Owner Name & Id",template:"#: owner.name1 #,#: owner.identityNumber #"},     
            { field: "ownerType.value", title:"Owner Type"},
            { field: "accountNo", title:"Account No."},
            { field: "startDate", title:"Start Date"},
            { field: "accountStatus.value", title:"Account Status"},
            { field: "accountBalance",title:"Account Balance"}],
        change : function(){
            var row = this.select();
            var data = this.dataItem(row);
            console.log("Selected: " + data + " Text, [" + JSON.stringify(data) + "]");
            
            currentAccount = data;
            if(data.accountStatus.value==='PENDING'){
            	$("#editAccountBtn").show();
                $("#statusAccountBtn").show();
            }else{
            	$("#editAccountBtn").hide();
                $("#statusAccountBtn").hide();
            }
            
        }

    });
	
	$("#sessionsGrid").kendoGrid({
		pageable: true,
        selectable : true,
        height: 500,
        toolbar: kendo.template($("#sessionsTemplate").html()),
		columns: [
		            { title:"Session Id",field:"sessionId"},     
		            { field: "loginId", title:"Login"},
		            { field: "cashierName", title:"Cashier Name"},
		            { field: "openDate", title:"Open Date"},
		            { field: "till.tillName", title:"Till Name"},
		            { field: "closeDate", title:"Close Date"},
		            { field: "open",title:"Is Open", template:"#=open?'YES':'NO'#"}],
        change : function(){
            var row = this.select();
            var data = this.dataItem(row);
            console.log("Selected: " + data + " Text, [" + JSON.stringify(data) + "]");
        }
	});
	
	$("#invoicesGrid").kendoGrid({
		pageable: true,
        selectable : true,
        height: 500,
        toolbar: kendo.template($("#invoicesTemplate").html()),
        detailTemplate: kendo.template($("#invoicesGridTemplate").html()),
        detailInit: showInvoicesDetail,
		columns: [
		            { title:"Account No.",field:"account.accountNo"},     
		            { field: "invoiceNo", title:"Invoice No."},
		            { field: "invoiceDate", title:"Invoice Date"},
		            { field: "itemCount", title:"Item Count"},
		            { field: "amountDue", title:"Amount Due"},
		            { field: "invoiceStatus.value", title:"Invoice Status"}],
        change : function(){
            var row = this.select();
            var data = this.dataItem(row);
            console.log("Selected: " + data + " Text, [" + JSON.stringify(data) + "]");
            
            currentInvoice = data;
            if(data.invoiceStatus.value==='PENDING'){
            	$("#editInvoiceBtn").show();
            	$("#statusInvoiceBtn").show();
            }else{
            	$("#editInvoiceBtn").hide();
            	$("#statusInvoiceBtn").hide();
            }
            loadReceipts();
        }
	});
	
	$("#receiptsGrid").kendoGrid({
		pageable: true,
        selectable : true,
        toolbar: kendo.template($("#receiptsTemplate").html()),
        detailTemplate: kendo.template($("#receiptsGridTemplate").html()),
        detailInit: showReceiptsDetail,
        columns: [
		            { title:"Receipt No.",field:"receiptNo"},     
		            { field: "invoice.invoiceNo", title:"Invoice No."},
		            { field: "effectiveDate", title:"Effective Date"},
		            { field: "amountPaid", title:"Amount Paid"},
		            { field: "confirmed", title:"Confirmed", template:"#= confirmed? 'YES':'NO' #"}],
      change : function(){
          var row = this.select();
          var data = this.dataItem(row);
          console.log("Selected: " + data + " Text, [" + JSON.stringify(data) + "]");
          
          currentReceipt = data;
          if(data.confirmed){
          	$("#editReceiptBtn").hide();
          	$("#confirmReceiptBtn").hide();
          }else{
          	$("#editReceiptBtn").show();
          	$("#confirmReceiptBtn").show();
          }
      }
	});
	
	attachAccountsToolBarActions();
	attachSessionsToolBarActions();
	attachInvoicesToolBarActions();
	attachReceiptsToolBarActions();
	loadSessions();
}

function attachAccountsToolBarActions(){
	kendo.init($("#accountSearchBy"));
	
	$("#searchAccountsBtn").click(function(e){
		searchAccounts(null,null);
		e.preventDefault();
	});
	
	var createAccountSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#account-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/pos/create_account",formData,function(data){
			$("#accountSearchVal").val(formData.accountNo);
			searchAccounts("accountNo",null);
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Account Added successfully.");
		});
	},
	updateAccountSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#account-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/pos/update_account",formData,function(data){
			$("#accountSearchVal").val(formData.accountNo);
			searchAccounts("accountNo",null);
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Account Added successfully.");
		});
	},
	statusAccountSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#account-status-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/pos/status_update_account",formData,function(data){
			$("#accountSearchVal").val(currentAccount.accountNo);
			searchAccounts("accountNo",null);
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Account Status changed successfully.");
		});
	};

	$("#addAccountBtn").click(function(e){
		e.preventDefault();
    	display_popup(
    			"account-form",
    			"account-form-template",
    			null,
    			createAccountSubmitHandler,
    			"Add Account",
    			"500px"
    		);
	});
	
	$("#editAccountBtn").click(function(e){
		e.preventDefault();
		var viewmodel = kendo.observable({
    		dataItem : currentAccount,
    		owner : currentAccount.owner.name1+", "+currentAccount.owner.identityNumber
    	});
    	display_popup(
    			"account-form",
    			"account-form-template",
    			viewmodel,
    			updateAccountSubmitHandler,
    			"Edit Account",
    			"500px"
    		);
	});
	
	$("#statusAccountBtn").click(function(e){
		e.preventDefault();
		var viewmodel = kendo.observable({
    		dataItem : currentAccount
    	});
    	display_popup(
    			"account-status-form",
    			"account-status-form-template",
    			viewmodel,
    			statusAccountSubmitHandler,
    			"Change Account Status",
    			"500px"
    		);
	});
}

function attachSessionsToolBarActions(){
	var createSessionSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#session-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/pos/create_session",formData,function(data){
			loadSessions();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("POS Session started successfully.");
		});
	};
	
	$("#addSessionBtn").click(function(e){
		e.preventDefault();
		display_popup(
    			"session-form",
    			"session-form-template",
    			null,
    			createSessionSubmitHandler,
    			"Start POS Session",
    			"500px"
    		);
	});

	$("#stopSessionBtn").click(function(e){
		e.preventDefault();
		sendAjaxGet("/dma/pos/close_session/"+posSession.sessionId,function(result){
			alert("POS Session closed successfully.");
			loadSessions();
		});
	});
}

function attachInvoicesToolBarActions(){

	$("#invoicesSearchBtn").click(function(e){
		var criteriaVal = $("#invoicesSearchFld").val();
		searchInvoices(criteriaVal);
		e.preventDefault();
	});
	
	var createInvoiceSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#invoice-form");
		var formData = getFormData(form);
		formData.sessionId = posSession.sessionId;
		
		sendAjaxPost("/dma/pos/create_invoice",formData,function(data){
			$("#invoicesSearchFld").val(formData.accountNo);
			searchInvoices(formData.accountNo);
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Invoice Added successfully.");
		});
	},
	updateInvoiceSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#invoice-form");
		var formData = getFormData(form);
		formData.sessionId = posSession.sessionId;
		
		sendAjaxPost("/dma/pos/update_invoice",formData,function(data){
			$("#invoicesSearchFld").val(formData.accountNo);
			searchInvoices(formData.accountNo);
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Invoice Updated successfully.");
		});
	},
	statusInvoiceSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#invoice-status-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/pos/status_update_invoice",formData,function(data){
			$("#invoicesSearchFld").val(formData.accountNo);
			searchInvoices(formData.accountNo);
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Invoice Status Updated successfully.");
		});
	};
	
	$("#addInvoiceBtn").click(function(e){
		e.preventDefault();
		display_popup(
    			"invoice-form",
    			"invoice-form-template",
    			null,
    			createInvoiceSubmitHandler,
    			"Add Invoice",
    			"500px"
    		);
	});
	
	$("#editInvoiceBtn").click(function(e){
		e.preventDefault();
		var viewmodel = kendo.observable({
    		dataItem : currentInvoice
    	});
		display_popup(
    			"invoice-form",
    			"invoice-form-template",
    			viewmodel,
    			updateInvoiceSubmitHandler,
    			"Edit Invoice",
    			"500px"
    		);
	});
	
	$("#statusInvoiceBtn").click(function(e){
		e.preventDefault();
		var viewmodel = kendo.observable({
    		dataItem : currentInvoice
    	});
    	display_popup(
    			"invoice-status-form",
    			"invoice-status-form-template",
    			viewmodel,
    			statusInvoiceSubmitHandler,
    			"Change Invoice Status",
    			"500px"
    		);
	});
}

function attachReceiptsToolBarActions(){
	var createReceiptSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#receipt-form");
		var formData = getFormData(form);
		formData.invoiceId = currentInvoice.invoiceId;
		formData.sessionId = posSession.sessionId;
		
		sendAjaxPost("/dma/pos/create_receipt",formData,function(data){
			var grid = $("#receiptsGrid").data("kendoGrid");
			grid.dataSource.read();
			$("#editReceiptBtn").hide();
          	$("#confirmReceiptBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Receipt added successfully.");
		});
	},
	updateReceiptSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#receipt-form");
		var formData = getFormData(form);
		formData.sessionId = posSession.sessionId;
		
		sendAjaxPost("/dma/pos/update_receipt",formData,function(data){
			var grid = $("#receiptsGrid").data("kendoGrid");
			grid.dataSource.read();
			
			$("#editReceiptBtn").hide();
          	$("#confirmReceiptBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Receipt updated successfully.");
		});
	};
	
	$("#addReceiptBtn").click(function(e){
		e.preventDefault();
		display_popup(
    			"receipt-form",
    			"receipt-form-template",
    			null,
    			createReceiptSubmitHandler,
    			"Add Receipt",
    			"500px"
    		);
	});
	
	$("#editReceiptBtn").click(function(e){
		e.preventDefault();
		var viewmodel = kendo.observable({
    		dataItem : currentReceipt
    	});
		display_popup(
    			"receipt-form",
    			"receipt-form-template",
    			viewmodel,
    			updateReceiptSubmitHandler,
    			"Edit Receipt",
    			"500px"
    		);
	});
	
	$("#confirmReceiptBtn").click(function(e){
    	e.preventDefault();
    	sendAjaxPost("/dma/pos/confirm_receipt",{receiptId:currentReceipt.receiptId},function(data){
    		var grid = $("#receiptsGrid").data("kendoGrid");
			grid.dataSource.read();
			$("#editReceiptBtn").hide();
          	$("#confirmReceiptBtn").hide();
          	
        	alert("Receipt confirmed successfully.");
    	});
    });
}

function showInvoicesDetail(e){
	var detailRow = e.detailRow;
	//initiate tabstrip on a detail
	detailRow.find(".invoicesGridDetailTabstrip").kendoTabStrip();
	
	detailRow.find(".invoiceItemsGrid").kendoGrid({
		dataSource: {
            type: "json",
            transport: {
                read: "/dma/pos/load_invoice_items/"+e.data.invoiceId
            },
            paging: true,
            pageSize: 8
        },
		pageable: true,
        selectable : true,
        toolbar: kendo.template($("#invoiceItemsTemplate").html()),
		columns: [
		            { title:"Line No.",field:"lineNo"},     
		            { field: "item.itemName", title:"Item Name"},
		            { field: "quantity", title:"Quantity"},
		            { field: "subTotal", title:"Sub Total"},
		            { field: "vatType.vatCode", title:"Vat Code"},
		            { field: "vatTotal", title:"Vat Total"},
		            { field: "lineTotal", title:"Line Total"}],
	    change : function(){
	        var row = this.select();
	        var data = this.dataItem(row);
	        
	        currentInvoiceItem = data;
	        
	        detailRow.find(".editInvoiceItemBtn").show();
	    }
	});
	
	var createInvoiceItemSubmitHandler = function(evt){
        evt.preventDefault();
        var form = $("#invoice-item-form");
		var formData = getFormData(form);
		formData.invoice = currentInvoice.invoiceId;
		
		sendAjaxPost("/dma/pos/create_invoice_item",formData,function(data){
			var grid = detailRow.find(".invoiceItemsGrid").data("kendoGrid");
			grid.dataSource.read();
			detailRow.find(".editInvoiceItemBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Invoice Item Added successfully.");
		});
		
	},updateInvoiceItemSubmitHandler = function(evt){
        evt.preventDefault();
        var form = $("#invoice-item-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/pos/update_invoice_item",formData,function(data){
			var grid = detailRow.find(".invoiceItemsGrid").data("kendoGrid");
			grid.dataSource.read();
			detailRow.find(".editInvoiceItemBtn").hide();
			
			form[0].reset();
			$("#current-form-window").data("kendoWindow").close();
			alert("Invoice Item Updated successfully.");
		});
	};
	
	detailRow.find(".addInvoiceItemBtn").click(function(evt){
        evt.preventDefault();
        display_popup(
    			"invoice-item-form",
    			"invoice-item-form-template",
    			null,
    			createInvoiceItemSubmitHandler,
    			"Add Invoice Item",
    			"500px"
    		);
    });
	

    detailRow.find(".editInvoiceItemBtn").click(function(evt){
        evt.preventDefault();
        var viewmodel = kendo.observable({
    		dataItem : currentInvoiceItem
    	});
        display_popup(
    			"invoice-item-form",
    			"invoice-item-form-template",
    			viewmodel,
    			updateInvoiceItemSubmitHandler,
    			"Edit Invoice Item",
    			"500px"
    		);
    });
	
}

function showReceiptsDetail(e){
	var detailRow = e.detailRow;
	
	detailRow.find(".receiptMopsGrid").kendoGrid({
		dataSource : {
			transport: {
	            read:  {
	                url: "/dma/pos/load_receipt_mops/"+e.data.receiptId,
	                dataType: "json"
	            },
	            update: {
	            	type: "POST",
	                url: "/dma/pos/update_receipt_mop",
	                dataType: "json",
	                contentType : "application/json"
	            },
	            create: {
	            	type: "POST",
	            	url: "/dma/pos/create_receipt_mop",
	                dataType: "json",
	                contentType : "application/json"
	            },
	            parameterMap: function (model, operation) {
	                if (operation !== "read" && model) {
	                	model.receiptId = currentReceipt.receiptId;
	                	return JSON.stringify(model);
	                }
	            }
	        },
	        pageSize: 20,
	        schema: {
	            model: {
	                id: "paymentId",
	                fields: {
	                	paymentId : { editable: false, nullable: true },
	                	mopType : { validation: { required: true } },
	                	mopRefNo : { validation: { required: true } },
	                	mopAmount : {type: "number", validation: { required: true } }
	                }
	            }
	        }
		},
		pageable: true,
        selectable : true,
        toolbar: ["create"],
        columns: [     
		            { field: "mopType", title:"Mop Type", template:"#=mopType.value#", editor: mopTypesDropDownEditor},
		            { field: "mopRefNo", title:"Mop Ref No."},
		            { field: "mopAmount", title:"Amount"},
		            { command: ["edit"], title: "&nbsp;", width: "172px" }],
	    change : function(){
	        var row = this.select();
	        var data = this.dataItem(row);
	        
	    },
	    editable : "inline"
	});
}

function loadSessions(){
	reloadKendoGrid("sessionsGrid","/dma/pos/loadUserSessions",10);
	
	sendAjaxGet("/dma/pos/get_open_session",function(result){
		posSession = result.data;
		
		if (posSession!=null){
    		$("#addSessionBtn").hide();
    		$("#stopSessionBtn").show();
    	}else{
    		$("#addSessionBtn").show();
    		$("#stopSessionBtn").hide();
    	}
	});
}

function searchAccounts(type,value){
	var searchType = type==null?$("#accountSearchBy").val():type;
	var searchValue = value==null?$("#accountSearchVal").val():value;
	console.log("Search Criteria :"+searchType+" and "+searchValue);

    reloadKendoGrid("accountsGrid","/dma/pos/search/"+searchType+"/"+searchValue,15);
    $("#editAccountBtn").hide();
    $("#statusAccountBtn").hide();
}

function searchInvoices(criteriaVal){
	reloadKendoGrid("invoicesGrid","/dma/pos/search_invoices/"+criteriaVal,15);
	
	$("#editInvoiceBtn").hide();
	$("#statusInvoiceBtn").hide();
	$("#receiptsTab").hide();
}

function loadReceipts(){
	$("#receiptsTab").show();
	reloadKendoGrid("receiptsGrid","/dma/pos/load_invoice_receipts/"+currentInvoice.invoiceId,10);
	
	$("#editReceiptBtn").hide();
  	$("#confirmReceiptBtn").hide();
}

function mopTypesDropDownEditor(container,options){
	$('<input required data-bind="value:' + options.field + '"/>')
    .appendTo(container)
    .kendoDropDownList({
        autoBind: false,
        dataTextField : "value",
        dataValueField : "variableId",
        optionLabel: "-Please Select-",
        dataSource: mopTypesDS
    });
}