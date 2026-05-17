"use client"

import { useState, useEffect } from "react"
import { Flame, MessageCircle, Camera, X, Trash2, MoreVertical, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"

type Post = {
  id: string
  foto_url: string | null
  tipo: string
  descricao_automatica: string | null
  total_fogo: number
  created_at: string
  aluno_id: string
  profiles: { nome: string; foto_url: string | null }
}

type Story = {
  id: string
  aluno_id: string
  foto_url: string
  profiles: { nome: string; foto_url: string | null }
}

type Comentario = {
  id: string
  texto: string
  created_at: string
  aluno_id: string
  profiles: { nome: string; foto_url: string | null }
}

export function HomeFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [currentAlunoId, setCurrentAlunoId] = useState<string | null>(null)
  const [activeStory, setActiveStory] = useState<Story | null>(null)
  const [commentPost, setCommentPost] = useState<Post | null>(null)

  useEffect(() => {
    async function fetchFeed() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: aluno } = await supabase
        .from('alunos')
        .select('id, academia_id')
        .eq('profile_id', user.id)
        .single()

      const aId = aluno?.academia_id || null
      setCurrentAlunoId(aluno?.id || null)

      let postsQuery = supabase
        .from('posts')
        .select('id, foto_url, tipo, descricao_automatica, total_fogo, created_at, aluno_id, alunos(profiles(nome, foto_url))')
        .order('created_at', { ascending: false })
        .limit(20)

      if (aId) postsQuery = postsQuery.eq('academia_id', aId)

      const { data: postsData } = await postsQuery

      const agora = new Date().toISOString()
      let storiesQuery = supabase
        .from('stories')
        .select('id, aluno_id, foto_url, alunos(profiles(nome, foto_url))')
        .gt('expira_em', agora)

      if (aId) storiesQuery = storiesQuery.eq('academia_id', aId)

      const { data: storiesData } = await storiesQuery

      if (postsData) setPosts(postsData.map((p: any) => ({
        ...p,
        profiles: p.alunos?.profiles || { nome: 'Aluno', foto_url: null }
      })))

      if (storiesData) setStories(storiesData.map((s: any) => ({
        ...s,
        profiles: s.alunos?.profiles || { nome: 'Aluno', foto_url: null }
      })))

      setLoading(false)
    }
    fetchFeed()
  }, [])

  async function handleDeletePost(postId: string) {
    await supabase.from('posts').delete().eq('id', postId)
    setPosts(posts.filter(p => p.id !== postId))
  }

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Story fullscreen */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex items-center justify-between px-4 pt-10 pb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary overflow-hidden">
                {activeStory.profiles.foto_url && (
                  <AvatarImage src={activeStory.profiles.foto_url} className="object-cover" />
                )}
                <AvatarFallback className="bg-secondary text-foreground text-sm font-bold">
                  {activeStory.profiles.nome.split(" ").map((n: string) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold text-white">{activeStory.profiles.nome}</span>
            </div>
            <button onClick={() => setActiveStory(null)}>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <img src={activeStory.foto_url} alt="story" className="w-full h-full object-contain" />
          </div>
        </div>
      )}

      {/* Modal de comentários */}
      {commentPost && (
        <CommentModal
          post={commentPost}
          currentAlunoId={currentAlunoId}
          onClose={() => setCommentPost(null)}
        />
      )}

      <div className="sticky top-0 z-10 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl">
        <h1 className="text-xl font-bold text-foreground">
          Gym<span className="text-primary">Flow</span>
        </h1>
      </div>

      {/* Stories */}
      <div className="flex gap-3 overflow-x-auto px-4 py-4 scrollbar-none">
        {stories.length === 0 ? (
          <div className="flex flex-shrink-0 flex-col items-center gap-1">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Camera className="h-6 w-6 text-muted-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">Sem stories</span>
          </div>
        ) : (
          stories.map((story) => (
            <button key={story.id} onClick={() => setActiveStory(story)} className="flex flex-shrink-0 flex-col items-center gap-1">
              <div className="rounded-full p-[2px] bg-gradient-to-br from-primary to-primary/60">
                <Avatar className="h-16 w-16 border-2 border-background overflow-hidden">
                  {story.profiles.foto_url && <AvatarImage src={story.profiles.foto_url} className="object-cover" />}
                  <AvatarFallback className="bg-secondary text-foreground text-sm font-bold">
                    {story.profiles.nome.split(" ").map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="max-w-[64px] truncate text-xs text-muted-foreground">
                {story.profiles.nome.split(" ")[0]}
              </span>
            </button>
          ))
        )}
      </div>

      {/* Feed */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
            <Camera className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="text-lg font-bold text-foreground">Nenhum post ainda</p>
          <p className="mt-2 text-sm text-muted-foreground">Seja o primeiro a postar seu treino!</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {posts.map((post) => (
            <FeedPost
              key={post.id}
              post={post}
              isOwn={post.aluno_id === currentAlunoId}
              onDelete={() => handleDeletePost(post.id)}
              onComment={() => setCommentPost(post)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CommentModal({ post, currentAlunoId, onClose }: {
  post: Post
  currentAlunoId: string | null
  onClose: () => void
}) {
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [texto, setTexto] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    async function fetchComentarios() {
      const { data } = await supabase
        .from('comentarios')
        .select('id, texto, created_at, aluno_id, alunos(profiles(nome, foto_url))')
        .eq('post_id', post.id)
        .order('created_at', { ascending: true })

      if (data) setComentarios(data.map((c: any) => ({
        ...c,
        profiles: c.alunos?.profiles || { nome: 'Aluno', foto_url: null }
      })))
      setLoading(false)
    }
    fetchComentarios()
  }, [post.id])

  async function handleSend() {
    if (!texto.trim() || !currentAlunoId) return
    setSending(true)

    const { data, error } = await supabase
      .from('comentarios')
      .insert({ post_id: post.id, aluno_id: currentAlunoId, texto: texto.trim() })
      .select('id, texto, created_at, aluno_id, alunos(profiles(nome, foto_url))')
      .single()

    if (!error && data) {
      setComentarios([...comentarios, {
        ...data,
        profiles: (data as any).alunos?.profiles || { nome: 'Aluno', foto_url: null }
      }])
      setTexto("")
    }
    setSending(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <button onClick={onClose}><X className="h-6 w-6 text-foreground" /></button>
        <span className="font-semibold text-foreground">Comentários</span>
        <div className="w-6" />
      </div>

      {/* Foto do post */}
      {post.foto_url && (
        <img src={post.foto_url} alt="post" className="w-full aspect-square object-cover max-h-48" />
      )}

      {/* Lista de comentários */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : comentarios.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageCircle className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Nenhum comentário ainda</p>
            <p className="text-xs text-muted-foreground">Seja o primeiro!</p>
          </div>
        ) : (
          comentarios.map((c) => (
            <div key={c.id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8 overflow-hidden flex-shrink-0">
                {c.profiles.foto_url && <AvatarImage src={c.profiles.foto_url} className="object-cover" />}
                <AvatarFallback className="bg-secondary text-foreground text-xs font-bold">
                  {c.profiles.nome.split(" ").map((n: string) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 rounded-xl bg-secondary px-3 py-2">
                <p className="text-xs font-semibold text-primary">{c.profiles.nome}</p>
                <p className="text-sm text-foreground mt-0.5">{c.texto}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input de comentário */}
      <div className="border-t border-border px-4 py-3 flex items-center gap-3">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Escreva um comentário..."
          className="flex-1 rounded-xl bg-secondary px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary"
        />
        <button
          onClick={handleSend}
          disabled={sending || !texto.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary disabled:opacity-50"
        >
          <Send className="h-4 w-4 text-primary-foreground" />
        </button>
      </div>
    </div>
  )
}

function FeedPost({ post, isOwn, onDelete, onComment }: {
  post: Post
  isOwn: boolean
  onDelete: () => void
  onComment: () => void
}) {
  const [fired, setFired] = useState(false)
  const [fireCount, setFireCount] = useState(post.total_fogo)
  const [showMenu, setShowMenu] = useState(false)
  const [commentCount, setCommentCount] = useState(0)

  useEffect(() => {
    supabase
      .from('comentarios')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', post.id)
      .then(({ count }) => setCommentCount(count || 0))
  }, [post.id])

  async function handleFire() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: aluno } = await supabase
      .from('alunos')
      .select('id')
      .eq('profile_id', user.id)
      .single()

    if (!aluno) return

    if (!fired) {
      await supabase.from('reacoes').insert({ post_id: post.id, aluno_id: aluno.id })
      await supabase.from('posts').update({ total_fogo: fireCount + 1 }).eq('id', post.id)
      setFireCount(fireCount + 1)
    } else {
      await supabase.from('reacoes').delete().eq('post_id', post.id).eq('aluno_id', aluno.id)
      await supabase.from('posts').update({ total_fogo: fireCount - 1 }).eq('id', post.id)
      setFireCount(fireCount - 1)
    }
    setFired(!fired)
  }

  if (post.tipo === 'pr_automatico' || post.tipo === 'treino_automatico') {
    return (
      <div className="mx-4 mb-4 rounded-xl border border-primary/30 bg-primary/5 p-4 neon-glow">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            <Flame className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary">{post.descricao_automatica}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {new Date(post.created_at).toLocaleDateString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <button onClick={handleFire} className="flex items-center gap-1 text-sm">
            <Flame className={`h-4 w-4 ${fired ? "fill-primary text-primary" : "text-muted-foreground"}`} />
            <span className={fired ? "text-primary" : "text-muted-foreground"}>{fireCount}</span>
          </button>
          <button onClick={onComment} className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>{commentCount}</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-4">
      {post.foto_url ? (
        <img src={post.foto_url} alt="post" className="aspect-square w-full object-cover" />
      ) : (
        <div className="aspect-square w-full bg-secondary flex items-center justify-center">
          <Camera className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 overflow-hidden">
              {post.profiles.foto_url && <AvatarImage src={post.profiles.foto_url} className="object-cover" />}
              <AvatarFallback className="bg-secondary text-foreground text-xs font-bold">
                {post.profiles.nome.split(" ").map((n: string) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold text-foreground">{post.profiles.nome}</span>
          </div>
          {isOwn && (
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)}>
                <MoreVertical className="h-5 w-5 text-muted-foreground" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-6 z-10 rounded-xl border border-border bg-card p-2 shadow-lg">
                  <button
                    onClick={() => { onDelete(); setShowMenu(false) }}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-secondary"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mt-2 flex items-center gap-4">
          <button onClick={handleFire} className="flex items-center gap-1 text-sm">
            <Flame className={`h-4 w-4 ${fired ? "fill-primary text-primary" : "text-muted-foreground"}`} />
            <span className={fired ? "text-primary" : "text-muted-foreground"}>{fireCount}</span>
          </button>
          <button onClick={onComment} className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>{commentCount}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
