package za.co.curvedradius.mockups;

import za.co.curvedradius.enums.Category;
import za.co.curvedradius.models.Address;
import za.co.curvedradius.models.Person;
import za.co.curvedradius.models.Variable;

/**
 * Created by Mpokie on 2015-04-16.
 */
public class MockData {
    public static Variable createVariable (Category category, String value){
        Variable variable = new Variable();
        variable.setCategory(category);
        variable.setValue(value);
        variable.setStatus("Active");
        return variable;
    }

    public static Person createPerson(String name,String surname){
        Person person = new Person();
        person.setFirstname(name);
        person.setSurname(surname);
        return person;
    }
}
