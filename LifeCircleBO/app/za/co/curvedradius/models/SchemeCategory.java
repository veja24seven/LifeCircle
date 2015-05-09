package za.co.curvedradius.models;

import play.data.format.Formats;
import play.data.validation.Constraints;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Mpokie on 2015-04-22.
 */
public class SchemeCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "scheme_category_id", nullable = false, updatable = false, length = 10)
    private long schemeCategoryId;

    @Constraints.Required
    @Column(name = "rate_level", unique = false, nullable = false, length = 80)
    private String rateLevel ;

    @Constraints.Required
    @Column(name = "category", unique = false, nullable = false, length = 30)
    private String category;

    @Constraints.Required
    @Column(name = "cover_amount", unique = false, nullable = false, updatable = true, length = 10, precision = 2)
    private double coverAmount;

    @Constraints.Required
    @Column(name = "age_from", unique = false, nullable = false, updatable = true, length = 3)
    private int ageFrom;

    @Constraints.Required
    @Column(name = "age_to", unique = false, nullable = false, updatable = true, length = 3)
    private int ageTo;

    @Column(name="spouse_cover",unique=false,nullable=false,updatable=true)
    private boolean spouseCover;

    @Column(name="child_cover",unique=false,nullable=false,updatable=true)
    private boolean childCover;

    @Column(name="extended_cover",unique=false,nullable=false,updatable=true)
    private boolean extendedCover;

    @Constraints.Required
    @Column(name = "uwr_premium", unique = false, nullable = false, updatable = true, length = 10, precision = 2)
    private double uwrPremium;

    @Constraints.Required
    @Column(name = "uwr_entry_fee", unique = false, nullable = false, updatable = true, length = 10, precision = 2)
    private double uwrEntryFee;

    @Constraints.Required
    @Column(name = "uwr_waiting_period", unique = false, nullable = false, updatable = true, length = 3)
    private int uwrWaitingPeriod;

    @Constraints.Required
    @Column(name = "premium_markup", unique = false, nullable = false, updatable = true, length = 3)
    private int premiumMarkup;

    @Constraints.Required
    @Column(name = "total_retail_premium", unique = false, nullable = false, updatable = true, length = 10, precision = 2)
    private double totalRetailPremium;

    @Constraints.Required
    @Column(name = "entry_fee", unique = false, nullable = false, updatable = true, length = 10, precision = 2)
    private double entryFee;

    @Constraints.Required
    @Column(name = "waiting_period", unique = false, nullable = false, updatable = true, length = 10, precision = 2)
    private int waitingPeriod;

    @Constraints.Required
    @Formats.DateTime(pattern="dd/MM/yyyy HH:mi:ss")
    @Temporal(TemporalType.DATE)
    @Column(name = "date_created", unique = false, nullable = false, updatable = false)
    private Date dateCreated;  //default to localtimestamp

    @Column(name = "created_by", unique = false, nullable = false, updatable = false, length = 30)
    private String createdBy; //username

    @Formats.DateTime(pattern="dd/MM/yyyy HH:mi:ss")
    @Temporal(TemporalType.DATE)
    @Column(name = "date_modified", unique = false, nullable = true, updatable = true)
    private Date dateModified;

    @Column(name = "modified_by", unique = false, nullable = true, updatable = true, length = 30)
    private String modifiedBy; //username

    public long getSchemeCategoryId() {
        return schemeCategoryId;
    }

    public void setSchemeCategoryId(long schemeCategoryId) {
        this.schemeCategoryId = schemeCategoryId;
    }

    public String getRateLevel() {
        return rateLevel;
    }

    public void setRateLevel(String rateLevel) {
        this.rateLevel = rateLevel;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getCoverAmount() {
        return coverAmount;
    }

    public void setCoverAmount(double coverAmount) {
        this.coverAmount = coverAmount;
    }

    public int getAgeFrom() {
        return ageFrom;
    }

    public void setAgeFrom(int ageFrom) {
        this.ageFrom = ageFrom;
    }

    public int getAgeTo() {
        return ageTo;
    }

    public void setAgeTo(int ageTo) {
        this.ageTo = ageTo;
    }

    public boolean isSpouseCover() {
        return spouseCover;
    }

    public void setSpouseCover(boolean spouseCover) {
        this.spouseCover = spouseCover;
    }

    public boolean isChildCover() {
        return childCover;
    }

    public void setChildCover(boolean childCover) {
        this.childCover = childCover;
    }

    public boolean isExtendedCover() {
        return extendedCover;
    }

    public void setExtendedCover(boolean extendedCover) {
        this.extendedCover = extendedCover;
    }

    public double getUwrPremium() {
        return uwrPremium;
    }

    public void setUwrPremium(double uwrPremium) {
        this.uwrPremium = uwrPremium;
    }

    public double getUwrEntryFee() {
        return uwrEntryFee;
    }

    public void setUwrEntryFee(double uwrEntryFee) {
        this.uwrEntryFee = uwrEntryFee;
    }

    public int getUwrWaitingPeriod() {
        return uwrWaitingPeriod;
    }

    public void setUwrWaitingPeriod(int uwrWaitingPeriod) {
        this.uwrWaitingPeriod = uwrWaitingPeriod;
    }

    public int getPremiumMarkup() {
        return premiumMarkup;
    }

    public void setPremiumMarkup(int premiumMarkup) {
        this.premiumMarkup = premiumMarkup;
    }

    public double getTotalRetailPremium() {
        return totalRetailPremium;
    }

    public void setTotalRetailPremium(double totalRetailPremium) {
        this.totalRetailPremium = totalRetailPremium;
    }

    public double getEntryFee() {
        return entryFee;
    }

    public void setEntryFee(double entryFee) {
        this.entryFee = entryFee;
    }

    public int getWaitingPeriod() {
        return waitingPeriod;
    }

    public void setWaitingPeriod(int waitingPeriod) {
        this.waitingPeriod = waitingPeriod;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Date getDateModified() {
        return dateModified;
    }

    public void setDateModified(Date dateModified) {
        this.dateModified = dateModified;
    }

    public String getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(String modifiedBy) {
        this.modifiedBy = modifiedBy;
    }
}
