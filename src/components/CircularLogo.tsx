import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface CircularLogoProps {
  size?: number;
}

const CircularLogo: React.FC<CircularLogoProps> = ({ size = 80 }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image 
        source={require('../../assets/logos/OK-TF1-logo.jpg')} 
        style={[styles.logo, { width: size, height: size }]}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});

export default CircularLogo;