# API Documentation: [API Name]

> **Version:** 1.0.0  
> **Base URL:** `https://api.example.com/v1`  
> **Last Updated:** YYYY-MM-DD

---

## Overview

<!-- Brief description of what this API does and who it is intended for. -->

### Authentication

<!-- Describe the authentication method. -->

All requests require an `Authorization` header:

```
Authorization: Bearer <token>
```

### Rate Limiting

| Tier     | Requests per minute |
| -------- | ------------------- |
| Standard | 60                  |
| Premium  | 600                 |

Rate limit headers are included in every response:

- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

### Error Responses

All errors follow this structure:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found.",
    "details": {}
  }
}
```

| HTTP Status | Error Code           | Meaning                           |
| ----------- | -------------------- | --------------------------------- |
| 400         | `VALIDATION_ERROR`   | Request body failed validation    |
| 401         | `UNAUTHORIZED`       | Missing or invalid authentication |
| 403         | `FORBIDDEN`          | Authenticated but not authorized  |
| 404         | `RESOURCE_NOT_FOUND` | Resource does not exist           |
| 429         | `RATE_LIMITED`       | Too many requests                 |
| 500         | `INTERNAL_ERROR`     | Unexpected server error           |

---

## Endpoints

### `GET /resource`

Retrieves a paginated list of resources.

**Query Parameters**

| Parameter | Type            | Required | Default     | Description                |
| --------- | --------------- | -------- | ----------- | -------------------------- |
| `page`    | `number`        | No       | `1`         | Page number (1-indexed)    |
| `limit`   | `number`        | No       | `20`        | Results per page (max 100) |
| `sort`    | `string`        | No       | `createdAt` | Field to sort by           |
| `order`   | `asc` \| `desc` | No       | `desc`      | Sort order                 |

**Response `200 OK`**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Example",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

### `GET /resource/:id`

Retrieves a single resource by ID.

**Path Parameters**

| Parameter | Type            | Description     |
| --------- | --------------- | --------------- |
| `id`      | `string` (UUID) | The resource ID |

**Response `200 OK`**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Example",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

---

### `POST /resource`

Creates a new resource.

**Request Body**

```json
{
  "name": "New Resource",
  "description": "Optional description"
}
```

| Field         | Type     | Required | Constraints        |
| ------------- | -------- | -------- | ------------------ |
| `name`        | `string` | Yes      | 1–100 characters   |
| `description` | `string` | No       | Max 500 characters |

**Response `201 Created`**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "New Resource",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

### `PATCH /resource/:id`

Updates an existing resource.

**Request Body**

All fields are optional. Only provided fields are updated.

```json
{
  "name": "Updated Name"
}
```

**Response `200 OK`** — Returns the updated resource.

---

### `DELETE /resource/:id`

Deletes a resource.

**Response `204 No Content`** — Empty body on success.

---

## Data Models

### Resource

```typescript
interface Resource {
  id: string; // UUID v4
  name: string; // 1–100 characters
  description?: string; // Optional, max 500 characters
  createdAt: string; // ISO 8601 datetime
  updatedAt: string; // ISO 8601 datetime
}
```

---

## Changelog

| Version | Date       | Changes                   |
| ------- | ---------- | ------------------------- |
| 1.0.0   | YYYY-MM-DD | Initial API documentation |
