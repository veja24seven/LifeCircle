//lookup data
var operationAreasDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/operationAreas"}
    }
}),
dmaCertificatesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/dma/seafarer_coc/all_dma_certificates"}
    }
}),
issueAuthoritiesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/issueAuthorities"}
    }
}),
issueCountriesDS = new kendo.data.DataSource({
	transport: {read: {dataType: "json",url: "/lookup/countries"}
    }
});

function init(){
	$("#seafarerCocTabstrip").kendoTabStrip();
	
	$("#dmaCertificatesGrid").kendoGrid({
		pageable: true,
        selectable : true,
        height: 500,
		toolbar: kendo.template($("#dmaCertificatesTemplate").html()),
        columns : [	
		           {field:"operationArea",title:"Operation Area"},
		           {field:"certificateCode",title:"Certificate Code"},
		           {field:"className",title:"Class Name"},
		           {field:"classRank",title:"Class Rank"},
		           {field:"gradeName",title:"Grade Name"},
		           {field:"gradeRank",title:"Grade Rank"},
		           {field:"available",title:"Is Available"},
		           {field:"confirmed",title:"Is Confirmed",template:"#= confirmed? 'YES':'NO' #"}
		     ],
		     change : function(){
		            var row = this.select();
		            var data = this.dataItem(row);
		            console.log("Selected: " + data + " Text, [" + JSON.stringify(data) + "]");
		            currentDMACertificate = data;
		            
		            if(currentDMACertificate.confirmed==false){
		            	$("#confirmDMACertificateBtn").show();
		    			$("#editDMACertificateBtn").show();
		            }
		            else{
		            	$("#confirmDMACertificateBtn").hide();
		    			$("#editDMACertificateBtn").hide();
		            }
		        }
	});
	
	$("#foreignConversionsGrid").kendoGrid({
		pageable: true,
        selectable : true,
        height: 500,
		toolbar: kendo.template($("#foreignConversionsTemplate").html()),
        columns : [	
		           {field:"foreignCode",title:"Foreign Code"},
		           {field:"foreignName",title:"Foreign Name"},
		           {field:"foreignRank",title:"Foreign Rank"},
		           {field:"issueCountry",title:"Issue Country"},
		           {field:"issueAuthority",title:"Issue Authority"},
		           {field:"available",title:"Is Available"},
		           {field:"confirmed",title:"Is Confirmed",template:"#= confirmed? 'YES':'NO' #"}
		     ],
	     change : function(){
	            var row = this.select();
	            var data = this.dataItem(row);
	            console.log("Selected: " + data + " Text, [" + JSON.stringify(data) + "]");
	            currentForeignConversion = data;

	            if(currentForeignConversion.confirmed==false){
	            	$("#confirmForeignConversionBtn").show();
	    			$("#editForeignConversionBtn").show();
	            }
	            else{
	            	$("#confirmForeignConversionBtn").hide();
	    			$("#editForeignConversionBtn").hide();
	            }
	        }
	});
	
	attachDMACertificateToolBarActions();
	
	attachForeignConversionToolBarActions();
	
}

function attachDMACertificateToolBarActions(){
	var createDMACertificateSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#dma-certificate-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/seafarer_coc/create_dma_certificate",formData,function(data){
			searchDMACertificates(formData.certificateCode);
			$("#confirmDMACertificateBtn").hide();
			$("#editDMACertificateBtn").hide();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        
	    	alert("DMA Certificate Added successfully.");
		});
	},
	updateDMACertificateSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#dma-certificate-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/seafarer_coc/update_dma_certificate",formData,function(data){
			searchDMACertificates(formData.certificateCode);
			$("#confirmDMACertificateBtn").hide();
			$("#editDMACertificateBtn").hide();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        
	    	alert("DMA Certificate Updated successfully.");
		});
	};
	
	$("#addNewDMACertificateBtn").click(function(e){
		e.preventDefault();
		display_popup(
				"dma-certificate-form",
				"dma-certificate-form-template",
				null,
				createDMACertificateSubmitHandler,
				"Add DMA Certificate",
				"500px"
			);
	});
	$("#editDMACertificateBtn").click(function(e){
		e.preventDefault();
		var viewmodel = kendo.observable({
			certificate : currentDMACertificate
		});
		display_popup(
				"dma-certificate-form",
				"dma-certificate-form-template",
				viewmodel,
				updateDMACertificateSubmitHandler,
				"Edit DMA Certificate",
				"500px"
			);
	});
	
	$("#confirmDMACertificateBtn").click(function(e){
		sendAjaxPost("/dma/seafarer_coc/confirm_dma_certificate/"+currentDMACertificate.certificateId,{},function(data){
			searchDMACertificates(currentDMACertificate.certificateCode);
			$("#confirmDMACertificateBtn").hide();
			$("#editDMACertificateBtn").hide();
        	alert("DMA Certificate confirmed successfully.");
    	});
		e.preventDefault();
	});

	$("#dmaCertificatesSearchBtn").click(function(e){
		searchDMACertificates($("#dmaCertificatesSearchField").val());
		e.preventDefault();
	});
	
	$("#dmaCertificatesSearchField").keydown(function(e){
        if (e.keyCode==13){
        	searchDMACertificates($("#dmaCertificatesSearchField").val());
        }
    });
}

function attachForeignConversionToolBarActions(){
	var createForeignConversionSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#foreign-conversion-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/seafarer_coc/create_foreign_conversion",formData,function(data){
			searchForeignConversions(formData.issueCountry);
			$("#confirmForeignConversionBtn").hide();
			$("#editForeignConversionBtn").hide();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        
	    	alert("Foreign Conversion Added successfully.");
		});
	},
	updateForeignConversionSubmitHandler = function(e){
		e.preventDefault();
		var form = $("#foreign-conversion-form");
		var formData = getFormData(form);
		
		sendAjaxPost("/dma/seafarer_coc/update_foreign_conversion",formData,function(data){
			searchForeignConversions(formData.issueCountry);
			$("#confirmForeignConversionBtn").hide();
			$("#editForeignConversionBtn").hide();
			
	    	form[0].reset();
	        $("#current-form-window").data("kendoWindow").close();
	        
	    	alert("Foreign Conversion Update successfully.");
		});
	};
	
	$("#addNewForeignConversionBtn").click(function(e){
		e.preventDefault();
		display_popup(
				"foreign-conversion-form",
				"foreign-conversion-form-template",
				null,
				createForeignConversionSubmitHandler,
				"Create Foreign Conversion",
				"500px"
			);
	});
	$("#editForeignConversionBtn").click(function(e){
		e.preventDefault();
		var viewmodel = kendo.observable({
			conversion : currentForeignConversion
		});
		display_popup(
				"foreign-conversion-form",
				"foreign-conversion-form-template",
				viewmodel,
				updateForeignConversionSubmitHandler,
				"Edit Foreign Conversion",
				"500px"
			);
	});
	
	$("#confirmForeignConversionBtn").click(function(e){
		
		sendAjaxPost("/dma/seafarer_coc/confirm_foreign_conversion/"+currentForeignConversion.conversionId,{},function(data){
			searchForeignConversions(currentForeignConversion.issueCountry);
			$("#confirmForeignConversionBtn").hide();
			$("#editForeignConversionBtn").hide();
        	alert("Foreign Conversion confirmed successfully.");
    	});
		e.preventDefault();
	});
	

	$("#foreignConversionsSearchBtn").click(function(e){
		searchForeignConversions($("#foreignConversionsSearchField").val());
		e.preventDefault();
	});
	
	$("#foreignConversionsSearchField").keydown(function(e){
        if (e.keyCode==13){
        	searchForeignConversions($("#foreignConversionsSearchField").val());
        }
    });
}

function searchDMACertificates(criteria){
	reloadKendoGrid("dmaCertificatesGrid","/dma/seafarer_coc/search_dma_certificates/"+criteria,10);
	$("#confirmDMACertificateBtn").hide();
}

function searchForeignConversions(criteria){
	reloadKendoGrid("foreignConversionsGrid","/dma/seafarer_coc/search_foreign_conversions/"+criteria,10);
	$("#confirmForeignConversionBtn").hide();
}