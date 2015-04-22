package za.co.curvedradius.models;

import play.data.format.Formats;
import play.data.validation.Constraints;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * Created by Mpokie on 2015-03-10.
 */
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

    public Person() {
    }

    public Long getPersonId() {
        return this.personId;
    }

    public List<Identity> getIdentity() {
        return this.identity;
    }

    public String getFirstname() {
        return this.firstname;
    }

    public String getSecondname() {
        return this.secondname;
    }

    public String getThirdname() {
        return this.thirdname;
    }

    public String getSurname() {
        return this.surname;
    }

    public Variable getGender() {
        return this.gender;
    }

    public Date getDateOfBirth() {
        return this.dateOfBirth;
    }

    public Country getNationality() {
        return this.nationality;
    }

    public List<Address> getAddresses() {
        return this.addresses;
    }

    public List<Contact> getContacts() {
        return this.contacts;
    }

    public void setPersonId(Long personId) {
        this.personId = personId;
    }

    public void setIdentity(List<Identity> identity) {
        this.identity = identity;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public void setSecondname(String secondname) {
        this.secondname = secondname;
    }

    public void setThirdname(String thirdname) {
        this.thirdname = thirdname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public void setGender(Variable gender) {
        this.gender = gender;
    }

    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public void setNationality(Country nationality) {
        this.nationality = nationality;
    }

    public void setAddresses(List<Address> addresses) {
        this.addresses = addresses;
    }

    public void setContacts(List<Contact> contacts) {
        this.contacts = contacts;
    }

    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof Person)) return false;
        final Person other = (Person) o;
        if (!other.canEqual((Object) this)) return false;
        final Object this$personId = this.personId;
        final Object other$personId = other.personId;
        if (this$personId == null ? other$personId != null : !this$personId.equals(other$personId)) return false;
        final Object this$identity = this.identity;
        final Object other$identity = other.identity;
        if (this$identity == null ? other$identity != null : !this$identity.equals(other$identity)) return false;
        final Object this$firstname = this.firstname;
        final Object other$firstname = other.firstname;
        if (this$firstname == null ? other$firstname != null : !this$firstname.equals(other$firstname)) return false;
        final Object this$secondname = this.secondname;
        final Object other$secondname = other.secondname;
        if (this$secondname == null ? other$secondname != null : !this$secondname.equals(other$secondname))
            return false;
        final Object this$thirdname = this.thirdname;
        final Object other$thirdname = other.thirdname;
        if (this$thirdname == null ? other$thirdname != null : !this$thirdname.equals(other$thirdname)) return false;
        final Object this$surname = this.surname;
        final Object other$surname = other.surname;
        if (this$surname == null ? other$surname != null : !this$surname.equals(other$surname)) return false;
        final Object this$gender = this.gender;
        final Object other$gender = other.gender;
        if (this$gender == null ? other$gender != null : !this$gender.equals(other$gender)) return false;
        final Object this$dateOfBirth = this.dateOfBirth;
        final Object other$dateOfBirth = other.dateOfBirth;
        if (this$dateOfBirth == null ? other$dateOfBirth != null : !this$dateOfBirth.equals(other$dateOfBirth))
            return false;
        final Object this$nationality = this.nationality;
        final Object other$nationality = other.nationality;
        if (this$nationality == null ? other$nationality != null : !this$nationality.equals(other$nationality))
            return false;
        final Object this$addresses = this.addresses;
        final Object other$addresses = other.addresses;
        if (this$addresses == null ? other$addresses != null : !this$addresses.equals(other$addresses)) return false;
        final Object this$contacts = this.contacts;
        final Object other$contacts = other.contacts;
        if (this$contacts == null ? other$contacts != null : !this$contacts.equals(other$contacts)) return false;
        return true;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final Object $personId = this.personId;
        result = result * PRIME + ($personId == null ? 0 : $personId.hashCode());
        final Object $identity = this.identity;
        result = result * PRIME + ($identity == null ? 0 : $identity.hashCode());
        final Object $firstname = this.firstname;
        result = result * PRIME + ($firstname == null ? 0 : $firstname.hashCode());
        final Object $secondname = this.secondname;
        result = result * PRIME + ($secondname == null ? 0 : $secondname.hashCode());
        final Object $thirdname = this.thirdname;
        result = result * PRIME + ($thirdname == null ? 0 : $thirdname.hashCode());
        final Object $surname = this.surname;
        result = result * PRIME + ($surname == null ? 0 : $surname.hashCode());
        final Object $gender = this.gender;
        result = result * PRIME + ($gender == null ? 0 : $gender.hashCode());
        final Object $dateOfBirth = this.dateOfBirth;
        result = result * PRIME + ($dateOfBirth == null ? 0 : $dateOfBirth.hashCode());
        final Object $nationality = this.nationality;
        result = result * PRIME + ($nationality == null ? 0 : $nationality.hashCode());
        final Object $addresses = this.addresses;
        result = result * PRIME + ($addresses == null ? 0 : $addresses.hashCode());
        final Object $contacts = this.contacts;
        result = result * PRIME + ($contacts == null ? 0 : $contacts.hashCode());
        return result;
    }

    protected boolean canEqual(Object other) {
        return other instanceof Person;
    }

    public String toString() {
        return "za.co.curvedradius.models.Person(personId=" + this.personId + ", identity=" + this.identity + ", firstname=" + this.firstname + ", secondname=" + this.secondname + ", thirdname=" + this.thirdname + ", surname=" + this.surname + ", gender=" + this.gender + ", dateOfBirth=" + this.dateOfBirth + ", nationality=" + this.nationality + ", addresses=" + this.addresses + ", contacts=" + this.contacts + ")";
    }
}
