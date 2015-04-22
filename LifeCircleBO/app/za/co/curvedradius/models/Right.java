package za.co.curvedradius.models;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Created with IntelliJ IDEA.
 * User: Veli Khumalo
 * Date: 2013/10/19
 * Time: 6:10 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
@Table(name="rights")
public class Right implements Serializable{

    private static final long serialVersionUID = -6327536715991036226L;

	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "right_id", nullable = false, updatable = false, length = 10)
    private int rightId;

	//A user descriptive name to identify the actual functional role of the URL below
    @Column(name = "description", unique = true, nullable = false, updatable = true, length = 100)
    private String description;

    public Right() {
    }

    public int getRightId() {
        return this.rightId;
    }

    public String getDescription() {
        return this.description;
    }

    public void setRightId(int rightId) {
        this.rightId = rightId;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof Right)) return false;
        final Right other = (Right) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.rightId != other.rightId) return false;
        final Object this$description = this.description;
        final Object other$description = other.description;
        if (this$description == null ? other$description != null : !this$description.equals(other$description))
            return false;
        return true;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        result = result * PRIME + this.rightId;
        final Object $description = this.description;
        result = result * PRIME + ($description == null ? 0 : $description.hashCode());
        return result;
    }

    protected boolean canEqual(Object other) {
        return other instanceof Right;
    }

    public String toString() {
        return "za.co.curvedradius.models.Right(rightId=" + this.rightId + ", description=" + this.description + ")";
    }

    public Right(String description) {
        this.description = description;
    }

}
