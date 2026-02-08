package com.jobportal.jobportal_backend.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "applications")
public class Application {

    @Id
    private String id;

    private String fullName;
    private String experience;
    private String skills;

    private String jobTitle;
    private String userEmail;

    // Resume file name
    private String resume;

    private Date appliedAt;
    private boolean verified = false;
    private String status; // PENDING, SELECTED, REJECTED





    public Application() {}


    /* ================= GETTERS & SETTERS ================= */

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }


    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }


    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }


    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }


    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }


    public String getResume() {
        return resume;
    }

    public void setResume(String resume) {
        this.resume = resume;
    }


    public Date getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(Date appliedAt) {
        this.appliedAt = appliedAt;
    }
    public boolean isVerified() {
    return verified;
}

public void setVerified(boolean verified) {
    this.verified = verified;
}
public String getStatus() {
    return status;
}

public void setStatus(String status) {
    this.status = status;
}


}
