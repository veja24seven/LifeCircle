package za.co.curvedradius.daos;

import play.db.jpa.JPA;
import za.co.curvedradius.models.Address;
import za.co.curvedradius.models.Contact;

/**
 * Created by Mpokie on 2015-04-17.
 */
public class AddressDao {
    public static void update(Address address){
        JPA.em().merge(address);
    }

    public static void save (Address address){
        JPA.em().persist(address);
    }

    public static void remove(Address address){
        JPA.em().remove(address);
    }
}
