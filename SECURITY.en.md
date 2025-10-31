# Security (HZ Base)

## Vulnerability Disclosure
- Contact the internal HZ security channel: security@hz (or corporate ticketing)
- Do not open public issues
- Provide reproduction details and potential impact

## Response SLA
- Critical (RCE/secret exposure): triage within 24 hours
- High: triage within 3 business days
- Others: per team priority

## Secrets & Configuration
- Do not store secrets in VCS
- Use Secret Manager/CI secrets
- Configuration via environment variables (see `.env.example` or `ENV_EXAMPLE.txt`)

## Dependencies
- Regular SCA scans
- Block packages with known critical vulnerabilities

## Incident Reporting
- Notify service owners and HZ security immediately
- Collect artifacts, restrict access temporarily, define recovery plan
