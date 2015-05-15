var gendersDS = new kendo.data.DataSource({
		transport: {read: {dataType: "json",url: "/lifecircle/lookup/load/gender"}
        }
	}),
    countriesDS = new kendo.data.DataSource({
        transport: {read: {dataType: "json",url: "/lifecircle/lookup/load_countries"}
          }
    });
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
            {title:"Address", template:"#= addresses[0].streetNumber # #= addresses[0].streetName #, #= addresses[0].suburb #, #= addresses[0].town #, #= addresses[0].province #"}],
        change : function(){
            var row = this.select();
            var data = this.dataItem(row);
            currentPerson = data;

            $("#editPersonBtn").show();
       }
    });

    attachPeopleToolBarActions();
}

function attachPeopleToolBarActions(){
    $("#searchTxtIn").keydown(function(e){
        if (e.keyCode==13){
            searchPeople($("#searchTxtIn").val());
        }
    });

    $("#searchBtn").click(function(e){
        searchPeople($("#searchTxtIn").val());
        e.preventDefault();
    });

    var createPersonSubmitHandler = function(e){
        		e.preventDefault();
        		var form = $("#person-form");
        		var formData = getFormData(form);

        		sendAjaxPost("/lifecircle/admin/create_person",formData,function(data){
        			reloadKendoGrid("peopleGrid","/lifecircle/admin/search_persons/"+formData.surname,10);
        			$("#editPersonBtn").hide();

        			form[0].reset();
        			$("#current-form-window").data("kendoWindow").close();
        			alert("Person Added successfully.");
        		});
        	},
        	updatePersonSubmitHandler = function(e){
        		e.preventDefault();
        		var form = $("#person-form");
        		var formData = getFormData(form);

        		sendAjaxPost("/lifecircle/admin/update_person",formData,function(data){
        			reloadKendoGrid("peopleGrid","/lifecircle/admin/search_persons/"+formData.surname,10);
                    $("#editPersonBtn").hide();

        			form[0].reset();
        			$("#current-form-window").data("kendoWindow").close();
        			alert("Person Updated successfully.");
        		});
        	};
        $("#addPersonBtn").click(function(e){
            	e.preventDefault();
            	display_popup(
            			"person-form",
            			"person-form-template",
            			null,
            			createPersonSubmitHandler,
            			"Add Person",
            			"500px"
            		);
            });

            $("#editPersonBtn").click(function(e){
            	e.preventDefault();
            	var viewmodel = kendo.observable({
            		dataItem : currentPerson,
            		identity : getIdentityNumber(currentPerson.identity),
            		email:getPersonContact(currentPerson.contacts,'EMAIL'),
            		mobile:getPersonContact(currentPerson.contacts,'MOBILE'),
            		address:currentPerson.addresses[0]
            	});
            	display_popup(
            			"person-form",
            			"person-form-template",
            			viewmodel,
            			updatePersonSubmitHandler,
            			"Edit Person",
            			"500px"
            		);
            });
}

function searchPeople(criteria){
    console.log("Search People by "+criteria);

    reloadKendoGrid("peopleGrid","/lifecircle/admin/search_persons/"+criteria,10);
    $("#editPersonBtn").hide();
    $("#activatePersonBtn").hide();
    $("#deactivatePersonBtn").hide();
}

function getIdentityNumber(identities){
    for(var i = 0; i < identities.length; i++) {
        var identity = identities[i];
        if(identity.identityType.value=='COUNTRY ID'){
            return identity;
        }
    }
}

function getPersonContact(contacts,type){
    for(var i = 0; i < contacts.length; i++) {
        var contact = contacts[i];
        if(contact.contactType.value==type){
            return contact;
        }
    }
}