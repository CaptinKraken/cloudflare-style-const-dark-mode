# Cookie Consent - cf_dark_mode

## Quick Reference

**Cookie Name:** `cf_dark_mode`  
**Category:** Strictly Necessary / Functional  
**Consent Required:** No  
**Platform:** OneTrust

---

## OneTrust Configuration

### Cookie Details

| Field | Value |
|-------|-------|
| **Cookie Name** | `cf_dark_mode` |
| **Domain** | `.cloudflare.com` |
| **Path** | `/` |
| **Duration** | 1 year (365 days) |
| **Category** | Strictly Necessary / Functional |
| **Type** | First Party |
| **Essential** | Yes ✅ |
| **Consent Required** | No |
| **SameSite** | Lax |
| **Secure** | Yes |

### Description (for cookie policy)

**Short:**
> Stores the user's dark mode preference (on/off/system) for consistent UI experience.

**Long:**
> This cookie remembers the user's dark mode setting to provide a consistent visual experience across all Cloudflare properties (dashboard.cloudflare.com, developer.cloudflare.com, etc.). It contains only the user's UI preference and no personally identifiable information.

### Purpose

Maintains user's dark mode preference across Cloudflare subdomains to:
- Provide consistent UI experience
- Prevent jarring light/dark mode switches when navigating between apps
- Support accessibility preferences

### Data Collected

- **Format:** Plain text string
- **Values:** `on`, `off`, or `system`
- **PII:** None
- **Tracking:** None

---

## Legal Justification

### GDPR Compliance

**Legal Basis:** Article 6(1)(f) - Legitimate Interest

**Why Exempt from Consent:**
1. **Strictly Necessary:** Required for the website to function properly
2. **User-Initiated:** Only set when user explicitly changes dark mode setting
3. **Functional Purpose:** Maintains UI state, not for analytics or advertising
4. **No PII:** Contains only a UI preference setting
5. **Expected Behavior:** Users expect their dark mode setting to persist

**Recital 30:** "Natural persons may be associated with online identifiers... However, the use of such identifiers should not in itself constitute processing of personal data where it is not combined with additional information."

The `cf_dark_mode` cookie value (`on`/`off`/`system`) cannot identify a natural person.

### CCPA Compliance

**Status:** Exempt - Not considered "personal information" under CCPA

**Reasoning:**
- Does not identify, relate to, or describe a consumer
- Contains only UI preference
- No sale of data occurs
- No advertising/marketing purpose

---

## Implementation Steps

### 1. Add to OneTrust Cookie List

**OneTrust Admin Console:**
1. Navigate to: **Cookie Compliance** → **Cookie List**
2. Click **"Add Cookie"**
3. Enter details from table above
4. Select **"Strictly Necessary"** category
5. Check **"Essential"** checkbox
6. Save

### 2. Cookie Declaration JSON (for API integration)

```json
{
  "name": "cf_dark_mode",
  "domain": ".cloudflare.com",
  "path": "/",
  "description": "Stores the user's dark mode preference (on/off/system) for consistent UI experience across Cloudflare properties",
  "category": "Strictly Necessary",
  "categoryId": "C0001",
  "duration": "365 days",
  "durationType": "persistent",
  "type": "First Party",
  "isEssential": true,
  "requiresConsent": false,
  "dataCollected": "UI preference setting",
  "purpose": "User Experience",
  "sameSite": "Lax",
  "secure": true
}
```

### 3. Update Privacy Policy

Add to the "Cookies We Use" section:

> **cf_dark_mode** (Strictly Necessary)  
> Duration: 1 year  
> Purpose: Stores your dark mode preference to maintain consistent appearance across Cloudflare applications. This cookie contains only your UI preference (on/off/system) and does not track your behavior or contain personal information.

### 4. Update Cookie Banner Configuration

Ensure `cf_dark_mode` is listed under **"Strictly Necessary Cookies"** in your cookie banner. Users should see it in the cookie details but should NOT be able to opt out (as it's essential).

---

## FAQs for Legal/Compliance Teams

**Q: Do we need user consent for this cookie?**  
A: No. It's a strictly necessary functional cookie exempt under GDPR Article 6(1)(f).

**Q: Should this appear in the cookie banner?**  
A: Yes, in the "Strictly Necessary" section for transparency, but users cannot opt out.

**Q: What if a user blocks all cookies?**  
A: The app will fall back to localStorage (per-site) and postMessage (for iframes). No errors occur.

**Q: Does this cookie track users?**  
A: No. It only stores a UI preference (on/off/system). No behavioral or identifying data.

**Q: Is it CCPA-compliant?**  
A: Yes. It doesn't contain "personal information" as defined by CCPA.

**Q: Can we set this without a cookie banner?**  
A: Yes, strictly necessary cookies can be set before consent. But for transparency, list it in your cookie policy.

**Q: What about children's privacy (COPPA)?**  
A: Compliant. Contains no personal information and serves only a functional purpose.

**Q: Do we need to update our Data Processing Agreement (DPA)?**  
A: No. It's first-party, no data is shared, and contains no personal information.

---

## Contact

**Package Owner:** DevTools Team  
**Privacy Questions:** Legal/Privacy Team  
**Technical Questions:** See [DARK_MODE_SYNC.md](./DARK_MODE_SYNC.md)

---

## References

- **GDPR:** Article 6(1)(f), Recital 30
- **CCPA:** Cal. Civ. Code § 1798.140(o)
- **ePrivacy Directive:** Article 5(3) - Strictly necessary cookies
- **ICO Guidance:** [Cookie types and exemptions](https://ico.org.uk/for-organisations/guide-to-pecr/cookies-and-similar-technologies/)
- **CNIL Guidance:** Strictly necessary cookies exempt from consent
