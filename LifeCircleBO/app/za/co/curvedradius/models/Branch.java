package za.co.curvedradius.models;

import lombok.Data;
import play.data.validation.Constraints;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

/**
 * Created by Mpokie on 2015-03-11.
 */
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
    @JoinColumn(name="address_id",referencedColumnName = "address_id",nullable = false)
    private Address address;

    @ManyToMany
    @JoinColumn(name="contact_id")
    private List<Contact> contacts;

    public long getBranchId() {
        return branchId;
    }

    public void setBranchId(long branchId) {
        this.branchId = branchId;
    }

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }

    public String getBranchCode() {
        return branchCode;
    }

    public void setBranchCode(String branchCode) {
        this.branchCode = branchCode;
    }

    public Variable getBranchType() {
        return branchType;
    }

    public void setBranchType(Variable branchType) {
        this.branchType = branchType;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public List<Contact> getContacts() {
        return contacts;
    }

    public void setContacts(List<Contact> contacts) {
        this.contacts = contacts;
    }

    public Branch() {
    }

    public Branch(String branchName, String branchCode, Variable branchType, Address address, List<Contact> contacts) {
        this.branchName = branchName;
        this.branchCode = branchCode;
        this.branchType = branchType;
        this.address = address;
        this.contacts = contacts;
    }
}
