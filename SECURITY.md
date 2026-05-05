# Security Policy

## Supported Versions

This is a **demonstration application** and is not intended for production use. No real payment data, cardholder data, or PCI-DSS-scoped data should ever be entered into this system.

| Version | Supported |
|---|---|
| Latest `main` | Demo use only |

## Reporting a Vulnerability

If you discover a security vulnerability in this codebase, please report it responsibly:

1. **Do not** open a public GitHub issue for security vulnerabilities
2. Email the repository owner directly with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact assessment
3. You will receive a response within 5 business days

## Scope

This demo application intentionally omits several production security controls to keep the codebase focused on GitHub Copilot demonstrations:

- No authentication or authorization
- No persistent storage
- No real payment card data (all PAN values are masked: `****-****-****-XXXX`)
- No encryption at rest
- In-memory data store that resets on restart

## Security Considerations for Extension

If extending this demo toward a real system, ensure you address:

- **PCI-DSS compliance** for any cardholder data (PANs, CVVs, expiry dates)
- **Authentication** (OAuth 2.0 / OpenID Connect)
- **Authorization** (role-based access control per entity)
- **Input validation** on all API endpoints
- **Audit logging** for all data access and mutations
- **Rate limiting** and DDoS protection
- **TLS/HTTPS** in all environments
- **Secrets management** (no credentials in code or env files)
