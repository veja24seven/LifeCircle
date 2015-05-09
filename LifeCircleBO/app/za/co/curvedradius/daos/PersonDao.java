package za.co.curvedradius.daos;

import play.db.jpa.JPA;
import za.co.curvedradius.models.Address;
import za.co.curvedradius.models.Branch;
import za.co.curvedradius.models.Person;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Mpokie on 2015-04-17.
 */
public class PersonDao {

    public static Person findById (long personId){
        return JPA.em().find(Person.class, personId);
    }

    public static List<Person> findByCriteria(String criteria){
        List<Person> persons = JPA.em()
                .createQuery("select c from Person c where upper(c.surname) like :criteria or upper(c.firstname) like :criteria ",Person.class)
                .setParameter("criteria", "%"+criteria.toUpperCase()+"%")
                .getResultList();
        return persons;
    }

    public static List<Person> findAllByName(String name){
        List<Person> persons = JPA.em().createQuery("select u from Person u where upper(u.firstname) like ?1 or upper(u.surname) like ?2 or u.identity.identityNumber like ?3", Person.class)
                .setParameter(1, "%" + name.toUpperCase() + "%")
                .setParameter(2, "%"+name.toUpperCase()+"%")
                .setParameter(3, "%"+name.toUpperCase()+"%")
                .getResultList();
        return persons!=null? persons:new ArrayList<Person>();
    }

    public static List<Person> findAll(){
        List<Person> persons = JPA.em().createQuery("select u from Person u", Person.class)
                .getResultList();
        return persons!=null? persons:new ArrayList<Person>();
    }

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
