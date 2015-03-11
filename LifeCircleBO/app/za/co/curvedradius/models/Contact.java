package za.co.curvedradius.models;

import lombok.Data;
import org.hibernate.annotations.Entity;
import play.data.validation.Constraints;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Created by Mpokie on 2015-03-10.
 */
@Data
@Entity
@Table(name="contacts")
public class Contact implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "contact_id", nullable = false, updatable = false, length = 10)
    private long contactId;

    private String contactValue;

    @Constraints.Required
    @ManyToOne
    @JoinColumn(name="contact_type_id",referencedColumnName = "variable_id",nullable = false)
    private Variable contactType;
}
