package za.co.curvedradius.daos;

import java.util.ArrayList;
import java.util.List;
import play.db.jpa.JPA;
import za.co.curvedradius.models.Country;

public class CountryDao {
	
	/**
	 * Save Nationality record
	 * @param nat
	 */
	public static void save (Country nat){
        JPA.em().persist(nat);
    }


    /**
     * Get all Countries
     * @return
     */
    public static List<Country> findAll(){
        List<Country> countries = JPA.em()
                .createQuery("select c from Country c", Country.class)
                .getResultList();
        return countries!=null? countries: new ArrayList<Country>();
    }

    /**
     * Get country by name
     * @return
     */
    public static Country findByName(String name){
        Country country = JPA.em()
                .createQuery("select n from Country n where UPPER(n.name) like ?1", Country.class)
                .setParameter(1,"%"+name.toUpperCase()+"%")
                .getSingleResult();
        return country;
    }

    public static Country findById(int countryId){
        return JPA.em().find(Country.class,countryId);
    }

	
}
