var currentUser = null;
var currentRole = null;
function init(){
	$("#userAdminTabstrip").kendoTabStrip();
	$("#usersGrid").kendoGrid({
        pageable: true,
        selectable : true,
        height: 500,
        toolbar: kendo.template($("#usersTemplate").html()),
        //detailTemplate: kendo.template($("#vesselDetailTemplate").html()),
        columns: [
            { field: "username", title:"User Name"},
            { field: "person.firstname", title:"First Name"},
            { field: "person.surname",title:"Surname"},
            { field: "person.identity[0].identityNumber",title:"ID Number"},
            { field: "person.gender.value",title:"Gender"},
            { field: "active",title:"Status", template:"#= active? 'Active':'Inactive' #"}],
        change : function(){
            var row = this.select();
            var data = this.dataItem(row);
            currentUser = data;
            console.log("Selected: " + currentUser + " Text, [" + JSON.stringify(currentUser) + "]");
            $("#editUserBtn").show();
            if (currentUser.active){
            	$("#activateUser").hide();
            	$("#deactivateUser").show();
            }else{
            	$("#activateUser").show();
            	$("#deactivateUser").hide();
            }
        }

    });
	
	$("#rolesGrid").kendoGrid({
        pageable: true,
        selectable : true,
        height: 500,
        toolbar: kendo.template($("#rolesTemplate").html()),
        detailTemplate: kendo.template($("#roleDetailTemplate").html()),
        detailInit: showRoleDetail,
        columns: [
            { field: "roleId", title:"Role Id"},
            { field: "description", title:"Role Description"},
            { field: "rights.length",title:"Available Rights"}],
        change : function(){
            var row = this.select();
            var data = this.dataItem(row);
            currentRole = data;
            $("#editRoleBtn").show();
        }

    });
	
	reloadKendoGrid("usersGrid","/lifecircle/users/load",10);
	reloadKendoGrid("rolesGrid","/lifecircle/users/load_roles",10);
	
	$("#addUserBtn").click(function(e){
		addNewUserForm();
		e.preventDefault();
	});
	
	$("#addRoleBtn").click(function(e){
		addNewRoleForm();
		e.preventDefault();
	});
	
	$("#editUserBtn").click(function(e){
		showEditUserForm(currentUser);
		e.preventDefault();
	});
	
	$("#editRoleBtn").click(function(e){
		showEditRoleForm(currentRole);
		e.preventDefault();
	});
	
	$("#activateUser").click(function(e){
		toggleActiveStatus();
	});
	
	$("#deactivateUser").click(function(e){
		toggleActiveStatus();
	});
	
	$("#searchUsersBtn").click(function(e){
		searchUsers($("#userSearch").val());
		e.preventDefault();
	});
	
	$("#userSearch").keydown(function(e){
        if (e.keyCode==13){
        	searchUsers($("#userSearch").val());
        }
    });
	initializeRoleTreeView();
}

function searchUsers(criteria){
	reloadKendoGrid("usersGrid","/lifecircle/users/search/"+criteria,10);
	$("#editUserBtn").hide();
	$("#activateUser").hide();
	$("#deactivateUser").hide();
}

var addUserFormAdded = false;
function addNewUserForm (){
	if(addUserFormAdded){
		$("#addNewUserContainer").data("kendoWindow").open();
	    $("#addNewUserContainer").data("kendoWindow").center();
	    return;
	}
	
	addUserFormAdded = true;
	
	$("#addNewUserContainer").kendoWindow({
        title: "Add New User",
        actions: ["Close"]
    });



	$("#role").kendoDropDownList({
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
        index: 0
    });

    $("#person").kendoDropDownList({
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
            index: 0
        });

    $("#branch").kendoDropDownList({
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
                index: 0
            });

    $("#addNewUserContainer").data("kendoWindow").open();
    $("#addNewUserContainer").data("kendoWindow").center();

    $("#cancelAddNewUser").click(function(e){
        $("#addNewUserForm")[0].reset();
        $("#addNewUserContainer").data("kendoWindow").close();

    });

    $("#addNewUserForm").submit(function(e){
        var validator = $("#addNewUserForm").kendoValidator().data("kendoValidator");
        if (validator.validate()){
            var data = getFormData($("#addNewUserForm"));
            $("#addNewUserForm")[0].reset();
            $("#addNewUserContainer").data("kendoWindow").close();
            saveUser(data);
        }
        e.preventDefault();
    });
    
    
}

var addRoleFormAdded = false;

function addNewRoleForm (){
	if(addRoleFormAdded){
		$("#addNewRoleContainer").data("kendoWindow").open();
	    $("#addNewRoleContainer").data("kendoWindow").center();
	    return;
	}
	
	addRoleFormAdded = true;
	
	$("#addNewRoleContainer").kendoWindow({
        title: "Add New Role",
        actions: ["Close"]
    });
	
	$("#rightsTreeView").kendoTreeView({
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
	
    $("#addNewRoleContainer").data("kendoWindow").open();
    $("#addNewRoleContainer").data("kendoWindow").center();

    $("#cancelAddNewRole").click(function(e){
        $("#addNewRoleForm")[0].reset();
        $("#addNewRoleContainer").data("kendoWindow").close();

    });

    $("#addNewRoleForm").submit(function(e){
        var validator = $("#addNewRoleForm").kendoValidator().data("kendoValidator");
        
        var checkedNodes = [];
        var treeView = $("#rightsTreeView").data("kendoTreeView");
        checkedNodeIds(treeView.dataSource.view(), checkedNodes);
        
        if (validator.validate() && checkedNodes.length>0){
        	
        	var data = getFormData($("#addNewRoleForm"));
        	
        	data.rights = checkedNodes;
        	
            $("#addNewRoleForm")[0].reset();
            $("#addNewRoleContainer").data("kendoWindow").close();
            saveRole(data);
        }
        if(checkedNodes.length==0){
        	alert("Select Applied Rights for this Role.");
        }
        e.preventDefault();
    });
    
    
}

function saveUser (formData) {
	$.ajax({
        url : "/lifecircle/users/create",
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
                alert("Fail to save :"+data.message);
            }
        },
        error : function (){
            alert("Fail to save : Internal Error");
        }

    });
}

function saveRole(formData){
	console.log(JSON.stringify(formData));
	$.ajax({
        url : "/lifecircle/users/create_role",
        type : "POST",
        contentType : "application/json",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function (data){
        	console.log(JSON.stringify(data));
            if (data.status==="Success"){
            	reloadKendoGrid("rolesGrid","/lifecircle/users/load_roles",10);
            }else{
                alert("Fail to save :"+data.message);
            }
        },
        error : function (){
            alert("Fail to save : Internal Error");
        }

    });
}

function toggleActiveStatus(){
	$.ajax({
        url : "/lifecircle/users/toggleActive/"+currentUser.userId,
        type : "POST",
        contentType : "application/json",
        dataType : "json",
        data : JSON.stringify({}),
        success : function (data){
        	console.log(JSON.stringify(data));
            if (data.status==="Success"){
            	reloadKendoGrid("usersGrid","/lifecircle/users/load",10);
            	$("#activateUser").hide();
            	$("#deactivateUser").hide();
            }else{
                alert("Fail to save :"+data.message);
            }
        },
        error : function (){
            alert("Fail to save : Internal Error");
        }

    });
}

function showRoleDetail(e){
	var detailRow = e.detailRow;
	detailRow.find(".rightsGrid").kendoGrid({
		dataSource : e.data.rights,
		columns: [
		          { field: "description", title:"Right Description"},
		          { field: "url", title:"URL Affected"},
		          { field: "httpCommand", title:"Http Method Affected" }]
	});
}

//function that gathers IDs of checked nodes
function checkedNodeIds(nodes, checkedNodes) {
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].checked) {
            checkedNodes.push(nodes[i].rightId);
        }

        if (nodes[i].hasChildren) {
            checkedNodeIds(nodes[i].children.view(), checkedNodes);
        }
    }
}