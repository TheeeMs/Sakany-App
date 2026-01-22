import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Modal,
  Animated,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_HEIGHT = 50;

interface DateTimeInputProps {
  date: Date | null;
  time: Date | null;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: Date) => void;
}

// Custom Wheel Picker Component
const WheelPicker = ({
  items,
  selectedIndex,
  onSelect,
  width = 80,
}: {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  width?: number;
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    if (index >= 0 && index < items.length && index !== selectedIndex) {
      onSelect(index);
    }
  };

  React.useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: selectedIndex * ITEM_HEIGHT,
        animated: false,
      });
    }, 100);
  }, []);

  return (
    <View
      style={{ width, height: ITEM_HEIGHT * 3 }}
      className="overflow-hidden"
    >
      {/* Highlight Bar */}
      <View
        className="absolute left-0 right-0 bg-[#0D9488]/10 rounded-xl"
        style={{ top: ITEM_HEIGHT, height: ITEM_HEIGHT }}
        pointerEvents="none"
      />

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              onSelect(index);
              scrollViewRef.current?.scrollTo({
                y: index * ITEM_HEIGHT,
                animated: true,
              });
            }}
            style={{ height: ITEM_HEIGHT }}
            className="items-center justify-center"
          >
            <Text
              className={`text-lg ${
                index === selectedIndex
                  ? "text-[#0D9488] font-bold text-xl"
                  : "text-gray-400"
              }`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export function DateTimeInput({
  date,
  time,
  onDateChange,
  onTimeChange,
}: DateTimeInputProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [tempTime, setTempTime] = useState<Date>(new Date());
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Date picker state
  const [selectedDay, setSelectedDay] = useState(new Date().getDate() - 1);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(0);

  // Time picker state
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState(0); // 0 = AM, 1 = PM

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const shortMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => String(currentYear + i));
  const days = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );
  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0"),
  );
  const periods = ["AM", "PM"];

  // Animate modal
  const animateIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const animateOut = (callback: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(callback);
  };

  // Format date for display
  const formatDate = (date: Date | null): string => {
    if (!date) return "Select Date";
    const day = date.getDate();
    const month = shortMonths[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  // Format time for display
  const formatTime = (time: Date | null): string => {
    if (!time) return "Select Time";
    let hours = time.getHours();
    const minutes = String(time.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  // Open picker
  const openDatePicker = () => {
    const d = date || new Date();
    setTempDate(d);
    setSelectedDay(d.getDate() - 1);
    setSelectedMonth(d.getMonth());
    setSelectedYear(d.getFullYear() - currentYear);
    setShowDatePicker(true);
    animateIn();
  };

  const openTimePicker = () => {
    const t = time || new Date();
    setTempTime(t);
    const h = t.getHours();
    setSelectedHour((h % 12 || 12) - 1);
    setSelectedMinute(t.getMinutes());
    setSelectedPeriod(h >= 12 ? 1 : 0);
    setShowTimePicker(true);
    animateIn();
  };

  // Close picker
  const closeDatePicker = () => {
    animateOut(() => setShowDatePicker(false));
  };

  const closeTimePicker = () => {
    animateOut(() => setShowTimePicker(false));
  };

  // Confirm selection
  const confirmDate = () => {
    const newDate = new Date(
      currentYear + selectedYear,
      selectedMonth,
      selectedDay + 1,
    );
    onDateChange(newDate);
    closeDatePicker();
  };

  const confirmTime = () => {
    const newTime = new Date();
    let hour = selectedHour + 1;
    if (selectedPeriod === 1) {
      hour = hour === 12 ? 12 : hour + 12;
    } else {
      hour = hour === 12 ? 0 : hour;
    }
    newTime.setHours(hour, selectedMinute, 0);
    onTimeChange(newTime);
    closeTimePicker();
  };

  // Quick select for date
  const quickSelectDate = (days: number) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + days);
    setSelectedDay(newDate.getDate() - 1);
    setSelectedMonth(newDate.getMonth());
    setSelectedYear(newDate.getFullYear() - currentYear);
  };

  // Quick select for time
  const quickSelectTime = (hour: number, minute: number) => {
    const isPM = hour >= 12;
    const displayHour = hour % 12 || 12;
    setSelectedHour(displayHour - 1);
    setSelectedMinute(minute);
    setSelectedPeriod(isPM ? 1 : 0);
  };

  // Get current selected date string for display
  const getCurrentDateString = () => {
    return `${shortMonths[selectedMonth]} ${selectedDay + 1}, ${currentYear + selectedYear}`;
  };

  // Get current selected time string for display
  const getCurrentTimeString = () => {
    return `${hours[selectedHour]}:${minutes[selectedMinute]} ${periods[selectedPeriod]}`;
  };

  // Render Custom Modal Picker
  const renderDatePickerModal = () => (
    <Modal visible={showDatePicker} transparent animationType="none">
      <Animated.View
        style={{ opacity: fadeAnim, flex: 1 }}
        className="justify-end bg-black/50"
      >
        <Pressable className="flex-1" onPress={closeDatePicker} />

        <View
          className="bg-white rounded-t-3xl overflow-hidden"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 20,
          }}
        >
          {/* Header with Gradient */}
          <LinearGradient
            colors={["#0D9488", "#14B8A6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="px-5 py-4"
          >
            <View className="flex-row justify-between items-center">
              <TouchableOpacity
                onPress={closeDatePicker}
                className="bg-white/20 px-4 py-2 rounded-full"
              >
                <Text className="text-white text-sm font-medium">Cancel</Text>
              </TouchableOpacity>

              <View className="flex-row items-center">
                <Ionicons name="calendar" size={20} color="white" />
                <Text className="text-white font-bold text-base ml-2">
                  Select Date
                </Text>
              </View>

              <TouchableOpacity
                onPress={confirmDate}
                className="bg-white px-4 py-2 rounded-full"
              >
                <Text className="text-[#0D9488] font-bold text-sm">Done</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Selected Value Display */}
          <View className="items-center py-4 border-b border-gray-100">
            <Text className="text-gray-400 text-sm mb-1">Selected</Text>
            <Text className="text-2xl font-bold text-gray-800">
              {getCurrentDateString()}
            </Text>
          </View>

          {/* Custom Wheel Picker */}
          <View className="flex-row justify-center items-center py-4 bg-gray-50">
            <WheelPicker
              items={shortMonths}
              selectedIndex={selectedMonth}
              onSelect={setSelectedMonth}
              width={90}
            />
            <WheelPicker
              items={days}
              selectedIndex={selectedDay}
              onSelect={setSelectedDay}
              width={60}
            />
            <WheelPicker
              items={years}
              selectedIndex={selectedYear}
              onSelect={setSelectedYear}
              width={80}
            />
          </View>

          {/* Quick Actions */}
          <View className="flex-row justify-around px-4 py-3 bg-white border-t border-gray-100">
            {[
              { label: "Today", days: 0 },
              { label: "Tomorrow", days: 1 },
              { label: "In a Week", days: 7 },
            ].map((preset) => (
              <TouchableOpacity
                key={preset.label}
                onPress={() => quickSelectDate(preset.days)}
                className="bg-[#0D9488]/10 px-4 py-2 rounded-full"
              >
                <Text className="text-[#0D9488] font-medium text-sm">
                  {preset.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="h-8 bg-white" />
        </View>
      </Animated.View>
    </Modal>
  );

  const renderTimePickerModal = () => (
    <Modal visible={showTimePicker} transparent animationType="none">
      <Animated.View
        style={{ opacity: fadeAnim, flex: 1 }}
        className="justify-end bg-black/50"
      >
        <Pressable className="flex-1" onPress={closeTimePicker} />

        <View
          className="bg-white rounded-t-3xl overflow-hidden"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 20,
          }}
        >
          {/* Header with Gradient */}
          <LinearGradient
            colors={["#6366F1", "#8B5CF6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="px-5 py-4"
          >
            <View className="flex-row justify-between items-center">
              <TouchableOpacity
                onPress={closeTimePicker}
                className="bg-white/20 px-4 py-2 rounded-full"
              >
                <Text className="text-white text-sm font-medium">Cancel</Text>
              </TouchableOpacity>

              <View className="flex-row items-center">
                <Ionicons name="time" size={20} color="white" />
                <Text className="text-white font-bold text-base ml-2">
                  Select Time
                </Text>
              </View>

              <TouchableOpacity
                onPress={confirmTime}
                className="bg-white px-4 py-2 rounded-full"
              >
                <Text className="text-[#6366F1] font-bold text-sm">Done</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Selected Value Display */}
          <View className="items-center py-4 border-b border-gray-100">
            <Text className="text-gray-400 text-sm mb-1">Selected</Text>
            <Text className="text-2xl font-bold text-gray-800">
              {getCurrentTimeString()}
            </Text>
          </View>

          {/* Custom Wheel Picker */}
          <View className="flex-row justify-center items-center py-4 bg-gray-50">
            <WheelPicker
              items={hours}
              selectedIndex={selectedHour}
              onSelect={setSelectedHour}
              width={70}
            />
            <Text className="text-2xl font-bold text-gray-800 mx-2">:</Text>
            <WheelPicker
              items={minutes}
              selectedIndex={selectedMinute}
              onSelect={setSelectedMinute}
              width={70}
            />
            <View className="ml-4">
              <WheelPicker
                items={periods}
                selectedIndex={selectedPeriod}
                onSelect={setSelectedPeriod}
                width={60}
              />
            </View>
          </View>

          {/* Quick Actions */}
          <View className="flex-row justify-around px-4 py-3 bg-white border-t border-gray-100">
            {[
              { label: "Morning", hour: 9, min: 0 },
              { label: "Noon", hour: 12, min: 0 },
              { label: "Evening", hour: 18, min: 0 },
            ].map((preset) => (
              <TouchableOpacity
                key={preset.label}
                onPress={() => quickSelectTime(preset.hour, preset.min)}
                className="bg-[#6366F1]/10 px-4 py-2 rounded-full"
              >
                <Text className="text-[#6366F1] font-medium text-sm">
                  {preset.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="h-8 bg-white" />
        </View>
      </Animated.View>
    </Modal>
  );

  return (
    <View className="flex-row">
      {/* Date Input */}
      <TouchableOpacity
        onPress={openDatePicker}
        className="flex-1 mr-2 overflow-hidden rounded-2xl"
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={date ? ["#0D9488", "#14B8A6"] : ["#F9FAFB", "#F3F4F6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-row items-center px-4 py-4"
          style={{
            shadowColor: date ? "#0D9488" : "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: date ? 0.3 : 0.05,
            shadowRadius: 8,
            elevation: date ? 4 : 2,
          }}
        >
          <View
            className={`w-10 h-10 rounded-xl items-center justify-center ${
              date ? "bg-white/20" : "bg-white"
            }`}
            style={
              !date
                ? {
                    shadowColor: "#0D9488",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }
                : undefined
            }
          >
            <Ionicons
              name="calendar"
              size={20}
              color={date ? "#FFFFFF" : "#0D9488"}
            />
          </View>
          <View className="ml-3 flex-1">
            <Text
              className={`text-xs ${date ? "text-white/70" : "text-gray-400"}`}
            >
              Date
            </Text>
            <Text
              className={`text-sm font-semibold ${
                date ? "text-white" : "text-gray-600"
              }`}
              numberOfLines={1}
            >
              {formatDate(date)}
            </Text>
          </View>
          <Ionicons
            name="chevron-down"
            size={16}
            color={date ? "#FFFFFF" : "#9CA3AF"}
          />
        </LinearGradient>
      </TouchableOpacity>

      {/* Time Input */}
      <TouchableOpacity
        onPress={openTimePicker}
        className="flex-1 overflow-hidden rounded-2xl"
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={time ? ["#6366F1", "#8B5CF6"] : ["#F9FAFB", "#F3F4F6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-row items-center px-4 py-4"
          style={{
            shadowColor: time ? "#6366F1" : "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: time ? 0.3 : 0.05,
            shadowRadius: 8,
            elevation: time ? 4 : 2,
          }}
        >
          <View
            className={`w-10 h-10 rounded-xl items-center justify-center ${
              time ? "bg-white/20" : "bg-white"
            }`}
            style={
              !time
                ? {
                    shadowColor: "#6366F1",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }
                : undefined
            }
          >
            <Ionicons
              name="time"
              size={20}
              color={time ? "#FFFFFF" : "#6366F1"}
            />
          </View>
          <View className="ml-3 flex-1">
            <Text
              className={`text-xs ${time ? "text-white/70" : "text-gray-400"}`}
            >
              Time
            </Text>
            <Text
              className={`text-sm font-semibold ${
                time ? "text-white" : "text-gray-600"
              }`}
              numberOfLines={1}
            >
              {formatTime(time)}
            </Text>
          </View>
          <Ionicons
            name="chevron-down"
            size={16}
            color={time ? "#FFFFFF" : "#9CA3AF"}
          />
        </LinearGradient>
      </TouchableOpacity>

      {/* Date Picker Modal */}
      {renderDatePickerModal()}

      {/* Time Picker Modal */}
      {renderTimePickerModal()}
    </View>
  );
}
