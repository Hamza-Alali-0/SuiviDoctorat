# Application Submission Debug Guide

## Overview

Comprehensive debug logging has been added to trace the entire application submission flow and identify issues with email delivery and UI synchronization.

## Issues Being Tracked

### Issue 1: Email Not Being Received

When an application is submitted, the backend says it will send an email but it's not arriving in the inbox.

**Related Logs to Check:**

- `[ApplicationsService] submitApplication called for campaignId:`
- `[ApplicationsService] Using endpoint:` - Check the correct endpoint is used
- `[ApplicationsService] ✓ Form submission successful, dossier created:` - Confirms form was submitted
- `[ApplicationsService] Starting file uploads, total files:` - Shows file upload progress
- Backend logs for email sending

---

### Issue 2: UI Doesn't Update After Submission

After submitting an application, the UI doesn't show the new application in the candidates' list, even though it's saved in the database.

---

## Debug Log Locations & What They Show

### 1. **CampaignsService - Campaign Submission Flow**

#### File: `frontend-app/src/app/pages/start-page/campaigns/campaigns.ts`

**Submission Start:**

```
[CampaignsPage] Submitting application for campaign: <campaignId> <campaignName>
[CampaignsPage] Using doctorantId: <userId>
[CampaignsPage] Files uploaded: [cv, diplomas, ...]
```

**Success Response:**

```
[CampaignsPage] ✓ Application submitted successfully. Response: {...}
[CampaignsPage] Before adding campaign ID, appliedCampaignIds: [...]
[CampaignsPage] After adding campaign ID, appliedCampaignIds: [<id>, ...]
[CampaignsPage] ✓ Saved applied IDs to localStorage
[CampaignsPage] ✓ Notified ApplicationsService of update
```

**Backend Refresh:**

```
[CampaignsPage] Refreshing applications from backend for userId: <userId>
[CampaignsPage] ✓ Received applications from backend: <count> applications
[CampaignsPage]   - Application found for campaign: <campaignId> <campaignName>
[CampaignsPage] Final appliedIds from backend: [<id>, ...]
```

**Modal Closure:**

```
[CampaignsPage] Closing modal in 2500ms...
[CampaignsPage] Closing application modal now
```

**Error:**

```
[CampaignsPage] ✗ Application submission FAILED: {...}
```

---

### 2. **ApplicationsService - API & Notification Layer**

#### File: `frontend-app/src/app/services/applications.service.ts`

**Submission:**

```
[ApplicationsService] submitApplication called for campaignId: <id>
[ApplicationsService] Form data: {...}
[ApplicationsService] Files: [cv, diplomas, ...]
[ApplicationsService] Prepared DTO with campagneId: <id>
[ApplicationsService] Using endpoint: /inscription-service/api/inscriptions/doctorant/<userId>/soumettre
```

**Success:**

```
[ApplicationsService] ✓ Form submission successful, dossier created: { id: <id>, status: 'DRAFT' }
[ApplicationsService] Uploading file: cv filename.pdf
[ApplicationsService] Starting file uploads, total files: 3
[ApplicationsService] ✓ File uploaded: cv_file.pdf
[ApplicationsService] ✓ All files uploaded successfully
```

**Notifications:**

```
[ApplicationsService] Broadcasting applicationsUpdated event to all listeners
```

**Fetching Applications:**

```
[ApplicationsService] Calling getMyApplications with userId: <id> URL: /inscription-service/api/inscriptions/doctorant/<id>/dashboard
[ApplicationsService] ✓ getMyApplications returned: 2 items
```

**Errors:**

```
[ApplicationsService] ✗ Application submission failed: {...}
[ApplicationsService] ✗ File upload failed: filename.pdf {...}
```

---

### 3. **Applications Page - Display & Refresh**

#### File: `frontend-app/src/app/pages/candidat/applications/applications.ts`

**Initialization:**

```
[ApplicationsPage] Component initialized, loading applications...
[ApplicationsPage] Manual refresh triggered by user
[ApplicationsPage] ✓ Detected application update notification, refreshing...
```

**Data Fetching:**

```
[ApplicationsPage] Starting fetchApplications()
[ApplicationsPage] Received profile data: { id: <userId>, ... }
[ApplicationsPage] Extracted userId from profile: <userId>
[ApplicationsPage] Calling getMyApplications with userId: <userId>
[ApplicationsPage] ✓ Received raw data from getMyApplications: [...]
[ApplicationsPage] Number of dossiers received: 2
```

**Data Processing:**

```
[ApplicationsPage]   Processing dossier: { dossierId: <id>, campaignId: <campaignId>, campaignName: '...', status: 'SUBMITTED' }
[ApplicationsPage] ✓ Mapped to allCampaigns, total: 2
[ApplicationsPage] All campaigns: [{ id: <id>, nom: '...', status: 'SUBMITTED' }]
```

**localStorage Persistence:**

```
[ApplicationsPage] Saving applied campaign IDs to localStorage: { key: 'campaign_applied_<user@email>', ids: [<id>, ...] }
```

**Filtering:**

```
[ApplicationsPage] applyFilters() called. allCampaigns count: 2
[ApplicationsPage] After search filter: 2
[ApplicationsPage] After type filter: 2
[ApplicationsPage] Sorted by deadline
[ApplicationsPage] ✓ applyFilters() complete. Final campaigns count: 2
```

**Completion:**

```
[ApplicationsPage] ✓ fetchApplications() complete. Final campaigns count: 2
```

---

### 4. **Campaigns Page - State Management**

#### File: `frontend-app/src/app/pages/start-page/campaigns/campaigns.ts`

**Initialization:**

```
[CampaignsPage] Component initialized (ngOnInit)
[CampaignsPage] User is logged in, loading profile...
[CampaignsPage] Set currentUserId: <userId>
```

**Applied IDs Loading:**

```
[CampaignsPage] Loading appliedCampaignIds from localStorage with key: campaign_applied_<user@email>
[CampaignsPage] ✓ Loaded appliedCampaignIds from campaign_applied_<user@email>: [<id>, ...]
```

**State Updates (via Effect):**

```
[CampaignsPage] ✓ appliedCampaignIds UPDATED: [<id>, <id>] total: 2
```

**Persistence:**

```
[CampaignsPage] ✓ Saved appliedCampaignIds to localStorage: { key: 'campaign_applied_<user@email>', ids: [<id>] }
```

---

## Workflow Trace Example

### Successful Application Flow:

```
1. User clicks "Postuler" button
   [CampaignsPage] Submitting application for campaign: 5 PhD Program 2024

2. Form is validated and files are prepared
   [CampaignsPage] Using doctorantId: 123
   [CampaignsPage] Files uploaded: [cv, diplomas]

3. ApplicationsService submits the form
   [ApplicationsService] submitApplication called for campaignId: 5
   [ApplicationsService] Using endpoint: .../doctorant/123/soumettre
   [ApplicationsService] ✓ Form submission successful, dossier created: { id: 42, status: 'DRAFT' }

4. Files are uploaded
   [ApplicationsService] Uploading file: cv filename.pdf
   [ApplicationsService] ✓ All files uploaded successfully

5. CampaignsPage receives success and updates local state
   [CampaignsPage] ✓ Application submitted successfully
   [CampaignsPage] After adding campaign ID, appliedCampaignIds: [5]
   [CampaignsPage] ✓ Saved applied IDs to localStorage
   [CampaignsPage] ✓ Notified ApplicationsService of update

6. ApplicationsService notifies all listeners
   [ApplicationsService] Broadcasting applicationsUpdated event to all listeners

7. ApplicationsPage receives the notification and refreshes
   [ApplicationsPage] ✓ Detected application update notification, refreshing...
   [ApplicationsPage] Starting fetchApplications()
   [ApplicationsPage] Calling getMyApplications with userId: 123
   [ApplicationsPage] ✓ Received raw data from getMyApplications: [...]
   [ApplicationsPage] ✓ Mapped to allCampaigns, total: 1
   [ApplicationsPage] ✓ applyFilters() complete. Final campaigns count: 1

8. Effect triggers showing state updated
   [CampaignsPage] ✓ appliedCampaignIds UPDATED: [5] total: 1

9. Modal closes after 2.5 seconds
   [CampaignsPage] Closing application modal now
```

---

## How to Use These Logs

### 1. **Open Browser Developer Tools**

- Press `F12` in Chrome/Firefox
- Go to **Console** tab
- Filter by `[CampaignsPage]`, `[ApplicationsService]`, or `[ApplicationsPage]`

### 2. **Trace the Full Flow**

1. **Submission Start** - Look for `[CampaignsPage] Submitting application`
2. **Service Processing** - Check `[ApplicationsService] submitApplication called`
3. **Response Handling** - See `✓ Application submitted successfully`
4. **State Update** - Verify `appliedCampaignIds UPDATED`
5. **Notifications** - Confirm `Broadcasting applicationsUpdated event`
6. **Refresh** - Check `✓ Detected application update notification, refreshing...`
7. **Final State** - Verify `Final campaigns count: X` in applications page

### 3. **Identify Problems**

| Symptom                            | Where to Look                                     | What to Check                                               |
| ---------------------------------- | ------------------------------------------------- | ----------------------------------------------------------- |
| Email not sent                     | Backend logs + `[ApplicationsService]`            | Form submitted? Files uploaded? Check backend email service |
| UI doesn't update after submission | `[CampaignsPage]` & `[ApplicationsPage]`          | Is state updated? Is notification sent? Is refresh called?  |
| appliedCampaignIds not updating    | Effect log: `appliedCampaignIds UPDATED`          | Was the signal set? Check localStorage save                 |
| Applications page shows 0          | `[ApplicationsPage] Number of dossiers received:` | Backend returning data? Check API response                  |
| Modal doesn't close                | `[CampaignsPage] Closing` logs                    | Is closeApplicationModal() called after 2.5s?               |

---

## Email Issue Debugging

### For Email Not Being Received:

1. **Check Form Submission Success:**

   ```
   [ApplicationsService] ✓ Form submission successful, dossier created: { id: 42, status: 'DRAFT' }
   ```

   If this log appears, the form reached the backend.

2. **Check Backend Logs:**

   - Check the inscription-service logs on port 8092
   - Look for email sending logs
   - Verify email configuration is correct

3. **Common Issues:**
   - Email address not captured correctly - check `[ApplicationsPage]` processing logs
   - Backend email service not running
   - Email SMTP configuration incorrect
   - Email marked as spam

### Check localStorage:

```javascript
// In browser console:
localStorage.getItem("campaign_applied_<user@email>");
// Should show applied campaign IDs like: [1, 5, 10]
```

---

## UI Update Issue Debugging

### For UI Not Updating After Submission:

1. **Verify State Update:**
   Look for this log:

   ```
   [CampaignsPage] ✓ appliedCampaignIds UPDATED: [5] total: 1
   ```

2. **Verify Notification Broadcast:**

   ```
   [ApplicationsService] Broadcasting applicationsUpdated event to all listeners
   ```

3. **Verify Applications Page Refresh:**

   ```
   [ApplicationsPage] ✓ Detected application update notification, refreshing...
   [ApplicationsPage] ✓ Received raw data from getMyApplications: [...]
   ```

4. **If Data Received But Not Displaying:**
   - Check browser console for errors
   - Verify filtering logic in `applyFilters()`
   - Check if campaigns array is being populated correctly

---

## Integration with Email Debugging

The logs show:

- **When** the application is submitted
- **What** data is sent to the backend
- **Whether** the backend confirms receipt
- **If** the user's state is correctly updated

But logs don't show:

- Whether the backend actually sends the email
- Email delivery status
- Reason for email failure

**For email debugging, you ALSO need to check:**

- Backend (inscription-service) logs
- Email service logs (SMTP, SendGrid, etc.)
- Email provider's delivery status

---

## localStorage Key Reference

Different users store applied campaigns under different keys:

```
campaign_applied_user@email.com
campaign_applied_john.doe@example.com
campaign_applied_123
```

The key is generated by `AuthService.getAppliedKeyForUser()`.

To check all stored applied campaigns:

```javascript
// In browser console:
for (let key in localStorage) {
  if (key.includes("campaign_applied")) {
    console.log(key, JSON.parse(localStorage.getItem(key)));
  }
}
```

---

## Common Debug Scenarios

### Scenario 1: "I submitted but it's not in my applications list"

1. Check: `[CampaignsPage] ✓ appliedCampaignIds UPDATED` - was the ID added?
2. Check: `[ApplicationsService] Broadcasting applicationsUpdated` - was event sent?
3. Check: `[ApplicationsPage] ✓ Detected application update notification` - did applications page receive it?
4. Check: `[ApplicationsPage] Number of dossiers received: X` - is the backend returning the new application?

### Scenario 2: "The button says I already applied but the applications list is empty"

1. Check: `[CampaignsPage] ✓ Loaded appliedCampaignIds from` - was it loaded from localStorage?
2. Check: `[ApplicationsPage] Number of dossiers received: X` - is backend returning 0 items?
3. **Root Cause:** Backend doesn't have the application, or userId mismatch

### Scenario 3: "After refreshing, the applications disappear"

1. Check: `[ApplicationsPage] Extracted userId from profile` - is userId correct?
2. Check: `[ApplicationsPage] Received raw data from getMyApplications:` - any applications returned?
3. Check: `[ApplicationsPage] ✓ Saved applied campaign IDs to localStorage` - was it saved?

---

## Next Steps

1. **Reproduce the issue** with these debug logs running
2. **Collect all console logs** from the entire flow
3. **Compare with this guide** to identify where the process breaks
4. **Check backend logs** for server-side issues
5. **Report findings** with specific log lines and timestamps

The logs should pinpoint exactly where and why the issue occurs.
