function loginUser (){
    var formData = getFormData($("#loginForm" ));
    $.ajax({
        url : "/login",
        type : "POST",
        contentType : "application/json",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function (data){
            console.log("LOGGED IN"+data);
            if (data.status==="Success")
                window.location.href="/";
            else{
                $("#errorMessage").show();
                $("#errorMessage").text(""+data.message);
                console.log("login as admin");
            }

        },
        error : function (){
            $("#errorMessage").show();
            $("#errorMessage").text("Internal Error occurred.");
        }

    });
}