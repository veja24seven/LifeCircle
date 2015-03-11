package za.co.curvedradius.models;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;
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

    private List<Identity> identity;
    private String firstname;
    private String secondname;
    private String thirdname;
    private String surname;
    private Variable gender;
    private List<Country> nationality;
    private List<Address> addresses;
    private List<Contact> contacts;

}
