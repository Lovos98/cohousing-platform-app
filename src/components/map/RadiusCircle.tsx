'use client'

import { Circle, Marker, useMap } from 'react-leaflet'
import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { getDestinationPoint } from '@/lib/geo'
import { getMapThemeColors } from '@/lib/theme'

interface RadiusCircleProps {
  center: { lat: number; lng: number }
  radius: number // in kilometers
  onCenterChange: (center: { lat: number; lng: number }) => void
  onRadiusChange?: (radius: number) => void
}

export function RadiusCircle({ center, radius, onCenterChange, onRadiusChange }: RadiusCircleProps) {
  const isDraggingRef = useRef(false)
  const dragModeRef = useRef<'center' | 'edge' | null>(null)
  const circleRef = useRef<L.Circle | null>(null)
  const edgeMarkerRef = useRef<L.Marker | null>(null)

  // Get map instance
  const map = useMap()

  // Theme state
  const [themeColors, setThemeColors] = useState({
    primary: '#2D7E5A',
    primaryLight: 'rgba(45, 126, 90, 0.15)',
    edgeHandle: '#F59E0B',
  })

  // Load theme colors on mount
  useEffect(() => {
    setThemeColors(getMapThemeColors())
  }, [])

  // Calculate edge marker position using geodesic calculation
  const calculateEdgePosition = () => {
    // Place edge marker to the east (bearing = 90 degrees) of the center
    const edgePoint = getDestinationPoint(center.lat, center.lng, 90, radius)
    return L.latLng(edgePoint.lat, edgePoint.lng)
  }

  // Add CSS styles for markers
  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      .center-pin-marker {
        background: transparent !important;
        border: none !important;
      }
      .center-pin-marker > div {
        transition: transform 0.2s ease, filter 0.2s ease;
      }
      .center-pin-marker:hover > div {
        transform: scale(1.1);
        filter: drop-shadow(0 0 8px rgba(45, 126, 90, 0.6));
      }
      .edge-handle-marker {
        background: transparent !important;
        border: none !important;
      }
      .edge-handle-marker > div {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .edge-handle-marker:hover > div {
        transform: scale(1.15);
        box-shadow: 0 0 12px rgba(245, 158, 11, 0.8);
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Create custom icon for center pin (green location marker)
  const centerPinIcon = L.divIcon({
    className: 'center-pin-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${themeColors.primary};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: grab;
      ">
        <div style="
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  })

  // Create custom icon for edge handle with radius label
  const edgeIcon = L.divIcon({
    className: 'edge-handle-marker',
    html: `
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="
          width: 24px;
          height: 24px;
          background: ${themeColors.primary};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: ew-resize;
        "></div>
        <div style="
          background: white;
          padding: 4px 8px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          font-size: 12px;
          font-weight: 600;
          color: ${themeColors.primary};
          white-space: nowrap;
          pointer-events: none;
        ">${radius.toFixed(1)} km</div>
      </div>
    `,
    iconSize: [100, 24],
    iconAnchor: [12, 12],
  })

  return (
    <>
      <Circle
        ref={circleRef}
        center={[center.lat, center.lng]}
        radius={radius * 1000} // Convert km to meters
        pathOptions={{
          color: themeColors.primary,
          fillColor: themeColors.primary,
          fillOpacity: 0.15,
          weight: 2,
        }}
        pane="pane-circle"
      />

      {/* Center Pin Marker - Green */}
      <Marker
        position={[center.lat, center.lng]}
        icon={centerPinIcon}
        draggable={true}
        pane="pane-circle-handles"
        eventHandlers={{
          add: (e) => {
            // Prevent click events from propagating to the map
            const marker = e.target
            const element = marker.getElement()
            if (element) {
              L.DomEvent.disableClickPropagation(element)
            }
          },
          dragstart: () => {
            isDraggingRef.current = true
            dragModeRef.current = 'center'
            // Change cursor to grabbing
            if (map) {
              const container = map.getContainer()
              container.style.cursor = 'grabbing'
            }
          },
          drag: (e) => {
            // Update circle and edge marker positions during drag without React re-render
            const marker = e.target
            const newPos = marker.getLatLng()

            // Update circle position directly
            if (circleRef.current) {
              circleRef.current.setLatLng(newPos)
            }

            // Update edge marker position to maintain same radius using geodesic calculation
            if (edgeMarkerRef.current) {
              const edgePoint = getDestinationPoint(newPos.lat, newPos.lng, 90, radius)
              const newEdgePos = L.latLng(edgePoint.lat, edgePoint.lng)
              edgeMarkerRef.current.setLatLng(newEdgePos)
            }
          },
          dragend: (e) => {
            // Only update state when drag ends to avoid re-render during drag
            const marker = e.target
            const newPos = marker.getLatLng()
            onCenterChange({
              lat: newPos.lat,
              lng: newPos.lng,
            })
            dragModeRef.current = null
            isDraggingRef.current = false
            // Reset cursor
            if (map) {
              const container = map.getContainer()
              container.style.cursor = ''
            }
          },
        }}
      />

      {/* Edge Handle Marker - Orange/Gold */}
      {onRadiusChange && (
        <Marker
          ref={edgeMarkerRef}
          position={calculateEdgePosition()}
          icon={edgeIcon}
          draggable={true}
          pane="pane-circle-handles"
          eventHandlers={{
            add: (e) => {
              // Prevent click events from propagating to the map
              const marker = e.target
              const element = marker.getElement()
              if (element) {
                L.DomEvent.disableClickPropagation(element)
              }
            },
            dragstart: (e) => {
              isDraggingRef.current = true
              dragModeRef.current = 'edge'
              // Change cursor to ew-resize during drag
              if (map) {
                const container = map.getContainer()
                container.style.cursor = 'ew-resize'
              }
              // Ensure marker and label stay fully styled during drag
              const marker = e.target
              const element = marker.getElement()
              if (element) {
                element.style.opacity = '1'
                // Ensure the parent flex container maintains its layout
                const flexContainer = element.querySelector('div') as HTMLElement
                if (flexContainer) {
                  flexContainer.style.display = 'flex'
                  flexContainer.style.alignItems = 'center'
                  flexContainer.style.gap = '8px'

                  // Get handle and label from flexContainer's direct children
                  const handleElement = flexContainer.children[0] as HTMLElement
                  const labelElement = flexContainer.children[1] as HTMLElement

                  // Set styles on the handle (circle) to maintain appearance
                  if (handleElement) {
                    handleElement.style.opacity = '1'
                    handleElement.style.width = '24px'
                    handleElement.style.height = '24px'
                    handleElement.style.background = themeColors.primary
                    handleElement.style.border = '3px solid white'
                    handleElement.style.borderRadius = '50%'
                    handleElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)'
                    handleElement.style.cursor = 'ew-resize'
                    handleElement.style.display = 'block'
                    handleElement.style.visibility = 'visible'
                  }

                  // Set opacity and styles on the label element to maintain appearance
                  if (labelElement) {
                    labelElement.style.opacity = '1'
                    labelElement.style.background = 'white'
                    labelElement.style.padding = '4px 8px'
                    labelElement.style.borderRadius = '4px'
                    labelElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)'
                    labelElement.style.fontSize = '12px'
                    labelElement.style.fontWeight = '600'
                    labelElement.style.color = themeColors.primary
                    labelElement.style.whiteSpace = 'nowrap'
                    labelElement.style.pointerEvents = 'none'
                    labelElement.style.textAlign = 'center'
                  }
                }
              }
            },
            drag: (e) => {
              // Update circle radius during drag without React re-render
              const marker = e.target
              const newEdgePos = marker.getLatLng()
              const centerLatLng = L.latLng(center.lat, center.lng)
              const newRadius = centerLatLng.distanceTo(newEdgePos) / 1000 // Convert to km

              // Clamp radius between 0.1 and 30 km
              const clampedRadius = Math.max(0.1, Math.min(30, newRadius))
              const clampedRadiusMeters = clampedRadius * 1000

              // Update circle radius directly
              if (circleRef.current) {
                circleRef.current.setRadius(clampedRadiusMeters)
              }

              // Continuously maintain styles during drag (Leaflet overrides them)
              const markerElement = marker.getElement()
              if (markerElement) {
                markerElement.style.opacity = '1'

                // Maintain flex layout
                const flexContainer = markerElement.querySelector('div') as HTMLElement
                if (flexContainer) {
                  flexContainer.style.display = 'flex'
                  flexContainer.style.alignItems = 'center'
                  flexContainer.style.gap = '8px'

                  // Get handle and label from flexContainer's direct children
                  const handleElement = flexContainer.children[0] as HTMLElement
                  const labelElement = flexContainer.children[1] as HTMLElement

                  // Maintain handle styles
                  if (handleElement) {
                    handleElement.style.opacity = '1'
                    handleElement.style.width = '24px'
                    handleElement.style.height = '24px'
                    handleElement.style.background = themeColors.primary
                    handleElement.style.border = '3px solid white'
                    handleElement.style.borderRadius = '50%'
                    handleElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)'
                    handleElement.style.cursor = 'ew-resize'
                    handleElement.style.display = 'block'
                    handleElement.style.visibility = 'visible'
                  }

                  // Update label text and maintain styles
                  if (labelElement) {
                    labelElement.textContent = `${clampedRadius.toFixed(1)} km`
                    labelElement.style.opacity = '1'
                    labelElement.style.background = 'white'
                    labelElement.style.padding = '4px 8px'
                    labelElement.style.borderRadius = '4px'
                    labelElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)'
                    labelElement.style.fontSize = '12px'
                    labelElement.style.fontWeight = '600'
                    labelElement.style.color = themeColors.primary
                    labelElement.style.whiteSpace = 'nowrap'
                    labelElement.style.pointerEvents = 'none'
                    labelElement.style.textAlign = 'center'
                  }
                }
              }
            },
            dragend: (e) => {
              // Only update state when drag ends to avoid re-render during drag
              const marker = e.target
              const newEdgePos = marker.getLatLng()
              const centerLatLng = L.latLng(center.lat, center.lng)
              const newRadius = centerLatLng.distanceTo(newEdgePos) / 1000 // Convert to km

              // Clamp radius between 0.1 and 30 km
              const clampedRadius = Math.max(0.1, Math.min(30, newRadius))
              onRadiusChange(clampedRadius)

              dragModeRef.current = null
              isDraggingRef.current = false
              // Reset cursor
              if (map) {
                const container = map.getContainer()
                container.style.cursor = ''
              }
            },
          }}
        />
      )}
    </>
  )
}
