package controllers;

import org.mockito.MockSettings;
import org.mockito.Mockito;
import play.db.jpa.Transactional;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import za.co.curvedradius.daos.*;
import za.co.curvedradius.enums.Category;
import za.co.curvedradius.evolution.ImportCountries;
import za.co.curvedradius.mockups.MockData;
import za.co.curvedradius.models.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by Mpokie on 2015-04-16.
 */
public class Mock extends Controller{

    @Transactional
    public static Result mockAdminUser(){
        Person person = MockData.createPerson("Elias","Khumalo");
        person.setSecondname("Veli");
        person.setDateOfBirth(Date.from(Instant.now()));


        List<Country> countries = ImportCountries.exec();
        for(Country country:countries){
            CountryDao.save(country);
            if(country.getCode().equals("ZA"))
                person.setNationality(country);
        }



        //create contact type variables
        Variable emailVar = MockData.createVariable(Category.CONTACT_TYPES,"EMAIL");
        Variable mobileVar = MockData.createVariable(Category.CONTACT_TYPES,"MOBILE");
        Variable workTel = MockData.createVariable(Category.CONTACT_TYPES,"TELEPHONE(W)");
        Variable homeTel = MockData.createVariable(Category.CONTACT_TYPES,"TELEPHONE(H)");
        VariableDao.save(emailVar);
        VariableDao.save(mobileVar);
        VariableDao.save(workTel);
        VariableDao.save(homeTel);

        //save address type
        Variable homeAddress = MockData.createVariable(Category.ADDRESS_TYPES,"HOME");
        Variable workAddress = MockData.createVariable(Category.CONTACT_TYPES,"WORK");
        VariableDao.save(homeAddress);
        VariableDao.save(workAddress);


        //create gender
        Variable gender = MockData.createVariable(Category.GENDER,"MALE");
        VariableDao.save(gender);
        VariableDao.save(MockData.createVariable(Category.GENDER,"FEMALE"));

        //set person gender
        person.setGender(gender);


        List<Contact> contacts = new ArrayList<>();

        //create contacts
        Contact contact =  new Contact();
        contact.setContactValue("+2782 042 3898");
        contact.setContactType(mobileVar);
        ContactDao.save(contact);
        contacts.add(contact);

        contact =  new Contact();
        contact.setContactValue("veli@curvedradius.co.za");
        contact.setContactType(emailVar);
        ContactDao.save(contact);
        contacts.add(contact);

        contact =  new Contact();
        contact.setContactValue("2721 888 6000");
        contact.setContactType(workTel);
        ContactDao.save(contact);
        contacts.add(contact);

        person.setContacts(contacts);

        List<Identity> identities = new ArrayList<>();
        //create identity
        Variable identVar = MockData.createVariable(Category.IDENTITY_TYPES,"COUNTRY ID");
        VariableDao.save(identVar);
        Identity identity = new Identity();
        identity.setIdentityNumber("8502025710085");
        identity.setIdentityType(identVar);
        IdentityDao.save(identity);
        identities.add(identity);

        person.setIdentity(identities);

        List<Address> addresses = new ArrayList<>();

        //create addresses
        Address address = new Address("67","19th Street","Broadlands Village","Strand","Western Cape",7140);
        AddressDao.save(address);
        addresses.add(address);

        person.setAddresses(addresses);

        PersonDao.save(person);

        contacts = new ArrayList<>();
        contact =  new Contact();
        contact.setContactValue("info@curvedradius.co.za");
        contact.setContactType(emailVar);
        ContactDao.save(contact);
        contacts.add(contact);

        contact =  new Contact();
        contact.setContactValue("2721 222 0000");
        contact.setContactType(workTel);
        ContactDao.save(contact);
        contacts.add(contact);

        Variable branchTypeVar = MockData.createVariable(Category.IDENTITY_TYPES,"COUNTRY ID");
        VariableDao.save(branchTypeVar);
        Branch branch = new Branch("Main Branch","HO001",branchTypeVar,address,contacts);
        BranchDao.save(branch);

        List<Right> rights = new ArrayList<>();
        Right right = new Right("USER_ADMIN");
        RightsDao.save(right);
        rights.add(right);

        Role role = new Role("ADMIN",rights);
        RoleDao.save(role);

        User user = new User(branch,"admin","passwd",role,person,true,Date.from(Instant.now()));
        UserDao.save(user);

        return ok(Json.toJson(user));
    }
}
