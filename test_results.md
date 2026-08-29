# Test Results

## 1. Test Environment

- Frontend: React + TypeScript + Vite
- Backend: FastAPI
- Database: SQLite
- Browser: Google Chrome

## 2. Test Data

- `https://www.google.com/`
- `https://www.youtube.com/`
- `https://github.com/`
- `https://www.wikipedia.org/`
- Invalid URL: `not-a-valid-url`

## 3. Test Data

### Valid URLs

The following real URLs were used during testing:

- https://www.google.com/
- https://www.youtube.com/
- https://github.com/
- https://www.wikipedia.org/

### Invalid URL

- not-a-url

---
## 3. Test Cases

### Backend

| Test Case | Description | Result |
|---|---|---|
| URL Creation | Creates a short URL from a valid URL | ✅ PASS |
| URL Validation | Rejects an invalid URL | ✅ PASS |
| Redirect Behavior | Redirects to the original URL | ✅ PASS |
| Click Count Increment | Increases click count after redirect | ✅ PASS |

### Frontend

| Test Case | Description | Result |
|---|---|---|
| Main Page Rendering | Displays the main page and required sections | ✅ PASS |
| Validation | Rejects invalid URL input | ✅ PASS |
| Table Rendering | Displays recent URLs with required actions | ✅ PASS |

### Analytics & Statistics

| Test Case | Description | Result |
|---|---|---|
| URL Analytics | Displays analytics for the selected URL | ✅ PASS |
| Statistics Chart | Displays clicks and URL creations over time | ✅ PASS |
| Pagination | Allows navigation through URL history | ✅ PASS |

## 4. Test Evidence

Screenshots were captured during manual testing to verify the implemented functionality.

### Backend

- [URL Creation](screenshots/url_creation.png)
- [URL Validation](screenshots/url_validation.png)
- [Redirect Behavior](screenshots/redirect_url.png)
- [Click Count Increment](screenshots/click_count.png)

### Frontend

### Frontend

- [Main Page Rendering](screenshots/full_frontend.png)
- [Frontend Validation](screenshots/url_validation.png)
- [Table Rendering](screenshots/table_rendering.png)

### Analytics & Statistics

- [URL Analytics](screenshots/analytics_per_url.png)
- [Statistics Chart](screenshots/overall_statistics.png)
- [Pagination](screenshots/full_frontend.png)

## 5. Test Summary

| Category | Tests | Passed | Failed |
|---|---:|---:|---:|
| Backend | 4 | 4 | 0 |
| Frontend | 3 | 3 | 0 |
| Analytics & Statistics | 3 | 3 | 0 |
| **Total** | **10** | **10** | **0** |

## 6. Overall Result

**10/10 manual tests passed successfully.**

The application was verified for URL creation, validation, redirection, click tracking, URL history, analytics, statistics visualization, and pagination.
