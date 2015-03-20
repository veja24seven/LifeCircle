package za.co.curvedradius.models;

import play.data.validation.Constraints;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Created with IntelliJ IDEA.
 * User: Veli Khumalo
 * Date: 2013/10/18
 * Time: 8:20 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
@Table(name="countries")
public class Country implements Serializable{

	private static final long serialVersionUID = -5571276832284271355L;

	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "country_id", nullable = false, updatable = false, length = 10)
    private long countryId;

    @Constraints.Required
    @Column(name = "isocode", unique = true, nullable = false, updatable = false, length = 4)
    private String code;

    @Constraints.Required
    @Column(name = "name", unique = false, nullable = false, updatable = true, length = 100)
    private String name;

    public Country() {
    }

    public long getCountryId() {
        return this.countryId;
    }

    public String getCode() {
        return this.code;
    }

    public String getName() {
        return this.name;
    }

    public void setCountryId(long countryId) {
        this.countryId = countryId;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof Country)) return false;
        final Country other = (Country) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.countryId != other.countryId) return false;
        final Object this$code = this.code;
        final Object other$code = other.code;
        if (this$code == null ? other$code != null : !this$code.equals(other$code)) return false;
        final Object this$name = this.name;
        final Object other$name = other.name;
        if (this$name == null ? other$name != null : !this$name.equals(other$name)) return false;
        return true;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final long $countryId = this.countryId;
        result = result * PRIME + (int) ($countryId >>> 32 ^ $countryId);
        final Object $code = this.code;
        result = result * PRIME + ($code == null ? 0 : $code.hashCode());
        final Object $name = this.name;
        result = result * PRIME + ($name == null ? 0 : $name.hashCode());
        return result;
    }

    protected boolean canEqual(Object other) {
        return other instanceof Country;
    }

    public String toString() {
        return "za.co.curvedradius.models.Country(countryId=" + this.countryId + ", code=" + this.code + ", name=" + this.name + ")";
    }
}
