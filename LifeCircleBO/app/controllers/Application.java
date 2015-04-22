package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import play.*;
import play.cache.Cache;
import play.db.jpa.Transactional;
import play.libs.Json;
import play.mvc.*;

import tyrex.services.UUID;
import views.html.*;
import za.co.curvedradius.daos.UserDao;
import za.co.curvedradius.exceptions.LoginException;
import za.co.curvedradius.models.Branch;
import za.co.curvedradius.models.User;
import za.co.curvedradius.utils.ErrorCode;
import za.co.curvedradius.utils.ResultObject;

public class Application extends Controller {

    public static Result index() {
        return ok(index.render("Your new application is ready."));
    }

    @Transactional
    public static Result login() {
        ResultObject result = new ResultObject();

        JsonNode jnode = request().body().asJson();
        Logger.info("Payload: "+jnode);
        try{
            User user = UserDao.authenticate(
                    jnode.get("username").textValue(),
                    jnode.get("password").textValue()
            );
            if(user!=null){
                Logger.info("User found: "+user);
                Branch branch = user.getBranch();
                if(branch!=null && branch.getBranchCode().equals(jnode.get("branch").textValue())){
                    String sessionId = UUID.create();
                    result = new ResultObject(
                            ResultObject.SUCCESS,
                            ErrorCode.SUCCESS.getCode(),
                            ErrorCode.SUCCESS.getMessage(),
                            user
                    );
                    result.sessionId = sessionId;
                    Cache.set(sessionId,user);
                }else{
                    throw new LoginException(ErrorCode.INCORRECT_BRANCH.getCode(),ErrorCode.INCORRECT_BRANCH.getMessage());
                }
            }else{
                throw new LoginException(ErrorCode.INVALID_LOGIN.getCode(),ErrorCode.INVALID_LOGIN.getMessage());
            }
        }catch (LoginException e){
            Logger.error("Application.login Error > ",e);
            result = new ResultObject(
                    ResultObject.ERROR,
                    e.getCode(),
                    e.getMessage(),
                    null
                );
        }
        finally {
            Logger.info("Login done : {}",Json.toJson(result));
        }
        return ok(Json.toJson(result));
    }
}
