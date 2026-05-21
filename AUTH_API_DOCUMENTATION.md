# SYNERGY CONCEPT BACKEND AUTH MODULE API DOCUMENTATION

---

## Base URLs

- **Production:** `https://synergy-concept-backend.onrender.com`

---

# 1. User Signup

### Endpoint

`POST /api/auth/signup`

### Description

Creates a new admin account and links it to an existing school record. The school information must already exist before signup can proceed.

### Request Type

**Body (JSON)**

### Required Body Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| firstName | string | Yes | User’s first name |
| lastName | string | Yes | User’s last name |
| email | string | Yes | Valid email address |
| password | string | Yes | User’s password |

### Example Request Body

```json
{
  "firstName": "Temitope",
  "lastName": "Daramola",
  "email": "sevaca5636@keevle.com",
  "password": "12345678"
}
```

### Example Success Response

```json
{
  "status": "success",
  "message": "Account has been created. Please verify your email to access your account",
  "data": {
    "account": {
      "id": "6a0d5f10bc6487377983c743",
      "email": "sevaca5636@keevle.com",
      "role": "admin",
      "schoolId": "6a0d5e8d9f5e1f0c14884584",
      "verified": false,
      "isApproved": false,
      "adminProfile": {
        "id": "6a0d5f10bc6487377983c745",
        "userId": "6a0d5f10bc6487377983c743",
        "firstName": "Temitope",
        "lastName": "Daramola",
        "gender": null,
        "createdAt": "2026-05-21T00:00:00.000Z",
        "updatedAt": "2026-05-21T00:00:00.000Z"
      },
      "studentProfile": null,
      "staffProfile": null,
      "parentProfile": null,
      "superAdminProfile": null,
      "createdAt": "2026-05-21T00:00:00.000Z",
      "updatedAt": "2026-05-21T00:00:00.000Z"
    }
  }
}
```

### Notes

- Signup requires existing school information in the backend.
- The response returns a sanitized account object without sensitive fields such as `password` or tokens.

---

# 2. User Login

### Endpoint

`POST /api/auth/login`

### Description

Authenticates a user and returns login response data. The returned response can vary depending on account verification and approval state.

### Request Type

**Body (JSON)**

### Required Body Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| email | string | Yes | Valid email address |
| password | string | Yes | User’s password |

### Example Request Body

```json
{
  "email": "sevaca5636@keevle.com",
  "password": "12345678"
}
```

### Example Response: Verified and Approved

```json
{
  "status": "success",
  "message": "Login successful. You can now access your dashboard",
  "data": {
    "account": {
      "id": "6a0d5f10bc6487377983c743",
      "email": "sevaca5636@keevle.com",
      "role": "admin",
      "schoolId": "6a0d5e8d9f5e1f0c14884584",
      "verified": true,
      "isApproved": true,
      "adminProfile": { ... },
      "createdAt": "2026-05-21T00:00:00.000Z",
      "updatedAt": "2026-05-21T00:00:00.000Z"
    },
    "token": "<access-token>"
  }
}
```

### Example Response: Verified but Not Approved

```json
{
  "status": "success",
  "message": "Login successful. Account is pending Approval. You will be notified upon approval",
  "data": {
    "account": {
      "id": "6a0d5f10bc6487377983c743",
      "email": "sevaca5636@keevle.com",
      "role": "admin",
      "schoolId": "6a0d5e8d9f5e1f0c14884584",
      "verified": true,
      "isApproved": false,
      "adminProfile": { ... },
      "createdAt": "2026-05-21T00:00:00.000Z",
      "updatedAt": "2026-05-21T00:00:00.000Z"
    },
    "token": "<access-token>"
  }
}
```

### Example Response: Not Verified

```json
{
  "status": "success",
  "message": "Login successful. Please verify your account to access dashboard. Check your email for a verification code",
  "data": null
}
```

### Notes

- The endpoint returns success for valid credentials even if the account is not verified.
- Only fully verified accounts return a token if allowed.
- Unverified accounts return `data: null` and no access token.

---

# 3. Verify Account

### Endpoint

`POST /api/auth/verify`

### Description

Verifies an account using the token sent by email. This marks the account as verified and returns login credentials.

### Request Type

**Body (JSON)**

### Required Body Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| email | string | Yes | The email address associated with the account |
| token | string | Yes | The verification token sent by email |

### Example Request Body

```json
{
  "email": "sevaca5636@keevle.com",
  "token": "your-verification-token"
}
```

### Example Success Response

```json
{
  "status": "success",
  "message": "Account has been verified. You can now access your dashboard",
  "data": {
    "account": {
      "id": "6a0d5f10bc6487377983c743",
      "email": "sevaca5636@keevle.com",
      "role": "admin",
      "schoolId": "6a0d5e8d9f5e1f0c14884584",
      "verified": true,
      "isApproved": false,
      "adminProfile": { ... },
      "createdAt": "2026-05-21T00:00:00.000Z",
      "updatedAt": "2026-05-21T00:00:00.000Z"
    },
    "token": "<access-token>"
  }
}
```

### Notes

- `email` is required alongside `token`.
- The response returns a sanitized account object and a new access token.

---

# QUICK SUMMARY TABLE

| Route | Method | Request Type | Required Fields / Params | Example Success Response |
| --- | --- | --- | --- | --- |
| `/api/auth/signup` | POST | Body (JSON) | firstName, lastName, email, password | `status`, `message`, `data.account` |
| `/api/auth/login` | POST | Body (JSON) | email, password | `status`, `message`, `data` or `data.account` + `token` |
| `/api/auth/verify` | POST | Body (JSON) | email, token | `status`, `message`, `data.account` + `token` |

---

# Notes

- Signup requires an existing school record before admin creation.
- Login can return success without an access token for unverified accounts.
- Verified-but-unapproved admins may still receive a token, but their client should restrict access until approval.
- All returned account objects are sanitized to exclude sensitive fields such as `password` and token material.
