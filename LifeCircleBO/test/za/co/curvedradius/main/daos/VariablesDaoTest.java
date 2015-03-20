package za.co.curvedradius.main.daos;
import controllers.Application;
import org.junit.Before;
import org.junit.Test;

import org.mockito.Mock;
import org.mockito.Mockito;
import play.GlobalSettings;
import play.libs.F;
import play.libs.Json;
import play.mvc.Result;
import play.test.FakeApplication;
import play.test.FakeRequest;
import za.co.curvedradius.daos.VariableDao;
import za.co.curvedradius.enums.Category;
import za.co.curvedradius.evolution.ExportSchema;
import za.co.curvedradius.models.Variable;

import java.util.List;

import static play.test.Helpers.*;
import static org.junit.Assert.*;
/**
 * Created by Mpokie on 2015-03-14.
 */
public class VariablesDaoTest {
    private Application fakeAppWithGlobal;
    @Before
    public void onStart(){
        //export and update test DB schema
        ExportSchema.exportTest(true);
        fakeAppWithGlobal = fakeApplication(new GlobalSettings() {
            @Override
            public void onStart(FakeApplication app) {
                System.out.println("Starting FakeApplication");
            }
        });
    }

    @Test
    public void findAllAddressTypes(){
        running(fakeAppWithGlobal,()->{});
        List<Variable> vars = VariableDao.findAll(Category.ADDRESS_TYPES);
        assertNotNull("Returned list is not suppose to be null",vars);
        assertEquals("Suppose to return an empty list",0,vars.size());
    }

    @Test
    public void findAllContactTypes(){
        List<Variable> vars = VariableDao.findAll(Category.CONTACT_TYPES);
        assertNotNull("Returned list is not suppose to be null",vars);
        assertEquals("Suppose to return an empty list",0,vars.size());
    }

    @Test
    public void findAllIdentityTypes(){
        List<Variable> vars = VariableDao.findAll(Category.IDENTITY_TYPES);
        assertNotNull("Returned list is not suppose to be null",vars);
        assertEquals("Suppose to return an empty list",0,vars.size());
    }


}
