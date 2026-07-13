'use client'

import { HomeHero } from './home-hero'
import { HomeStats } from './home-stats'
import { HomeCategoryGrid } from './home-category-grid'
import { HomeHowItWorks } from './home-how-it-works'
import { HomeCta } from './home-cta'
export function HomeContent() {
  return (
    <div className="min-h-screen bg-background">
      <HomeHero />
      <HomeStats />
      <HomeCategoryGrid />
      <HomeHowItWorks />
      <HomeCta />
    </div>
  )
}
