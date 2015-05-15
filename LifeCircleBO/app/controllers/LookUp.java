package controllers;

import play.db.jpa.Transactional;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import za.co.curvedradius.daos.CountryDao;
import za.co.curvedradius.daos.VariableDao;
import za.co.curvedradius.enums.Category;

/**
 * Created by Mpokie on 2015-03-12.
 */
public class LookUp extends Controller {
    @Transactional
    public static Result load (String category){
        return ok(
                Json.toJson(
                        VariableDao.findAll(
                                Category.valueOf(category.toUpperCase())
                        )
                )
        );
    }

    @Transactional
    public static Result loadCountries(){
        return ok(Json.toJson(CountryDao.findAll()));
    }

    @Transactional
    public static Result variableCategories(){
        return ok(Json.toJson(Category.values()));
    }
}
