package za.co.curvedradius.daos;

import play.Logger;
import play.db.jpa.JPA;
import za.co.curvedradius.models.Contact;

/**
 * Created by Mpokie on 2015-04-16.
 */
public class ContactDao {
    public static Contact findByValueAndType(String contactValue,String contactType){
        Contact contact = null;
        try {
            contact = JPA.em().createQuery("select c from Contact c where upper(c.contactValue)=?1 and upper(c.contactType.value)=?2",Contact.class)
                    .setParameter(1,contactValue.trim().toUpperCase())
                    .setParameter(2,contactType)
                    .getSingleResult();
        }catch (Exception e){
            Logger.error("Error ContactDao.findByValueAndType(" + contactValue + ","+ contactType +") : ", e);
        }

        return contact;
    }

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
