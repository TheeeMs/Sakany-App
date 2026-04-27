import React, { useEffect, useRef, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AlertVariant = "info" | "success" | "warning" | "danger";

export interface CustomAlertButton {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
}

export interface CustomAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  variant?: AlertVariant;
  buttons?: CustomAlertButton[];
  onDismiss?: () => void;
}

// ─── Variant Config ───────────────────────────────────────────────────────────

const VARIANT_CONFIG: Record<
  AlertVariant,
  { color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  info:    { color: "#0D9488", bg: "#E6F7F6", icon: "information-circle" },
  success: { color: "#10B981", bg: "#D1FAE5", icon: "checkmark-circle"   },
  warning: { color: "#F59E0B", bg: "#FEF3C7", icon: "warning"            },
  danger:  { color: "#EF4444", bg: "#FEE2E2", icon: "close-circle"       },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function CustomAlert({
  visible,
  title,
  message,
  variant = "info",
  buttons = [{ text: "OK" }],
  onDismiss,
}: CustomAlertProps) {
  const translateY = useRef(new Animated.Value(40)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset instantly, then animate in
      translateY.setValue(40);
      opacity.setValue(0);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const cfg = VARIANT_CONFIG[variant];

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onDismiss}>
      {/* Scrim */}
      <TouchableWithoutFeedback onPress={onDismiss}>
        <Animated.View style={[styles.scrim, { opacity }]} />
      </TouchableWithoutFeedback>

      {/* Card */}
      <View style={styles.wrapper} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.card,
            { opacity, transform: [{ translateY }] },
          ]}
        >
          {/* Icon Badge */}
          <View style={[styles.iconWrap, { backgroundColor: cfg.bg }]}>
            <Ionicons name={cfg.icon} size={32} color={cfg.color} />
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          {message ? (
            <Text style={styles.message}>{message}</Text>
          ) : null}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Buttons */}
          <View style={[styles.buttonsRow, buttons.length === 1 && styles.buttonsCenter]}>
            {buttons.map((btn, i) => {
              const isDestructive = btn.style === "destructive";
              const isCancel      = btn.style === "cancel";
              const textColor     = isDestructive ? "#EF4444" : isCancel ? "#6B7280" : cfg.color;
              const bgColor       = isDestructive
                ? "#FEF2F2"
                : isCancel
                ? "#F3F4F6"
                : cfg.bg;

              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    btn.onPress?.();
                    onDismiss?.();
                  }}
                  style={[
                    styles.btn,
                    { backgroundColor: bgColor },
                    i > 0 && { marginLeft: 8 },
                    buttons.length === 1 && styles.btnFull,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.btnText, { color: textColor }]}>
                    {btn.text.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCustomAlert() {
  const [state, setState] = React.useState<{
    visible: boolean;
    title: string;
    message?: string;
    variant?: AlertVariant;
    buttons?: CustomAlertButton[];
  }>({ visible: false, title: "" });

  const show = useCallback(
    (
      title: string,
      message?: string,
      buttons?: CustomAlertButton[],
      variant?: AlertVariant
    ) => {
      setState({ visible: true, title, message, buttons, variant });
    },
    []
  );

  const dismiss = useCallback(() => {
    setState((prev) => ({ ...prev, visible: false }));
  }, []);

  const Component = useCallback(
    () => (
      <CustomAlert
        visible={state.visible}
        title={state.title}
        message={state.message}
        variant={state.variant}
        buttons={state.buttons}
        onDismiss={dismiss}
      />
    ),
    [state, dismiss]
  );

  return { show, dismiss, Component };
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 16,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  message: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 4,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#F3F4F6",
    marginTop: 20,
    marginBottom: 12,
  },
  buttonsRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonsCenter: {
    justifyContent: "center",
  },
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnFull: {
    flex: 1,
    alignItems: "center",
  },
  btnText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
});
