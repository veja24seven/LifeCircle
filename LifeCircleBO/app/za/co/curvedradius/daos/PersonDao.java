package za.co.curvedradius.daos;

import play.db.jpa.JPA;
import za.co.curvedradius.models.Address;
import za.co.curvedradius.models.Person;

/**
 * Created by Mpokie on 2015-04-17.
 */
public class PersonDao {
    public static void update(Person person){
        JPA.em().merge(person);
    }

    public static void save (Person person){
        JPA.em().persist(person);
    }

    public static void remove(Person person){
        JPA.em().remove(person);
    }
}
