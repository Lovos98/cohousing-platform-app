'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/i18n'
import { Home, Users, Heart, Shield } from 'lucide-react'

export default function LandingPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2000&auto=format&fit=crop)',
          }}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1F5A40]/80 via-[#2D7E5A]/70 to-[#E8F5EF]/90" />

        {/* Content */}
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            {t.landing.hero.title}
            <span className="text-[#D1FAE5]"> {t.landing.hero.titleAccent} </span>
            {t.landing.hero.titleEnd}
          </h1>
          <p className="text-xl text-white/95 mb-8 max-w-2xl mx-auto drop-shadow-md">
            {t.landing.hero.subtitle}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" className="text-lg px-8 bg-white text-[#2D7E5A] hover:bg-[#D1FAE5] shadow-lg">
              <Link href="/signup">{t.common.getStarted}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 border-2 border-white text-white hover:bg-white/20 shadow-lg">
              <Link href="/login">{t.common.login}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">{t.landing.features.title}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-[#E8F5EF] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-[#2D7E5A]" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{t.landing.features.smartMatching.title}</h3>
            <p className="text-gray-600">
              {t.landing.features.smartMatching.description}
            </p>
          </div>

          <div className="text-center">
            <div className="bg-[#E8F5EF] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-[#2D7E5A]" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{t.landing.features.verifiedProfiles.title}</h3>
            <p className="text-gray-600">
              {t.landing.features.verifiedProfiles.description}
            </p>
          </div>

          <div className="text-center">
            <div className="bg-[#E8F5EF] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="h-8 w-8 text-[#2D7E5A]" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{t.landing.features.qualityListings.title}</h3>
            <p className="text-gray-600">
              {t.landing.features.qualityListings.description}
            </p>
          </div>

          <div className="text-center">
            <div className="bg-[#E8F5EF] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-[#2D7E5A]" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{t.landing.features.securePlatform.title}</h3>
            <p className="text-gray-600">
              {t.landing.features.securePlatform.description}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t.landing.howItWorks.title}</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-[#2D7E5A] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">{t.landing.howItWorks.step1.title}</h3>
              <p className="text-gray-600">
                {t.landing.howItWorks.step1.description}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#2D7E5A] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">{t.landing.howItWorks.step2.title}</h3>
              <p className="text-gray-600">
                {t.landing.howItWorks.step2.description}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#2D7E5A] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">{t.landing.howItWorks.step3.title}</h3>
              <p className="text-gray-600">
                {t.landing.howItWorks.step3.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">{t.landing.cta.title}</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {t.landing.cta.subtitle}
        </p>
        <Button asChild size="lg" className="text-lg px-8 bg-[#2D7E5A] hover:bg-[#1F5A40]">
          <Link href="/signup">{t.common.signupNow}</Link>
        </Button>
      </section>
    </div>
  )
}
