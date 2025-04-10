import React from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  Modal 
} from 'react-native';

interface LoadingScreenProps {
  visible: boolean;
  message?: string;
  overlay?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  visible = true, 
  message = 'Loading...', 
  overlay = false 
}) => {
  return (
    <Modal 
      transparent 
      animationType="fade" 
      visible={visible}
      statusBarTranslucent
    >
      <View style={[
        styles.container, 
        overlay && styles.overlayBackground
      ]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="large" 
            color="#FF8C00" 
            style={styles.indicator}
          />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBackground: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingContainer: {
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  indicator: {
    marginBottom: 10,
  },
  message: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LoadingScreen;