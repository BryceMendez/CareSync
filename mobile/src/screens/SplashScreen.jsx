import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const progressOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(progressOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.timing(progressWidth, {
        toValue: width * 0.5,
        duration: 2000,
        useNativeDriver: false,
      }).start();
    }, 1200);

    const timer = setTimeout(() => {
      onFinish();
    }, 3800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EBF2FF" />

      {/* Background decorative circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      {/* Logo — CareSync Image */}
      <Animated.View
        style={[
          styles.logoContainer,
          { transform: [{ scale: logoScale }], opacity: logoOpacity },
        ]}
      >
        <Image
          source={require('../../assets/CareSync_logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Progress Bar */}
      <Animated.View style={[styles.progressContainer, { opacity: progressOpacity }]}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgCircle1: {
    position: 'absolute',
    width: 320, height: 320, borderRadius: 160,
    backgroundColor: '#BFDBFE', opacity: 0.3,
    top: -80, right: -80,
  },
  bgCircle2: {
    position: 'absolute',
    width: 250, height: 250, borderRadius: 125,
    backgroundColor: '#BFDBFE', opacity: 0.2,
    bottom: -60, left: -60,
  },
  bgCircle3: {
    position: 'absolute',
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: '#BFDBFE', opacity: 0.1,
    top: height * 0.3, right: -50,
  },
  logoContainer: {
    width: 350,
    height: 350,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  outerRing: {
    width: 180, height: 180, borderRadius: 90,
    borderWidth: 1.5, borderColor: '#BFDBFE',
    alignItems: 'center', justifyContent: 'center',
  },
  innerRing: {
    width: 84, height: 84, borderRadius: 42,
    borderWidth: 1, borderColor: '#EBF2FF',
    alignItems: 'center', justifyContent: 'center',
  },
  centerBadge: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#1A56DB',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#1A56DB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8,
    elevation: 6,
  },
  centerLetter: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
  },
  nodeDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#1A56DB',
  },
  logoImage: {
    width: 350,
    height: 350,
  },
  brandName: {
    fontSize: 38,
    fontWeight: '700',
    color: '#1A56DB',
    letterSpacing: 1.5,
  },
  tagline: {
    fontSize: 13,
    color: '#4B5E82',
    letterSpacing: 0.3,
    lineHeight: 20,
    textAlign: 'center',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    width: width * 0.5,
  },
  loadingText: {
    fontSize: 11,
    color: '#BFDBFE',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  progressTrack: {
    width: width * 0.5,
    height: 3,
    backgroundColor: '#EBF2FF',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1A56DB',
    borderRadius: 2,
  },
});