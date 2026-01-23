import { View, Text, StyleSheet } from "react-native";
import { AppBottomNav } from "../../components/navigation";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.title}>About Sakany</Text>
        <Text style={styles.description}>
          Your app for finding the perfect home.
        </Text>
      </View>

      {/* Bottom Navigation */}
      <AppBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
