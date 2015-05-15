package za.co.curvedradius.daos;

import play.Logger;
import play.db.jpa.JPA;
import za.co.curvedradius.models.Identity;

/**
 * Created by Mpokie on 2015-04-16.
 */
public class IdentityDao {

    public static Identity findByIdValue(String identityNumber){
        Identity identity = null;
        try {
             identity = JPA.em().createQuery("select i from Identity i where i.identityNumber=?1",Identity.class)
                    .setParameter(1,identityNumber.trim())
                    .getSingleResult();
        }catch (Exception e){
            Logger.error("Error IdentityDao.findByIdValue(" + identityNumber + ") : ", e);
        }
        return identity;
    }

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
