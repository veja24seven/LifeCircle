var territoriesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/userTerritories"}}
}),
glAccountTypesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/glAccountTypes"}}
}),
glAccountsDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/glAccounts"}}
}),
itemCategoriesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/itemCategories"}}
}),
territoriesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/userTerritories"}}
});
function init(){
	$("#posTabstrip").kendoTabStrip();
	
	$("#tillsGrid").kendoGrid({
		dataSource : {
			transport: {
	            read:  {
	                url: "/dma/pos_admin/load_tills",
	                dataType: "json"
	            },
	            update: {
	            	type: "POST",
	                url: "/dma/pos_admin/update_till",
	                dataType: "json",
	                contentType : "application/json"
	            },
	            create: {
	            	type: "POST",
	            	url: "/dma/pos_admin/create_till",
	                dataType: "json",
	                contentType : "application/json"
	            },
	            parameterMap: function (model, operation) {
	                if (operation !== "read" && model) {
	                	if(operation==='update')
	                		model.territory = model.territory.variableId;
	                	return JSON.stringify(model);
	                }
	            }
	        },
	        pageSize: 20,
	        schema: {
	            model: {
	                id: "tillNo",
	                fields: {
	                	tillNo : { editable: false, nullable: true },
	                    tillName : { validation: { required: true } },
	                    territory : { validation: { required: true } },
	                    active : { validation: { required: true } }
	                }
	            }
	        }
		},
        pageable: true,
        selectable : true,
        height: 500,
        toolbar: ["create"],
        columns: [
            { field: "tillName", title:"Till Name"},
            { field: "territory", title:"Territory", template:"#= territory.value #", editor: territoryDropDownEditor},
            { field: "active",title:"Is Active", template:"#= active?'YES':'NO' #", editor: tillStatusDropDownEditor},
            { command: ["edit"], title: "&nbsp;", width: "172px" }],
        editable : "inline"
	});
	
	
	$("#vatsGrid").kendoGrid({
		dataSource : {
			transport: {
	            read:  {
	                url: "/dma/pos_admin/load_vat_types",
	                dataType: "json"
	            },
	            update: {
	            	type: "POST",
	                url: "/dma/pos_admin/update_vat_type",
	                dataType: "json",
	                contentType : "application/json"
	            },
	            create: {
	            	type: "POST",
	            	url: "/dma/pos_admin/create_vat_type",
	                dataType: "json",
	                contentType : "application/json"
	            },
	            parameterMap: function (model, operation) {
	                if (operation !== "read" && model) {
	                	console.log("Model "+kendo.stringify(model));
	                	return JSON.stringify(model);
	                }
	            }
	        },
	        pageSize: 20,
	        schema: {
	            model: {
	                id: "vatTypeId",
	                fields: {
	                	vatTypeId : { editable: false, nullable: true },
	                	vatCode : { validation: { required: true } },
	                	vatValue : { validation: { required: true } },
	                	status : { validation: { required: true } }
	                }
	            }
	        }
		},
        pageable: true,
        selectable : true,
        height: 500,
        toolbar: ["create"],
        columns: [
            { field: "vatCode", title:"Vat Code"},
            { field: "vatValue", title:"Vat Value"},
            { field: "status", title:"Status", editor: vatStatusDropDownEditor},
            { command: ["edit"], title: "&nbsp;", width: "172px" }],
        editable : "inline"
	});
	
	$("#glAccountsGrid").kendoGrid({
		dataSource : {
			transport: {
	            read:  {
	                url: "/dma/pos_admin/load_gl_accounts",
	                dataType: "json"
	            },
	            update: {
	            	type: "POST",
	                url: "/dma/pos_admin/update_gl_account",
	                dataType: "json",
	                contentType : "application/json"
	            },
	            create: {
	            	type: "POST",
	            	url: "/dma/pos_admin/create_gl_account",
	                dataType: "json",
	                contentType : "application/json"
	            },
	            parameterMap: function (model, operation) {
	                if (operation !== "read" && model) {
	                	console.log("Model "+kendo.stringify(model));
	                	return JSON.stringify(model);
	                }
	            }
	        },
	        pageSize: 20,
	        schema: {
	            model: {
	                id: "glAccountId",
	                fields: {
	                	glAccountId : { editable: false, nullable: true },
	                	glAccountName : { validation: { required: true } },
	                	glAccountType : { validation: { required: true } },
	                	active : { validation: { required: true } }
	                }
	            }
	        }
		},
        pageable: true,
        selectable : true,
        height: 500,
        toolbar: ["create"],
        columns: [
            { field: "glAccountName", title:"GL Account Name"},
            { field: "glAccountType", title:"GL Account Type", template:"#=glAccountType.value#", editor: accountTypeDropDownEditor},
            { field: "active", title:"Active", template:"#=active?'YES':'NO'#", editor: activeFlagDropDownEditor},
            { command: ["edit"], title: "&nbsp;", width: "172px" }],
        editable : "inline"
	});
	
	$("#itemCategoriesGrid").kendoGrid({
		dataSource : {
			transport: {
	            read:  {
	                url: "/dma/pos_admin/load_item_categories",
	                dataType: "json"
	            },
	            update: {
	            	type: "POST",
	                url: "/dma/pos_admin/update_item_category",
	                dataType: "json",
	                contentType : "application/json"
	            },
	            create: {
	            	type: "POST",
	            	url: "/dma/pos_admin/create_item_category",
	                dataType: "json",
	                contentType : "application/json"
	            },
	            parameterMap: function (model, operation) {
	                if (operation !== "read" && model) {
	                	console.log("Model "+kendo.stringify(model));
	                	return JSON.stringify(model);
	                }
	            }
	        },
	        pageSize: 20,
	        schema: {
	            model: {
	                id: "categoryId",
	                fields: {
	                	categoryId : { editable: false, nullable: true },
	                	categoryName : { validation: { required: true } },
	                	glAccount : { validation: { required: true } },
	                	active : { validation: { required: true } }
	                }
	            }
	        }
		},
        pageable: true,
        selectable : true,
        height: 500,
        toolbar: ["create"],
        columns: [
            { field: "categoryName", title:"Category Name"},
            { field: "glAccount", title:"GL Account", template:"#=glAccount.glAccountName#", editor: glAccountDropDownEditor},
            { field: "active", title:"Active", template:"#=active?'YES':'NO'#", editor: activeFlagDropDownEditor},
            { command: ["edit"], title: "&nbsp;", width: "172px" }],
        editable : "inline"
	});
	
	$("#itemsGrid").kendoGrid({
		dataSource : {
			transport: {
	            read:  {
	                url: "/dma/pos_admin/load_item_setups",
	                dataType: "json"
	            },
	            update: {
	            	type: "POST",
	                url: "/dma/pos_admin/update_item_setup",
	                dataType: "json",
	                contentType : "application/json"
	            },
	            create: {
	            	type: "POST",
	            	url: "/dma/pos_admin/create_item_setup",
	                dataType: "json",
	                contentType : "application/json"
	            },
	            parameterMap: function (model, operation) {
	                if (operation !== "read" && model) {
	                	console.log("Model "+kendo.stringify(model));
	                	return JSON.stringify(model);
	                }
	            }
	        },
	        pageSize: 20,
	        schema: {
	            model: {
	                id: "itemId",
	                fields: {
	                	itemId : { editable: false, nullable: true },
	                	itemCode : { validation: { required: true } },
	                	itemName : { validation: { required: true } },
	                	category : { validation: { required: true } },
	                	sellingPrice : { type:"number",validation: { required: true } },
	                	available : { validation: { required: true } }
	                }
	            }
	        }
		},
        pageable: true,
        selectable : true,
        height: 500,
        toolbar: ["create"],
        columns: [
            { field: "itemName", title:"Item Name"},
            { field: "itemCode", title:"Item Code"},
            { field: "category", title:"Category", template:"#=category.categoryName#", editor: itemCategoriesDropDownEditor},
            { field: "sellingPrice", title:"Selling Price"},
            { field: "available", title:"Available", template:"#=available?'YES':'NO'#", editor: activeFlagDropDownEditor},
            { command: ["edit"], title: "&nbsp;", width: "172px" }],
        editable : "inline"
	});
	
	$("#receipsGrid").kendoGrid({
		dataSource : {
			transport: {
	            read:  {
	                url: "/dma/pos_admin/load_receipts",
	                dataType: "json"
	            },
	            update: {
	            	type: "POST",
	                url: "/dma/pos_admin/update_receipt_setup",
	                dataType: "json",
	                contentType : "application/json"
	            },
	            create: {
	            	type: "POST",
	            	url: "/dma/pos_admin/create_receipt_setup",
	                dataType: "json",
	                contentType : "application/json"
	            },
	            parameterMap: function (model, operation) {
	                if (operation !== "read" && model) {
	                	console.log("Model "+kendo.stringify(model));
	                	return JSON.stringify(model);
	                }
	            }
	        },
	        pageSize: 20,
	        schema: {
	            model: {
	                id: "receiptNo",
	                fields: {
	                	receiptNo : { editable: true, nullable: false, validation: { required: true } },
	                	territory : { validation: { required: true } },
	                	bookNo : { validation: { required: true } },
	                	used : { validation: { required: true } }
	                }
	            }
	        }
		},
        pageable: true,
        selectable : true,
        height: 500,
        toolbar: ["create"],
        columns: [
            { field: "receiptNo", title:"Receipt No"},
            { field: "territory", title:"Territory", template:"#=territory.value#", editor: territoriesDropDownEditor},
            { field: "bookNo", title:"Book No"},
            { field: "used", title:"Is Used", template:"#=used?'YES':'NO'#", editor: activeFlagDropDownEditor},
            { command: ["edit"], title: "&nbsp;", width: "172px" }],
        editable : "inline"
	});
	
	/*
	$("#vatsGrid").kendoGrid({
		
	});
	
	$("#cashiersGrid").kendoGrid({
		
	});
	
	
	
	$("#glAccountsGrid").kendoGrid({
		
	});
	
	$("#itemCategoriesGrid").kendoGrid({
		
	});

	*/
}

function itemCategoriesDropDownEditor(container,options){
	$('<input required data-bind="value:' + options.field + '"/>')
    .appendTo(container)
    .kendoDropDownList({
        autoBind: false,
        dataTextField : "categoryName",
        dataValueField : "categoryId",
        optionLabel: "-Please Select-",
        dataSource: itemCategoriesDS
    });
}

function accountTypeDropDownEditor(container,options){
	$('<input required data-bind="value:' + options.field + '"/>')
    .appendTo(container)
    .kendoDropDownList({
        autoBind: false,
        dataTextField : "value",
        dataValueField : "variableId",
        optionLabel: "-Please Select-",
        dataSource: glAccountTypesDS
    });
}

function territoriesDropDownEditor(container,options){
	$('<input required data-bind="value:' + options.field + '"/>')
    .appendTo(container)
    .kendoDropDownList({
        autoBind: false,
        dataTextField : "value",
        dataValueField : "variableId",
        optionLabel: "-Please Select-",
        dataSource: territoriesDS
    });
}

function glAccountDropDownEditor(container,options){
	$('<input required data-bind="value:' + options.field + '"/>')
    .appendTo(container)
    .kendoDropDownList({
        autoBind: false,
        dataTextField : "glAccountName",
        dataValueField : "glAccountId",
        optionLabel: "-Please Select-",
        dataSource: glAccountsDS
    });
}

function territoryDropDownEditor(container,options){
	$('<input required data-bind="value:' + options.field + '"/>')
    .appendTo(container)
    .kendoDropDownList({
        autoBind: false,
        dataTextField : "value",
        dataValueField : "variableId",
        optionLabel: "-Please Select-",
        dataSource: territoriesDS
    });
}

function tillStatusDropDownEditor(container, options) {
	$('<input required data-bind="value:' + options.field + '"/>')
    .appendTo(container)
    .kendoDropDownList({
        autoBind: false,
        optionLabel: "-Please Select-",
        dataSource: ['YES','NO']
    });
}

function vatStatusDropDownEditor(container, options) {
	$('<input required data-bind="value:' + options.field + '"/>')
    .appendTo(container)
    .kendoDropDownList({
        autoBind: false,
        optionLabel: "-Please Select-",
        dataSource: ['Active','Inactive']
    });
}

function activeFlagDropDownEditor(container, options) {
	$('<input required data-bind="value:' + options.field + '"/>')
    .appendTo(container)
    .kendoDropDownList({
        autoBind: false,
        optionLabel: "-Please Select-",
        dataTextField : "label",
        dataValueField : "indx",
        dataSource: [{label:'YES',indx:true},{label:'NO',indx:false}]
    });
}