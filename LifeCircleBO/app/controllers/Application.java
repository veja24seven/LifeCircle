package controllers;

import annotations.HasRights;
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
        User user = (User)Cache.get(Http.Context.current().session().get("session_id"));
        if(user==null){
            session().clear();
            return ok(login.render());
        }
        return ok(home.render(""));
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

                    session("session_id", sessionId);
                    session("username", user.getPerson().getFirstname()+" "+user.getPerson().getSurname());
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

    @HasRights
    @Transactional
    public static Result changeUserPassword(){
        ResultObject result = new ResultObject();
        try {
            JsonNode json = request().body().asJson();
            User user = (User)Cache.get(session("session_id"));
            if(user==null)
                throw new Exception("User session expired. Login to make this request.");

            if(!user.getPassword().equals(json.get("password").asText()))
                throw new Exception("Incorrect User Old password. Please use correct Old User password.");

            user.setPassword(json.get("newpassword").asText());

            UserDao.update(user);

            result.status = ResultObject.SUCCESS;
        } catch (Exception e) {
            e.printStackTrace();
            result.status = ResultObject.ERROR;
            result.message = e.getMessage();
        }
        return ok(Json.toJson(result));
    }

    public static Result logout(){
        Cache.remove(session("session_id"));
        session().clear();
        return redirect("/");
    }

    @HasRights
    public static Result variablesApp(){
        return ok(vars_app.render(""));
    }

    @HasRights
     public static Result admin(){
        return ok(admin.render(""));
    }

    @HasRights
    public static Result userAdmin(){
        return ok(useradmin.render(""));
    }

    @HasRights
    public static Result personsApp() { return ok(people.render(""));}

    @HasRights
    public static Result branchesApp() { return ok(branches.render(""));}

    @HasRights
    public static Result membersApp() { return ok(members.render(""));}

    @HasRights
    public static Result personDisplay(String personId){
        return ok(customer_detail.render(Integer.parseInt(personId)));
    }
}
