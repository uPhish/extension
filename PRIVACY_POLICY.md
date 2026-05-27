# Privacy Policy

**Effective Date:** May 27, 2026
**Last Updated:** May 27, 2026

---

## 1. Introduction

This Privacy Policy describes how we collect, use, store, and protect information when you use our threat intelligence service ("the Service"). The Service is designed to help identify and block malicious domains, phishing sites, and other online threats to protect users across the web.

We are committed to transparency. This policy is written to clearly explain what data we handle, why we handle it, and what we never do with it.

---

## 2. What We Collect

### 2.1 Domain Check Queries

When you use the Service to check whether a domain is blocked (e.g., via the `/threatdb/check/{domain}` endpoint), we process the domain name you submit. This is used solely to perform a real-time lookup against our threat database and return a result. We do not log or persistently store the domains you query for lookup purposes.

### 2.2 Threat Reports (User-Submitted)

When a user voluntarily submits a URL report through the Service (e.g., via the `/threatdb/report` endpoint), we collect the following:

| Field | Description |
|---|---|
| `domain` | The domain extracted from the reported URL |
| `url` | The full URL being reported as a threat |
| `threat_type` | The category of threat, if identified (e.g., Phishing, Malware, Scam) |
| `reported_by` | The source of the report (e.g., "Extension", "Website") |
| `useragent` | Your browser's user agent string (see Section 3) |
| `created_at` / `updated_at` | Timestamps of when the report was created or updated |

### 2.3 Third-Party Threat Feeds

We ingest threat data from third-party sources, including, but not limited to, **PhishTank**, to maintain and update our database of blocked domains. This data is sourced from their public feeds and does not involve any personal information from our users. Domains sourced this way are attributed to their respective feed in our records.

### 2.4 Blocked Domain Records

Our database of blocked domains contains:

- Domain name
- Threat classification (e.g., Phishing, Malware, Command and Control Botnet, Spyware, etc.)
- The source that identified the threat
- Flags for whether the domain has been reported to registrars or Cloudflare
- Timestamps

None of these records contain personally identifiable information.

---

## 3. User Agent Reporting

Your browser's user agent string (a technical identifier that describes your browser and operating system) may be submitted as part of a voluntary threat report:

- We do **not** passively collect your user agent during routine domain checks.
- User agent data is collected **only** when you actively submit a report.
- The purpose of collecting it is limited to providing additional context about the environment in which a threat was encountered, which can help with threat analysis and verification.
- We do not use user agent data for tracking, fingerprinting, profiling, or advertising purposes.

---

## 4. How We Use Your Data

We use the data we collect strictly for the following purposes:

- **Threat Detection:** To check whether a queried domain is known to be malicious.
- **Threat Intelligence:** To build and improve our database of blocked domains, benefiting all users of the Service.
- **Feed Integration:** To ingest and incorporate verified threat data from trusted third-party sources like PhishTank.
- **Abuse Reporting:** Blocked domains may be reported to domain registrars or infrastructure providers (such as Cloudflare) to facilitate takedowns. These reports do not include any personal user data.

We do **not** use your data for advertising, selling to third parties, user profiling, or any purpose outside of threat intelligence and internet safety.

---

## 5. Data Sharing

We do not sell, rent, or trade your personal data. Limited data sharing occurs only in the following contexts:

- **Registrar & Infrastructure Reporting:** When a domain is confirmed malicious, we may report it to the relevant domain registrar or to Cloudflare for abuse action. Only the domain name and threat classification are shared — no user-identifying information is included.
- **Third-Party Feeds (Inbound):** We receive threat data from services like PhishTank. We do not share your data with these providers.
- **Legal Obligations:** We may disclose data if required by law, court order, or to protect against fraud or abuse.

---

## 6. Data Retention

- **Reported domains** are retained in our database for as long as necessary to support threat intelligence operations and historical analysis.
- **Blocked domain records** are retained indefinitely to prevent re-emergence of known threats, subject to periodic review and removal when a domain is deemed safe.
- We do not retain personally identifiable information beyond what is strictly necessary.

---

## 7. Security

We use industry-standard practices to secure the data we store:

- All data is stored in a managed database with access controls.
- API access is rate-limited to prevent abuse.
- Credentials are stored as environment variables and never exposed in code.
- CORS policies are enforced at the API level.

While we take reasonable precautions, no system is completely immune to security risks. We encourage responsible disclosure if you discover a vulnerability.

---

## 8. Your Rights

Depending on your jurisdiction, you may have rights regarding your personal data, including:

- **Access:** The right to know what data we hold about you.
- **Deletion:** The right to request that data associated with you be deleted.
- **Correction:** The right to correct inaccurate data.

Because the Service is primarily a threat intelligence tool and collects minimal personal data by design, most interactions do not involve personal data at all. To exercise any of these rights, please contact us using the information in Section 10.

---

## 9. Children's Privacy

The Service is not directed at children under the age of 13, and we do not knowingly collect personal information from children. If you believe a child has submitted personal data through the Service, please contact us and we will promptly delete it.

---

## 10. Contact

If you have questions about this Privacy Policy, wish to exercise your data rights, or need to report a concern, please contact us at:

**Email:** [contact@uphish.com]

---

## 11. Changes to This Policy

We may update this Privacy Policy from time to time. When we do, we will update the "Last Updated" date at the top of this document. We encourage you to review this policy periodically. Continued use of the Service after changes are posted constitutes your acceptance of the updated policy.
