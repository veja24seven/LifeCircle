package za.co.curvedradius.models;

import play.data.format.Formats;
import play.data.validation.Constraints;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: Veli Khumalo
 * Date: 2013/10/19
 * Time: 2:45 AM
 * To change this template use File | Settings | File Templates.
 */
@Entity
@Table(name="users")
public class User implements Serializable{

    private static final long serialVersionUID = -4927886078127676971L;

	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "user_id", nullable = false, updatable = false, length = 10)
    private long userId;

    @Constraints.Required
    @Column(name = "username", unique = true, nullable = false, length = 30)
    private String username;

    @Constraints.Required
    @Column(name = "password", unique = false, nullable = false, length = 100)
    private String password;

    @ManyToOne
    @JoinColumn(name = "role_id",nullable = false)
    private Role role;
    
    //@Constraints.Required
	@Column(name = "is_active", unique = false, nullable = false, updatable = true)
	private boolean isActive;
    
    @Formats.DateTime(pattern="dd/MM/yyyy HH:mi:ss")
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "status_date", unique = false, nullable = true, updatable = true)
	private Date statusDate;

    @ManyToOne
    @JoinColumn(name = "person_id",nullable = false)
    private Person person;

    public User() {
    }

    public long getUserId() {
        return this.userId;
    }

    public String getUsername() {
        return this.username;
    }

    public String getPassword() {
        return this.password;
    }

    public Role getRole() {
        return this.role;
    }

    public boolean isActive() {
        return this.isActive;
    }

    public Date getStatusDate() {
        return this.statusDate;
    }

    public Person getPerson() {
        return this.person;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }

    public void setStatusDate(Date statusDate) {
        this.statusDate = statusDate;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof User)) return false;
        final User other = (User) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.userId != other.userId) return false;
        final Object this$username = this.username;
        final Object other$username = other.username;
        if (this$username == null ? other$username != null : !this$username.equals(other$username)) return false;
        final Object this$password = this.password;
        final Object other$password = other.password;
        if (this$password == null ? other$password != null : !this$password.equals(other$password)) return false;
        final Object this$role = this.role;
        final Object other$role = other.role;
        if (this$role == null ? other$role != null : !this$role.equals(other$role)) return false;
        if (this.isActive != other.isActive) return false;
        final Object this$statusDate = this.statusDate;
        final Object other$statusDate = other.statusDate;
        if (this$statusDate == null ? other$statusDate != null : !this$statusDate.equals(other$statusDate))
            return false;
        final Object this$person = this.person;
        final Object other$person = other.person;
        if (this$person == null ? other$person != null : !this$person.equals(other$person)) return false;
        return true;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final long $userId = this.userId;
        result = result * PRIME + (int) ($userId >>> 32 ^ $userId);
        final Object $username = this.username;
        result = result * PRIME + ($username == null ? 0 : $username.hashCode());
        final Object $password = this.password;
        result = result * PRIME + ($password == null ? 0 : $password.hashCode());
        final Object $role = this.role;
        result = result * PRIME + ($role == null ? 0 : $role.hashCode());
        result = result * PRIME + (this.isActive ? 79 : 97);
        final Object $statusDate = this.statusDate;
        result = result * PRIME + ($statusDate == null ? 0 : $statusDate.hashCode());
        final Object $person = this.person;
        result = result * PRIME + ($person == null ? 0 : $person.hashCode());
        return result;
    }

    protected boolean canEqual(Object other) {
        return other instanceof User;
    }

    public String toString() {
        return "za.co.curvedradius.models.User(userId=" + this.userId + ", username=" + this.username + ", password=" + this.password + ", role=" + this.role + ", isActive=" + this.isActive + ", statusDate=" + this.statusDate + ", person=" + this.person + ")";
    }
}
