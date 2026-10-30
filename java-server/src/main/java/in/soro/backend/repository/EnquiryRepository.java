package in.soro.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import in.soro.backend.model.Enquiry;

public interface EnquiryRepository extends MongoRepository<Enquiry, String> {
}
