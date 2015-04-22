package za.co.curvedradius.utils;

/**
 * Created by Mpokie on 2015-04-04.
 */
public class ResultObject {
    public final static String SUCCESS = "Success";
    public final static String ERROR = "Error";

    public String status;
    public String error;
    public String message;
    public Object data;
    public String sessionId;

    public ResultObject() {}

    public ResultObject(String status, String error, String message, Object data) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.data = data;
    }

}
