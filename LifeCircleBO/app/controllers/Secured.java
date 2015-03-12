package controllers;

import play.cache.Cache;
import play.db.jpa.Transactional;
import play.mvc.Http.Context;
import play.mvc.Result;
import play.mvc.Security;
import za.co.curvedradius.daos.UserDao;
import za.co.curvedradius.models.Right;
import za.co.curvedradius.models.Role;
import za.co.curvedradius.models.User;

/**
 * Created with IntelliJ IDEA.
 * User: Veli Khumalo
 * Date: 2013/10/19
 * Time: 4:39 AM
 * To change this template use File | Settings | File Templates.
 */
public class Secured extends Security.Authenticator{
    @Override
    public String getUsername(Context ctx) {
        return ctx.session().get("username");
    }

    @Override
    public Result onUnauthorized(Context ctx) {
        return redirect("/");
    }

    public static String getUsername() {
        return Context.current().session().get("username");
    }

    // Access rights

    @Transactional
    public static boolean hasRole(Context ctx,Role role) {
        String username = ctx.session().get("username");
        return UserDao.hasRole(username, role);
    }

 // Access rights
    @Transactional
    public static boolean hasRight(Context ctx) {
    	User user = UserDao.findById(Integer.parseInt(ctx.session().get("session_id")));
		if (user==null) return false;
		String url = ctx.request().path();
		boolean found = true;
		/*for (Right right:user.getRole().getRights()){
					if (url.equals(right.getUrl())){
						found = true;
						break;
					}
			}*/
		return found;

    }

    public static boolean hasRight(String right) {
    	User user = (User)Cache.get(Context.current().session().get("session_id"));//UserDao.findById(Integer.parseInt(Http.Context.current().session().get("session_id")));
    	if (user==null)
        	return false;
    	boolean found = false;
        for (Right r:user.getRole().getRights()){
			if (right.equals(r.getDescription())){
				found = true;
				break;
			}
		}
        return found;
    }
    
}
