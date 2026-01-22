import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform, Modal } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

interface DateTimeInputProps {
  date: Date | null;
  time: Date | null;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: Date) => void;
}

export function DateTimeInput({
  date,
  time,
  onDateChange,
  onTimeChange,
}: DateTimeInputProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Format date for display
  const formatDate = (date: Date | null): string => {
    if (!date) return "mm/dd/yyyy";
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Format time for display
  const formatTime = (time: Date | null): string => {
    if (!time) return "- : - -";
    let hours = time.getHours();
    const minutes = String(time.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  // Handle date change
  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (event.type === "set" && selectedDate) {
      onDateChange(selectedDate);
      if (Platform.OS === "ios") {
        setShowDatePicker(false);
      }
    } else if (event.type === "dismissed") {
      setShowDatePicker(false);
    }
  };

  // Handle time change
  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedTime?: Date,
  ) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
    if (event.type === "set" && selectedTime) {
      onTimeChange(selectedTime);
      if (Platform.OS === "ios") {
        setShowTimePicker(false);
      }
    } else if (event.type === "dismissed") {
      setShowTimePicker(false);
    }
  };

  // Render iOS Modal Picker
  const renderIOSPicker = (
    visible: boolean,
    mode: "date" | "time",
    value: Date,
    onChange: (event: DateTimePickerEvent, date?: Date) => void,
    onClose: () => void,
  ) => (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/30">
        <View className="bg-white rounded-t-3xl">
          {/* Header */}
          <View className="flex-row justify-between items-center px-5 py-4 border-b border-gray-200">
            <TouchableOpacity onPress={onClose}>
              <Text className="text-gray-500 text-base">Cancel</Text>
            </TouchableOpacity>
            <Text className="text-gray-900 font-semibold text-base">
              {mode === "date" ? "Select Date" : "Select Time"}
            </Text>
            <TouchableOpacity
              onPress={() => {
                onChange(
                  {
                    type: "set",
                    nativeEvent: { timestamp: value.getTime(), utcOffset: 0 },
                  },
                  value,
                );
              }}
            >
              <Text className="text-[#0D9488] font-semibold text-base">
                Done
              </Text>
            </TouchableOpacity>
          </View>

          {/* Picker */}
          <DateTimePicker
            value={value}
            mode={mode}
            display="spinner"
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                if (mode === "date") {
                  onDateChange(selectedDate);
                } else {
                  onTimeChange(selectedDate);
                }
              }
            }}
            textColor="#1F2937"
            style={{ height: 200 }}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <View className="flex-row">
      {/* Date Input */}
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        className="flex-1 flex-row items-center border border-gray-200 rounded-xl px-4 py-3 mr-2"
        activeOpacity={0.7}
      >
        <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
        <Text
          className={`ml-3 text-base ${
            date ? "text-gray-700" : "text-gray-400"
          }`}
        >
          {formatDate(date)}
        </Text>
      </TouchableOpacity>

      {/* Time Input */}
      <TouchableOpacity
        onPress={() => setShowTimePicker(true)}
        className="flex-1 flex-row items-center border border-gray-200 rounded-xl px-4 py-3"
        activeOpacity={0.7}
      >
        <Ionicons name="time-outline" size={20} color="#9CA3AF" />
        <Text
          className={`ml-3 text-base ${
            time ? "text-gray-700" : "text-gray-400"
          }`}
        >
          {formatTime(time)}
        </Text>
      </TouchableOpacity>

      {/* Date Picker */}
      {Platform.OS === "ios"
        ? renderIOSPicker(
            showDatePicker,
            "date",
            date || new Date(),
            handleDateChange,
            () => setShowDatePicker(false),
          )
        : showDatePicker && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

      {/* Time Picker */}
      {Platform.OS === "ios"
        ? renderIOSPicker(
            showTimePicker,
            "time",
            time || new Date(),
            handleTimeChange,
            () => setShowTimePicker(false),
          )
        : showTimePicker && (
            <DateTimePicker
              value={time || new Date()}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
    </View>
  );
}
