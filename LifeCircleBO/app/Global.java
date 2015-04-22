import play.Application;
import play.GlobalSettings;
import za.co.curvedradius.evolution.ExportSchema;

/**
 * Created by Mpokie on 2015-04-04.
 */
public class Global extends GlobalSettings{
    @Override
    public void onStart(Application application) {
        super.onStart(application);
        ExportSchema.export(true);
    }
}
