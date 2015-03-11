package za.co.curvedradius.models;

import lombok.Data;
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
@Data
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

}
