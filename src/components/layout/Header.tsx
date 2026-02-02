'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import { useTranslation } from '@/i18n'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ProfileDropdown } from '@/components/profile/ProfileDropdown'
import { Home, Building2, Heart, MessageSquare, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { currentUser, logout, getUnreadCount } = useApp()
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const unreadCount = currentUser ? getUnreadCount(currentUser.id) : 0

  const navItems = currentUser
    ? [
        { href: '/browse', label: t.nav.browse, icon: Home },
        ...(currentUser.role === 'landlord'
          ? [{ href: '/properties', label: t.nav.myProperties, icon: Building2 }]
          : []),
        { href: '/matches', label: t.nav.matches, icon: Heart },
        { href: '/messages', label: t.nav.messages, icon: MessageSquare, badge: unreadCount },
      ]
    : []

  if (!currentUser) {
    return (
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-[#2D7E5A]">
              CoHousing
            </Link>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Button variant="ghost" asChild>
                <Link href="/login">{t.common.login}</Link>
              </Button>
              <Button asChild className="bg-[#2D7E5A] hover:bg-[#1F5A40]">
                <Link href="/signup">{t.common.signup}</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/browse" className="text-2xl font-bold text-[#2D7E5A]">
            CoHousing
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#2D7E5A] relative ${
                    isActive ? 'text-[#2D7E5A]' : 'text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {item.badge && item.badge > 0 && (
                    <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Language Switcher & Profile Dropdown */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <ProfileDropdown />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-2">
                <ProfileDropdown />
                <LanguageSwitcher />
              </div>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-2 rounded transition-colors ${
                      isActive ? 'bg-[#E8F5EF] text-[#2D7E5A]' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                    {item.badge && item.badge > 0 && (
                      <Badge variant="destructive" className="ml-auto px-1.5 py-0.5 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
