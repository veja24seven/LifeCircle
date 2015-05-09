package za.co.curvedradius.daos;
import play.db.jpa.JPA;
import za.co.curvedradius.exceptions.LoginException;
import za.co.curvedradius.models.Role;
import za.co.curvedradius.models.User;
import za.co.curvedradius.utils.ErrorCode;

import java.util.ArrayList;
import java.util.List;

public class UserDao {
	
	public static User findById(long userId){
		return JPA.em().find(User.class, userId);
	}

	public static List<User> findAll() {
		List<User> users = JPA.em().createQuery("select u from User u",User.class)
				.getResultList();
		return users!=null? users:new ArrayList<User>(); 
	}
	
	public static List<User> findAllByUsername(String username){
		List<User> users = JPA.em().createQuery("select u from User u where upper(u.username) like ?1",User.class)
				.setParameter(1, "%"+username.toUpperCase()+"%")
				.getResultList();
		return users!=null? users:new ArrayList<User>();
	}

    public static List<User> findAllByBranchIdAndUsername(long branchId,String criteria){
        List<User> users = JPA.em().createQuery("select u from User u where upper(u.username) like ?1 and u.branch.branchId=?2 ", User.class)
                .setParameter(1, "%" + criteria.toUpperCase() + "%")
                .setParameter(2, branchId)
                .getResultList();
        return users!=null? users:new ArrayList<User>();
    }

    public static List<User> findAllByBranchId(long branchId){
        List<User> users = JPA.em().createQuery("select u from User u where u.branch.branchId=?1 ", User.class)
                .setParameter(1, branchId)
                .getResultList();
        return users!=null? users:new ArrayList<User>();
    }
	
	public static User authenticate(String username,String password) throws LoginException{
        User user = JPA.em()
                .createQuery("select u from User u where u.username='" + username + "'", User.class).getSingleResult();
        if(!user.getPassword().equals(password)){
            throw new LoginException(
                    ErrorCode.INCORRECT_PASSWORD.getCode(),
                    ErrorCode.INCORRECT_PASSWORD.getMessage()
            );
        }
        return user;
    }

    public static boolean hasRole (String username,Role role){
        User user = JPA.em()
                .createQuery("select u from User u where u.username='" + username + "'", User.class).getSingleResult();
        return user.getRole()!=null?user.getRole().getRoleId()==role.getRoleId():false;
    }

    public static void update(User user){
    	JPA.em().merge(user);
    }

    public static void save (User user){
    	JPA.em().persist(user);
    }

    public static void remove(User user){
    	JPA.em().remove(user);
    }
}
