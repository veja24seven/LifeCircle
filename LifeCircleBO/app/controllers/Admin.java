package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import play.Logger;
import play.db.jpa.Transactional;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import za.co.curvedradius.daos.*;
import za.co.curvedradius.enums.Category;
import za.co.curvedradius.models.*;
import za.co.curvedradius.utils.DateUtil;
import za.co.curvedradius.utils.ErrorCode;
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
    public static Result searchPersons(String criteria){
        List<Person> persons;
        try {
            if (criteria!=null && !criteria.equalsIgnoreCase("%") && !criteria.equalsIgnoreCase("*")){
                persons = PersonDao.findByCriteria(criteria);
            }else{
                persons = PersonDao.findAll();

            }
        } catch (Exception e) {
            e.printStackTrace();
            persons = new ArrayList<Person>();
        }

        return ok(Json.toJson(persons));
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

    @Transactional
     public static Result createPerson(){
        ResultObject result = new ResultObject();
        try {
            JsonNode jnode = request().body().asJson();

            Person person = new Person();

            Identity identity = IdentityDao.findByIdValue(jnode.get("identity").textValue());
            if(identity!=null){
                result.status = ResultObject.ERROR;
                result.message = "ID Number already used in this system.";
            }
            identity = new Identity();
            identity.setIdentityNumber(jnode.get("identity").textValue().trim());
            identity.setIdentityType(VariableDao.findByValue(Category.IDENTITY_TYPES,"COUNTRY ID"));
            IdentityDao.save(identity);
            List<Identity> identities = new ArrayList<>();
            identities.add(identity);

            person.setIdentity(identities);
            person.setFirstname(jnode.get("firstname").textValue());
            person.setSecondname(jnode.get("secondname").textValue());
            person.setThirdname(jnode.get("thirdname").textValue());
            person.setSurname(jnode.get("surname").textValue());
            person.setGender(VariableDao.findById(jnode.get("gender").asLong()));
            person.setDateOfBirth(DateUtil.parseDate(jnode.get("dateOfBirth").textValue(),"yyyy-MM-dd"));
            person.setNationality(CountryDao.findById(jnode.get("nationality").asLong()));

            //set address
            Address address = new Address();
            address.setStreetNumber(jnode.get("streetNumber").textValue());
            address.setStreetName(jnode.get("streetName").textValue());
            address.setSuburb(jnode.get("suburb").textValue());
            address.setTown(jnode.get("town").textValue());
            address.setProvince(jnode.get("province").textValue());
            address.setPostalCode(jnode.get("postalCode").asInt());
            AddressDao.save(address);
            List<Address> addresses = new ArrayList<>();
            addresses.add(address);

            person.setAddresses(addresses);

            //set Contacts
            List<Contact> contacts = new ArrayList<>();
            Contact contact = ContactDao.findByValueAndType(jnode.get("mobile").textValue(), Contact.MOBILE);
            if(contact==null){
                contact = new Contact();
                contact.setContactType(VariableDao.findByValue(Category.CONTACT_TYPES,Contact.MOBILE));
                contact.setContactValue(jnode.get("mobile").textValue().trim());
                ContactDao.save(contact);
            }
            contacts.add(contact);

            contact = ContactDao.findByValueAndType(jnode.get("email").textValue(), Contact.EMAIL);
            if(contact==null){
                contact = new Contact();
                contact.setContactType(VariableDao.findByValue(Category.CONTACT_TYPES,Contact.EMAIL));
                contact.setContactValue(jnode.get("email").textValue().trim());
                ContactDao.save(contact);
            }
            contacts.add(contact);

            person.setContacts(contacts);

            PersonDao.save(person);
            result.status = ResultObject.SUCCESS;
        }catch (Exception e){
            Logger.error("Create Person Unexpected Error > ",e);
            result.status = ResultObject.ERROR;

            result.message = "System fault. Fail to create Person.";
        }
        return ok(Json.toJson(result));
    }

    @Transactional
    public static Result updatePerson(){
        ResultObject result = new ResultObject();
        try {
            JsonNode jnode = request().body().asJson();

            Person person = PersonDao.findById(jnode.get("personId").asLong());

            Identity identity = IdentityDao.findByIdValue(jnode.get("identity").textValue());
            if(identity!=null && person.getIdentity().get(0).getIdentityId()!=identity.getIdentityId()){
                result.status = ResultObject.ERROR;
                result.message = "ID Number already used in this system.";
            }
            if(identity==null){
                identity = person.getIdentity().get(0);
                identity.setIdentityNumber(jnode.get("identity").textValue().trim());
                identity.setIdentityType(VariableDao.findByValue(Category.IDENTITY_TYPES,"COUNTRY ID"));
                IdentityDao.update(identity);
            }

            person.setFirstname(jnode.get("firstname").textValue());
            person.setSecondname(jnode.get("secondname").textValue());
            person.setThirdname(jnode.get("thirdname").textValue());
            person.setSurname(jnode.get("surname").textValue());
            person.setGender(VariableDao.findById(jnode.get("gender").asLong()));
            person.setDateOfBirth(DateUtil.parseDate(jnode.get("dateOfBirth").textValue(),"yyyy-MM-dd"));
            person.setNationality(CountryDao.findById(jnode.get("nationality").asLong()));

            //set address
            Address address = person.getAddresses().get(0);
            address.setStreetNumber(jnode.get("streetNumber").textValue());
            address.setStreetName(jnode.get("streetName").textValue());
            address.setSuburb(jnode.get("suburb").textValue());
            address.setTown(jnode.get("town").textValue());
            address.setProvince(jnode.get("province").textValue());
            address.setPostalCode(jnode.get("postalCode").asInt());
            AddressDao.update(address);

            //set Contacts
            List<Contact> contacts = person.getContacts();
            Contact contact = contacts.stream()
                    .filter(item->item.getContactType().getValue().equals(Contact.MOBILE))
                    .findFirst().orElse(null);
            if(contact==null){
                contact = new Contact();
                contact.setContactType(VariableDao.findByValue(Category.CONTACT_TYPES,Contact.MOBILE));
                contact.setContactValue(jnode.get("mobile").textValue().trim());
                ContactDao.save(contact);
                contacts.add(contact);
            }else{
                contact.setContactValue(jnode.get("mobile").textValue().trim());
                ContactDao.update(contact);
            }


            contact = contacts.stream()
                    .filter(item->item.getContactType().getValue().equals(Contact.EMAIL))
                    .findFirst().orElse(null);
            if(contact==null){
                contact = new Contact();
                contact.setContactType(VariableDao.findByValue(Category.CONTACT_TYPES,Contact.EMAIL));
                contact.setContactValue(jnode.get("email").textValue().trim());
                ContactDao.save(contact);
                contacts.add(contact);
            }else{
                contact.setContactValue(jnode.get("email").textValue().trim());
                ContactDao.update(contact);
            }

            PersonDao.update(person);

            result.status = ResultObject.SUCCESS;
        }catch (Exception e){
            Logger.error("Update Person Unexpected Error > ",e);
            result.status = ResultObject.ERROR;

            result.message = "System fault. Fail to update Person.";
        }
        return ok(Json.toJson(result));
    }
}
