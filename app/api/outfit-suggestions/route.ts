import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY

interface ClothingItem {
  id: string
  name: string
  category: string
  color: string
  season: string
  tags?: string[]
}

interface OutfitSuggestion {
  name: string
  occasion: string
  items: string[]
  styling_tips: string
  confidence: number
}

export async function POST(request: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'AI service not configured. Please add GOOGLE_API_KEY to environment.' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { selectedItem, wardrobeItems, occasion } = body as {
      selectedItem: ClothingItem
      wardrobeItems: ClothingItem[]
      occasion?: string
    }

    if (!selectedItem || !wardrobeItems || wardrobeItems.length === 0) {
      return NextResponse.json(
        { error: 'Selected item and wardrobe items are required' },
        { status: 400 }
      )
    }

    // Build wardrobe inventory description
    const wardrobeDescription = wardrobeItems.map(item =>
      `- ${item.name} (${item.category}, ${item.color}, ${item.season})`
    ).join('\n')

    const occasionPrompt = occasion
      ? `Focus on outfits suitable for: ${occasion}`
      : 'Suggest outfits for various occasions (work, casual, date night, etc.)'

    // Call Gemini API for outfit suggestions
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
                  text: `You are a professional stylist. I want to create outfits using this item:

SELECTED ITEM: ${selectedItem.name} (${selectedItem.category}, ${selectedItem.color}, ${selectedItem.season})

MY WARDROBE:
${wardrobeDescription}

${occasionPrompt}

Suggest 3-5 complete outfit combinations that include the selected item. Return a JSON array with this structure:

[
  {
    "name": "Outfit name (e.g., 'Smart Casual Friday')",
    "occasion": "work/casual/date night/formal/workout/etc.",
    "items": ["list of item names from the wardrobe that make up this outfit"],
    "styling_tips": "Brief styling advice for this combination",
    "confidence": 0.85
  }
]

Rules:
1. Only use items from MY WARDROBE list
2. Create complete outfits (top + bottom minimum, add layers/accessories if available)
3. Consider color coordination and seasonal appropriateness
4. Confidence should be 0.0-1.0 based on how well items complement each other

IMPORTANT: Return ONLY the JSON array, no markdown formatting or additional text.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048,
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
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!textResponse) {
      return NextResponse.json(
        { error: 'No suggestions returned from AI' },
        { status: 500 }
      )
    }

    // Parse the JSON response
    let suggestions: OutfitSuggestion[]
    try {
      let cleanedResponse = textResponse.trim()
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.slice(7)
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.slice(3)
      }
      if (cleanedResponse.endsWith('```')) {
        cleanedResponse = cleanedResponse.slice(0, -3)
      }
      suggestions = JSON.parse(cleanedResponse.trim())
    } catch (parseError) {
      console.error('Failed to parse AI response:', textResponse)
      return NextResponse.json(
        { error: 'Failed to parse AI response', raw: textResponse },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      selectedItem: selectedItem.name,
      suggestions
    })

  } catch (error) {
    console.error('Error generating outfit suggestions:', error)
    return NextResponse.json(
      { error: 'Failed to generate outfit suggestions' },
      { status: 500 }
    )
  }
}
