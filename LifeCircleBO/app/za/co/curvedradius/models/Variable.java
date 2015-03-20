package za.co.curvedradius.models;

import play.data.validation.Constraints;
import za.co.curvedradius.enums.Category;

import javax.persistence.*;

@Entity
@Table(name="variables")
public class Variable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "variable_id", nullable = false, updatable = false, length = 10)
	private long variableId;
	
	@Constraints.Required
	@Enumerated(EnumType.STRING)
	private Category category;

	@Constraints.Required
	@Column(name = "value", unique = false, nullable = false, updatable = true, length = 100)
	private String value;
	
	@Constraints.Required
	@Column(name = "status", unique = false, nullable = false, columnDefinition="varchar(10) default 'Active'")
	private String status;

    public Variable() {
    }

    public long getVariableId() {
        return this.variableId;
    }

    public Category getCategory() {
        return this.category;
    }

    public String getValue() {
        return this.value;
    }

    public String getStatus() {
        return this.status;
    }

    public void setVariableId(long variableId) {
        this.variableId = variableId;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof Variable)) return false;
        final Variable other = (Variable) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.variableId != other.variableId) return false;
        final Object this$category = this.category;
        final Object other$category = other.category;
        if (this$category == null ? other$category != null : !this$category.equals(other$category)) return false;
        final Object this$value = this.value;
        final Object other$value = other.value;
        if (this$value == null ? other$value != null : !this$value.equals(other$value)) return false;
        final Object this$status = this.status;
        final Object other$status = other.status;
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) return false;
        return true;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final long $variableId = this.variableId;
        result = result * PRIME + (int) ($variableId >>> 32 ^ $variableId);
        final Object $category = this.category;
        result = result * PRIME + ($category == null ? 0 : $category.hashCode());
        final Object $value = this.value;
        result = result * PRIME + ($value == null ? 0 : $value.hashCode());
        final Object $status = this.status;
        result = result * PRIME + ($status == null ? 0 : $status.hashCode());
        return result;
    }

    protected boolean canEqual(Object other) {
        return other instanceof Variable;
    }

    public String toString() {
        return "za.co.curvedradius.models.Variable(variableId=" + this.variableId + ", category=" + this.category + ", value=" + this.value + ", status=" + this.status + ")";
    }
}
