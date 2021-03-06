package za.co.curvedradius.models;

import lombok.Data;
import play.data.validation.Constraints;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Created by Mpokie on 2015-03-10.
 */
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

    @Column(name = "suburb", unique = false, nullable = true, length = 100)
    private String suburb;

    @Constraints.Required
    @Column(name = "town", unique = false, nullable = false, length = 100)
    private String town;

    @Constraints.Required
    @Column(name = "province", unique = false, nullable = false, length = 100)
    private String province;

    @Constraints.Required
    @Column(name = "postal_code", unique = false, nullable = false, length = 4)
    private int postalCode;

    public int getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(int postalCode) {
        this.postalCode = postalCode;
    }

    public long getAddressId() {
        return addressId;
    }

    public void setAddressId(long addressId) {
        this.addressId = addressId;
    }

    public String getStreetNumber() {
        return streetNumber;
    }

    public void setStreetNumber(String streetNumber) {
        this.streetNumber = streetNumber;
    }

    public String getStreetName() {
        return streetName;
    }

    public void setStreetName(String streetName) {
        this.streetName = streetName;
    }

    public String getSuburb() {
        return suburb;
    }

    public void setSuburb(String suburb) {
        this.suburb = suburb;
    }

    public String getTown() {
        return town;
    }

    public void setTown(String town) {
        this.town = town;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public Address(String streetNumber, String streetName, String suburb, String town, String province, int postalCode) {
        this.streetNumber = streetNumber;
        this.streetName = streetName;
        this.suburb = suburb;
        this.town = town;
        this.province = province;
        this.postalCode = postalCode;
    }

    public Address() {
    }
}
