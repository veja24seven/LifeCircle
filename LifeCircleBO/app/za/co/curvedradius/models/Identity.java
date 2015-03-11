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
@Table(name="identities")
public class Identity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "identity_id", nullable = false, updatable = false, length = 10)
    private long identityId;

    @Constraints.Required
    @Column(name = "identity_number", unique = true, nullable = false, length = 30)
    private String identityNumber;

    private Variable identityType;
}
