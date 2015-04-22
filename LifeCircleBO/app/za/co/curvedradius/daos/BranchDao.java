package za.co.curvedradius.daos;

import play.db.jpa.JPA;
import za.co.curvedradius.models.Address;
import za.co.curvedradius.models.Branch;

/**
 * Created by Mpokie on 2015-04-17.
 */
public class BranchDao {
    public static void update(Branch branch){
        JPA.em().merge(branch);
    }

    public static void save (Branch branch){
        JPA.em().persist(branch);
    }

    public static void remove(Branch branch){
        JPA.em().remove(branch);
    }
}
