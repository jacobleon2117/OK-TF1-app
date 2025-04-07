// src/components/widgets/WeatherTempWidget.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CardContainer from './CardContainer';

export default function WeatherTempWidget() {
  // Demo data
  const data = {
    weather: {
      temp: 72,
      condition: 'Partly Cloudy',
      humidity: 65,
    },
    sensors: {
      localTemp: 82,
      sensorBattery: 75,
    }
  };

  const getWeatherIcon = (condition: string) => {
    const conditions = {
      'clear': 'sunny',
      'partly cloudy': 'partly-sunny',
      'cloudy': 'cloud',
      'rain': 'rainy',
      'thunderstorm': 'thunderstorm',
      'snow': 'snow',
      'fog': 'cloud',
    };
    
    const iconName = Object.entries(conditions).find(
      ([key]) => condition.toLowerCase().includes(key)
    )?.[1] || 'partly-sunny';
    
    return iconName;
  };

  const weatherIcon = getWeatherIcon(data.weather.condition);
  
  // Heat level indicator
  const getHeatColor = (temp: number) => {
    if (temp >= 90) return '#ff3b30'; // Hot (red)
    if (temp >= 80) return '#ff9500'; // Warm (orange)
    if (temp >= 70) return '#ffcc00'; // Moderate (yellow)
    return '#4cd964'; // Cool (green)
  };
  
  const sensorHeatColor = getHeatColor(data.sensors.localTemp);

  return (
    <CardContainer 
      title="Weather & Temperature" 
      icon={<Ionicons name="thermometer-outline" size={14} color="#4da6ff" />}
    >
      <View style={styles.content}>
        <View style={styles.row}>
          {/* Weather information */}
          <View style={styles.weatherSection}>
            <View style={styles.tempRow}>
              <Ionicons name={weatherIcon as any} size={20} color="#4da6ff" />
              <Text style={styles.temperature}>{data.weather.temp}°</Text>
            </View>
            <Text style={styles.condition}>{data.weather.condition}</Text>
            <Text style={styles.humidity}>Humidity: {data.weather.humidity}%</Text>
          </View>
          
          <View style={styles.divider} />
          
          {/* Sensor temperature */}
          <View style={styles.sensorSection}>
            <View style={styles.sensorTempContainer}>
              <Text style={[styles.sensorTemp, {color: sensorHeatColor}]}>
                {data.sensors.localTemp}°
              </Text>
              <Ionicons 
                name="bluetooth" 
                size={12} 
                color="#4da6ff" 
                style={styles.bluetoothIcon} 
              />
            </View>
            <Text style={styles.sensorName}>Sensor Temp</Text>
            <View style={styles.batteryRow}>
              <Ionicons name="battery-half" size={10} color="#ccc" />
              <Text style={styles.batteryText}>{data.sensors.sensorBattery}%</Text>
            </View>
          </View>
        </View>
      </View>
    </CardContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherSection: {
    flex: 1,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temperature: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 6,
  },
  condition: {
    fontSize: 12,
    color: '#ccc',
  },
  humidity: {
    fontSize: 10,
    color: '#aaa',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 10,
  },
  sensorSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  sensorTempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sensorTemp: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  bluetoothIcon: {
    marginLeft: 5,
  },
  sensorName: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'right',
  },
  batteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  batteryText: {
    fontSize: 10,
    color: '#aaa',
    marginLeft: 4,
  },
});
