"use client"

interface YouTubeEmbedProps {
  videoId: string
  title?: string
}

export function YouTubeEmbed({ videoId, title = "YouTube video player" }: YouTubeEmbedProps) {
  return (
    <div className="aspect-video w-full">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  )
}
