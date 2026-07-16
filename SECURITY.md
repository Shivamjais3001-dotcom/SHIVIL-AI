# Security Policy

## Supported Versions

We actively update and patch security bugs for the following version lines:

| Version | Supported |
| :--- | :--- |
| v1.0.0-beta | Yes |
| < v1.0.0 | No |

---

## 🔒 Reporting a Vulnerability

We take the security of SHIVIL AI and university databases very seriously. If you find a security vulnerability (such as SQL injection bypass, cookie hijacking, or role authorization evasion), please do not open a public issue.

Instead:
1. Email a description of the issue to `security@shivil.ai`.
2. Include steps to reproduce the exploit.
3. Our engineering team will review, triage, and patch the bug in a private hotfix branch, publishing the fix within 48 hours.

---

## 🛡️ Enterprise Compliance Clearances
Every Release Candidate compiles validations tracking compliance standards:
*   SSO authentication and JWT session rotations.
*   PII redaction checks (automatically logs and filters sensitive tokens).
*   Permission barriers restricting student/faculty scopes on raw database tools.
