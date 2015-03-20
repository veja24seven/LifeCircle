package za.co.curvedradius.daos;

import play.db.jpa.JPA;
import za.co.curvedradius.models.Right;

import java.util.ArrayList;
import java.util.List;

public class RightsDao {
	
	public static Right findById(int rightId){
		return JPA.em().find(Right.class, rightId);
	}
	
	public static List<Right> findAll (){
		List<Right> rights = JPA.em().createQuery("select r from Right r",Right.class)
				.getResultList();
		return rights!=null? rights:new ArrayList<Right>();
	}
	
	public static void save(Right right){
        JPA.em().persist(right);
    }

}
