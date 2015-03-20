package za.co.curvedradius.main;

import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import play.libs.F;
import play.libs.Json;
import play.mvc.Result;
import play.test.FakeRequest;
import za.co.curvedradius.models.Variable;
import static play.test.Helpers.*;

/**
 * Created by Mpokie on 2015-03-12.
 */
public class VariablesManTest {
    @Test
    public void createVariable() {
        Variable variable = Mockito.mock(Variable.class);

        /*Result result = callAction(
                controllers.routes.ref.VariablesMan.createVariable(),
                new FakeRequest(POST,"/lifecircle/variables/create").withJsonBody(Json.toJson(variable))
        );*/
    }

    @Test
    public void updateVariable() {

    }

    @Test
    public void loadAllVariables(){

    }
}
