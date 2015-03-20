package za.co.curvedradius.models;

import play.data.validation.Constraints;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Created by Mpokie on 2015-03-10.
 */
@Entity
@Table(name="identities")
public class Identity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "identity_id", nullable = false, updatable = false, length = 10)
    private long identityId;

    @Constraints.Required
    @Column(name = "identity_number", unique = true, nullable = false, length = 30)
    private String identityNumber;

    @Constraints.Required
    @ManyToOne
    @JoinColumn(name="identity_type_id",referencedColumnName = "variable_id",nullable = false)
    private Variable identityType;

    public Identity() {
    }

    public long getIdentityId() {
        return this.identityId;
    }

    public String getIdentityNumber() {
        return this.identityNumber;
    }

    public Variable getIdentityType() {
        return this.identityType;
    }

    public void setIdentityId(long identityId) {
        this.identityId = identityId;
    }

    public void setIdentityNumber(String identityNumber) {
        this.identityNumber = identityNumber;
    }

    public void setIdentityType(Variable identityType) {
        this.identityType = identityType;
    }

    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof Identity)) return false;
        final Identity other = (Identity) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.identityId != other.identityId) return false;
        final Object this$identityNumber = this.identityNumber;
        final Object other$identityNumber = other.identityNumber;
        if (this$identityNumber == null ? other$identityNumber != null : !this$identityNumber.equals(other$identityNumber))
            return false;
        final Object this$identityType = this.identityType;
        final Object other$identityType = other.identityType;
        if (this$identityType == null ? other$identityType != null : !this$identityType.equals(other$identityType))
            return false;
        return true;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final long $identityId = this.identityId;
        result = result * PRIME + (int) ($identityId >>> 32 ^ $identityId);
        final Object $identityNumber = this.identityNumber;
        result = result * PRIME + ($identityNumber == null ? 0 : $identityNumber.hashCode());
        final Object $identityType = this.identityType;
        result = result * PRIME + ($identityType == null ? 0 : $identityType.hashCode());
        return result;
    }

    protected boolean canEqual(Object other) {
        return other instanceof Identity;
    }

    public String toString() {
        return "za.co.curvedradius.models.Identity(identityId=" + this.identityId + ", identityNumber=" + this.identityNumber + ", identityType=" + this.identityType + ")";
    }
}
