import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import BackgroundGrid from './common/auth/BackgroundGrid';

interface LoadingScreenProps {
  visible: boolean;
  message?: string;
  overlay?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  visible,
  message = 'loading...',
  overlay = true,
}) => {
  if (!visible) return null;

  const content = (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#F09737" />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );

  if (overlay) {
    return (
      <Modal transparent={true} animationType="fade" visible={visible}>
        <View style={styles.overlay}>{content}</View>
      </Modal>
    );
  }

  return <BackgroundGrid>{content}</BackgroundGrid>;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
});

export default LoadingScreen;
