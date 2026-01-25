import React from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";

interface IllustrationProps {
  width?: number;
  height?: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Onboarding 1 - Family Scene
export const FamilyIllustration: React.FC<IllustrationProps> = ({
  width = screenWidth,
  height = screenHeight * 0.42,
}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Image
        source={require("../../../assets/image.png")}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

// Onboarding 2 - Maintenance Scene
export const MaintenanceIllustration: React.FC<IllustrationProps> = ({
  width = screenWidth,
  height = screenHeight * 0.42,
}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Image
        source={require("../../../assets/image copy.png")}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

// Onboarding 3 - Payment Scene
export const PaymentIllustration: React.FC<IllustrationProps> = ({
  width = screenWidth,
  height = screenHeight * 0.42,
}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Image
        source={require("../../../assets/image copy 2.png")}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  image: {
    width: "95%",
    height: "100%",
  },
});
