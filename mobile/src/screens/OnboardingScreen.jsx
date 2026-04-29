import React, { useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    FlatList,
    Animated,
    StatusBar,
    Image,
} from "react-native";


const { width } = Dimensions.get("window");

// ─── Illustrations ─────────────────────────────────────────────────────────────

function IllustrationFamily() {
    return (
        <Image
            source={require("../../assets/onboarding1 (2).png")}
            style={{ width: 320, height: 200 }}
            resizeMode="contain"
        />
    );
}

function IllustrationCamera() {
    return (
        <Image
            source={require("../../assets/onboarding.png")}
            style={{ width: 320, height: 200 }}
            resizeMode="contain"
        />
    );
}

function IllustrationAlerts() {
    return (
        <Image
            source={require("../../assets/onboarding3.png")}
            style={{ width: 320, height: 200 }}
            resizeMode="contain"
        />
    );
}

// ─── Slide Data ────────────────────────────────────────────────────────────────

const slides = [
    {
        id: "1",
        title: "Always Know How\nThey're Doing",
        description:
            "CareSync keeps you connected to your loved ones at the assisted living facility — anytime, anywhere.",
        Illustration: IllustrationFamily,
    },
    {
        id: "2",
        title: "Visual Peace\nof Mind",
        description:
            "Access secure live camera feeds with AI-driven activity detection to see how your loved ones are doing in real-time.",
        Illustration: IllustrationCamera,
    },
    {
        id: "3",
        title: "Daily Reports &\nInstant Alerts",
        description:
            "Get daily activity summaries — sleep, meals, movement. Receive push notifications the moment anything needs your attention.",
        Illustration: IllustrationAlerts,
    },
];

// ─── Main Component ────────────────────────────────────────────────────────────

export default function OnboardingScreen({ onFinish }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    // animatedIndex drives the dot animation independently of scroll events
    const animatedIndex = useRef(new Animated.Value(0)).current;

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            const nextIndex = currentIndex + 1;
            flatListRef.current?.scrollToIndex({ index: nextIndex });
            setCurrentIndex(nextIndex);
            Animated.timing(animatedIndex, {
                toValue: nextIndex,
                duration: 300,
                useNativeDriver: false,
            }).start();
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
            <StatusBar barStyle="dark-content" backgroundColor="#EBF2FF" />
            <View style={styles.blob1} />
            <View style={styles.blob2} />

            <TouchableOpacity style={styles.skipButton} onPress={onFinish}>
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                style={styles.flatList}
            />

            <View style={styles.dotsContainer}>
                {slides.map((_, i) => {
                    const dotWidth = animatedIndex.interpolate({
                        inputRange: [i - 1, i, i + 1],
                        outputRange: [8, 24, 8],
                        extrapolate: "clamp",
                    });
                    const dotColor = animatedIndex.interpolate({
                        inputRange: [i - 1, i, i + 1],
                        outputRange: ["#BFDBFE", "#1A56DB", "#BFDBFE"],
                        extrapolate: "clamp",
                    });
                    return (
                        <Animated.View
                            key={i}
                            style={[
                                styles.dot,
                                { width: dotWidth, backgroundColor: dotColor },
                            ]}
                        />
                    );
                })}
            </View>

            <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
                activeOpacity={0.85}
            >
                <Text style={styles.nextButtonText}>
                    {currentIndex === slides.length - 1
                        ? "Get Started"
                        : "Next"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EBF2FF",
        alignItems: "center",
    },
    blob1: {
        position: "absolute",
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: "#BFDBFE",
        opacity: 0.35,
        top: -60,
        left: -80,
    },
    blob2: {
        position: "absolute",
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: "#BFDBFE",
        opacity: 0.2,
        bottom: 80,
        right: -60,
    },
    skipButton: {
        position: "absolute",
        top: 55,
        right: 24,
        zIndex: 10,
        paddingVertical: 6,
        paddingHorizontal: 14,
    },
    skipText: {
        fontSize: 15,
        color: "#4B5E82",
        fontWeight: "500",
    },
    flatList: {
        flex: 1,
        marginTop: 40,
    },
    slide: {
        width,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 36,
    },
    illustrationContainer: {
    width: 240,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    // No backgroundColor, no shadow, no elevation, no overflow
},
    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#1A56DB",
        textAlign: "center",
        lineHeight: 34,
        marginBottom: 16,
    },
    description: {
        fontSize: 14,
        color: "#4B5E82",
        textAlign: "center",
        lineHeight: 22,
        maxWidth: 300,
    },
    dotsContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 28,
        gap: 6,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    nextButton: {
        backgroundColor: "#1A56DB",
        paddingVertical: 16,
        paddingHorizontal: 48,
        borderRadius: 50,
        marginBottom: 48,
        shadowColor: "#1A56DB",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
        elevation: 6,
    },
    nextButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
});
