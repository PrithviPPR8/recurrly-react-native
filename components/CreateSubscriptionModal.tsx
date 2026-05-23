import { icons } from "@/constants/icons";
import clsx from "clsx";
import dayjs from "dayjs";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: "#ff6b6b",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#f5c542",
  Productivity: "#a8d5ba",
  Cloud: "#87ceeb",
  Music: "#ffd1dc",
  Other: "#d3d3d3",
};

interface CreateSubscriptionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubscriptionCreate: (subscription: Subscription) => void;
}

const CreateSubscriptionModal: React.FC<CreateSubscriptionModalProps> = ({
  isVisible,
  onClose,
  onSubscriptionCreate,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<"Monthly" | "Yearly">("Monthly");
  const [category, setCategory] = useState("Entertainment");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    const normalizedPrice = price.trim();
    if (!normalizedPrice) {
      newErrors.price = "Price is required";
    } else if (!/^\d+(\.\d{1,2})?$/.test(normalizedPrice)) {
      newErrors.price = "Price must be a valid amount (up to 2 decimals)";
    } else if (Number(normalizedPrice) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const now = dayjs();
    const renewalDate =
      frequency === "Monthly"
        ? now.add(1, "month").toISOString()
        : now.add(1, "year").toISOString();

    const subscription: Subscription = {
      id: `subscription-${Date.now()}`,
      name: name.trim(),
      price: Number(price.trim()),
      category,
      status: "active",
      startDate: now.toISOString(),
      renewalDate,
      icon: icons.wallet,
      billing: frequency,
      color: CATEGORY_COLORS[category],
      currency: "USD",
    };

    onSubscriptionCreate(subscription);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Entertainment");
    setErrors({});
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1">
          <Pressable
            className="modal-overlay"
            onPress={onClose}
            accessible={false}
          />

          <View className="modal-container">
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable className="modal-close" onPress={onClose}>
                <Text className="modal-close-text">×</Text>
              </Pressable>
            </View>

            <ScrollView
              className="modal-body"
              showsVerticalScrollIndicator={false}
              scrollEnabled
            >
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">Name</Text>
                  <TextInput
                    className={clsx(
                      "auth-input",
                      errors.name && "auth-input-error",
                    )}
                    placeholder="e.g., Netflix"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    value={name}
                    onChangeText={setName}
                  />
                  {errors.name && (
                    <Text className="auth-error">{errors.name}</Text>
                  )}
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Price</Text>
                  <TextInput
                    className={clsx(
                      "auth-input",
                      errors.price && "auth-input-error",
                    )}
                    placeholder="e.g., 12.99"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    keyboardType="decimal-pad"
                    value={price}
                    onChangeText={setPrice}
                  />
                  {errors.price && (
                    <Text className="auth-error">{errors.price}</Text>
                  )}
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Frequency</Text>
                  <View className="picker-row">
                    {(["Monthly", "Yearly"] as const).map((freq) => (
                      <Pressable
                        key={freq}
                        className={clsx(
                          "picker-option",
                          frequency === freq && "picker-option-active",
                        )}
                        onPress={() => setFrequency(freq)}
                      >
                        <Text
                          className={clsx(
                            "picker-option-text",
                            frequency === freq && "picker-option-text-active",
                          )}
                        >
                          {freq}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Category</Text>
                  <View className="category-scroll">
                    {CATEGORIES.map((cat) => (
                      <Pressable
                        key={cat}
                        className={clsx(
                          "category-chip",
                          category === cat && "category-chip-active",
                        )}
                        onPress={() => setCategory(cat)}
                      >
                        <Text
                          className={clsx(
                            "category-chip-text",
                            category === cat && "category-chip-text-active",
                          )}
                        >
                          {cat}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <Pressable
                  className={clsx(
                    "auth-button",
                    (!name.trim() || !price.trim()) && "auth-button-disabled",
                  )}
                  onPress={handleSubmit}
                  disabled={!name.trim() || !price.trim()}
                >
                  <Text className="auth-button-text">Create Subscription</Text>
                </Pressable>
              </View>

              <View className="h-4" />
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateSubscriptionModal;
