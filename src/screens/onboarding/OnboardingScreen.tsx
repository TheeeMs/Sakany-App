import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { onboardingSlides, OnboardingSlide } from "./data";
import { PaginationDots } from "./components";

const { width, height } = Dimensions.get("window");

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({
  onComplete,
}: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < onboardingSlides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleGetStarted = () => {
    onComplete();
  };

  const handleContinueAsGuest = () => {
    onComplete();
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const isLastSlide = currentIndex === onboardingSlides.length - 1;
  const isFirstSlide = currentIndex === 0;

  const renderSlide = ({ item }: { item: OnboardingSlide }) => {
    const { Illustration } = item;
    return (
      <View style={styles.slideContainer}>
        {/* Illustration Box */}
        <View style={styles.illustrationBox}>
          <Illustration width={width * 0.9} height={height * 0.38} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF8F3" />

      {/* Background - Split into two colors */}
      <View style={styles.topBackground} />
      <View style={styles.bottomBackground} />

      {/* Content Container */}
      <SafeAreaView style={styles.safeArea}>
        {/* Skip Button */}
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>skip</Text>
        </TouchableOpacity>

        {/* Slides */}
        <View style={styles.slidesContainer}>
          <FlatList
            ref={flatListRef}
            data={onboardingSlides}
            renderItem={renderSlide}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false },
            )}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            scrollEventThrottle={16}
          />
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Title and Description */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              {onboardingSlides[currentIndex].title}
            </Text>
            <Text style={styles.description}>
              {onboardingSlides[currentIndex].description}
            </Text>
          </View>

          {/* Pagination Dots */}
          <PaginationDots
            total={onboardingSlides.length}
            currentIndex={currentIndex}
          />

          {/* Navigation Buttons */}
          <View style={styles.buttonsContainer}>
            {/* Back and Next Row */}
            <View style={styles.navigationRow}>
              {/* Back Button */}
              {!isFirstSlide ? (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBack}
                >
                  <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
                </TouchableOpacity>
              ) : (
                <View style={styles.placeholder} />
              )}

              {/* Next/Get Started Button */}
              {isLastSlide ? (
                <TouchableOpacity
                  style={styles.mainButton}
                  onPress={handleGetStarted}
                >
                  <Text style={styles.mainButtonText}>Get Started</Text>
                  <Ionicons name="arrow-forward" size={20} color="#00A996" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.mainButton}
                  onPress={handleNext}
                >
                  <Text style={styles.mainButtonText}>Next</Text>
                  <Ionicons name="arrow-forward" size={20} color="#00A996" />
                </TouchableOpacity>
              )}
            </View>

            {/* Continue as Guest - Only on last slide */}
            {isLastSlide && (
              <TouchableOpacity
                style={styles.guestButton}
                onPress={handleContinueAsGuest}
              >
                <Text style={styles.guestText}>Continue as a guest</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.48,
    backgroundColor: "#FDF8F3",
  },
  bottomBackground: {
    position: "absolute",
    top: height * 0.48,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#00A996",
  },
  safeArea: {
    flex: 1,
  },
  skipButton: {
    position: "absolute",
    top: 50,
    right: 25,
    zIndex: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  skipText: {
    fontSize: 15,
    color: "#555",
  },
  slidesContainer: {
    height: height * 0.52,
    paddingTop: 50,
  },
  slideContainer: {
    width,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  illustrationBox: {
    width: width,
    height: height * 0.48,
    backgroundColor: "#FDF8F3",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    justifyContent: "flex-end",
    alignItems: "center",
    overflow: "hidden",
    paddingBottom: 20,
  },
  contentSection: {
    flex: 1,
    paddingTop: 20,
  },
  textContainer: {
    paddingHorizontal: 35,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#F8F8F8",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 32,
  },
  description: {
    fontSize: 14,
    color: "#F8F8F8",
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.85,
  },
  buttonsContainer: {
    paddingHorizontal: 25,
    marginTop: "auto",
    marginBottom: "auto",
  },
  navigationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    width: 0,
  },
  mainButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FDF8F3",
    paddingVertical: 16,
    borderRadius: 30,
    gap: 10,
  },
  mainButtonText: {
    color: "#00A996",
    fontSize: 17,
    fontWeight: "600",
  },
  guestButton: {
    marginTop: 16,
    alignItems: "center",
    paddingVertical: 8,
  },
  guestText: {
    color: "#F8F8F8",
    fontSize: 14,
    opacity: 0.85,
  },
});
