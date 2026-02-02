'use client'

import { MapContainer, TileLayer } from 'react-leaflet'
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { RadiusCircle } from './RadiusCircle'
import { PropertyMarkers } from './PropertyMarkers'
import { Property } from '@/lib/types'
import 'leaflet/dist/leaflet.css'

interface BrowseMapProps {
  properties: Property[]
  mapCenter: { lat: number; lng: number }
  searchRadius: number
  onCenterChange: (center: { lat: number; lng: number }) => void
  onRadiusChange?: (radius: number) => void
}

// Helper component to initialize panes
function PaneInitializer() {
  const map = useMap()

  useEffect(() => {
    // Create custom panes for z-index control
    if (!map.getPane('pane-properties')) {
      const pane = map.createPane('pane-properties')
      pane.style.zIndex = '400'
    }
    if (!map.getPane('pane-circle')) {
      const pane = map.createPane('pane-circle')
      pane.style.zIndex = '500'
    }
    if (!map.getPane('pane-circle-handles')) {
      const pane = map.createPane('pane-circle-handles')
      pane.style.zIndex = '600'
    }
  }, [map])

  return null
}

export function BrowseMap({
  properties,
  mapCenter,
  searchRadius,
  onCenterChange,
  onRadiusChange,
}: BrowseMapProps) {
  return (
    <MapContainer
      center={[mapCenter.lat, mapCenter.lng]}
      zoom={10}
      className="w-full h-[40vh] md:h-[50vh] lg:h-[60vh] rounded-lg shadow-lg z-0"
    >
      <PaneInitializer />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RadiusCircle
        center={mapCenter}
        radius={searchRadius}
        onCenterChange={onCenterChange}
        onRadiusChange={onRadiusChange}
      />

      <PropertyMarkers properties={properties} />
    </MapContainer>
  )
}
