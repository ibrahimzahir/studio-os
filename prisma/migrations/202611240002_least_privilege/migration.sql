DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'studio_app') THEN CREATE ROLE studio_app NOLOGIN NOSUPERUSER NOBYPASSRLS; END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'studio_auth') THEN CREATE ROLE studio_auth NOLOGIN NOSUPERUSER NOBYPASSRLS; END IF;
END $$;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO studio_app, studio_auth;
GRANT SELECT, INSERT, UPDATE, DELETE ON "User", "Session", "Account", "Verification", "TwoFactor", "RateLimit" TO studio_auth;
GRANT SELECT (id, name, "studioId", role, status, "twoFactorEnabled") ON "User" TO studio_app;
GRANT UPDATE (status) ON "User" TO studio_app;
GRANT SELECT ("userId"), DELETE ON "Session" TO studio_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON "Opportunity", "StudioSettings" TO studio_app;
GRANT SELECT, INSERT ON "AuditEvent" TO studio_app;
ALTER TABLE "Opportunity" ADD CONSTRAINT opportunity_title_not_empty CHECK (length(trim(title)) >= 3);
ALTER TABLE "Opportunity" ADD CONSTRAINT opportunity_category_valid CHECK (category IN ('operations', 'hospitality', 'events'));
ALTER TABLE "Opportunity" ADD CONSTRAINT opportunity_status_valid CHECK (status IN ('needs_research', 'in_review', 'approved'));
