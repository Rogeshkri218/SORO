package in.soro.backend.model;

import org.bson.Document;

public record UserDocument(Document fields) {
    public Object id() {
        return fields.get("_id");
    }

    public Object get(String field) {
        return fields.get(field);
    }
}
