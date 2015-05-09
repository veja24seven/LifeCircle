//datasource
var categoriesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lifecircle/lookup/variableCategories"}
    },
    sort: { dir: "asc" }
});

function init(){
	var dataSource = new kendo.data.DataSource({
        transport: {
            read:  {
                url: "/lifecircle/variables/load_all",
                dataType: "json"
            },
            update: {
            	type: "POST",
                url: "/lifecircle/variables/update",
                dataType: "json",
                contentType : "application/json"
            },
            create: {
            	type: "POST",
            	url: "/lifecircle/variables/create",
                dataType: "json",
                contentType : "application/json"
            },
            parameterMap: function (model, operation) {
                if (operation !== "read" && model) {
                	console.log("Model "+kendo.stringify(model));
                	return JSON.stringify({variableId:model.variableId,category:model.category,
                		value:model.value,status:model.status});
                }
            }
        },
        pageSize: 20,
        schema: {
            model: {
                id: "variableId",
                fields: {
                	variableId: { editable: false, nullable: true },
                    category : { validation: { required: true } },
                    value : { validation: { required: true } },
                    status : { validation: { required: true } }
                }
            }
        }
    });
	$("#variablesGrid").kendoGrid({
		dataSource : dataSource,
        pageable: true,
        selectable : true,
        height: 500,
        toolbar: ["create"],
        filterable: {
            extra: false,
            operators: {
                string: {
                    startswith: "Starts with",
                    eq: "Is equal to",
                    neq: "Is not equal to"
                }
            }
        },
        columns: [
            { field: "category", title:"Category", editor: categoryDropDownEditor,filterable: {ui: categoryFilter}},
            { field: "value", title:"Variable Value"},
            { field: "status",title:"Variable Status", filterable: false, editor: statusDropDownEditor},
            { command: ["edit"], title: "&nbsp;", width: "172px" }],
        editable : "inline"
    });
	
	
}

function categoryDropDownEditor(container, options) {
	$('<input required data-bind="value:' + options.field + '"/>')
    .appendTo(container)
    .kendoDropDownList({
        autoBind: false,
        optionLabel: "-Please Select-",
        dataSource: categoriesDS
    });
}

function statusDropDownEditor(container, options) {
	$('<input required data-bind="value:' + options.field + '"/>')
    .appendTo(container)
    .kendoDropDownList({
        autoBind: false,
        optionLabel: "-Please Select-",
        dataSource: ['Active','Inactive']
    });
}

function categoryFilter(element){
	element.kendoDropDownList({
        dataSource: categoriesDS,
        optionLabel: "--Select Value--"
    });
}