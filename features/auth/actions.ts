"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { createClient } from "lib/supabase/server"

async function getBaseUrl(): Promise<string> {
  const headersList = await headers()
  const host = headersList.get("host") ?? "localhost:3000"
  const protocol = host.startsWith("localhost") ? "http" : "https"
  return `${protocol}://${host}`
}

export async function signInWithGoogle(redirectTo?: string) {
  const supabase = await createClient()
  const baseUrl = await getBaseUrl()
  const callbackUrl = `${baseUrl}/auth/callback${redirectTo ? `?next=${redirectTo}` : ""}`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callbackUrl },
  })

  if (error || !data.url) {
    redirect("/login?error=oauth_failed")
  }

  redirect(data.url)
}

export async function signInWithMagicLink(email: string, redirectTo?: string): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const baseUrl = await getBaseUrl()
  const callbackUrl = `${baseUrl}/auth/callback${redirectTo ? `?next=${redirectTo}` : ""}`

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: callbackUrl },
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

export async function signInWithPassword(email: string, password: string): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

export async function signUpWithPassword(
  email: string,
  password: string,
  redirectTo?: string
): Promise<{ error: string | null; needsConfirmation?: boolean }> {
  const supabase = await createClient()
  const baseUrl = await getBaseUrl()
  const callbackUrl = `${baseUrl}/auth/callback${redirectTo ? `?next=${redirectTo}` : ""}`

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: callbackUrl },
  })

  if (error) {
    return { error: error.message }
  }

  // If email confirmation is required, user won't have a session yet
  if (data.user && !data.session) {
    return { error: null, needsConfirmation: true }
  }

  return { error: null }
}

export async function resetPassword(email: string): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const baseUrl = await getBaseUrl()
  const callbackUrl = `${baseUrl}/auth/callback?next=/reset-password`

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: callbackUrl,
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

export async function updatePassword(newPassword: string): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({ password: newPassword })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
