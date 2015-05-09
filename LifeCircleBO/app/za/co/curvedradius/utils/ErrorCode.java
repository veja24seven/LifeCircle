package za.co.curvedradius.utils;

/**
 * Created by Mpokie on 2015-04-04.
 */
public enum ErrorCode {
    INVALID_LOGIN("LGN_101","Invalid username or password"),
    INCORRECT_PASSWORD("LGN_102","Incorrect password"),
    INCORRECT_BRANCH("LGN_103","Incorrect branch"),
    SUCCESS("OK_200","Request Successfully Submitted");

    private String code;
    private String message;

    ErrorCode(String code,String message){
        this.code = code;
        this.message = message;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
