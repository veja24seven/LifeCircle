package za.co.curvedradius.models;

import org.hibernate.annotations.Entity;
import play.data.validation.Constraints;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Created by Mpokie on 2015-03-10.
 */
@Entity
@Table(name="contacts")
public class Contact implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "contact_id", nullable = false, updatable = false, length = 10)
    private long contactId;

    @Constraints.Required
    @Column(name = "contact_value", unique = false, nullable = false, length = 100)
    private String contactValue;

    @Constraints.Required
    @ManyToOne
    @JoinColumn(name="contact_type_id",referencedColumnName = "variable_id",nullable = false)
    private Variable contactType;

    public Contact() {
    }

    public long getContactId() {
        return this.contactId;
    }

    public String getContactValue() {
        return this.contactValue;
    }

    public Variable getContactType() {
        return this.contactType;
    }

    public void setContactId(long contactId) {
        this.contactId = contactId;
    }

    public void setContactValue(String contactValue) {
        this.contactValue = contactValue;
    }

    public void setContactType(Variable contactType) {
        this.contactType = contactType;
    }

    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof Contact)) return false;
        final Contact other = (Contact) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.contactId != other.contactId) return false;
        final Object this$contactValue = this.contactValue;
        final Object other$contactValue = other.contactValue;
        if (this$contactValue == null ? other$contactValue != null : !this$contactValue.equals(other$contactValue))
            return false;
        final Object this$contactType = this.contactType;
        final Object other$contactType = other.contactType;
        if (this$contactType == null ? other$contactType != null : !this$contactType.equals(other$contactType))
            return false;
        return true;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final long $contactId = this.contactId;
        result = result * PRIME + (int) ($contactId >>> 32 ^ $contactId);
        final Object $contactValue = this.contactValue;
        result = result * PRIME + ($contactValue == null ? 0 : $contactValue.hashCode());
        final Object $contactType = this.contactType;
        result = result * PRIME + ($contactType == null ? 0 : $contactType.hashCode());
        return result;
    }

    protected boolean canEqual(Object other) {
        return other instanceof Contact;
    }

    public String toString() {
        return "za.co.curvedradius.models.Contact(contactId=" + this.contactId + ", contactValue=" + this.contactValue + ", contactType=" + this.contactType + ")";
    }
}
