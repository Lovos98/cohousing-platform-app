// Compatibility matching algorithm

import { UserPreferences, CompatibilityBreakdown } from './types'

/**
 * Calculate compatibility score between two preference sets
 * Returns a score from 0-100
 */
export function calculateCompatibility(
  pref1: UserPreferences,
  pref2: UserPreferences
): CompatibilityBreakdown {
  // Calculate individual category scores (0-100)
  const cleanlinessScore = calculateScalarDifference(pref1.cleanliness, pref2.cleanliness)
  const noiseScore = calculateScalarDifference(pref1.noiseTolerance, pref2.noiseTolerance)
  const socialScore = calculateScalarDifference(pref1.socialLevel, pref2.socialLevel)
  const guestsScore = calculateScalarDifference(pref1.overnight_guests, pref2.overnight_guests)
  const expensesScore = calculateScalarDifference(pref1.shared_expenses, pref2.shared_expenses)
  const petsScore = calculatePetCompatibility(pref1.pets, pref2.pets)
  const smokingScore = calculateSmokingCompatibility(pref1.smoking, pref2.smoking)

  // Weighted average (some preferences matter more)
  const weights = {
    cleanliness: 0.20,
    noiseTolerance: 0.15,
    socialLevel: 0.15,
    pets: 0.20,
    smoking: 0.15,
    overnight_guests: 0.075,
    shared_expenses: 0.075,
  }

  const overall = Math.round(
    cleanlinessScore * weights.cleanliness +
    noiseScore * weights.noiseTolerance +
    socialScore * weights.socialLevel +
    guestsScore * weights.overnight_guests +
    expensesScore * weights.shared_expenses +
    petsScore * weights.pets +
    smokingScore * weights.smoking
  )

  return {
    overall,
    categories: {
      cleanliness: Math.round(cleanlinessScore),
      noiseTolerance: Math.round(noiseScore),
      socialLevel: Math.round(socialScore),
      pets: Math.round(petsScore),
      smoking: Math.round(smokingScore),
      overnight_guests: Math.round(guestsScore),
      shared_expenses: Math.round(expensesScore),
    },
  }
}

/**
 * Calculate compatibility for scalar values (1-5 scale)
 * Closer values = higher compatibility
 */
function calculateScalarDifference(val1: number, val2: number): number {
  const maxDiff = 4 // Maximum difference on 1-5 scale
  const diff = Math.abs(val1 - val2)
  return ((maxDiff - diff) / maxDiff) * 100
}

/**
 * Calculate pet preference compatibility
 */
function calculatePetCompatibility(pref1: string, pref2: string): number {
  // Perfect matches
  if (pref1 === pref2) return 100

  // Compatible combinations
  if ((pref1 === 'love' && pref2 === 'ok') || (pref1 === 'ok' && pref2 === 'love')) return 80
  if ((pref1 === 'no' && pref2 === 'ok') || (pref1 === 'ok' && pref2 === 'no')) return 60

  // Incompatible combinations
  if ((pref1 === 'allergic' || pref2 === 'allergic') && (pref1 === 'love' || pref2 === 'love')) return 0
  if (pref1 === 'allergic' || pref2 === 'allergic') return 20
  if ((pref1 === 'love' && pref2 === 'no') || (pref1 === 'no' && pref2 === 'love')) return 30

  return 50
}

/**
 * Calculate smoking preference compatibility
 */
function calculateSmokingCompatibility(pref1: string, pref2: string): number {
  // Perfect matches
  if (pref1 === pref2) return 100

  // Compatible combinations
  if ((pref1 === 'occasional' && pref2 === 'yes') || (pref1 === 'yes' && pref2 === 'occasional')) return 90
  if ((pref1 === 'occasional' && pref2 === 'no') || (pref1 === 'no' && pref2 === 'occasional')) return 60

  // Incompatible
  if ((pref1 === 'yes' && pref2 === 'no') || (pref1 === 'no' && pref2 === 'yes')) return 20

  return 50
}

/**
 * Get color class for compatibility score
 */
export function getCompatibilityColor(score: number): string {
  if (score >= 80) return 'text-[#2D7E5A]'
  if (score >= 60) return 'text-[#2D7E5A]'
  if (score >= 40) return 'text-yellow-600'
  return 'text-red-600'
}

/**
 * Get background color class for compatibility score
 */
export function getCompatibilityBgColor(score: number): string {
  if (score >= 80) return 'bg-[#E8F5EF] border-[#2D7E5A]'
  if (score >= 60) return 'bg-[#E8F5EF] border-[#2D7E5A]'
  if (score >= 40) return 'bg-yellow-100 border-yellow-300'
  return 'bg-red-100 border-red-300'
}

/**
 * Get compatibility label
 */
export function getCompatibilityLabel(score: number): string {
  if (score >= 80) return 'Excellent Match'
  if (score >= 60) return 'Good Match'
  if (score >= 40) return 'Moderate Match'
  return 'Poor Match'
}
