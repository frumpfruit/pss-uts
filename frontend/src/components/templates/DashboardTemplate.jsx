import React from 'react'

export function DashboardTemplate({
  banner,
  stats,
  mainGrid,
  secondaryGrid
}) {
  return (
    <div className="space-y-6">
      {/* 1. Hero Welcome Banner */}
      {banner && <div>{banner}</div>}

      {/* 2. Top Stats Row (Responsive: 1 col on mobile, 2 on sm, 4 on lg/xl) */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats}
        </div>
      )}

      {/* 3. Main 2-column or 3-column Grid Section */}
      {mainGrid && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {mainGrid}
        </div>
      )}

      {/* 4. Secondary Grid Section */}
      {secondaryGrid && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {secondaryGrid}
        </div>
      )}
    </div>
  )
}
