import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

interface BackgroundGridProps {
  children: React.ReactNode;
}

const { width, height } = Dimensions.get('window');

const BackgroundGrid: React.FC<BackgroundGridProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* Background grid images */}
      <View style={styles.backgroundGrid}>
        <Image
          source={require('../../../../assets/images/bg-img-1.jpg')}
          style={styles.gridImage}
        />
        <Image
          source={require('../../../../assets/images/bg-img-2.jpg')}
          style={styles.gridImage}
        />
        <Image
          source={require('../../../../assets/images/bg-img-3.jpg')}
          style={styles.gridImage}
        />
        <Image
          source={require('../../../../assets/images/bg-img-4.jpg')}
          style={styles.gridImage}
        />
        <Image
          source={require('../../../../assets/images/bg-img-5.jpg')}
          style={styles.gridImage}
        />
        <Image
          source={require('../../../../assets/images/bg-img-6.jpg')}
          style={styles.gridImage}
        />
        <Image
          source={require('../../../../assets/images/bg-img-7.jpg')}
          style={styles.gridImage}
        />
        {/* Special handling for image 8 */}
        <View style={styles.specialImageContainer}>
          <Image
            source={require('../../../../assets/images/bg-img-8.jpg')}
            style={styles.specialImage}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* transparent overlay */}
      <View style={styles.overlay} />

      {/* Content container with higher z-index */}
      <View style={styles.contentContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    flexDirection: 'row',
    flexWrap: 'wrap',
    zIndex: 1,
  },
  gridImage: {
    width: width / 2,
    height: height / 4,
  },
  specialImageContainer: {
    width: width / 2,
    height: height / 4,
    overflow: 'hidden',
  },
  specialImage: {
    width: width / 2 + 50,
    height: height / 4,
    marginLeft: -50,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 2,
  },
  contentContainer: {
    flex: 1,
    zIndex: 3,
  },
});

export default BackgroundGrid;
