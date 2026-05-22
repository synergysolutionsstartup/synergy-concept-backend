# SYNERGY CONCEPT BACKEND SCHOOL INFO API DOCUMENTATION

---

## Base URLs

- **Production:** `https://synergy-concept-backend.onrender.com`

---

# 1. Create School Info

### Endpoint

`POST /api/school-info`

### Description

Creates or upserts school information for the authenticated super-admin user. The API uses the authenticated user's `userId` as the owner and returns the saved school record.

### Authorization

- Requires a valid access token in `Authorization: Bearer <token>`
- Allowed role: `super_admin` only

### Request Type

**Body (JSON)**

### Required Body Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| name | string | Yes | The school name |
| email | string | Yes | Contact email for the school |
| phoneNumber1 | string | Yes | Primary contact number |
| state | string | Yes | School state or region |
| country | string | Yes | School country |
| address | string | Yes | School street address |

### Optional Body Fields

| Field | Type | Description |
| --- | --- | --- |
| photo | string | Optional school image URL |
| phoneNumber2 | string | Optional secondary contact number |

### Example Request Body

```json
{
  "name": "Synergy Concept International School",
  "photo": "https://example.com/logo.png",
  "email": "info@synergyconcept.school",
  "phoneNumber1": "+2348012345678",
  "phoneNumber2": "+2348098765432",
  "state": "Lagos",
  "country": "Nigeria",
  "address": "123 Model Street, Lekki Phase 1"
}
```

### Example Success Response

```json
{
  "status": "success",
  "message": "School information saved successfully",
  "data": {
    "id": "64a1b9f7c3e2a4d2e5f6b7c8",
    "name": "Synergy Concept International School",
    "photo": "https://example.com/logo.png",
    "email": "info@synergyconcept.school",
    "phoneNumber1": "+2348012345678",
    "phoneNumber2": "+2348098765432",
    "state": "Lagos",
    "country": "Nigeria",
    "address": "123 Model Street, Lekki Phase 1",
    "createdAt": "2026-05-21T12:00:00.000Z",
    "updatedAt": "2026-05-21T12:00:00.000Z"
  }
}
```

### Notes

- The route uses `findOneAndUpdate` with `userId` and `upsert: true`, so it will create a new school info record if none exists for the super-admin, or replace the existing record for that owner.
- `userId` is injected from the authenticated session and is not accepted in the request body.
- The response returns the normalized school info record.

---

# 2. Update School Info

### Endpoint

`PUT /api/school-info`

### Description

Updates an existing school info record by its `id`. The request may include any subset of school fields to patch.

### Authorization

- Requires a valid access token in `Authorization: Bearer <token>`
- Allowed role: `super_admin` only

### Request Type

**Body (JSON)**

### Required Body Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| id | string | Yes | The school information record id to update |

### Optional Body Fields

| Field | Type | Description |
| --- | --- | --- |
| name | string | School name |
| photo | string | School image URL |
| email | string | Contact email |
| phoneNumber1 | string | Primary phone number |
| phoneNumber2 | string | Secondary phone number |
| state | string | School state or region |
| country | string | School country |
| address | string | School address |

### Example Request Body

```json
{
  "id": "64a1b9f7c3e2a4d2e5f6b7c8",
  "email": "contact@synergyconcept.school",
  "phoneNumber1": "+2348012349999"
}
```

### Example Success Response

```json
{
  "status": "success",
  "message": "School information saved successfully",
  "data": {
    "id": "64a1b9f7c3e2a4d2e5f6b7c8",
    "name": "Synergy Concept International School",
    "photo": "https://example.com/logo.png",
    "email": "contact@synergyconcept.school",
    "phoneNumber1": "+2348012349999",
    "phoneNumber2": "+2348098765432",
    "state": "Lagos",
    "country": "Nigeria",
    "address": "123 Model Street, Lekki Phase 1",
    "createdAt": "2026-05-21T12:00:00.000Z",
    "updatedAt": "2026-05-21T12:15:00.000Z"
  }
}
```

### Notes

- If the record id is invalid or not found, the underlying DAO will return `null` and the response may contain `data: null`.
- `userId` is not returned in the final response.

---

# 3. Read School Info

### Endpoint

`GET /api/school-info?id=<school-id>`

### Description

Retrieves a school info record by its id.

### Authorization

- No authentication middleware is configured for this route.

### Request Type

**Query Parameter**

### Required Query Parameters

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| id | string | Yes | The school info record id |

### Example Request

```
GET http://localhost:3000/api/school-info/?id=64a1b9f7c3e2a4d2e5f6b7c8
Content-Type: application/json
```

### Example Success Response (Record Found)

```json
{
  "status": "success",
  "message": "School Information retrived successfully",
  "data": {
    "id": "64a1b9f7c3e2a4d2e5f6b7c8",
    "name": "Synergy Concept International School",
    "photo": "https://example.com/logo.png",
    "email": "info@synergyconcept.school",
    "phoneNumber1": "+2348012345678",
    "phoneNumber2": "+2348098765432",
    "state": "Lagos",
    "country": "Nigeria",
    "address": "123 Model Street, Lekki Phase 1",
    "createdAt": "2026-05-21T12:00:00.000Z",
    "updatedAt": "2026-05-21T12:00:00.000Z"
  }
}
```

### Example Success Response (Record Not Found)

```json
{
  "status": "success",
  "message": "School Information retrived successfully",
  "data": null
}
```

### Notes

- The controller converts any stored field value equal to `"N/A"` into `null` in the returned payload.
- The response omits the internal `userId` field.
- If the `id` query parameter is missing, the route returns `400 Bad Request`.

---

# School Info Data Model

The returned school info record includes these fields:

- `id`: string
- `name`: string
- `photo`: string | null
- `email`: string
- `phoneNumber1`: string
- `phoneNumber2`: string | null
- `state`: string
- `country`: string
- `address`: string
- `createdAt`: string
- `updatedAt`: string

---

# Summary Table

| Route | Method | Auth | Main Behavior | Returned Data |
| --- | --- | --- | --- | --- |
| `/api/school-info` | POST | `super_admin` | Create or upsert school info by owner | Normalized school info record |
| `/api/school-info` | PUT | `super_admin` | Update school info by id | Normalized school info record |
| `/api/school-info` | GET | None | Fetch school info by id | Normalized school info record or null |

---

# Important Business Rules

- `POST` uses the signed-in super-admin’s `userId` to create or overwrite the school info record for that owner.
- `PUT` requires the record `id` and only updates the specified fields.
- `GET` returns `data: null` when no matching record exists rather than an error.
- All responses are sanitized and do not expose the internal `userId`.
