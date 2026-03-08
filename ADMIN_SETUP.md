# Admin Panel & AI News Generator Setup Guide

## Overview

The improved admin panel includes a professional sidebar layout and an AI-powered news generator that can create articles using Claude AI.

## Features

### 1. Improved Admin Panel

- **Responsive Sidebar Navigation**
  - Collapsible sidebar (full width or icon-only)
  - Active route highlighting
  - Quick access to all admin features
  - User email display
  - One-click logout

- **Navigation Items**
  - Articles - View and manage all articles
  - Create Article - Manually create new articles
  - AI Generator - Generate articles with AI
  - Adverts - Manage advertisements

### 2. AI News Generator

- **Generate Quality Articles** with titles and topics
- **Multiple Tones**: Journalistic, Professional, Casual
- **Multi-language Support**: English, Kinyarwanda, Swahili
- **Smart Features**:
  - Auto-generated excerpts
  - Read time estimation
  - Copy-to-clipboard for each field
  - Preview before publishing

## Setup Instructions

### Step 1: Get Anthropic API Key

1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Sign up or login
3. Navigate to APIs → Keys
4. Create a new API key
5. Copy it securely

### Step 2: Configure Environment

Add to your `.env.local`:

```bash
# AI News Generator
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

### Step 3: Test the AI Generator

1. Start your dev server: `npm run dev`
2. Go to `http://localhost:3000/admin/login`
3. Login with your admin credentials
4. Click "AI Generator" in the sidebar
5. Fill in:
   - **Title**: Article headline
   - **Topic**: Key points or description
   - **Tone**: Style preference
   - **Language**: Output language
6. Click "Generate Article"

## Files Created/Modified

### New Files

- `app/admin/ai-generator/page.tsx` - AI generator interface
- `app/api/admin/generate-article/route.ts` - AI generation API

### Modified Files

- `app/admin/layout.tsx` - Improved sidebar layout
- `.env.example` - Added ANTHROPIC_API_KEY template

## How to Use

### Generate an Article

1. In admin panel, click "AI Generator"
2. Enter article title and topic
3. Select tone and language
4. Click "Generate Article"
5. Copy the generated content
6. Use "Create Article" to finalize and publish

### Best Practices for AI Generation

**Good Topic Descriptions:**

```
Rwanda's technology sector has seen significant growth with new startups emerging
in fintech and agriculture tech. Focus on job creation, investment trends, and
success stories from Kigali and Kigobe.
```

**Poor Topic Descriptions:**

```
Tech in Rwanda
```

**Tips:**

- Be specific about what you want included
- Mention key data points or statistics if known
- Give context about the news angle
- Specify tone to match your audience

## API Integration

### Generate Article Endpoint

**Post**: `/api/admin/generate-article`

**Request Body:**

```json
{
  "title": "Rwanda's Tech Sector Booms",
  "topic": "Details about tech growth, startups, investments",
  "tone": "journalistic",
  "language": "en"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "title": "Rwanda's Tech Sector Booms",
    "content": "Full article content...",
    "excerpt": "Brief excerpt for preview",
    "readTime": 5,
    "language": "en"
  }
}
```

## Troubleshooting

### "AI service not configured"

- Check that `ANTHROPIC_API_KEY` is set in `.env.local`
- Verify the API key is valid on console.anthropic.com
- Restart the dev server after adding the env variable

### Article generation too slow

- Initial requests may take 10-15 seconds
- Subsequent requests are faster
- Consider the complexity of your topic

### Generated content quality issues

- Be more specific in your topic description
- Provide more context and details
- Try different tones to see what works best

### Language output is wrong

- Ensure you selected the correct language
- For Kinyarwanda and Swahili, be more descriptive
- English typically produces longer content

## Cost Considerations

- Free tier: ~5M input tokens/month
- Each article generation costs ~200-400 tokens
- Approximately 60-100 free articles/month at normal usage
- Reference [Anthropic Pricing](https://www.anthropic.com/pricing) for details

## Future Enhancements

Potential improvements:

- Batch generation of multiple articles
- Article templates for specific news types
- Auto-categorization of generated articles
- SEO optimization suggestions
- Multi-source research integration

## Support

For issues:

1. Check `.env.local` configuration
2. Verify API key validity
3. Review browser console for error messages
4. Check server logs for API response details
