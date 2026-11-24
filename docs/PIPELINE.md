# Pipeline and handoff contract
Research → owner review → Antigravity production → QA → release review → publication.
Internal transition rules prohibit stage skipping and require an owner actor for approvals. The actor argument is NOT authentication. No network endpoint may trust a caller-supplied owner role or approval object.
Production packages include schema version, deterministic opportunity/revision job ID, audience, market, deliverables, evidence assessment, approval metadata, acceptance criteria and automaticPublishing=false.
Before a production API exists: persist immutable opportunity/evidence revisions; bind approvals to their content hash; authenticate owners; enforce ownership in DAL; append audit events; transactionally deduplicate dispatch. Current package construction is only an internal contract prototype.
Antigravity runner support is unverified; start with file-based handoffs. Artifact ingestion must validate paths, sizes, MIME signatures, checksums and untrusted content. QA failures request revision. Paused, cancelled, failed, rejected and retry states remain to implement.
