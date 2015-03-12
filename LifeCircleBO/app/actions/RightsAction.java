package actions;

import annotations.HasRights;
import play.Logger;
import play.cache.Cache;
import play.libs.F.Promise;
import play.mvc.Action;
import play.mvc.Http;
import play.mvc.Result;
import za.co.curvedradius.models.User;

public class RightsAction  extends Action<HasRights> {

	/* (non-Javadoc)
	 * @see play.mvc.Action#call(play.mvc.Http.Context)
	 */
    @Override
    public Promise<Result> call(Http.Context ctx) throws Throwable {
        User user = (User)Cache.get(Http.Context.current().session().get("session_id"));//UserDao.findById(Integer.parseInt(ctx.session().get("session_id")));

        if(user==null) return Promise.pure((Result)redirect("/"));

        //String url = ctx.request().path();
        boolean found = true;
        /*for (Right right:user.getRole().getRights()){
            if (url.equals(right.getUrl())){
                found = true;
                break;
            }
        }*/
        if (!found){
            Logger.info("Has no permission to access this page ::"+ctx.request().path());
            return Promise.pure((Result)redirect("/"));
        }

        return delegate.call(ctx);
    }
	/*@Override
	public Result call(Context ctx) throws Throwable {
		User user = UserDao.findById(Integer.parseInt(ctx.session().get("session_id")));
		Logger.info("Has no permission ");
		String [] rights = configuration.value().split("\\|");
		if (rights.length>0){
			for (String r:rights){
				boolean found = false;
				for (Right right:user.getRole().getRights()){
					if (r.equals(right.getDescription())){
						found = true;
						break;
					}
				}
				if (!found){
					Logger.info("Has no permission to access this page ::"+ctx.request().path());
					return redirect("/");
				}
			}
			
		}
		return delegate.call(ctx);
	}*/
}
