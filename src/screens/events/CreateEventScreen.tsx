import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";
import { createEvent } from "../../services/events";

type DurationUnit = "Hour" | "Day";

const EVENT_CATEGORIES = [
  "COMMUNITY",
  "SPORTS",
  "EDUCATION",
  "ENTERTAINMENT",
  "OTHER",
] as const;

function parseDateAndTime(dateValue: string, timeValue: string) {
  const dateParts = dateValue.trim().split("-");
  if (dateParts.length !== 3) {
    return null;
  }

  const [dayText, monthText, yearText] = dateParts;
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);

  const timeParts = timeValue.trim().split(":");
  if (timeParts.length !== 2) {
    return null;
  }

  const [hourText, minuteText] = timeParts;
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year) ||
    !Number.isInteger(hour) ||
    !Number.isInteger(minute)
  ) {
    return null;
  }

  if (month < 1 || month > 12 || day < 1 || day > 31 || hour < 0 || hour > 23) {
    return null;
  }

  if (minute < 0 || minute > 59) {
    return null;
  }

  const date = new Date(year, month - 1, day, hour, minute, 0, 0);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function buildEventDateWindow(
  startDateTime: Date | null,
  durationValue: string,
  durationUnit: DurationUnit,
) {
  if (!startDateTime || Number.isNaN(startDateTime.getTime())) {
    return null;
  }

  const duration = Number(durationValue);
  if (!Number.isFinite(duration) || duration <= 0) {
    return null;
  }

  const start = new Date(startDateTime);
  start.setSeconds(0, 0);

  const durationMs =
    durationUnit === "Hour" ? duration * 3600000 : duration * 86400000;
  const end = new Date(start.getTime() + durationMs);

  if (end.getTime() <= start.getTime()) {
    return null;
  }

  return {
    start,
    end,
    startIso: start.toISOString(),
    endIso: end.toISOString(),
  };
}

export default function CreateEventScreen() {
  const navigation = useNavigation();
  const currentUser = useAuthStore((state) => state.user);

  const [durationUnit, setDurationUnit] = useState<DurationUnit>("Hour");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "OTHER",
    description: "",
    durationValue: "",
    price: "0",
    location: "",
    contact: "",
    imageUrl: "",
  });

  const eventWindow = useMemo(
    () =>
      buildEventDateWindow(startDateTime, formData.durationValue, durationUnit),
    [startDateTime, formData.durationValue, durationUnit],
  );

  const selectedDateText = useMemo(() => {
    if (!startDateTime) {
      return "DD-MM-YYYY";
    }

    return startDateTime.toLocaleDateString("en-GB");
  }, [startDateTime]);

  const selectedTimeText = useMemo(() => {
    if (!startDateTime) {
      return "00:00";
    }

    return startDateTime.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }, [startDateTime]);

  const openPicker = (mode: "date" | "time") => {
    setPickerMode(mode);
    setIsPickerVisible(true);
  };

  const handlePickerChange = (
    event: DateTimePickerEvent,
    selectedValue?: Date,
  ) => {
    if (Platform.OS === "android") {
      setIsPickerVisible(false);
    }

    if (event.type === "dismissed" || !selectedValue) {
      return;
    }

    setStartDateTime((prev) => {
      const base = prev ? new Date(prev) : new Date();

      if (pickerMode === "date") {
        base.setFullYear(
          selectedValue.getFullYear(),
          selectedValue.getMonth(),
          selectedValue.getDate(),
        );
      } else {
        base.setHours(
          selectedValue.getHours(),
          selectedValue.getMinutes(),
          0,
          0,
        );
      }

      return base;
    });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    const title = formData.title.trim();
    const description = formData.description.trim();
    const location = formData.location.trim();
    const contactPhone = formData.contact.trim();
    const normalizedPriceInput = formData.price.trim().replace(",", ".");
    const priceValue =
      normalizedPriceInput.length === 0 ? 0 : Number(normalizedPriceInput);
    const eventStart = eventWindow?.start;
    const eventEnd = eventWindow?.end;

    if (!title || !description || !location || !contactPhone) {
      Alert.alert("Validation", "Please fill all required fields.");
      return;
    }

    if (!startDateTime) {
      Alert.alert("Validation", "Please choose event start date and time.");
      return;
    }

    if (!eventStart || !eventEnd) {
      Alert.alert(
        "Validation",
        "Duration is required and end time must be after start time.",
      );
      return;
    }

    if (!Number.isFinite(priceValue) || priceValue < 0) {
      Alert.alert(
        "Validation",
        "Price must be a valid number greater than or equal to 0.",
      );
      return;
    }

    if (eventStart.getTime() < Date.now()) {
      Alert.alert("Validation", "Event start time cannot be in the past.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createEvent({
        organizerId: currentUser?.id,
        title,
        description,
        location,
        startDate: eventWindow.startIso,
        endDate: eventWindow.endIso,
        price: priceValue,
        imageUrl: formData.imageUrl.trim() || undefined,
        hostName:
          `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() ||
          "Sakany Resident",
        category: formData.category,
        hostRole: currentUser?.role || "RESIDENT",
        contactPhone,
        recurringEvent: false,
      });

      Alert.alert("Success", "Event submitted successfully.", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch {
      Alert.alert("Error", "Failed to submit event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddLocation = () => {
    console.log("Add location");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="relative flex-row items-center justify-center px-4 py-3 border-b border-gray-100">
        <TouchableOpacity
          onPress={handleGoBack}
          className="absolute left-4 w-10 h-10 items-center justify-center z-10"
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">
          Create New Event
        </Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Event Title */}
          <View className="px-6 mb-6 mt-4">
            <Text className="text-[17px] font-semibold text-[#1A1A1A] mb-2">
              Event Title
            </Text>
            <TextInput
              className="w-full h-14 px-4 bg-white border border-gray-200 rounded-xl text-base text-gray-900"
              placeholder="AI & Future of Work Summit 2026"
              placeholderTextColor="#9CA3AF"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />
          </View>

          {/* Event Category */}
          <View className="px-6 mb-6">
            <Text className="text-[17px] font-semibold text-[#1A1A1A] mb-2">
              Event Category
            </Text>
            <TouchableOpacity
              className="w-full h-14 px-4 bg-white border border-gray-200 rounded-xl flex-row items-center justify-between"
              onPress={() => setIsCategoryOpen((prev) => !prev)}
              activeOpacity={0.8}
            >
              <Text className="text-base text-gray-900">
                {formData.category}
              </Text>
              <Ionicons
                name={isCategoryOpen ? "chevron-up" : "chevron-down"}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
            {isCategoryOpen ? (
              <View className="mt-2 flex-row flex-wrap gap-2">
                {EVENT_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    className={`px-3 py-2 rounded-full border ${
                      formData.category === category
                        ? "bg-[#E7F7F7] border-[#00A996]"
                        : "bg-white border-gray-200"
                    }`}
                    onPress={() => {
                      setFormData({ ...formData, category });
                      setIsCategoryOpen(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      className={`text-sm ${
                        formData.category === category
                          ? "text-[#00A996] font-semibold"
                          : "text-gray-600"
                      }`}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
          </View>

          {/* Event Description */}
          <View className="px-6 mb-6">
            <Text className="text-[17px] font-semibold text-[#1A1A1A] mb-2">
              Event Description
            </Text>
            <TextInput
              className="w-full h-32 px-4 py-3 bg-white border border-gray-200 rounded-xl text-base text-gray-900"
              placeholder="Write a few lines about your event..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
            />
          </View>

          {/* Date & Time */}
          <View className="flex-row px-6 mb-6">
            <View className="flex-1 mr-2">
              <Text className="text-[17px] font-semibold text-[#1A1A1A] mb-2">
                Date
              </Text>
              <TouchableOpacity
                onPress={() => openPicker("date")}
                activeOpacity={0.8}
                className="w-full h-14 px-4 bg-white border border-gray-200 rounded-xl flex-row items-center"
              >
                <Text
                  className={`flex-1 text-base ${
                    startDateTime ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {selectedDateText}
                </Text>
                <Ionicons name="calendar-outline" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <View className="flex-1 ml-2">
              <Text className="text-[17px] font-semibold text-[#1A1A1A] mb-2">
                Time
              </Text>
              <TouchableOpacity
                onPress={() => openPicker("time")}
                activeOpacity={0.8}
                className="w-full h-14 px-4 bg-white border border-gray-200 rounded-xl flex-row items-center"
              >
                <Text
                  className={`flex-1 text-base ${
                    startDateTime ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {selectedTimeText}
                </Text>
                <Ionicons name="time-outline" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Duration */}
          <View className="px-6 mb-6">
            <Text className="text-[17px] font-semibold text-[#1A1A1A] mb-2">
              Duration
            </Text>
            <View className="w-full h-14 border border-gray-200 rounded-xl flex-row items-center overflow-hidden">
              {/* Number Selector */}
              <View className="flex-1 px-4 flex-row items-center justify-between">
                <TextInput
                  className="flex-1 text-base text-gray-900"
                  placeholder="Choose Number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  value={formData.durationValue}
                  onChangeText={(text) =>
                    setFormData({ ...formData, durationValue: text })
                  }
                />
              </View>

              {/* Divider */}
              <View className="w-[1px] h-9 bg-gray-200" />

              {/* Hour/Day Toggle */}
              <View className="p-1.5 bg-gray-50 m-1 rounded-[10px] flex-row">
                <TouchableOpacity
                  onPress={() => setDurationUnit("Hour")}
                  className={`px-4 py-2 rounded-lg ${
                    durationUnit === "Hour" ? "bg-[#00a693]" : "bg-transparent"
                  }`}
                >
                  <Text
                    className={`text-[15px] font-medium ${
                      durationUnit === "Hour" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    Hour
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setDurationUnit("Day")}
                  className={`px-4 py-2 rounded-lg ${
                    durationUnit === "Day" ? "bg-[#00a693]" : "bg-transparent"
                  }`}
                >
                  <Text
                    className={`text-[15px] font-medium ${
                      durationUnit === "Day" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    Day
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {eventWindow ? (
              <View className="mt-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-3">
                <Text className="text-xs text-gray-500 mb-1">Start (ISO)</Text>
                <Text className="text-xs text-[#111827] mb-2">
                  {eventWindow.startIso}
                </Text>
                <Text className="text-xs text-gray-500 mb-1">End (ISO)</Text>
                <Text className="text-xs text-[#111827]">
                  {eventWindow.endIso}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Price */}
          <View className="px-6 mb-6">
            <Text className="text-[17px] font-semibold text-[#1A1A1A] mb-2">
              Price
            </Text>
            <View className="w-full h-14 px-4 bg-white border border-gray-200 rounded-xl flex-row items-center">
              <Text className="text-base text-gray-500 mr-2">EGP</Text>
              <TextInput
                className="flex-1 text-base text-gray-900"
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                value={formData.price}
                onChangeText={(text) =>
                  setFormData({ ...formData, price: text })
                }
              />
            </View>
            <Text className="text-xs text-gray-400 mt-1">
              Set 0 for free events.
            </Text>
          </View>

          {/* Location */}
          <View className="px-6 mb-6">
            <Text className="text-[17px] font-semibold text-[#1A1A1A] mb-2">
              Location
            </Text>
            <View className="w-full h-14 px-4 bg-white border border-gray-200 rounded-xl flex-row items-center">
              <TextInput
                className="flex-1 text-base text-gray-400"
                value={formData.location}
                onChangeText={(text) =>
                  setFormData({ ...formData, location: text })
                }
              />
              <TouchableOpacity onPress={handleAddLocation}>
                <Text className="text-[#00a693] font-semibold text-[15px]">
                  Add Location
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Contact Number */}
          <View className="px-6 mb-6">
            <Text className="text-[17px] font-semibold text-[#1A1A1A] mb-2">
              Contact Number
            </Text>
            <View className="w-full h-14 px-4 bg-white border border-gray-200 rounded-xl flex-row items-center">
              {/* Country Flag & Code */}
              <View className="flex-row items-center mr-3">
                <View className="w-8 h-5 rounded-sm overflow-hidden mr-2">
                  <View className="flex-1 bg-red-600" />
                  <View className="flex-1 bg-white items-center justify-center">
                    <View className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
                  </View>
                  <View className="flex-1 bg-black" />
                </View>
                <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
              </View>

              <Text className="text-base text-gray-900 font-medium mr-2">
                +20
              </Text>

              <TextInput
                className="flex-1 text-base text-gray-900"
                placeholder="123 456 7890"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={formData.contact}
                onChangeText={(text) =>
                  setFormData({ ...formData, contact: text })
                }
              />
            </View>
          </View>

          {/* Event Cover Image */}
          <View className="px-6 mb-6">
            <Text className="text-[17px] font-semibold text-[#1A1A1A] mb-2">
              Event Cover Image{" "}
              <Text className="text-gray-400 font-normal">(Optional)</Text>
            </Text>
            <TextInput
              className="w-full h-14 px-4 bg-white border border-gray-200 rounded-xl text-base text-gray-900"
              placeholder="Paste image URL"
              placeholderTextColor="#9CA3AF"
              value={formData.imageUrl}
              onChangeText={(text) =>
                setFormData({ ...formData, imageUrl: text })
              }
            />
          </View>

          {/* Bottom Spacing for Fixed Button */}
          <View className="h-32" />
        </ScrollView>
      </KeyboardAvoidingView>

      {isPickerVisible ? (
        <View className="bg-white border-t border-gray-200">
          <View className="px-4 py-2 flex-row items-center justify-between">
            <Text className="text-sm text-gray-600">
              Select {pickerMode === "date" ? "Date" : "Time"}
            </Text>
            <TouchableOpacity onPress={() => setIsPickerVisible(false)}>
              <Text className="text-sm font-semibold text-[#00A996]">Done</Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={startDateTime || new Date()}
            mode={pickerMode}
            is24Hour
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handlePickerChange}
          />
        </View>
      ) : null}

      {/* Fixed Bottom Button */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 pt-4 pb-8"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 8,
        }}
      >
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.9}
          className="w-full h-14 bg-[#00a693] rounded-2xl items-center justify-center"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white font-bold text-lg">Submit Event</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
