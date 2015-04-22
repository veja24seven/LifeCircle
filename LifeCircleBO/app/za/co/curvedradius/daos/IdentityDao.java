package za.co.curvedradius.daos;

import play.db.jpa.JPA;
import za.co.curvedradius.models.Identity;

/**
 * Created by Mpokie on 2015-04-16.
 */
public class IdentityDao {
    public static void update(Identity identity){
        JPA.em().merge(identity);
    }

    public static void save (Identity identity){
        JPA.em().persist(identity);
    }

    public static void remove(Identity identity){
        JPA.em().remove(identity);
    }
}
