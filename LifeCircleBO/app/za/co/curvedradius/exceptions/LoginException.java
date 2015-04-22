package za.co.curvedradius.exceptions;

/**
 * Created by Mpokie on 2015-04-04.
 */
public class LoginException extends Exception{
    private String code;

    public LoginException(String code,String message) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
