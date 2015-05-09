function init(){
    $("#peopleGrid").kendoGrid({
        pageable: true, selectable : true,
        toolbar: kendo.template($("#people-grid-toolbar-template").html()),
        columns: [
            { field: "identity[0].identityNumber", title:"ID Number"},
            { field: "firstname", title:"Name"},
            { field: "surname", title:"Surname"},
            { field: "dateOfBirth", title:"DOB"},
            { field: "nationality.name",title:"Nationality"},
            { field: "gender.value",title:"Gender"},
            { command: { text: "View", click: showCustomerFullDetails }, title: " ", width: "100px" }]
    });
}