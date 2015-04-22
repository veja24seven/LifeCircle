package za.co.curvedradius.daos;

import play.db.jpa.JPA;
import za.co.curvedradius.models.Contact;

/**
 * Created by Mpokie on 2015-04-16.
 */
public class ContactDao {
    public static void update(Contact contact){
        JPA.em().merge(contact);
    }

    public static void save (Contact contact){
        JPA.em().persist(contact);
    }

    public static void remove(Contact contact){
        JPA.em().remove(contact);
    }
}
