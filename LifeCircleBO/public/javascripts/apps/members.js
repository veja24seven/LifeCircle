function init(){
    $("#membersGrid").kendoGrid({
        pageable: true, selectable : true,
        toolbar: kendo.template($("#member-grid-toolbar-template").html()),
        columns: [
            { field: "person.identity[0].identityNumber", title:"ID Number"},
            { template: "#= person.firstname # #= person.surname #", title:"Name"},
            { field: "preferredLanguage.value", title:"Preferred Language"},
            { field: "scheme.name",title:"Scheme"},
            { field: "schemeCategory.name",title:"Scheme Category"},
            { field: "cover",title:"Cover"},
            { field: "premium",title:"Premium"}],
        change : function(){
            var row = this.select();
            var data = this.dataItem(row);
            currentMember = data;

            $("#editMemberBtn").show();
       }
    });

    attachMemberToolBarActions();
}

function attachMemberToolBarActions(){
    $("#searchTxtIn").keydown(function(e){
        if (e.keyCode==13){
            searchMembers($("#searchTxtIn").val());
        }
    });

    $("#searchBtn").click(function(e){
        searchMembers($("#searchTxtIn").val());
        e.preventDefault();
    });

    $("#addMemberBtn").click(function(e){
        e.preventDefault();
        var viewmodel = kendo.observable({
                    		dataItem : 'Items to be set'
                    	});
        display_read_popup(
            "member-form-template",
            viewmodel,
            "Add Member",
            "1300px"
        );
        initializeSemanticWidgets();
    });
}

function searchMembers(criteria){
    console.log("Search Members by "+criteria);

    reloadKendoGrid("membersGrid","/lifecircle/members/search/"+criteria,10);
    $("#editMemberBtn").hide();
}

function initializeSemanticWidgets(){
    $("#scheme").dropdown();
}