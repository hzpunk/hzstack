# Security Review Checklist

- [ ] No secrets in VCS; stored in Secret Manager/CI
- [ ] Least-privilege service accounts
- [ ] Dependency SCA scan with no critical vulns
- [ ] Input validation (server/client)
- [ ] Logs free of personal/secret data
- [ ] Endpoint audit: authentication and authorization
- [ ] HTTPS everywhere, HSTS for prod
