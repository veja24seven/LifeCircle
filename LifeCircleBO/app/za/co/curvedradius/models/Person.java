package za.co.curvedradius.models;

import lombok.Data;
import play.data.format.Formats;
import play.data.validation.Constraints;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * Created by Mpokie on 2015-03-10.
 */
@Data
@Entity
@Table(name="persons")
public class Person implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "person_id", nullable = false, updatable = false, length = 10)
    private Long personId;

    @ManyToMany
    @JoinColumn(name="identity_id")
    private List<Identity> identity;

    @Constraints.Required
    @Column(name = "first_name", unique = false, nullable = false, length = 100)
    private String firstname;

    @Constraints.Required
    @Column(name = "second_name", unique = false, nullable = false, length = 100)
    private String secondname;

    @Constraints.Required
    @Column(name = "third_name", unique = false, nullable = true, length = 100)
    private String thirdname;

    @Constraints.Required
    @Column(name = "surname", unique = false, nullable = false, length = 100)
    private String surname;

    @Constraints.Required
    @ManyToOne
    @JoinColumn(name="gender_id",referencedColumnName = "variable_id",nullable = false)
    private Variable gender;

    @Constraints.Required
    @Formats.DateTime(pattern="dd/MM/yyyy")
    @Temporal(TemporalType.DATE)
    @Column(name = "dob", unique = false, nullable = false, updatable = true)
    private Date dateOfBirth;

    @Constraints.Required
    @ManyToOne
    @JoinColumn(name="nationality_id",referencedColumnName = "country_id",nullable = false)
    private Country nationality;

    @ManyToMany
    @JoinColumn(name="address_id")
    private List<Address> addresses;

    @ManyToMany
    @JoinColumn(name="contact_id")
    private List<Contact> contacts;

}
