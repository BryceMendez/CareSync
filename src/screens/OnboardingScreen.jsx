import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
  StatusBar,
} from 'react-native';
import Svg, {
  Circle, Rect, Path, Line, Defs, LinearGradient, Stop,
} from 'react-native-svg';

const { width } = Dimensions.get('window');

// ─── Illustrations ─────────────────────────────────────────────────────────────

function IllustrationFamily() {
  return (
    <Svg width={220} height={200} viewBox="0 0 220 200">
      <Defs>
        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#E3F2FD" />
          <Stop offset="1" stopColor="#BBDEFB" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="80" width="220" height="120" fill="#E8F5E9" rx="12" />
      <Rect x="0" y="0" width="220" height="100" fill="url(#sky)" rx="12" />
      <Rect x="70" y="90" width="80" height="70" fill="white" rx="4" />
      <Path d="M60 95 L110 55 L160 95" fill="#90CAF9" />
      <Rect x="95" y="130" width="30" height="30" fill="#BBDEFB" rx="2" />
      <Rect x="78" y="105" width="22" height="20" fill="#E3F2FD" rx="2" />
      <Rect x="120" y="105" width="22" height="20" fill="#E3F2FD" rx="2" />
      <Rect x="30" y="130" width="8" height="30" fill="#A5D6A7" />
      <Circle cx="34" cy="118" r="18" fill="#66BB6A" opacity={0.8} />
      <Circle cx="185" cy="80" r="14" fill="#FFF9C4" />
      <Rect x="174" y="94" width="22" height="35" fill="#42A5F5" rx="5" />
      <Rect x="179" y="100" width="12" height="18" fill="#E3F2FD" rx="2" />
      <Circle cx="28" cy="80" r="12" fill="#FFE0B2" />
      <Rect x="18" y="92" width="20" height="30" fill="#A5D6A7" rx="5" />
      <Line x1="38" y1="100" x2="44" y2="122" stroke="#795548" strokeWidth="2" />
      <Path d="M45 75 Q110 30 170 78" stroke="#42A5F5" strokeWidth="2"
        fill="none" strokeDasharray="5 4" />
      <Circle cx="75" cy="50" r="3" fill="#2196F3" />
      <Circle cx="110" cy="38" r="3" fill="#2196F3" />
      <Circle cx="145" cy="50" r="3" fill="#2196F3" />
    </Svg>
  );
}

function IllustrationCamera() {
  return (
    <Svg width={220} height={200} viewBox="0 0 220 200">
      <Defs>
        <LinearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#E3F2FD" />
          <Stop offset="1" stopColor="#90CAF9" />
        </LinearGradient>
      </Defs>
      <Rect x="30" y="20" width="160" height="120" rx="10" fill="#1565C0" />
      <Rect x="38" y="28" width="144" height="104" rx="6" fill="url(#screen)" />
      <Rect x="95" y="140" width="30" height="16" fill="#1565C0" />
      <Rect x="80" y="155" width="60" height="6" rx="3" fill="#1565C0" />
      <Rect x="42" y="32" width="66" height="46" rx="4" fill="#BBDEFB" />
      <Rect x="114" y="32" width="64" height="46" rx="4" fill="#BBDEFB" />
      <Rect x="42" y="82" width="66" height="46" rx="4" fill="#BBDEFB" />
      <Rect x="114" y="82" width="64" height="46" rx="4" fill="#BBDEFB" />
      <Circle cx="68" cy="48" r="8" fill="#FFE0B2" />
      <Rect x="60" y="56" width="16" height="18" fill="#66BB6A" rx="3" />
      <Rect x="58" y="38" width="20" height="28" stroke="#2196F3"
        strokeWidth="1.5" fill="none" strokeDasharray="3 2" rx="2" />
      <Path
        d="M140 90 L140 90 Q140 88 142 87 L157 82 L172 87 Q174 88 174 90 L174 110 Q174 120 157 125 Q140 120 140 110 Z"
        fill="#1976D2" opacity={0.8} />
      <Path d="M148 104 L153 109 L166 96" stroke="white" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M54 100 Q68 88 82 100" stroke="#42A5F5" strokeWidth="1.5"
        fill="none" strokeLinecap="round" />
      <Path d="M58 107 Q68 99 78 107" stroke="#42A5F5" strokeWidth="1.5"
        fill="none" strokeLinecap="round" />
      <Circle cx="68" cy="113" r="2.5" fill="#2196F3" />
    </Svg>
  );
}

function IllustrationAlerts() {
  return (
    <Svg width={220} height={200} viewBox="0 0 220 200">
      <Defs>
        <LinearGradient id="phone_grad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#E3F2FD" />
          <Stop offset="1" stopColor="#F8FBFF" />
        </LinearGradient>
      </Defs>
      <Rect x="60" y="10" width="100" height="180" rx="16" fill="#1565C0" />
      <Rect x="66" y="20" width="88" height="160" rx="10" fill="url(#phone_grad)" />
      <Rect x="88" y="14" width="44" height="8" rx="4" fill="#0D47A1" />
      <Rect x="72" y="30" width="76" height="42" rx="8" fill="white" />
      <Path d="M82 48 Q86 40 94 40 Q88 44 88 50 Q88 56 94 60 Q86 60 82 52 Q80 50 82 48Z"
        fill="#5C6BC0" />
      <Circle cx="104" cy="42" r="1.5" fill="#90CAF9" />
      <Circle cx="110" cy="38" r="2" fill="#64B5F6" />
      <Circle cx="117" cy="34" r="2.5" fill="#42A5F5" />
      <Rect x="78" y="62" width="64" height="4" rx="2" fill="#E3F2FD" />
      <Rect x="78" y="62" width="46" height="4" rx="2" fill="#42A5F5" />
      <Rect x="72" y="80" width="76" height="36" rx="8" fill="#FFF3E0" />
      <Path d="M98 86 Q100 83 102 86 L105 92 L95 92 Z" fill="#FF9800" />
      <Path d="M95 92 L105 92 Q106 95 100 95 Q94 95 95 92Z" fill="#FF9800" />
      <Line x1="100" y1="83" x2="100" y2="86" stroke="#FF9800" strokeWidth="1.5" />
      <Rect x="110" y="87" width="32" height="4" rx="2" fill="#FFB74D" />
      <Rect x="110" y="95" width="24" height="3" rx="2" fill="#FFCC80" />
      <Rect x="72" y="124" width="76" height="46" rx="8" fill="white" />
      <Rect x="80" y="148" width="8" height="16" rx="2" fill="#90CAF9" />
      <Rect x="92" y="140" width="8" height="24" rx="2" fill="#42A5F5" />
      <Rect x="104" y="144" width="8" height="20" rx="2" fill="#90CAF9" />
      <Rect x="116" y="136" width="8" height="28" rx="2" fill="#1976D2" />
      <Rect x="128" y="142" width="8" height="22" rx="2" fill="#42A5F5" />
      <Line x1="78" y1="164" x2="138" y2="164" stroke="#E3F2FD" strokeWidth="1" />
      <Circle cx="150" cy="30" r="14" fill="#F44336" />
      <Path d="M144 26 Q150 22 156 26 L158 32 L142 32 Z" fill="white" />
      <Path d="M142 32 L158 32 Q159 36 150 36 Q141 36 142 32Z" fill="white" />
    </Svg>
  );
}

// ─── Slide Data ────────────────────────────────────────────────────────────────

const slides = [
  {
    id: '1',
    title: "Always Know How\nThey're Doing",
    description: 'CareSync keeps you connected to your loved ones at the assisted living facility — anytime, anywhere.',
    Illustration: IllustrationFamily,
  },
  {
    id: '2',
    title: 'Visual Peace\nof Mind',
    description: 'Access secure live camera feeds with AI-driven activity detection to see how your loved ones are doing in real-time.',
    Illustration: IllustrationCamera,
  },
  {
    id: '3',
    title: 'Daily Reports &\nInstant Alerts',
    description: 'Get daily activity summaries — sleep, meals, movement. Receive push notifications the moment anything needs your attention.',
    Illustration: IllustrationAlerts,
  },
];

// ─── Main Component ────────────────────────────────────────────────────────────

export default function OnboardingScreen({ onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish();
    }
  };

  const renderItem = ({ item }) => {
    const { Illustration } = item;
    return (
      <View style={styles.slide}>
        <View style={styles.illustrationContainer}>
          <Illustration />
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F7FF" />
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <TouchableOpacity style={styles.skipButton} onPress={onFinish}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        style={styles.flatList}
      />

      <View style={styles.dotsContainer}>
        {slides.map((_, i) => {
          const dotWidth = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });
          const dotColor = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: ['#BBDEFB', '#2196F3', '#BBDEFB'],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i}
              style={[styles.dot, { width: dotWidth, backgroundColor: dotColor }]}
            />
          );
        })}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.85}>
        <Text style={styles.nextButtonText}>
          {currentIndex === slides.length - 1 ? 'Get Started' : 'Next →'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
  },
  blob1: {
    position: 'absolute',
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: '#BBDEFB', opacity: 0.35,
    top: -60, left: -80,
  },
  blob2: {
    position: 'absolute',
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: '#90CAF9', opacity: 0.2,
    bottom: 80, right: -60,
  },
  skipButton: {
    position: 'absolute',
    top: 55, right: 24,
    zIndex: 10,
    paddingVertical: 6, paddingHorizontal: 14,
  },
  skipText: {
    fontSize: 15,
    color: '#5B8DB8',
    fontWeight: '500',
  },
  flatList: {
    flex: 1,
    marginTop: 40,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  illustrationContainer: {
    width: 240, height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    backgroundColor: 'white',
    borderRadius: 32,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1565C0',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#5B8DB8',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 50,
    marginBottom: 48,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});