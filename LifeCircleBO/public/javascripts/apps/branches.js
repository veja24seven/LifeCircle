var branchesDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lifecircle/admin/load_branches"}
        }
	}),
    branchTypesDS = new kendo.data.DataSource({
        transport: {read: {dataType: "json",url: "/lifecircle/lookup/load/branch_types"}
          }
    });

function init(){
    $("#branchesGrid").kendoGrid({
    	pageable: true, selectable : true,
    	toolbar: kendo.template($("#branches-grid-toolbar-template").html()),
    	dataSource:branchesDS,
    	columns : [
            {title:"Branch Code", field:"branchCode"},
            {title:"Branch Name", field:"branchName"},
            {title:"Branch Type", field:"branchType.value"},
            {title:"Branch Address", template:"#= address.streetNumber # #= address.streetName #, #= address.suburb #, #= address.town #, #= address.province #"}
        ],
        change : function(){
            var row = this.select();
            var data = this.dataItem(row);
            currentBranch = data;

            $("#branchEditBtn").show();
        }
    });

    attachBranchesToolBarActions();
}

function attachBranchesToolBarActions(){

    var createBranchSubmitHandler = function(e){
    		e.preventDefault();
    		var form = $("#branch-form");
    		var formData = getFormData(form);

    		sendAjaxPost("/lifecircle/admin/create_branch",formData,function(data){
    			reloadKendoGrid("branchesGrid","/lifecircle/admin/load_branches",10);
    			$("#branchEditBtn").hide();

    			form[0].reset();
    			$("#current-form-window").data("kendoWindow").close();
    			alert("Branch Added successfully.");
    		});
    	},
    	updateBranchSubmitHandler = function(e){
    		e.preventDefault();
    		var form = $("#branch-form");
    		var formData = getFormData(form);

    		sendAjaxPost("/lifecircle/admin/update_branch",formData,function(data){
    			reloadKendoGrid("branchesGrid","/lifecircle/admin/load_branches",10);
                $("#branchEditBtn").hide();

    			form[0].reset();
    			$("#current-form-window").data("kendoWindow").close();
    			alert("Branch Updated successfully.");
    		});
    	};
    $("#branchAddBtn").click(function(e){
        	e.preventDefault();
        	display_popup(
        			"branch-form",
        			"branch-form-template",
        			null,
        			createBranchSubmitHandler,
        			"Add Branch",
        			"500px"
        		);
        });

        $("#branchEditBtn").click(function(e){
        	e.preventDefault();
        	var viewmodel = kendo.observable({
        		dataItem : currentBranch
        	});
        	display_popup(
        			"branch-form",
        			"branch-form-template",
        			viewmodel,
        			updateBranchSubmitHandler,
        			"Edit Branch",
        			"500px"
        		);
        });
}