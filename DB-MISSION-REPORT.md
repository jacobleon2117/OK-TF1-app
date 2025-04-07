Mission Management Database Mapping

## Collections

# missions
missions/{missionId}/
  {
    id: string (auto-generated)
    title: string
    description: string
    startTime: timestamp
    endTime: timestamp (null until mission completed)
    status: string ('preparing', 'active', 'completed', 'cancelled')
    
    coordinatorId: string (user ID of mission coordinator)
    teamId: string (reference to the team assigned)
    
    location: {
      startingCoordinates: {
        latitude: number
        longitude: number
      }
      operationArea: {
        northEast: {
          latitude: number
          longitude: number
        },
        southWest: {
          latitude: number
          longitude: number
        }
      }
    }
    
    missionMetrics: {
      totalDistanceCovered: number (in miles)
      totalDuration: number (in minutes)
      averageTeamSpeed: number (miles per hour)
    }
    
    reportSummary: {
      totalPinsDropped: number
      pinTypes: {
        brokenHouse: number
        floodedHouse: number
        boat: number
        fire: number
        bodyFound: number
        rescuedPeople: number
      }
    }
  }

# mission_locations
missions/{missionId}/locations/{locationTrackingId}/
  {
    id: string (auto-generated)
    userId: string
    timestamp: timestamp
    coordinates: {
      latitude: number
      longitude: number
    }
    accuracy: number
    altitude: number
    speed: number
    heading: number
    roadType: string ('paved', 'dirt', 'off-road', 'trail')
  }

# mission_pins
missions/{missionId}/pins/{pinId}/
  {
    id: string (auto-generated)
    type: string ('brokenHouse', 'floodedHouse', 'boat', 'fire', 'bodyFound', 'rescuedPeople')
    userId: string (who dropped the pin)
    timestamp: timestamp
    coordinates: {
      latitude: number
      longitude: number
    }
    description: string
    imageUrls: string[] (optional, for photo evidence)
    additionalDetails: {
      rescueCount: number (for rescued people)
      fireIntensity: string (for fire)
      // Other type-specific details
    }
  }

# mission_team_assignments
missions/{missionId}/team_assignments/{assignmentId}/
  {
    userId: string
    role: string ('team_leader', 'team_member', 'support')
    status: string ('active', 'injured', 'evacuated')
    checkinTime: timestamp
    checkoutTime: timestamp
  }