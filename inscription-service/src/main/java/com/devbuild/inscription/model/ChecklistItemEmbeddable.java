package com.devbuild.inscription.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class ChecklistItemEmbeddable {
    private String label;
    private String description;
    private Boolean obligatoire;

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Boolean getObligatoire() { return obligatoire; }
    public void setObligatoire(Boolean obligatoire) { this.obligatoire = obligatoire; }
}
