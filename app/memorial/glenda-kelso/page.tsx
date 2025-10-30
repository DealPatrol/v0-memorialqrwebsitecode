import { GlendaMemorialClient } from "./client"
import {
  getMemorialBySlug,
  getMemorialStories,
  getMemorialMessages,
  getMemorialPhotos,
  getMemorialMusic,
} from "@/app/actions/memorial"

export default async function GlendaMemorial() {
  const memorial = await getMemorialBySlug("glenda-kelso")

  if (!memorial) {
    return <div>Memorial not found</div>
  }

  const [stories, messages, photos, music] = await Promise.all([
    getMemorialStories(memorial.id),
    getMemorialMessages(memorial.id),
    getMemorialPhotos(memorial.id),
    getMemorialMusic(memorial.id),
  ])

  return (
    <GlendaMemorialClient
      memorial={memorial}
      initialStories={stories}
      initialMessages={messages}
      initialPhotos={photos}
      initialMusic={music}
    />
  )
}
