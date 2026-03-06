# Adding Real Articles to Amakuru

This guide explains how to add and manage real articles in the Amakuru news platform.

## System Overview

The application now uses a centralized articles system:
- **Data Storage**: `data/articles.json` - Contains all published articles
- **API Route**: `app/api/articles/route.ts` - Handles article CRUD operations
- **Pages**: Fetch articles dynamically from the API instead of hardcoded mock data

## Adding Articles

### Option 1: Direct JSON Edit

Edit `data/articles.json` and add new article objects to the `articles` array:

```json
{
  "id": "7",
  "title": "Your Article Title Here",
  "slug": "your-article-title-here",
  "excerpt": "Brief summary of the article (appears in listings)",
  "content": "Full article content here",
  "image": "https://images.unsplash.com/photo-url",
  "category": "technology",
  "author": "Author Name",
  "publishedAt": "2 hours ago",
  "readTime": 5,
  "tags": ["Tag1", "Tag2"],
  "featured": false,
  "status": "published"
}
```

**Available Categories:**
- `technology`
- `business`
- `politics`
- `health`
- `education`
- `culture`
- `sports`
- `investigations`

### Option 2: API POST Request

Send a POST request to `/api/articles` to create articles programmatically:

```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Your Article Title",
    "excerpt": "Brief summary",
    "content": "Full content",
    "category": "technology",
    "author": "Author Name",
    "image": "https://image-url.com",
    "readTime": 5,
    "tags": ["tag1", "tag2"],
    "featured": false
  }'
```

**Required Fields:**
- `title` - Article headline
- `excerpt` - Short summary for listings
- `category` - One of the available categories
- `author` - Author name

**Optional Fields:**
- `content` - Full article body (defaults to excerpt)
- `image` - Featured image URL (defaults to placeholder)
- `slug` - URL-friendly version (auto-generated from title)
- `readTime` - Minutes to read (defaults to 5)
- `tags` - Array of tags
- `featured` - Mark as featured (defaults to false)
- `publishedAt` - Publication date (auto-generated)

### Option 3: Connect to External Database

To use a real database (MongoDB, PostgreSQL, etc.):

1. Update `app/api/articles/route.ts`:
```typescript
// Replace JSON import with database query
import { connectDB } from '@/lib/db';
import { Article } from '@/models/Article';

export async function GET(request: NextRequest) {
  const db = await connectDB();
  const articles = await Article.find({ status: 'published' });
  // ... rest of implementation
}
```

2. Update pages to fetch from API:
```typescript
// In any page or component
const response = await fetch('/api/articles?category=technology&limit=6');
const { data: articles } = await response.json();
```

## Using Articles in Pages

All pages now fetch articles from the API. Example:

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('/api/articles?limit=6')
      .then((res) => res.json())
      .then((data) => setArticles(data.data));
  }, []);

  return (
    <div>
      {articles.map((article) => (
        <div key={article.id}>{article.title}</div>
      ))}
    </div>
  );
}
```

## API Endpoints

### GET /api/articles
Fetch articles with optional filters.

**Query Parameters:**
- `category` - Filter by category
- `limit` - Number of articles to return
- `featured` - Get only featured articles (`true`/`false`)

**Examples:**
```
GET /api/articles
GET /api/articles?category=technology
GET /api/articles?limit=10
GET /api/articles?featured=true
GET /api/articles?category=politics&limit=5
```

### POST /api/articles
Create a new article.

**Request Body:**
```json
{
  "title": "Article Title",
  "excerpt": "Article excerpt",
  "category": "technology",
  "author": "Author Name",
  "content": "Full article content",
  "image": "https://image-url.com",
  "tags": ["tag1", "tag2"]
}
```

## Article Structure

Every article has these fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `title` | string | Article headline |
| `slug` | string | URL-friendly title |
| `excerpt` | string | Short summary |
| `content` | string | Full article body |
| `image` | string | Featured image URL |
| `category` | string | Article category |
| `author` | string | Author name |
| `publishedAt` | string | Publication date/time |
| `readTime` | number | Estimated read time (minutes) |
| `tags` | array | Topic tags |
| `featured` | boolean | Feature on homepage |
| `status` | string | Publication status |

## Next Steps

1. **Add your first article** to `data/articles.json` or via the API
2. **Test retrieval** by visiting:
   - Homepage: Shows featured + latest articles
   - Category pages: `/category/technology`, `/category/business`, etc.
   - Search: Use search bar to find articles
3. **Connect to real database** for production use
4. **Add admin panel** for easy article management

## Troubleshooting

- **Articles not showing**: Check `status: "published"` in JSON
- **API errors**: Ensure all required fields are provided
- **Image not loading**: Use absolute image URLs (https://)
- **Category filter not working**: Verify category name matches available categories

