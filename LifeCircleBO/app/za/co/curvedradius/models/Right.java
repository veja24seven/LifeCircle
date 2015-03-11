package za.co.curvedradius.models;

import lombok.Data;
import play.data.validation.Constraints;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Created with IntelliJ IDEA.
 * User: Veli Khumalo
 * Date: 2013/10/19
 * Time: 6:10 PM
 * To change this template use File | Settings | File Templates.
 */
@Data
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
}
