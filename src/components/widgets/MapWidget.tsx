// src/components/widgets/MapWidget.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WidgetContainer from './WidgetContainer';

export default function MapWidget({ onPress }: { onPress?: () => void }) {
  // Demo data
  const data = {
    location: {
      latlong: "lat/long 36.1386/-95.9882",
      address: "DS CoffeeCo.",
      fullAddress: "1633 South Boulder Avenue",
      cityState: "Tulsa, OK 74119",
      what3words: "w3w ///salads.strut.family", // Optional what3words address -- 
    },
    team: {
      nearbyMembers: 4,
    },
    incidents: [
      { type: 'fire', distance: 2.4 },
      { type: 'medical', distance: 1.1 },
    ]
  };

   // Format coordinates as degrees, minutes, seconds
   const formatCoordinates = (coord: number, isLatitude: boolean) => {
    const absolute = Math.abs(coord);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.floor((minutesNotTruncated - minutes) * 60);
    
    const direction = isLatitude 
      ? (coord >= 0 ? "N" : "S") 
      : (coord >= 0 ? "E" : "W");
    
    return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
  };
  

  return (
    <WidgetContainer 
      title="Location & Map" 
      icon={<Ionicons name="map" size={14} color="#4cd964" />}
      onPress={onPress}
    >
      <View style={styles.content}>
        {/* Map preview - This would normally be a MapView component */}
        <View style={styles.mapPreview}>
          <View style={styles.mapOverlay}>
            <Ionicons name="expand" size={14} color="#fff" style={styles.expandIcon} />
          </View>
          
          {/* This would be replaced with an actual MapView */}
          <View style={styles.mapPlaceholder}>
            <View style={styles.gridLines}></View>
            <View style={styles.currentLocation}></View>
          </View>
        </View>

        <View style={styles.notMap}>
        <View style={styles.infoContainer}>
          <View style={styles.locationInfo}>
            <Text style={styles.locationText} numberOfLines={1}>
              <Ionicons name="location" size={12} color="#ff3b30" style={styles.locationIcon} />
                {data.location.address}
            </Text>

            <Text style={styles.locationText} numberOfLines={1}>
              <Ionicons name="location" size={12} color="#ff3b30" style={styles.locationIcon} />
                {data.location.fullAddress}
            </Text>

            <Text style={styles.locationText} numberOfLines={1}>
                <Ionicons name="location" size={12} color="#ff3b30" style={styles.locationIcon} />
                  {data.location.cityState}
            </Text>
            
            <Text style={styles.locationText} numberOfLines={1}>
                <Ionicons name="location" size={12} color="#ff3b30" style={styles.locationIcon} />
                  {data.location.latlong}
            </Text>

            <Text style={styles.locationText} numberOfLines={1}>
                <Ionicons name="location" size={12} color="#ff3b30" />
                  {data.location.what3words}
            </Text>
            
          </View>

          </View>
          <View style={styles.statsColumn}>
            <Text style={styles.statText}>
              <Ionicons name="people" size={12} color="#4cd964" /> {data.team.nearbyMembers} nearby
            </Text>
            <Text style={styles.statText}>
              <Ionicons name="warning" size={12} color="#ff9500" /> {data.incidents.length} incidents
            </Text>
          </View>
        
      </View>
      </View>
    </WidgetContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  mapPreview: {
    width: 80,
    aspectRatio: 1,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    marginRight: 8,
    alignSelf: 'stretch', 
  },
  mapPlaceholder: {
    backgroundColor: '#1c1c1e',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridLines: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
    currentLocation: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4cd964',
    borderWidth: 2,
    borderColor: '#fff',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
    padding: 2,
  },
  expandIcon: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    padding: 2,
  },
  notMap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  locationColumn: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  locationInfo: {
    flexDirection: 'column',
    alignItems: 'right',
    marginLeft: 4,
    marginBottom: 4,
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    color: '#fff',
    fontSize: 12,
  },
  coordinatesContainer: {
    marginBottom: 4,
  },
  coordinatesText: {
    color: '#aaa',
    fontSize: 10,
    fontFamily: 'monospace', 
  },
  statsColumn: {
    // justifyContent: 'space-between',
    marginTop: 2,
  },
  statText: {
    color: '#ccc',
    fontSize: 10,
  },
});
