import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/admin/generate-article
 * Generate article content using Claude AI
 * 
 * Body:
 * {
 *   "title": "Article Title",
 *   "topic": "Brief topic description",
 *   "tone": "professional|journalistic|casual",
 *   "language": "en|ky|sw"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, topic, tone = 'journalistic', language = 'en' } = body;

    if (!title || !topic) {
      return NextResponse.json(
        { success: false, error: 'Title and topic are required' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'AI service not configured' },
        { status: 500 }
      );
    }

    const systemPrompt = `You are a professional news writer for AMAKURU24, an East African news platform.
Write high-quality, well-structured news articles in ${language === 'ky' ? 'Kinyarwanda' : language === 'sw' ? 'Swahili' : 'English'}.
The tone should be ${tone}.
Always include:
- Engaging opening paragraph
- Clear main points
- Quotes or evidence when possible
- Concluding paragraph
Use markdown formatting for better readability.`;

    const userPrompt = `Write a news article with the following details:
Title: ${title}
Topic: ${topic}
Length: 400-600 words
Please write comprehensive, factual content suitable for a news website.`;

    // Call Anthropic API (Claude)
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Anthropic API error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to generate article' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.content[0]?.text || '';

    // Extract excerpt (first 150 characters)
    const excerpt = content
      .replace(/[#*_`]/g, '')
      .substring(0, 150)
      .trim();

    // Estimate read time
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    return NextResponse.json({
      success: true,
      data: {
        title,
        content,
        excerpt: excerpt + (excerpt.length === 150 ? '...' : ''),
        readTime: Math.max(1, readTime),
        language,
      },
    });
  } catch (error) {
    console.error('Error generating article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate article' },
      { status: 500 }
    );
  }
}
