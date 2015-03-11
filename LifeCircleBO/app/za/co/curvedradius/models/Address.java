package za.co.curvedradius.models;

import lombok.Data;
import play.data.validation.Constraints;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Created by Mpokie on 2015-03-10.
 */
@Data
@Entity
@Table(name="addresses")
public class Address  implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "address_id", nullable = false, updatable = false, length = 10)
    private long addressId;

    @Constraints.Required
    @Column(name = "street_number", unique = false, nullable = false, length = 30)
    private String streetNumber;

    @Constraints.Required
    @Column(name = "street_name", unique = false, nullable = false, length = 100)
    private String streetName;

    private String suburb;
    private String town;
    private String province;
}
