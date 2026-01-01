package com.jobportal.jobportal_backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "employers")
public class Employer {

    @Id
    private String id;
    private String name;
    private String hiringFor;

    // getters & setters
    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getHiringFor() {
        return hiringFor;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setHiringFor(String hiringFor) {
        this.hiringFor = hiringFor;
    }
}
