package za.co.curvedradius.models;
import lombok.Data;
import play.data.validation.Constraints;
import za.co.curvedradius.enums.Category;

import javax.persistence.*;

@Data
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
}
