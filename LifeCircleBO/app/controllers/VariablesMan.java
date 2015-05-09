package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import play.db.jpa.Transactional;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import za.co.curvedradius.daos.VariableDao;
import za.co.curvedradius.enums.Category;
import za.co.curvedradius.models.Variable;

/**
 * 
 * @author Veli Khumalo 2014-02-22
 *
 */
@Security.Authenticated(Secured.class)
public class VariablesMan extends Controller {
	
	@Transactional
	public static Result loadAllVariables(){
		return ok(Json.toJson(VariableDao.findAll(null)));
	}
	
	@Transactional 
	public static Result createVariable(){
		try {
			JsonNode json = request().body().asJson();
			
			Variable variable = new Variable();
			variable.setCategory(Category.valueOf(json.get("category").textValue()));
			variable.setValue(json.get("value").textValue());
			variable.setStatus(json.get("status").textValue());
			
			VariableDao.save(variable);
			return ok(Json.toJson(variable));
		} catch (Exception e) {
			return ok("System Error. Fail to create Variable.");
		}
	}
	
	@Transactional 
	public static Result updateVariable(){
		try {
			JsonNode json = request().body().asJson();
			
			Variable variable = VariableDao.findById(json.get("variableId").asLong());
			variable.setCategory(Category.valueOf(Category.class, json.get("category").textValue()));
			variable.setValue(json.get("value").textValue());
			variable.setStatus(json.get("status").textValue());
			
			VariableDao.update(variable);
			return ok(Json.toJson(variable));
		} catch (Exception e) {
			return ok("System Error. Fail to create Variable.");
		}
	}

}
