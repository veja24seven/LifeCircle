package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import play.Logger;
import play.db.jpa.Transactional;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import za.co.curvedradius.daos.*;
import za.co.curvedradius.models.*;
import za.co.curvedradius.utils.ResultObject;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Veli Khumalo
 *
 */
@Security.Authenticated(Secured.class)
public class Admin extends Controller{

    @Transactional
    public static Result searchPersons(){
        ResultObject result = new ResultObject();
        result.status = ResultObject.SUCCESS;
        try {
            JsonNode jnode = request().body().asJson();
            String criteria = jnode.get("criteria").textValue();
            if (criteria!=null && !criteria.equalsIgnoreCase("%") && !criteria.equalsIgnoreCase("*")){
                List<Person> persons = PersonDao.findByCriteria(criteria);
                result.data = persons;
            }else{
                List<Person> persons = PersonDao.findAll();
                result.data = persons;
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.data = new ArrayList<Person>();
        }

        return ok(Json.toJson(result));
    }

    @Transactional
    public static Result loadPersonDetail(String personId){
        return ok(Json.toJson(PersonDao.findById(Long.parseLong(personId))));
    }

    @Transactional
    public static Result loadPersons(){
        return ok (Json.toJson(PersonDao.findAll()));
    }

    @Transactional
    public static Result loadBranches(){
        return ok (Json.toJson(BranchDao.findAll()));
    }
    /**
     * Load all User
     * @return
     */
    @Transactional
    public static Result loadAllUsers () {
        return ok (Json.toJson(UserDao.findAll()));
    }

    /**
     * Load all User by Username
     * @return
     */
    @Transactional
    public static Result searchUsersByUsername (String username) {
        return ok (Json.toJson(UserDao.findAllByUsername(username)));
    }

    /**
     *
     */
    @Transactional
    public static Result loadAllRoles(){
        return ok (Json.toJson(RoleDao.findAll()));
    }

    /**
     * Load All Rights
     * @return
     */
    @Transactional
    public static Result loadAllRights (){
        return ok(Json.toJson(RightsDao.findAll()));
    }

    @Transactional
    public static Result createUser(){
        ResultObject result = new ResultObject();
        try{
            JsonNode userJson = request().body().asJson();

            Logger.info("User Datils :" + userJson.toString());

            User user = new User();
            user.setUsername(userJson.get("username").textValue());
            user.setPassword(userJson.get("password").textValue());
            user.setBranch(BranchDao.findById(userJson.get("branch").asLong()));
            user.setPerson(PersonDao.findById(userJson.get("person").asLong()));
            user.setRole(RoleDao.findById(userJson.get("role").asInt()));
            user.setActive(false);
            //user.setStatusDate(new Date());

            Logger.info("User Instance : "+user.toString());
            UserDao.save(user);
            result.status = ResultObject.SUCCESS;
        }catch(Exception e){
            e.printStackTrace();
            result.status = ResultObject.ERROR;
            result.message = "System fault. Fail to Create User.";
        }
        return ok(Json.toJson(result));
    }

    @Transactional
    public static Result updateUser(){
        ResultObject result = new ResultObject();
        try {
            JsonNode userJson = request().body().asJson();
            Logger.info("User Datils :"+userJson.toString());

            User user = UserDao.findById(userJson.get("userId").asInt());
            user.setUsername(userJson.get("username").textValue());
            user.setPassword(userJson.get("password").textValue());
            user.setRole(RoleDao.findById(userJson.get("role").asInt()));

            Logger.info("User Instance : "+user.toString());
            UserDao.update(user);
            result.status = ResultObject.SUCCESS;
        }catch(Exception e){
            e.printStackTrace();
            result.status = ResultObject.ERROR;
            result.message = "System fault. Fail to Update User.";
        }
        return ok(Json.toJson(result));
    }

    @Transactional
    public static Result createRole(){
        ResultObject result = new ResultObject();
        try{
            JsonNode roleJson = request().body().asJson();
            Logger.info("Role >>"+roleJson.toString());

            Role role = new Role();
            role.setDescription(roleJson.get("roleName").textValue());
            JsonNode rightsJson = roleJson.get("rights");

            List<Right> rights = new ArrayList<Right>();

            for (int i=0;i<rightsJson.size();i++){
                Right right = RightsDao.findById(rightsJson.get(i).asInt());
                rights.add(right);
            }

            role.setRights(rights);

            RoleDao.save(role);

            result.status = ResultObject.SUCCESS;
        }catch(Exception e){
            e.printStackTrace();
            result.status = ResultObject.ERROR;
            result.message = "System fault. Fail to save Role.";
        }
        return ok(Json.toJson(result));
    }

    @Transactional
    public static Result updateRole(){
        ResultObject result = new ResultObject();
        try{
            JsonNode roleJson = request().body().asJson();
            Logger.info("Role >>"+roleJson.toString());

            Role role = RoleDao.findById(roleJson.get("roleId").asInt());
            role.setDescription(roleJson.get("roleName").textValue());
            JsonNode rightsJson = roleJson.get("rights");

            List<Right> rights = new ArrayList<Right>();

            for (int i=0;i<rightsJson.size();i++){
                Right right = RightsDao.findById(rightsJson.get(i).asInt());
                rights.add(right);
            }

            role.getRights().clear();
            role.getRights().addAll(rights);

            RoleDao.update(role);

            result.status = ResultObject.SUCCESS;
        }catch(Exception e){
            e.printStackTrace();
            result.status = ResultObject.ERROR;
            result.message = "System fault. Fail to save Role.";
        }
        return ok(Json.toJson(result));
    }

    @Transactional
    public static Result toggleActiveStatus(String userId){
        ResultObject result = new ResultObject();
        try{
            User user = UserDao.findById(Integer.parseInt(userId));
            user.setActive(!user.isActive());

            UserDao.update(user);
            result.status = ResultObject.SUCCESS;
        }catch(Exception e){
            e.printStackTrace();
            result.status = ResultObject.ERROR;
            result.message = "System fault. Fail to change User active status.";
        }
        return ok(Json.toJson(result));
    }

    @Transactional
    public static Result createBranch(){
        ResultObject result = new ResultObject();
        try {
            JsonNode jnode = request().body().asJson();
            Branch branch = new Branch();
            branch.setBranchCode(jnode.get("branchCode").textValue());
            branch.setBranchName(jnode.get("branchName").textValue());
            branch.setBranchType(VariableDao.findById(jnode.get("branchType").asLong()));

            Address address = new Address();
            address.setStreetNumber(jnode.get("streetNumber").textValue());
            address.setStreetName(jnode.get("streetName").textValue());
            address.setSuburb(jnode.get("suburb").textValue());
            address.setTown(jnode.get("town").textValue());
            address.setProvince(jnode.get("province").textValue());
            address.setPostalCode(jnode.get("postalCode").asInt());

            AddressDao.save(address);

            branch.setAddress(address);
            BranchDao.save(branch);
            result.status = ResultObject.SUCCESS;
        }catch (Exception e){
            Logger.error("Create Branch Unexpected Error > ",e);
            result.status = ResultObject.ERROR;

            result.message = "System fault. Fail to create Branch.";;
        }
        return ok(Json.toJson(result));
    }

    @Transactional
    public static Result updateBranch(){
        ResultObject result = new ResultObject();
        try {
            JsonNode jnode = request().body().asJson();
            Branch branch = BranchDao.findById(jnode.get("branchId").asLong());
            branch.setBranchCode(jnode.get("branchCode").textValue());
            branch.setBranchName(jnode.get("branchName").textValue());
            branch.setBranchType(VariableDao.findById(jnode.get("branchType").asLong()));

            Address address = branch.getAddress();
            address.setStreetNumber(jnode.get("streetNumber").textValue());
            address.setStreetName(jnode.get("streetName").textValue());
            address.setSuburb(jnode.get("suburb").textValue());
            address.setTown(jnode.get("town").textValue());
            address.setProvince(jnode.get("province").textValue());
            address.setPostalCode(jnode.get("postalCode").asInt());

            AddressDao.update(address);

            BranchDao.update(branch);
            result.status = ResultObject.SUCCESS;
        }catch (Exception e){
            Logger.error("Update Branch Unexpected Error > ",e);
            result.status = ResultObject.ERROR;

            result.message = "System fault. Fail to update Branch.";
        }
        return ok(Json.toJson(result));
    }
}
