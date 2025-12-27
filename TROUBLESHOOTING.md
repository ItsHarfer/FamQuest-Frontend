# Troubleshooting Guide

## Common Issues

### 1. n8n Webhook "Not Found" (404 Error)

**Error Message:**
```
n8n webhook failed: Not Found
```

**Possible Causes:**

1. **Webhook URL is incorrect**
   - Check your `.env` file: `N8N_WEBHOOK_URL`
   - The URL should look like: `https://your-n8n-instance.com/webhook/your-webhook-id`
   - Or: `http://localhost:5678/webhook/your-webhook-id` (for local n8n)

2. **Webhook is not active in n8n**
   - Open your n8n workflow
   - Check if the Webhook node is active (green)
   - Make sure the workflow itself is active

3. **Webhook path is wrong**
   - In n8n, go to your Webhook node
   - Copy the exact webhook URL shown in the node
   - Make sure it matches your `.env` file

**Solution Steps:**

1. Verify your `.env` file:
   ```env
   N8N_WEBHOOK_URL="https://your-n8n-instance.com/webhook/abc123"
   ```

2. Test the webhook URL directly:
   ```bash
   curl -X POST https://your-n8n-instance.com/webhook/abc123 \
     -H "Content-Type: application/json" \
     -d '{"action": "register", "name": "Test", "email": "test@example.com", "password": "test123"}'
   ```

3. Check n8n workflow:
   - Open n8n
   - Find your workflow
   - Ensure the Webhook node is configured correctly
   - Activate the workflow if it's not active

4. Check n8n logs:
   - Look at the n8n execution logs
   - See if requests are reaching n8n
   - Check for any errors in the workflow

### 2. Environment Variable Not Set

**Error Message:**
```
n8n webhook URL not configured
```

**Solution:**
1. Create or update your `.env` file in the project root
2. Add: `N8N_WEBHOOK_URL="your-webhook-url"`
3. Restart your Next.js development server

### 3. CORS Issues

If you're running n8n locally and Next.js locally, you might encounter CORS issues.

**Solution:**
- Configure CORS in your n8n workflow
- Or use a proxy
- Or deploy n8n to a public URL

### 4. Network Connection Issues

**Error Message:**
```
n8n webhook request failed
```

**Solution:**
- Check if n8n is running and accessible
- Verify network connectivity
- Check firewall settings

## Debugging Tips

### Enable Console Logging

The API routes now log detailed error information. Check your terminal/console for:
- The webhook URL being called
- HTTP status codes
- Error response bodies

### Test Webhook Directly

Test your n8n webhook with curl:

```bash
# Registration
curl -X POST http://localhost:5678/webhook/your-webhook-id \
  -H "Content-Type: application/json" \
  -d '{
    "action": "register",
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "timestamp": "2025-12-15T10:30:00.000Z"
  }'

# Login
curl -X POST http://localhost:5678/webhook/your-webhook-id \
  -H "Content-Type: application/json" \
  -d '{
    "action": "login",
    "email": "test@example.com",
    "password": "test123",
    "timestamp": "2025-12-15T10:30:00.000Z"
  }'

# Chat/Orchestrator
curl -X POST http://localhost:5678/webhook/your-webhook-id \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello Guild Master",
    "userId": "user-uuid",
    "timestamp": "2025-12-15T10:30:00.000Z"
  }'
```

### Check n8n Workflow

1. Open your n8n workflow
2. Check the Webhook node configuration:
   - HTTP Method: `POST`
   - Path: Should match your webhook URL
   - Response Mode: `Last Node` or `When Last Node Finishes`
3. Ensure the workflow is **Active**
4. Test the workflow manually in n8n

### Verify Environment Variables

```bash
# In your project root, check if .env exists
cat .env

# Should contain:
# N8N_WEBHOOK_URL="your-webhook-url"
```

## Getting Your n8n Webhook URL

1. **For n8n Cloud:**
   - Go to your workflow
   - Click on the Webhook node
   - Copy the "Production URL" or "Test URL"
   - Format: `https://your-instance.app.n8n.cloud/webhook/abc123`

2. **For Self-Hosted n8n:**
   - Go to your workflow
   - Click on the Webhook node
   - Copy the webhook URL
   - Format: `http://localhost:5678/webhook/abc123` (local)
   - Or: `https://your-domain.com/webhook/abc123` (deployed)

3. **For n8n Desktop:**
   - Same as self-hosted
   - Usually: `http://localhost:5678/webhook/abc123`

## Common n8n Webhook URL Formats

- **n8n Cloud:** `https://[instance].app.n8n.cloud/webhook/[id]`
- **Local n8n:** `http://localhost:5678/webhook/[id]`
- **Self-hosted:** `https://[your-domain]/webhook/[id]`

Make sure the URL in your `.env` file matches exactly!


