/**
 * Created with IntelliJ IDEA.
 * User: Harry
 * Date: 2013/10/12
 * Time: 8:47 PM
 * To change this template use File | Settings | File Templates.*/

function getFormData(form){
    var unindexed_array = form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

function showModal () {
    $("#modal").show();
}

function hideModal () {
    $("#modal").hide();
}

function reloadKendoGrid(gridName,remoteUrl,size){
	console.log("Load Data for Grid: "+gridName);
	var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: remoteUrl // the remote service url - Twitter API v1.1
            }
        },
        pageSize: size
    });

    $("#"+gridName+"").data("kendoGrid").setDataSource(dataSource);
    dataSource.read();
}

function reloadKendoGridOnDetailRow(gridName,remoteUrl,size,detailRow){
	var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: remoteUrl // the remote service url - Twitter API v1.1
            }
        },
        pageSize: size
    });

	detailRow.find("."+gridName+"").data("kendoGrid").setDataSource(dataSource);
    dataSource.read();
}


///MAIN SCRIPTS
var cupFormAdded = false;
function addCUPForm (){
	if(cupFormAdded){
		$("#CUPContainer").data("kendoWindow").open();
	    $("#CUPContainer").data("kendoWindow").center();
	    return;
	}
	
	cupFormAdded = true;
	
	$("#CUPContainer").kendoWindow({
        title: "Change User Password",
        actions: ["Close"]
    });
	
    $("#CUPContainer").data("kendoWindow").open();
    $("#CUPContainer").data("kendoWindow").center();

    $("#cancelCUP").click(function(e){
        $("#CUPForm")[0].reset();
        $("#CUPContainer").data("kendoWindow").close();

    });

    $("#CUPForm").submit(function(e){
        var validator = $("#CUPForm").kendoValidator().data("kendoValidator");
        if (validator.validate()){
            var data = getFormData($("#CUPForm"));
            
            saveCUP(data);
        }
        e.preventDefault();
    });
}

function saveCUP (formData) {
	$.ajax({
        url : "/change_password",
        type : "POST",
        contentType : "application/json",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function (data){
        	console.log(JSON.stringify(data));
            if (data.status==="Success"){
            	$("#CUPForm")[0].reset();
                $("#CUPContainer").data("kendoWindow").close();
                window.location.href="/logout";
            }else{
                alert(data.message);
            }
        },
        error : function (){
            alert("Fail to save : Internal Error");
        }

    });
}