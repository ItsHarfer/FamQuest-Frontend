# n8n Webhook API Documentation

This document describes the API requests that the FamQuest frontend sends to n8n webhooks.

## Base Configuration

All requests are sent to the n8n webhook URL configured in `.env`:
```
N8N_WEBHOOK_URL="https://your-n8n-instance.com/webhook/orchestrator"
```

## Request Format

All requests use `POST` method with `Content-Type: application/json`.

---

## 1. Orchestrator Endpoint (Chat & Actions)

**Frontend Route:** `/api/orchestrator`  
**Method:** `POST`

### Request Payload

```json
{
  "message": "I completed the kitchen cleaning quest",
  "imageData": "base64_encoded_image_string_or_url", // Optional, for PHOTO_AI verification
  "userId": "user-uuid-here", // Optional, will be validated in n8n
  "userEmail": "user@example.com", // Optional
  "userName": "Hero Name", // Optional
  "timestamp": "2025-12-15T10:30:00.000Z"
}
```

### Example Request

```bash
curl -X POST http://localhost:3000/api/orchestrator \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I completed the kitchen cleaning quest",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "userEmail": "hero@example.com",
    "userName": "Hero",
    "timestamp": "2025-12-15T10:30:00.000Z"
  }'
```

### Expected n8n Response

```json
{
  "message": "A victory! Your Preparation Stage increases. The Guild Master acknowledges your completion of the kitchen cleaning quest.",
  "questsUpdated": true,
  "quests": [
    {
      "id": "quest-uuid",
      "title": "Clean the Kitchen",
      "status": "COMPLETED",
      "xp_value": 50
    }
  ]
}
```

### Frontend Response

```json
{
  "success": true,
  "message": "A victory! Your Preparation Stage increases...",
  "questsUpdated": true,
  "quests": [...]
}
```

---

## 2. User Login

**Frontend Route:** `/api/auth/login`  
**Method:** `POST`

### Request Payload

```json
{
  "action": "login",
  "email": "user@example.com",
  "password": "userpassword",
  "timestamp": "2025-12-15T10:30:00.000Z"
}
```

### Example Request

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "action": "login",
    "email": "user@example.com",
    "password": "userpassword",
    "timestamp": "2025-12-15T10:30:00.000Z"
  }'
```

### Expected n8n Response

```json
{
  "success": true,
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Hero",
    "email": "user@example.com",
    "role": "Member",
    "stage": 1,
    "xp_current": 250,
    "family_id": "family-uuid"
  },
  "token": "jwt-token-here", // Optional, if n8n manages sessions
  "message": "Welcome back, Hero!"
}
```

### Frontend Response

```json
{
  "success": true,
  "user": {...},
  "token": "jwt-token-here"
}
```

---

## 3. User Registration

**Frontend Route:** `/api/auth/register`  
**Method:** `POST`

### Request Payload

```json
{
  "action": "register",
  "name": "Hero Name",
  "email": "user@example.com",
  "password": "userpassword",
  "timestamp": "2025-12-15T10:30:00.000Z"
}
```

### Example Request

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "action": "register",
    "name": "Hero Name",
    "email": "user@example.com",
    "password": "userpassword",
    "timestamp": "2025-12-15T10:30:00.000Z"
  }'
```

### Expected n8n Response

```json
{
  "success": true,
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Hero Name",
    "email": "user@example.com",
    "role": "Member",
    "stage": 0,
    "xp_current": 0,
    "family_id": "family-uuid"
  },
  "message": "Welcome to FamQuest, Hero! Your adventure begins now."
}
```

### Frontend Response

```json
{
  "success": true,
  "user": {...},
  "message": "Welcome to FamQuest, Hero! Your adventure begins now."
}
```

---

## 4. Get User Data

**Frontend Route:** `/api/user?userId=user-uuid`  
**Method:** `GET`

### Request Query Parameters

```
userId: string (UUID)
```

### Example Request

```bash
curl -X GET "http://localhost:3000/api/user?userId=123e4567-e89b-12d3-a456-426614174000"
```

### Expected n8n Response

```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Hero",
    "email": "user@example.com",
    "role": "Member",
    "stage": 1,
    "xp_current": 250,
    "family_id": "family-uuid"
  }
}
```

### Frontend Response

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Hero",
  "email": "user@example.com",
  "role": "Member",
  "stage": 1,
  "xp_current": 250,
  "family_id": "family-uuid"
}
```

---

## 5. Get Quests

**Frontend Route:** `/api/quests?userId=user-uuid`  
**Method:** `GET`

### Request Query Parameters

```
userId: string (UUID)
```

### Example Request

```bash
curl -X GET "http://localhost:3000/api/quests?userId=123e4567-e89b-12d3-a456-426614174000"
```

### Expected n8n Response

```json
{
  "quests": [
    {
      "id": "quest-uuid-1",
      "title": "Clean the Kitchen",
      "category": "Household",
      "status": "OPEN",
      "verification_type": "SIMPLE",
      "proof_url": null,
      "bonus_xp": 0,
      "assigned_to": "user-uuid",
      "xp_value": 50,
      "due_date": "2025-12-20T00:00:00.000Z",
      "is_secret": false,
      "quest_type": "QUEST"
    },
    {
      "id": "quest-uuid-2",
      "title": "Morning Exercise",
      "category": "Health",
      "status": "DAILY_RITUAL",
      "verification_type": "PHOTO_AI",
      "proof_url": null,
      "bonus_xp": 25,
      "assigned_to": "user-uuid",
      "xp_value": 30,
      "due_date": null,
      "is_secret": false,
      "quest_type": "DAILY_RITUAL"
    }
  ]
}
```

### Frontend Response

```json
[
  {
    "id": "quest-uuid-1",
    "title": "Clean the Kitchen",
    "category": "Household",
    "status": "OPEN",
    ...
  }
]
```

---

## 6. Get Boss Battle Data

**Frontend Route:** `/api/boss?userId=user-uuid`  
**Method:** `GET`

### Request Query Parameters

```
userId: string (UUID)
```

### Example Request

```bash
curl -X GET "http://localhost:3000/api/boss?userId=123e4567-e89b-12d3-a456-426614174000"
```

### Expected n8n Response

```json
{
  "boss": {
    "id": "boss-uuid",
    "name": "The Entropy Dragon",
    "theme": "Chaos and Disorder",
    "description": "A formidable beast born from the chaos of uncompleted tasks and forgotten responsibilities.",
    "current_hp": 750,
    "max_hp": 1000,
    "illustration_url": "https://example.com/boss-image.png",
    "requirements": [
      {
        "id": "req-1",
        "description": "At least 2 family members reach Stage 2 (Adept)",
        "target_stage": 2,
        "completed": true,
        "progress": 2,
        "max_progress": 2
      },
      {
        "id": "req-2",
        "description": "Complete 50 quests as a family",
        "target_quest_count": 50,
        "completed": false,
        "progress": 35,
        "max_progress": 50
      }
    ],
    "family_id": "family-uuid"
  },
  "progress": {
    "completed_stages": [0, 1, 2],
    "completed_quests": 35,
    "total_required_stages": 2,
    "total_required_quests": 50,
    "requirements": [...]
  }
}
```

### Frontend Response

```json
{
  "boss": {...},
  "progress": {...}
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message here",
  "details": "Additional error details (optional)"
}
```

### Common Error Codes

- `400` - Bad Request (missing required fields)
- `401` - Unauthorized (invalid credentials or session)
- `404` - Not Found (user/quest/boss not found)
- `500` - Internal Server Error (n8n webhook failed or server error)

---

## n8n Webhook Implementation Notes

### Action-Based Routing

For endpoints that use `action` field (login, register, getUser, getQuests, getBoss), n8n should route based on the `action` value:

```javascript
// n8n workflow example
const action = $input.item.json.action;

switch(action) {
  case 'login':
    // Handle login logic
    break;
  case 'register':
    // Handle registration logic
    break;
  case 'getUser':
    // Handle get user logic
    break;
  case 'getQuests':
    // Handle get quests logic
    break;
  case 'getBoss':
    // Handle get boss logic
    break;
  default:
    // Handle orchestrator/chat messages
}
```

### Session Management

If n8n manages sessions, it should:
1. Validate tokens/cookies in requests
2. Return session tokens in login/register responses
3. Validate userId in subsequent requests

### Image Handling

For `PHOTO_AI` verification, the `imageData` field can contain:
- Base64 encoded image string
- Image URL
- File reference

n8n should process this and update quest status accordingly.

---

## Testing

You can test these endpoints using the provided curl examples or tools like Postman. Make sure to:

1. Set `N8N_WEBHOOK_URL` in your `.env` file
2. Configure your n8n workflow to handle these requests
3. Test each endpoint with valid and invalid data

