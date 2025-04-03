// src/components/widgets/WeatherWidget.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WidgetContainer from './WidgetContainer';

// Placeholder imports for future implementation
// import { fetchWeatherData } from '../../services/weatherService';
// import { useLocation } from '../../hooks/useLocation';

export default function WeatherWidget() {
  // Will be replaced with real data later
  const weatherData = {
    temp: 72,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 8,
    feelsLike: 74,
  };

  // Function to determine weather icon based on condition
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
    
    // Default to partly-sunny if condition not found
    const iconName = Object.entries(conditions).find(
      ([key]) => condition.toLowerCase().includes(key)
    )?.[1] || 'partly-sunny';
    
    return iconName;
  };

  const weatherIcon = getWeatherIcon(weatherData.condition);

  const handlePress = () => {
    // Handle widget press - can be used to open detailed weather view
    console.log('Weather widget pressed');
  };

  return (
    <WidgetContainer 
      title="Weather" 
      icon={<Ionicons name="cloud" size={18} color="#4da6ff" />}
      onPress={handlePress}
    >
      <View style={styles.weatherContent}>
        <View style={styles.mainWeather}>
          <Ionicons 
            name={weatherIcon as any} 
            size={42} 
            color="#4da6ff" 
            style={styles.weatherIcon} 
          />
          <View>
            <View style={styles.tempContainer}>
              <Text style={styles.temperature}>{weatherData.temp}°</Text>
              <Text style={styles.unit}>F</Text>
            </View>
            <Text style={styles.condition}>{weatherData.condition}</Text>
          </View>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Ionicons name="water-outline" size={14} color="#666" />
            <Text style={styles.detailText}>{weatherData.humidity}%</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="speedometer-outline" size={14} color="#666" />
            <Text style={styles.detailText}>{weatherData.windSpeed} mph</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="thermometer-outline" size={14} color="#666" />
            <Text style={styles.detailText}>Feels {weatherData.feelsLike}°</Text>
          </View>
        </View>
      </View>
    </WidgetContainer>
  );
}

const styles = StyleSheet.create({
  weatherContent: {
    marginTop: 4,
  },
  mainWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weatherIcon: {
    marginRight: 16,
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  temperature: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  unit: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  condition: {
    fontSize: 14,
    color: '#666',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 13,
  },
});
