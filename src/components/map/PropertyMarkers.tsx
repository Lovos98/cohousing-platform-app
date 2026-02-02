'use client'

import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Property } from '@/lib/types'

interface PropertyMarkersProps {
  properties: Property[]
}

// Create custom marker icon using divIcon (doesn't require external images)
const customIcon = L.divIcon({
  className: 'custom-marker-icon',
  html: `
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path fill="#2D7E5A" stroke="#FFFFFF" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 1.9 0.4 3.7 1.2 5.3L12.5 41l11.3-23.2c0.8-1.6 1.2-3.4 1.2-5.3C25 5.6 19.4 0 12.5 0z"/>
      <circle fill="#FFFFFF" cx="12.5" cy="12.5" r="4"/>
    </svg>
  `,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

export function PropertyMarkers({ properties }: PropertyMarkersProps) {
  // Panes are created by PaneInitializer in BrowseMap - no need to duplicate that logic here

  return (
    <>
      {properties.map((property) => (
        <Marker
          key={property.id}
          position={[property.latitude, property.longitude]}
          icon={customIcon}
          pane="pane-properties"
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-sm mb-1">{property.title}</h3>
              <p className="text-xs text-gray-600 mb-1">{property.city}</p>
              <p className="text-sm font-bold text-green-700">
                €{property.price.toLocaleString()}/month
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {property.bedrooms} bed • {property.bathrooms} bath
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  )
}
