package za.co.curvedradius.models;

import lombok.Data;
import play.data.validation.Constraints;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

/**
 * Created by Mpokie on 2015-03-11.
 */
@Data
@Entity
@Table(name="branches")
public class Branch implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "branch_id", nullable = false, updatable = false, length = 10)
    private long branchId;

    @Constraints.Required
    @Column(name = "branch_name", unique = false, nullable = false, length = 100)
    private String branchName;

    @Constraints.Required
    @Column(name = "branch_code", unique = true, nullable = false, length = 20)
    private String branchCode;

    @Constraints.Required
    @ManyToOne
    @JoinColumn(name="branch_type_id",referencedColumnName = "variable_id",nullable = false)
    private Variable branchType;

    @Constraints.Required
    @ManyToOne
    @JoinColumn(name="address_id",referencedColumnName = "variable_id",nullable = false)
    private Address address;

    @ManyToMany
    @JoinColumn(name="contact_id")
    private List<Contact> contacts;
}
