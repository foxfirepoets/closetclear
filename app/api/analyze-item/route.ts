import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY

interface ClothingAnalysis {
  name: string
  category: string
  color: string
  pattern: string
  material: string
  style: string
  season: string
  occasions: string[]
  brand_guess: string
  condition: string
  care_tips: string[]
  resale_potential: 'high' | 'medium' | 'low'
  keep_donate_sell: 'keep' | 'donate' | 'sell'
  recommendation_reason: string
}

export async function POST(request: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'AI service not configured. Please add GOOGLE_API_KEY to environment.' },
      { status: 500 }
    )
  }

  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File | null

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Convert image to base64
    const bytes = await imageFile.arrayBuffer()
    const base64Image = Buffer.from(bytes).toString('base64')
    const mimeType = imageFile.type || 'image/jpeg'

    // Call Gemini Vision API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze this clothing item image and provide detailed information. Return a JSON object with these exact fields:

{
  "name": "descriptive name for this item (e.g., 'Navy Blue Crew Neck Sweater')",
  "category": "one of: Tops, Bottoms, Dresses, Outerwear, Shoes, Accessories, Underwear, Sleepwear, Activewear, Other",
  "color": "primary color (e.g., Black, White, Gray, Brown, Beige, Red, Pink, Orange, Yellow, Green, Blue, Purple, Navy, Burgundy, Gold, Silver, Multi-color)",
  "pattern": "solid, striped, plaid, floral, geometric, animal print, abstract, or other",
  "material": "best guess (cotton, polyester, wool, denim, silk, leather, etc.)",
  "style": "casual, formal, business casual, athleisure, vintage, trendy, classic",
  "season": "one of: Spring, Summer, Fall, Winter, All Seasons",
  "occasions": ["list of suitable occasions like work, casual, date night, workout, party"],
  "brand_guess": "if visible or recognizable, otherwise 'Unknown'",
  "condition": "excellent, good, fair, or poor based on visible wear",
  "care_tips": ["list of care recommendations"],
  "resale_potential": "high, medium, or low based on style/condition",
  "keep_donate_sell": "recommendation: keep, donate, or sell",
  "recommendation_reason": "brief explanation of why you suggest keep/donate/sell"
}

IMPORTANT: Return ONLY the JSON object, no markdown formatting or additional text.`
                },
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: base64Image
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            topK: 32,
            topP: 1,
            maxOutputTokens: 1024,
          }
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', errorText)
      return NextResponse.json(
        { error: 'AI analysis failed. Please try again.' },
        { status: 500 }
      )
    }

    const data = await response.json()

    // Extract the text response
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!textResponse) {
      return NextResponse.json(
        { error: 'No analysis returned from AI' },
        { status: 500 }
      )
    }

    // Parse the JSON response (handle potential markdown formatting)
    let analysis: ClothingAnalysis
    try {
      // Remove potential markdown code blocks
      let cleanedResponse = textResponse.trim()
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.slice(7)
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.slice(3)
      }
      if (cleanedResponse.endsWith('```')) {
        cleanedResponse = cleanedResponse.slice(0, -3)
      }
      analysis = JSON.parse(cleanedResponse.trim())
    } catch (parseError) {
      console.error('Failed to parse AI response:', textResponse)
      return NextResponse.json(
        { error: 'Failed to parse AI response', raw: textResponse },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      analysis
    })

  } catch (error) {
    console.error('Error analyzing image:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    )
  }
}
