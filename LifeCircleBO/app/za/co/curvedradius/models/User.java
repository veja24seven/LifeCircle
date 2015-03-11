package za.co.curvedradius.models;

import lombok.Data;
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
@Data
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
}
