var userEditFormAdded = false;
function showEditUserForm (dataItem) {
	if(userEditFormAdded){
		$("#editUserContainer").data("kendoWindow").open();
	    $("#editUserContainer").data("kendoWindow").center();
	    fillUserForm(dataItem);
	    return;
	}
	userEditFormAdded = true;
	
	$("#editUserContainer").kendoWindow({
        title: "Edit User",
        actions: ["Close"]
    });

	$("#personEdit").kendoDropDownList({
        dataTextField: "surname",
        dataValueField: "personId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lifecircle/admin/load_persons"
                }
            }
        },
        value : dataItem.person.personId
    });

    $("#branchEdit").kendoDropDownList({
        dataTextField: "branchName",
        dataValueField: "branchId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lifecircle/admin/load_branches"
                }
            }
        },
        value : dataItem.branch.branchId
    });

	$("#roleEdit").kendoDropDownList({
        dataTextField: "description",
        dataValueField: "roleId",
        optionLabel: "-Please Select-",
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/lifecircle/users/load_roles"
                }
            }
        },
        value : dataItem.role.roleId
    });
	
    $("#editUserContainer").data("kendoWindow").open();
    $("#editUserContainer").data("kendoWindow").center();
    
    fillUserForm(dataItem);
    $("#cancelEditUser").click(function(e){
        $("#editUserForm")[0].reset();
        $("#editUserContainer").data("kendoWindow").close();

    });

    $("#editUserForm").submit(function(e){
        var validator = $("#editUserForm").kendoValidator().data("kendoValidator");
        if (validator.validate()){
            var data = getFormData($("#editUserForm"));
            $("#editUserForm")[0].reset();
            $("#editUserContainer").data("kendoWindow").close();
            updateUser(data);
        }
        e.preventDefault();
    });
}

var roleEditFormAdded = false;
function showEditRoleForm (dataItem) {
	if(roleEditFormAdded){
		$("#editRoleContainer").data("kendoWindow").open();
	    $("#editRoleContainer").data("kendoWindow").center();
	    fillRoleForm(dataItem);
	    return;
	}
	roleEditFormAdded = true;
	
	$("#editRoleContainer").kendoWindow({
        title: "Edit Role",
        actions: ["Close"]
    });
	
	$("#editRoleContainer").data("kendoWindow").open();
    $("#editRoleContainer").data("kendoWindow").center();
    
    fillRoleForm(dataItem);
    $("#cancelEditRole").click(function(e){
        $("#editRoleForm")[0].reset();
        $("#editRoleContainer").data("kendoWindow").close();

    });

    $("#editRoleForm").submit(function(e){
    	var validator = $("#editRoleForm").kendoValidator().data("kendoValidator");
        
        var checkedNodes = [];
        var treeView = $("#rightsTreeViewEdit").data("kendoTreeView");
        checkedNodeIds(treeView.dataSource.view(), checkedNodes);
        
        if (validator.validate() && checkedNodes.length>0){
        	
        	var data = getFormData($("#editRoleForm"));
        	
        	data.rights = checkedNodes;
        	
            $("#editRoleForm")[0].reset();
            $("#editRoleContainer").data("kendoWindow").close();
            updateRole(data);
        }
        if(checkedNodes.length==0){
        	alert("Select Applied Rights for this Role.");
        }
        e.preventDefault();
    });
}

var roleTreeViewInitialized = false;
function initializeRoleTreeView(){
	if(roleTreeViewInitialized)
		return;
	roleTreeViewInitialized = true;
	$("#rightsTreeViewEdit").kendoTreeView({
		checkboxes: {
            checkChildren: true
        },
        dataSource: {
        	transport: {
                read: {
                    dataType: "json",
                    url: "/lifecircle/users/load_rights"
                }
            }
        },
        template : "#: item.description #"
	});
}

function fillUserForm(data){
	$("#userId").val(data.userId);
	$("#usernameEdit").val(data.username);
	$("#passwordEdit").val(data.password);
	$("#firstnameEdit").val(data.firstName);
	$("#lastnameEdit").val(data.lastName);
	$("#employeeNoEdit").val(data.employeeNumber);
	$("#emailEdit").val(data.email);
}

function fillRoleForm(data){
	$("#roleId").val(data.roleId);
	$("#roleNameEdit").val(data.description);
	var treeview = $("#rightsTreeViewEdit").data("kendoTreeView");
	
	//de-select all
	$.each(treeview.dataSource.view(),function(i,item){
		item.checked= false;
	});
	
	$.each(data.rights, function(index, right){
	       var node = treeview.findByText(right.description);
	       node.find('input[type="checkbox"]').prop("checked",true);
	       var viewItem = treeview.dataSource.view()[index];
	       viewItem.checked = true;
	    });
}

function updateUser(formData){
	$.ajax({
        url : "/lifecircle/users/update_user",
        type : "POST",
        contentType : "application/json",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function (data){
        	console.log(JSON.stringify(data));
            if (data.status==="Success"){
            	reloadKendoGrid("usersGrid","/lifecircle/users/load",10);
            	$("#editUserBtn").hide();
            	$("#activateUser").hide();
            	$("#deactivateUser").hide();
            }else{
                alert("Fail to update :"+data.message);
            }
        },
        error : function (){
            alert("Fail to save : Internal Error");
        }

    });
}

function updateRole(formData){
	$.ajax({
        url : "/lifecircle/users/update_role",
        type : "POST",
        contentType : "application/json",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function (data){
        	console.log(JSON.stringify(data));
            if (data.status==="Success"){
            	reloadKendoGrid("rolesGrid","/lifecircle/users/load_roles",10);
            	$("#editRoleBtn").hide();
            }else{
                alert("Fail to update :"+data.message);
            }
        },
        error : function (){
            alert("Fail to save : Internal Error");
        }

    });
}