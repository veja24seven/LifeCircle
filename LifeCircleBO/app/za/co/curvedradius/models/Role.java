package za.co.curvedradius.models;

import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: Veli Khumalo
 * Date: 2013/10/19
 * Time: 2:48 AM
 * To change this template use File | Settings | File Templates.
 */
@Entity
@Table(name="roles")
public class Role implements Serializable{

    private static final long serialVersionUID = -7075339928092904672L;

	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "role_id", nullable = false, updatable = false, length = 10)
    private long roleId;

    @Column(name = "description", unique = true, nullable = false, updatable = true, length = 100)
    private String description;

    @ManyToMany(fetch = FetchType.EAGER)
    @Cascade({CascadeType.SAVE_UPDATE, CascadeType.DELETE})
    private List<Right> rights;

    public Role() {
    }

    public long getRoleId() {
        return this.roleId;
    }

    public String getDescription() {
        return this.description;
    }

    public List<Right> getRights() {
        return this.rights;
    }

    public void setRoleId(long roleId) {
        this.roleId = roleId;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setRights(List<Right> rights) {
        this.rights = rights;
    }

    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof Role)) return false;
        final Role other = (Role) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.roleId != other.roleId) return false;
        final Object this$description = this.description;
        final Object other$description = other.description;
        if (this$description == null ? other$description != null : !this$description.equals(other$description))
            return false;
        final Object this$rights = this.rights;
        final Object other$rights = other.rights;
        if (this$rights == null ? other$rights != null : !this$rights.equals(other$rights)) return false;
        return true;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final long $roleId = this.roleId;
        result = result * PRIME + (int) ($roleId >>> 32 ^ $roleId);
        final Object $description = this.description;
        result = result * PRIME + ($description == null ? 0 : $description.hashCode());
        final Object $rights = this.rights;
        result = result * PRIME + ($rights == null ? 0 : $rights.hashCode());
        return result;
    }

    protected boolean canEqual(Object other) {
        return other instanceof Role;
    }

    public String toString() {
        return "za.co.curvedradius.models.Role(roleId=" + this.roleId + ", description=" + this.description + ", rights=" + this.rights + ")";
    }
}
