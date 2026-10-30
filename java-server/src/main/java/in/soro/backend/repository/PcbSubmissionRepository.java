package in.soro.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import in.soro.backend.model.PcbSubmission;

public interface PcbSubmissionRepository extends MongoRepository<PcbSubmission, String> {
}
