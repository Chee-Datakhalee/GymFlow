"use client"

import { useState, useEffect, useRef } from "react"
import { Flame, MessageCircle, Camera, X, Trash2, MoreVertical, UserPlus, UserCheck } from "lucide-react"
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

type AlunoProfile = {
  aluno_id: string
  nome: string
  foto_url: string | null
  objetivo: string | null
  streak: number
  total_posts: number
  total_seguidores: number
}

export function HomeFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [currentAlunoId, setCurrentAlunoId] = useState<string | null>(null)
  const [currentAcademiaId, setCurrentAcademiaId] = useState<string | null>(null)
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [viewingProfile, setViewingProfile] = useState<AlunoProfile | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)

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
      setCurrentAcademiaId(aId)

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

  async function openProfile(alunoId: string) {
    if (alunoId === currentAlunoId) return

    const { data: aluno } = await supabase
      .from('alunos')
      .select('id, streak, objetivo, academia_id, profiles(nome, foto_url)')
      .eq('id', alunoId)
      .single()

    if (!aluno) return

    const { count: totalPosts } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('aluno_id', alunoId)

    const { count: totalSeguidores } = await supabase
      .from('seguidores')
      .select('*', { count: 'exact', head: true })
      .eq('seguido_id', alunoId)

    setViewingProfile({
      aluno_id: aluno.id,
      nome: (aluno as any).profiles?.nome || 'Aluno',
      foto_url: (aluno as any).profiles?.foto_url || null,
      objetivo: aluno.objetivo,
      streak: aluno.streak || 0,
      total_posts: totalPosts || 0,
      total_seguidores: totalSeguidores || 0,
    })
  }

  function openStory(index: number) {
    setActiveStoryIndex(index)
    setProgress(0)
    startTimer(index)
  }

  function startTimer(index: number) {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (progressRef.current) clearInterval(progressRef.current)

    setProgress(0)
    const startTime = Date.now()
    const duration = 15000

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      setProgress(Math.min((elapsed / duration) * 100, 100))
    }, 50)

    timerRef.current = setTimeout(() => {
      if (progressRef.current) clearInterval(progressRef.current)
      if (index < stories.length - 1) {
        setActiveStoryIndex(index + 1)
        startTimer(index + 1)
      } else {
        closeStory()
      }
    }, duration)
  }

  function closeStory() {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
    setActiveStoryIndex(null)
    setProgress(0)
  }

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

  const activeStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null

  return (
    <div className="flex flex-col">
      {/* Modal perfil de outro aluno */}
      {viewingProfile && currentAlunoId && (
        <AlunoProfileModal
          profile={viewingProfile}
          currentAlunoId={currentAlunoId}
          currentAcademiaId={currentAcademiaId}
          onClose={() => setViewingProfile(null)}
        />
      )}

      {/* Story fullscreen */}
      {activeStory && activeStoryIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex gap-1 px-4 pt-10 pb-2">
            {stories.map((_, i) => (
              <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-none"
                  style={{ width: i < activeStoryIndex ? '100%' : i === activeStoryIndex ? `${progress}%` : '0%' }}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary overflow-hidden">
                {activeStory.profiles.foto_url && <AvatarImage src={activeStory.profiles.foto_url} className="object-cover" />}
                <AvatarFallback className="bg-secondary text-foreground text-sm font-bold">
                  {activeStory.profiles.nome.split(" ").map((n: string) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold text-white">{activeStory.profiles.nome}</span>
            </div>
            <button onClick={closeStory}><X className="h-6 w-6 text-white" /></button>
          </div>
          <div className="flex-1 flex relative">
            <button className="absolute left-0 top-0 bottom-0 w-1/3 z-10" onClick={() => { if (activeStoryIndex > 0) openStory(activeStoryIndex - 1); else closeStory() }} />
            <img src={activeStory.foto_url} alt="story" className="w-full h-full object-contain" />
            <button className="absolute right-0 top-0 bottom-0 w-1/3 z-10" onClick={() => { if (activeStoryIndex < stories.length - 1) openStory(activeStoryIndex + 1); else closeStory() }} />
          </div>
        </div>
      )}

      <div className="sticky top-0 z-10 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl">
        <h1 className="text-xl font-bold text-foreground">Gym<span className="text-primary">Flow</span></h1>
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
          stories.map((story, i) => (
            <button key={story.id} onClick={() => openStory(i)} className="flex flex-shrink-0 flex-col items-center gap-1">
              <div className="rounded-full p-[2px] bg-gradient-to-br from-primary to-primary/60">
                <Avatar className="h-16 w-16 border-2 border-background overflow-hidden">
                  {story.profiles.foto_url && <AvatarImage src={story.profiles.foto_url} className="object-cover" />}
                  <AvatarFallback className="bg-secondary text-foreground text-sm font-bold">
                    {story.profiles.nome.split(" ").map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="max-w-[64px] truncate text-xs text-muted-foreground">{story.profiles.nome.split(" ")[0]}</span>
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
              onOpenProfile={() => openProfile(post.aluno_id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function AlunoProfileModal({ profile, currentAlunoId, currentAcademiaId, onClose }: {
  profile: AlunoProfile
  currentAlunoId: string
  currentAcademiaId: string | null
  onClose: () => void
}) {
  const [seguindo, setSeguindo] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('seguidores')
      .select('id')
      .eq('seguidor_id', currentAlunoId)
      .eq('seguido_id', profile.aluno_id)
      .single()
      .then(({ data }) => {
        setSeguindo(!!data)
        setLoading(false)
      })
  }, [profile.aluno_id, currentAlunoId])

  async function handleSeguir() {
    if (seguindo) {
      await supabase.from('seguidores').delete()
        .eq('seguidor_id', currentAlunoId)
        .eq('seguido_id', profile.aluno_id)
      setSeguindo(false)
    } else {
      await supabase.from('seguidores').insert({
        seguidor_id: currentAlunoId,
        seguido_id: profile.aluno_id,
      })
      setSeguindo(true)
    }
  }

  return (
    <div className="fixed inset-0 z-40 bg-background flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <button onClick={onClose}><X className="h-6 w-6 text-foreground" /></button>
        <span className="font-semibold text-foreground">{profile.nome.split(" ")[0]}</span>
        <div className="w-6" />
      </div>

      <div className="px-4 pt-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-primary overflow-hidden">
            {profile.foto_url && <AvatarImage src={profile.foto_url} className="object-cover" />}
            <AvatarFallback className="bg-secondary text-foreground text-xl font-bold">
              {profile.nome.split(" ").map((n: string) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">{profile.nome}</h2>
            <p className="text-sm text-muted-foreground capitalize">{profile.objetivo || ""}</p>
            <div className="mt-1 flex items-center gap-2">
              <Flame className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-primary">{profile.streak} dias</span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-foreground">{profile.total_posts}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-foreground">{profile.total_seguidores}</p>
            <p className="text-xs text-muted-foreground">Seguidores</p>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-foreground">—</p>
            <p className="text-xs text-muted-foreground">Seguindo</p>
          </div>
        </div>

        {!loading && (
          <button
            onClick={handleSeguir}
            className={`mt-4 w-full h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${
              seguindo
                ? "bg-secondary text-foreground border border-border"
                : "bg-primary text-primary-foreground neon-glow"
            }`}
          >
            {seguindo ? (
              <><UserCheck className="h-4 w-4" /> Seguindo</>
            ) : (
              <><UserPlus className="h-4 w-4" /> Seguir</>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

function FeedPost({ post, isOwn, onDelete, onOpenProfile }: {
  post: Post
  isOwn: boolean
  onDelete: () => void
  onOpenProfile: () => void
}) {
  const [fired, setFired] = useState(false)
  const [fireCount, setFireCount] = useState(post.total_fogo)
  const [showMenu, setShowMenu] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comentarios, setComentarios] = useState<any[]>([])
  const [textoComment, setTextoComment] = useState("")
  const [sendingComment, setSendingComment] = useState(false)
  const [currentAlunoId, setCurrentAlunoId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('alunos').select('id').eq('profile_id', user.id).single()
        .then(({ data }) => setCurrentAlunoId(data?.id || null))
    })
    fetchComentarios()
  }, [post.id])

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
  }

  async function handleSendComment() {
    if (!textoComment.trim() || !currentAlunoId) return
    setSendingComment(true)
    await supabase.from('comentarios').insert({
      post_id: post.id,
      aluno_id: currentAlunoId,
      texto: textoComment.trim()
    })
    setTextoComment("")
    await fetchComentarios()
    setSendingComment(false)
  }

  async function handleFire() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: aluno } = await supabase.from('alunos').select('id').eq('profile_id', user.id).single()
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
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>{comentarios.length}</span>
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
          <button onClick={onOpenProfile} className="flex items-center gap-3">
            <Avatar className="h-8 w-8 overflow-hidden">
              {post.profiles.foto_url && <AvatarImage src={post.profiles.foto_url} className="object-cover" />}
              <AvatarFallback className="bg-secondary text-foreground text-xs font-bold">
                {post.profiles.nome.split(" ").map((n: string) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold text-foreground">{post.profiles.nome}</span>
          </button>
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
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>{comentarios.length}</span>
          </button>
        </div>

        {showComments && (
          <div className="mt-3 flex flex-col gap-2">
            {comentarios.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhum comentário ainda</p>
            ) : (
              comentarios.map((c) => (
                <div key={c.id} className="flex items-start gap-2">
                  <Avatar className="h-6 w-6 overflow-hidden flex-shrink-0">
                    {c.profiles.foto_url && <AvatarImage src={c.profiles.foto_url} className="object-cover" />}
                    <AvatarFallback className="bg-secondary text-foreground text-xs font-bold">
                      {c.profiles.nome.split(" ").map((n: string) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-primary">{c.profiles.nome.split(" ")[0]} </span>
                    <span className="text-xs text-foreground">{c.texto}</span>
                  </div>
                </div>
              ))
            )}
            <div className="flex items-center gap-2 mt-1">
              <input
                value={textoComment}
                onChange={(e) => setTextoComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                placeholder="Adicionar comentário..."
                className="flex-1 rounded-lg bg-secondary px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary"
              />
              <button
                onClick={handleSendComment}
                disabled={sendingComment || !textoComment.trim()}
                className="text-primary disabled:opacity-50 text-xs font-semibold"
              >
                Publicar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
