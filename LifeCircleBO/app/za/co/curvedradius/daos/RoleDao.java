package za.co.curvedradius.daos;

import play.db.jpa.JPA;
import za.co.curvedradius.models.Role;

import java.util.ArrayList;
import java.util.List;

public class RoleDao {
	
	public static List<Role> findAll(){
		List<Role> roles = JPA.em().createQuery("select r from Role r",Role.class)
				.getResultList();
		return roles!=null? roles:new ArrayList<Role>();
	} 
	
	public static Role findById (int roleId){
		return JPA.em().find(Role.class, roleId);
	}
	
	public static void save (Role role){
        JPA.em().persist(role);
    }
	
	public static void update (Role role){
		
        JPA.em().merge(role);
    }
}
