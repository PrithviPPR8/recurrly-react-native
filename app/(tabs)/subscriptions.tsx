import SubscriptionCard from "@/components/SubscriptionCard";
import { useSubscriptions } from "@/context/SubscriptionContext";
import { styled } from "nativewind";
import React, { useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const StyledTextInput = styled(TextInput);
const StyledView = styled(View);

const Subscriptions = () => {
  const { subscriptions } = useSubscriptions();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCards, setExpandedCards] = useState<string>("");

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(
      (sub) =>
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.plan?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, subscriptions]);

  const toggleExpanded = (id: string) => {
    setExpandedCards(expandedCards === id ? "" : id);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StyledView className="px-5 pt-5 pb-3">
        <Text className="text-2xl font-bold text-text mb-4">Subscriptions</Text>
        <StyledTextInput
          placeholder="Search subscriptions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
          className="bg-card px-4 py-3 rounded-lg text-text"
        />
      </StyledView>

      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StyledView className="px-5 pb-3">
            <SubscriptionCard
              {...item}
              expanded={expandedCards === item.id}
              onPress={() => toggleExpanded(item.id)}
            />
          </StyledView>
        )}
        ListEmptyComponent={
          <StyledView className="flex-1 items-center justify-center py-8">
            <Text className="text-text text-center">
              No subscriptions found
            </Text>
          </StyledView>
        }
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </SafeAreaView>
  );
};

export default Subscriptions;
