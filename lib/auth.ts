import { supabase } from './supabase'

export async function signUp(email: string, password: string, tipo: 'aluno' | 'academia') {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { tipo }
    }
  })
  return { data, error }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
