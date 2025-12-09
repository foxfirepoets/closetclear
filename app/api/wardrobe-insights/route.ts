import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY

interface ClothingItem {
  id: string
  name: string
  category: string
  color: string
  season: string
  wear_count: number
  purchase_price?: number
  created: string
  last_worn?: string
  tags?: string[]
}

interface ItemRecommendation {
  item_id: string
  item_name: string
  decision: 'keep' | 'donate' | 'sell'
  reason: string
  estimated_resale_value?: number
  urgency: 'high' | 'medium' | 'low'
}

interface WardrobeInsights {
  total_items: number
  items_to_keep: number
  items_to_donate: number
  items_to_sell: number
  estimated_total_resale: number
  category_breakdown: Record<string, number>
  color_analysis: {
    dominant_colors: string[]
    missing_basics: string[]
  }
  seasonal_gaps: string[]
  recommendations: ItemRecommendation[]
  general_advice: string[]
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
    const { wardrobeItems } = body as { wardrobeItems: ClothingItem[] }

    if (!wardrobeItems || wardrobeItems.length === 0) {
      return NextResponse.json(
        { error: 'Wardrobe items are required' },
        { status: 400 }
      )
    }

    // Calculate days since purchase for each item
    const now = new Date()
    const itemsWithAge = wardrobeItems.map(item => {
      const createdDate = new Date(item.created)
      const daysOwned = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
      const wearFrequency = daysOwned > 0 ? (item.wear_count / daysOwned * 30).toFixed(1) : '0' // wears per month
      return {
        ...item,
        days_owned: daysOwned,
        wear_frequency: wearFrequency
      }
    })

    // Build wardrobe inventory for AI
    const wardrobeDescription = itemsWithAge.map(item =>
      `ID: ${item.id} | ${item.name} | Category: ${item.category} | Color: ${item.color} | Season: ${item.season} | Worn ${item.wear_count} times | Owned ${item.days_owned} days | Wear rate: ${item.wear_frequency}/month | Price: $${item.purchase_price || 'unknown'}`
    ).join('\n')

    // Call Gemini API for wardrobe analysis
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
                  text: `You are a professional wardrobe consultant and decluttering expert. Analyze this wardrobe and provide recommendations.

WARDROBE INVENTORY (${wardrobeItems.length} items):
${wardrobeDescription}

Analyze the wardrobe and return a JSON object with this structure:

{
  "total_items": ${wardrobeItems.length},
  "items_to_keep": <number>,
  "items_to_donate": <number>,
  "items_to_sell": <number>,
  "estimated_total_resale": <total estimated resale value in USD>,
  "category_breakdown": {
    "Tops": <count>,
    "Bottoms": <count>,
    ... other categories
  },
  "color_analysis": {
    "dominant_colors": ["list of most common colors"],
    "missing_basics": ["colors/items the wardrobe is missing for versatility"]
  },
  "seasonal_gaps": ["seasons that need more items"],
  "recommendations": [
    {
      "item_id": "actual ID from the list",
      "item_name": "item name",
      "decision": "keep" | "donate" | "sell",
      "reason": "brief explanation",
      "estimated_resale_value": <if sell, estimated value in USD>,
      "urgency": "high" | "medium" | "low"
    }
  ],
  "general_advice": ["3-5 actionable tips to improve the wardrobe"]
}

Decision Criteria:
- KEEP: Items worn frequently (>2x/month), versatile basics, good condition
- DONATE: Items rarely worn (<1x/month for 3+ months), worn out, don't fit well
- SELL: Brand name items in good condition, trendy pieces with resale value
- Items never worn in 30+ days should be flagged as donate/sell

IMPORTANT: Return ONLY the JSON object, no markdown formatting or additional text. Include recommendations for EVERY item in the wardrobe.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            topK: 32,
            topP: 1,
            maxOutputTokens: 4096,
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
        { error: 'No insights returned from AI' },
        { status: 500 }
      )
    }

    // Parse the JSON response
    let insights: WardrobeInsights
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
      insights = JSON.parse(cleanedResponse.trim())
    } catch (parseError) {
      console.error('Failed to parse AI response:', textResponse)
      return NextResponse.json(
        { error: 'Failed to parse AI response', raw: textResponse },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      insights
    })

  } catch (error) {
    console.error('Error generating wardrobe insights:', error)
    return NextResponse.json(
      { error: 'Failed to generate wardrobe insights' },
      { status: 500 }
    )
  }
}
