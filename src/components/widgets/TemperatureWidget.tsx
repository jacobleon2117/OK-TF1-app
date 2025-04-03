// src/components/widgets/TemperatureWidget.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WidgetContainer from './WidgetContainer';

// Placeholder imports for future implementation
// import { fetchTemperatureData } from '../../services/temperatureService';
// import { useSensors } from '../../hooks/useSensors';

export default function TemperatureWidget() {
  // Demo temperature data - will be replaced with real data
  const tempData = {
    indoor: 68,
    outdoor: 72,
    target: 70,
    mode: 'heat',
    history: [65, 66, 67, 68, 68, 68, 69, 68]
  };

  const getModeIcon = (mode: string) => {
    switch(mode.toLowerCase()) {
      case 'heat':
        return { name: 'flame', color: '#e74c3c' };
      case 'cool':
        return { name: 'snow', color: '#3498db' };
      case 'auto':
        return { name: 'swap-vertical', color: '#9b59b6' };
      case 'fan':
        return { name: 'fan', color: '#7f8c8d' };
      default:
        return { name: 'power', color: '#95a5a6' };
    }
  };

  // Determine if heating or cooling is active
  const isHeating = tempData.indoor < tempData.target && tempData.mode === 'heat';
  const isCooling = tempData.indoor > tempData.target && tempData.mode === 'cool';
  
  const modeIcon = getModeIcon(tempData.mode);

  // Temperature trend visualization (simplified)
  const renderTrend = () => {
    return (
      <View style={styles.trendContainer}>
        {tempData.history.map((temp, index) => (
          <View 
            key={index}
            style={[
              styles.trendBar,
              { 
                height: Math.max(4, (temp - 60) * 2.5),
                backgroundColor: temp >= 72 ? '#e74c3c' : '#3498db'
              }
            ]} 
          />
        ))}
      </View>
    );
  };

  const handlePress = () => {
    // Handle widget press - can be used to open detailed temperature view
    console.log('Temperature widget pressed');
  };

  return (
    <WidgetContainer 
      title="Temperature" 
      icon={<Ionicons name="thermometer-outline" size={18} color="#e67e22" />}
      onPress={handlePress}
    >
      <View style={styles.tempContent}>
        <View style={styles.mainTemp}>
          <View style={styles.currentContainer}>
            <Text style={styles.currentTemp}>{tempData.indoor}°</Text>
            <Text style={styles.indoorLabel}>INDOOR</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.controlContainer}>
            <View style={styles.targetContainer}>
              <Text style={styles.targetTemp}>{tempData.target}°</Text>
              <Text style={styles.targetLabel}>TARGET</Text>
            </View>
            
            <View style={styles.modeContainer}>
              <Ionicons 
                name={modeIcon.name as any} 
                size={18} 
                color={modeIcon.color} 
              />
              <Text style={[styles.modeText, { color: modeIcon.color }]}>
                {tempData.mode.toUpperCase()}
              </Text>
              
              {(isHeating || isCooling) && (
                <View style={styles.activeIndicator}>
                  <Text style={styles.activeText}>
                    {isHeating ? 'HEATING' : 'COOLING'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
        
        <View style={styles.bottomContainer}>
          <View style={styles.outdoorContainer}>
            <Ionicons name="partly-sunny-outline" size={14} color="#666" />
            <Text style={styles.outdoorTemp}>Outdoor: {tempData.outdoor}°</Text>
          </View>
          
          {renderTrend()}
        </View>
      </View>
    </WidgetContainer>
  );
}

const styles = StyleSheet.create({
  tempContent: {
    marginTop: 4,
  },
  mainTemp: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  currentTemp: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  indoorLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: -4,
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 12,
  },
  controlContainer: {
    flex: 1,
  },
  targetContainer: {
    alignItems: 'center',
    marginBottom: 6,
  },
  targetTemp: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  targetLabel: {
    fontSize: 10,
    color: '#888',
    marginTop: -2,
  },
  modeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  activeIndicator: {
    marginLeft: 8,
    backgroundColor: '#f39c12',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
  },
  outdoorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  outdoorTemp: {
    marginLeft: 4,
    color: '#666',
    fontSize: 13,
  },
  trendContainer: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  trendBar: {
    width: 4,
    marginHorizontal: 2,
    borderRadius: 2,
  },
});
