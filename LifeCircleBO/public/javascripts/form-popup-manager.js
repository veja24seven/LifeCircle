function display_popup(formName,formTemplate,viewModel,submithandler,title, width){
	//declare and initialize window
	var formwindow = $("<div id='current-form-window' style='overflow:hidden;'>").kendoWindow({
		width: width,
        title: title,
        modal: true,
        actions: ["Close"],
        deactivate: function() {
        	console.log("Destroy current window...");
            this.destroy();
        }
	}).data("kendoWindow");
	
	var template = kendo.template($("#"+formTemplate+"").html());
	
	formwindow.content(template);
	
	var form = $("#"+formName+"");
	
	form.submit(function(e){
		e.preventDefault();
		submithandler(e);
	});
	
	$('#cancel-button').click(function(e){
		e.preventDefault();
		form[0].reset();
        formwindow.destroy();
	})
	
	if (viewModel==null)
		kendo.init(form);
	else
		kendo.bind(form,viewModel);
	
	formwindow.center().open();
    
    var onClose = function() {
    	form[0].reset();
        formwindow.destroy();
    }
}

function display_read_popup(template,viewModel,title, width){
	//declare and initialize window
	var formwindow = $("<div id='current-read-window' style='overflow:hidden;'>").kendoWindow({
		width: width,
        title: title,
        modal: true,
        actions: ["Close"],
        deactivate: function() {
        	console.log("Destroy current window...");
            this.destroy();
        }
	}).data("kendoWindow");
	
	var template = kendo.template($("#"+template+"").html());
	
	formwindow.content(template(viewModel));
	kendo.bind($("#current-read-window"),viewModel);
	
	formwindow.center().open();
}

function sendAjaxPost(url,formData,successHandler){
	$.ajax({
        url : url,
        type : "POST",
        contentType : "application/json",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function (data){
            console.log(JSON.stringify(data));
            if (data.status==="Success"){
            	successHandler(data);
            }else{
                alert(data.message);
            }

        },
        error : function (){
            alert("Fail to save : Internal Error");
        }

    });
}

function sendAjaxGet(url,successHandler){
	$.ajax({
        url : url,
        type : "GET",
        contentType : "application/json",
        success : function (data){
            console.log(JSON.stringify(data));
            successHandler(data)
        }
    });
}

function datesRangeHandler(start,end){
	var startChange = function () {
        var startDate = start.value(),
        endDate = end.value();

        if (startDate) {
            startDate = new Date(startDate);
            startDate.setDate(startDate.getDate());
            end.min(startDate);
        } else if (endDate) {
            start.max(new Date(endDate));
        } else {
            endDate = new Date();
            start.max(endDate);
            end.min(endDate);
        }
    },
    endChange = function() {
        var endDate = end.value(),
        startDate = start.value();

        if (endDate) {
            endDate = new Date(endDate);
            endDate.setDate(endDate.getDate());
            start.max(endDate);
        } else if (startDate) {
            end.min(new Date(startDate));
        } else {
            endDate = new Date();
            start.max(endDate);
            end.min(endDate);
        }
    };
	start.bind('change',startChange);
	end.bind('change',endChange);
}