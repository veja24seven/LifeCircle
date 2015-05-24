package za.co.curvedradius.models;

import play.data.format.Formats;
import play.data.validation.Constraints;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Mpokie on 2015-05-16.
 */
@Entity
@Table(name="employments")
public class Employment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "employment_id", nullable = false, updatable = false, length = 10)
    private Long employmentId;

    @Column(name = "employer_name", unique = false, nullable = true, length = 100)
    private String employerName;

    @Column(name = "occupation", unique = false, nullable = true, length = 100)
    private String occupation;

    @Column(name = "employee_number", unique = false, nullable = true, length = 10)
    private String employeeNumber;

    @Constraints.Required
    @ManyToOne
    @JoinColumn(name="employment_type_id",referencedColumnName = "variable_id",nullable = false)
    private Variable employmentType;

    @Constraints.Required
    @ManyToOne
    @JoinColumn(name="income_band_id",referencedColumnName = "variable_id",nullable = false)
    private Variable incomeBand;

    @Constraints.Required
    @ManyToOne
    @JoinColumn(name="income_frequency_id",referencedColumnName = "variable_id",nullable = false)
    private Variable incomeFrequency;

    @Constraints.Required
    @ManyToOne
    @JoinColumn(name="status_id",referencedColumnName = "variable_id",nullable = false)
    private Variable status;

    @Constraints.Required
    @Formats.DateTime(pattern="dd/MM/yyyy")
    @Temporal(TemporalType.DATE)
    @Column(name = "employment_date", unique = false, nullable = false, updatable = true)
    private Date employmentDate;

    public Long getEmploymentId() {
        return employmentId;
    }

    public void setEmploymentId(Long employmentId) {
        this.employmentId = employmentId;
    }

    public String getEmployerName() {
        return employerName;
    }

    public void setEmployerName(String employerName) {
        this.employerName = employerName;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public String getEmployeeNumber() {
        return employeeNumber;
    }

    public void setEmployeeNumber(String employeeNumber) {
        this.employeeNumber = employeeNumber;
    }

    public Variable getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(Variable employmentType) {
        this.employmentType = employmentType;
    }

    public Variable getIncomeBand() {
        return incomeBand;
    }

    public void setIncomeBand(Variable incomeBand) {
        this.incomeBand = incomeBand;
    }

    public Variable getIncomeFrequency() {
        return incomeFrequency;
    }

    public void setIncomeFrequency(Variable incomeFrequency) {
        this.incomeFrequency = incomeFrequency;
    }

    public Variable getStatus() {
        return status;
    }

    public void setStatus(Variable status) {
        this.status = status;
    }

    public Date getEmploymentDate() {
        return employmentDate;
    }

    public void setEmploymentDate(Date employmentDate) {
        this.employmentDate = employmentDate;
    }
}
