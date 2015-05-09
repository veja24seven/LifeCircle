package za.co.curvedradius.daos;

import play.db.jpa.JPA;
import za.co.curvedradius.models.Branch;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Mpokie on 2015-04-17.
 */
public class BranchDao {
    public static Branch findById (long branchId){
        return JPA.em().find(Branch.class, branchId);
    }

    public static List<Branch> findAll(){
        List<Branch> branches = JPA.em().createQuery("select u from Branch u", Branch.class)
                .getResultList();
        return branches!=null? branches:new ArrayList<Branch>();
    }

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
