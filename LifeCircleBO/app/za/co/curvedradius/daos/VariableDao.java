package za.co.curvedradius.daos;

import play.Logger;
import play.db.jpa.JPA;
import za.co.curvedradius.enums.Category;
import za.co.curvedradius.models.Variable;

import java.util.ArrayList;
import java.util.List;

public class VariableDao {
	
	 /**
     * Get all Types
     * @return
     */
    public static List<Variable> findAll(Category category){
        List<Variable> types = category!=null?JPA.em()
                .createQuery("select t from Variable t where t.category=?1 and t.status='Active'", Variable.class)
                .setParameter(1, category)
                .getResultList() : JPA.em()
                .createQuery("select t from Variable t ", Variable.class)
                .getResultList();
        return types!=null? types: new ArrayList<Variable>();
    }

    /**
     * Get Variable by Id
     * @return
     */
    public static Variable findById(long variableId){
    	Logger.info("Find Variable By Its ID :"+variableId);
        Variable type = null;
        try {
        	type = JPA.em().find(Variable.class,variableId);
		} catch (Exception e) {
			Logger.error("Error VariableDao.findById("+variableId+") : ",e);
		}
        return type;
    }
    
    /**
     * Find type by its category and value
     * @param category
     * @param value
     * @return
     */
    public static Variable findByValue (Category category,String value){
    	Variable type = null;
    	try {
    		type = JPA.em()
        			.createQuery("select t from Variable t where t.category=?1 and upper(t.value) = ?2", Variable.class)
        			.setParameter(1, category)
        			.setParameter(2, value.toUpperCase())
        			.getSingleResult();
		} catch (Exception e) {
			Logger.error("Error VariableDao.findByValue("+value+") : ",e);
		}
    	return type;
    }
    
    /**
     * Save Variable
     * @param type
     */
    public static void save (Variable type){
        JPA.em().persist(type);
    }
    
    /**
     * Update Variable
     * @param type
     */
    public static void update (Variable type){
        JPA.em().merge(type);
    }

}
