'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import { useTranslation } from '@/i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export function LoginForm() {
  const router = useRouter()
  const { login } = useApp()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (login(email, password)) {
      router.push('/browse')
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t.auth.login.title}</CardTitle>
        <CardDescription>{t.auth.login.subtitle}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">{t.auth.login.email}</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t.auth.login.password}</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="text-sm text-gray-600 bg-[#E8F5EF] p-3 rounded border border-[#2D7E5A]">
            <p className="font-medium mb-1">Demo Accounts:</p>
            <p>Seeker: sarah@example.com / password123</p>
            <p>Landlord: mike@example.com / password123</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full bg-[#2D7E5A] hover:bg-[#1F5A40]">
            {t.auth.login.button}
          </Button>
          <p className="text-sm text-center text-gray-600">
            {t.auth.login.noAccount}{' '}
            <Link href="/signup" className="text-[#2D7E5A] hover:underline">
              {t.auth.login.signupLink}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
