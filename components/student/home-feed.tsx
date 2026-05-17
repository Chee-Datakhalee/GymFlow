"use client"

import { useState } from "react"
import { Flame, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { mockUsers, mockFeedPosts } from "@/lib/mock-data"

export function HomeFeed() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl">
        <h1 className="text-xl font-bold text-foreground">
          Gym<span className="text-primary">Flow</span>
        </h1>
      </div>

      {/* Stories */}
      <div className="flex gap-3 overflow-x-auto px-4 py-4 scrollbar-none">
        {mockUsers.slice(0, 8).map((user) => (
          <div key={user.id} className="flex flex-shrink-0 flex-col items-center gap-1">
            <div className={`rounded-full p-[2px] ${
              user.streak > 0 ? "bg-gradient-to-br from-primary to-primary/60" : "bg-border"
            }`}>
              <Avatar className="h-16 w-16 border-2 border-background">
                <AvatarFallback className="bg-secondary text-foreground text-sm font-bold">
                  {user.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <span className="max-w-[64px] truncate text-xs text-muted-foreground">
              {user.name.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>

      {/* Feed */}
      <div className="flex flex-col">
        {mockFeedPosts.map((post) => {
          const user = mockUsers.find((u) => u.id === post.userId)
          if (!user) return null
          return <FeedPost key={post.id} post={post} user={user} />
        })}
      </div>
    </div>
  )
}

function FeedPost({
  post,
  user,
}: {
  post: (typeof mockFeedPosts)[0]
  user: (typeof mockUsers)[0]
}) {
  const [fired, setFired] = useState(false)
  const [fireCount, setFireCount] = useState(post.fires)

  if (post.type === "achievement") {
    return (
      <div className="mx-4 mb-4 rounded-xl border border-primary/30 bg-primary/5 p-4 neon-glow">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            <Flame className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary">{post.text}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <button
            onClick={() => { setFired(!fired); setFireCount(fired ? fireCount - 1 : fireCount + 1) }}
            className="flex items-center gap-1 text-sm"
          >
            <Flame className={`h-4 w-4 ${fired ? "fill-primary text-primary" : "text-muted-foreground"}`} />
            <span className={fired ? "text-primary" : "text-muted-foreground"}>{fireCount}</span>
          </button>
          <button className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments}</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-4">
      {/* Post image placeholder */}
      <div className="aspect-square w-full bg-secondary">
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-card text-foreground text-xl font-bold">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs">Foto do treino</span>
          </div>
        </div>
      </div>
      {/* Post info */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-secondary text-foreground text-xs font-bold">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold text-foreground">{user.name}</span>
        </div>
        <div className="mt-2 flex items-center gap-4">
          <button
            onClick={() => { setFired(!fired); setFireCount(fired ? fireCount - 1 : fireCount + 1) }}
            className="flex items-center gap-1 text-sm"
          >
            <Flame className={`h-4 w-4 ${fired ? "fill-primary text-primary" : "text-muted-foreground"}`} />
            <span className={fired ? "text-primary" : "text-muted-foreground"}>{fireCount}</span>
          </button>
          <button className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
