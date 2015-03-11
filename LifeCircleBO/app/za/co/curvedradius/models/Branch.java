package za.co.curvedradius.models;

import lombok.Data;

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
    private String branchName;
    private String branchCode;
    private Variable branchType;
    private Address address;
    private List<Contact> contacts;
}
