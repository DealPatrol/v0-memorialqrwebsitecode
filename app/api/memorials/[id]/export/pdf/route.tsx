import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const memorialId = params.id
    const body = await request.json()
    const {
      includePhotos = true,
      includeVideos = false,
      includeStories = true,
      includeMessages = true,
      includeTimeline = true,
    } = body

    const supabase = await createClient()

    // Fetch memorial data
    const { data: memorial, error: memorialError } = await supabase
      .from("memorials")
      .select("*")
      .eq("id", memorialId)
      .single()

    if (memorialError || !memorial) {
      return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    }

    // Fetch additional data based on options
    const dataPromises = []

    if (includePhotos) {
      dataPromises.push(
        supabase.from("photos").select("*").eq("memorial_id", memorialId).order("created_at", { ascending: false }),
      )
    }

    if (includeVideos) {
      dataPromises.push(
        supabase.from("videos").select("*").eq("memorial_id", memorialId).order("created_at", { ascending: false }),
      )
    }

    if (includeStories) {
      dataPromises.push(
        supabase.from("stories").select("*").eq("memorial_id", memorialId).order("created_at", { ascending: false }),
      )
    }

    if (includeMessages) {
      dataPromises.push(
        supabase.from("messages").select("*").eq("memorial_id", memorialId).order("created_at", { ascending: false }),
      )
    }

    if (includeTimeline) {
      dataPromises.push(
        supabase.from("milestones").select("*").eq("memorial_id", memorialId).order("date", { ascending: true }),
      )
    }

    const results = await Promise.all(dataPromises)

    // Generate HTML for PDF
    const html = generateMemorialHTML(memorial, {
      photos: includePhotos ? results[0]?.data || [] : [],
      videos: includeVideos ? results[1]?.data || [] : [],
      stories: includeStories ? results[2]?.data || [] : [],
      messages: includeMessages ? results[3]?.data || [] : [],
      milestones: includeTimeline ? results[4]?.data || [] : [],
    })

    // In a real implementation, you would use a library like puppeteer or jsPDF
    // For now, we'll return the HTML as a simple PDF placeholder
    const pdfBuffer = Buffer.from(html)

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${memorial.full_name}-memorial.pdf"`,
      },
    })
  } catch (error) {
    console.error("[v0] PDF export error:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}

function generateMemorialHTML(memorial: any, data: any) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Memorial for ${memorial.full_name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #333; }
          .section { margin: 30px 0; }
          .photo { max-width: 300px; margin: 10px; }
        </style>
      </head>
      <body>
        <h1>In Loving Memory of ${memorial.full_name}</h1>
        ${memorial.birth_date ? `<p>Born: ${new Date(memorial.birth_date).toLocaleDateString()}</p>` : ""}
        ${memorial.death_date ? `<p>Passed: ${new Date(memorial.death_date).toLocaleDateString()}</p>` : ""}
        
        ${
          memorial.biography
            ? `
          <div class="section">
            <h2>Life Story</h2>
            <p>${memorial.biography}</p>
          </div>
        `
            : ""
        }
        
        ${
          data.milestones?.length > 0
            ? `
          <div class="section">
            <h2>Life Timeline</h2>
            ${data.milestones
              .map(
                (m: any) => `
              <div>
                <strong>${new Date(m.date).toLocaleDateString()}</strong> - ${m.title}
                <p>${m.description}</p>
              </div>
            `,
              )
              .join("")}
          </div>
        `
            : ""
        }
        
        ${
          data.stories?.length > 0
            ? `
          <div class="section">
            <h2>Memories & Stories</h2>
            ${data.stories
              .map(
                (s: any) => `
              <div>
                <h3>${s.title}</h3>
                <p><em>By ${s.author_name}</em></p>
                <p>${s.content}</p>
              </div>
            `,
              )
              .join("")}
          </div>
        `
            : ""
        }
        
        ${
          data.messages?.length > 0
            ? `
          <div class="section">
            <h2>Messages</h2>
            ${data.messages
              .map(
                (m: any) => `
              <div>
                <p><strong>${m.author_name}:</strong> ${m.content}</p>
              </div>
            `,
              )
              .join("")}
          </div>
        `
            : ""
        }
      </body>
    </html>
  `
}
