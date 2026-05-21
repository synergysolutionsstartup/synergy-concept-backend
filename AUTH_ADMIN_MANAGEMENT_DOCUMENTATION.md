# SYNERGY CONCEPT BACKEND AUTH MODULE ADMIN MANAGEMENT API DOCUMENTATION

---

## Base URLs

- **Production:** `https://synergy-concept-backend.onrender.com`

---

# 1. Read Users By Role

### Endpoint

`GET /api/auth/users`

### Description

Retrieves users filtered by role. Super-admins may read all roles. Admins may read all non-super-admin users.

### Authorization

- Requires a valid access token in `Authorization: Bearer <token>`
- Allowed roles: `admin`, `super_admin`

### Request Type

**Query Parameter**

### Optional Query Parameter

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| role | string | No | Filter users by role (`admin`, `staff`, `student`, `parent`, `super_admin`) |

### Example Request

```
GET http://localhost:3000/api/auth/users?role=staff
Authorization: Bearer <access-token>
```

### Example Success Response

```json
{
  "status": "success",
  "message": "Users retrieved successfully.",
  "data": [
    {
      "id": "6a0d5f10bc6487377983c743",
      "email": "ade.adenike@example.com",
      "role": "staff",
      "schoolId": "6a0d5e8d9f5e1f0c14884584",
      "verified": true,
      "isApproved": true,
      "staffProfile": {
        "id": "6a0d5f10bc6487377983c746",
        "userId": "6a0d5f10bc6487377983c743",
        "firstName": "Ade",
        "lastName": "Adenike",
        "gender": null,
        "department": null,
        "hireDate": null,
        "subRoles": ["class_teacher"],
        "createdAt": "2026-05-21T00:00:00.000Z",
        "updatedAt": "2026-05-21T00:00:00.000Z"
      },
      "createdAt": "2026-05-21T00:00:00.000Z",
      "updatedAt": "2026-05-21T00:00:00.000Z"
    }
  ]
}
```

### Notes

- Super-admin may request any role.
- Admin may request any role except `super_admin`.
- If `role` is omitted, super-admin receives all users and admin receives all non-super-admin users.
- The response returns sanitized account objects only.

---

# 2. Approve a Single Admin

### Endpoint

`PATCH /api/auth/admins/:id/approve`

### Description

Approves an admin account by setting `isApproved: true`.

### Authorization

- Requires a valid access token in `Authorization: Bearer <token>`
- Allowed role: `super_admin` only

### Request Type

**URL Parameter**

### Required URL Param

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| id | string | Yes | The admin user id to approve |

### Example Request

```
PATCH http://localhost:3000/api/auth/admins/6a0d5f10bc6487377983c743/approve
Authorization: Bearer <superadmin-access-token>
```

### Example Success Response

```json
{
  "status": "success",
  "message": "Admin account approved successfully.",
  "data": {
    "account": {
      "id": "6a0d5f10bc6487377983c743",
      "email": "ade.adenike@example.com",
      "role": "admin",
      "schoolId": "6a0d5e8d9f5e1f0c14884584",
      "verified": true,
      "isApproved": true,
      "adminProfile": {
        "id": "6a0d5f10bc6487377983c745",
        "userId": "6a0d5f10bc6487377983c743",
        "firstName": "Ade",
        "lastName": "Adenike",
        "gender": null,
        "createdAt": "2026-05-21T00:00:00.000Z",
        "updatedAt": "2026-05-21T00:00:00.000Z"
      },
      "createdAt": "2026-05-21T00:00:00.000Z",
      "updatedAt": "2026-05-21T00:00:00.000Z"
    }
  }
}
```

### Notes

- This endpoint only approves `admin` users.
- If the requested account is not an admin, it returns a `400` error.
- If the account id does not exist, it returns a `404` error.

---

# 3. Approve Many Admins

### Endpoint

`PATCH /api/auth/admins/approve-many`

### Description

Approves multiple admin accounts in a single request.

### Authorization

- Requires a valid access token in `Authorization: Bearer <token>`
- Allowed role: `super_admin` only

### Request Type

**Body (JSON)**

### Required Body Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| ids | string[] | Yes | List of admin user ids to approve |

### Example Request Body

```json
{
  "ids": [
    "6a0d5f10bc6487377983c743",
    "6a0d5f20bc6487377983c744"
  ]
}
```

### Example Success Response

```json
{
  "status": "success",
  "message": "Admin accounts approved successfully.",
  "data": {
    "admins": [
      {
        "id": "6a0d5f10bc6487377983c743",
        "email": "ade.adenike@example.com",
        "role": "admin",
        "schoolId": "6a0d5e8d9f5e1f0c14884584",
        "verified": true,
        "isApproved": true,
        "adminProfile": {
          "id": "6a0d5f10bc6487377983c745",
          "userId": "6a0d5f10bc6487377983c743",
          "firstName": "Ade",
          "lastName": "Adenike",
          "gender": null,
          "createdAt": "2026-05-21T00:00:00.000Z",
          "updatedAt": "2026-05-21T00:00:00.000Z"
        },
        "createdAt": "2026-05-21T00:00:00.000Z",
        "updatedAt": "2026-05-21T00:00:00.000Z"
      }
    ]
  }
}
```

### Notes

- The request must include at least one admin id.
- The endpoint returns the list of approved admin accounts in sanitized form.

---

# QUICK SUMMARY TABLE

| Route | Method | Request Type | Required Fields / Params | Access |
| --- | --- | --- | --- | --- |
| `/api/auth/users` | GET | Query Param | [role] | admin, super_admin |
| `/api/auth/admins/:id/approve` | PATCH | URL Param | id | super_admin |
| `/api/auth/admins/approve-many` | PATCH | Body (JSON) | ids | super_admin |

---

# Notes

- `GET /api/auth/users` is the only role-read endpoint in this group.
- Admins cannot read `super_admin` users.
- Approval endpoints return sanitized account objects only.


**Body (JSON)**

### Required Body Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| ids | string[] | Yes | List of admin user ids to approve |

### Example Request Body

```json
{
  "ids": [
    "6a0d5f10bc6487377983c743",
    "6a0d5f20bc6487377983c744"
  ]
}
```

### Example Success Response

```json
{
  "status": "success",
  "message": "Admin accounts approved successfully.",
  "data": {
    "admins": [
      {
        "id": "6a0d5f10bc6487377983c743",
        "email": "ade.adenike@example.com",
        "role": "admin",
        "schoolId": "6a0d5e8d9f5e1f0c14884584",
        "verified": true,
        "isApproved": true,
        "adminProfile": { ... },
        "createdAt": "2026-05-21T00:00:00.000Z",
        "updatedAt": "2026-05-21T00:00:00.000Z"
      }
    ]
  }
}
```

### Notes

- The request must include at least one admin id.
- The endpoint returns the list of approved admin accounts in sanitized form.

---

# QUICK SUMMARY TABLE

| Route | Method | Request Type | Required Fields / Params | Access |
| --- | --- | --- | --- | --- |
| `/api/auth/create-account` | POST | Body (JSON) | role, firstName, lastName, email, password, [subRoles] | admin, super_admin |
| `/api/auth/users` | GET | Query Param | [role] | admin, super_admin |
| `/api/auth/admins/:id/approve` | PATCH | URL Param | id | super_admin |
| `/api/auth/admins/approve-many` | PATCH | Body (JSON) | ids | super_admin |

---

# Notes

- `create-account` may only create `staff`, `student`, or `parent` accounts; it rejects `role: admin`.
- Admin users cannot read `super_admin` users via `/api/auth/users`.
- Approval endpoints return sanitized account objects without sensitive fields.
