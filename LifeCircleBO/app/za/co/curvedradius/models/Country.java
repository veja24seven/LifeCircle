package za.co.curvedradius.models;

import lombok.Data;
import play.data.validation.Constraints;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Created with IntelliJ IDEA.
 * User: Veli Khumalo
 * Date: 2013/10/18
 * Time: 8:20 PM
 * To change this template use File | Settings | File Templates.
 */
@Data
@Entity
@Table(name="countries")
public class Country implements Serializable{

	private static final long serialVersionUID = -5571276832284271355L;

	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "country_id", nullable = false, updatable = false, length = 10)
    private long countryId;

    @Constraints.Required
    @Column(name = "isocode", unique = true, nullable = false, updatable = false, length = 4)
    private String code;

    @Constraints.Required
    @Column(name = "name", unique = false, nullable = false, updatable = true, length = 100)
    private String name;
}
