import { useClerk, useUser } from "@clerk/expo";
import { styled } from "nativewind";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function Settings() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress;
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName ?? ""}`.trim()
    : (email ?? "Your account");

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="rounded-4xl bg-card p-6 shadow-lg shadow-black/5">
        <Text className="mb-2 text-2xl font-sans-bold text-primary">
          Account
        </Text>
        <Text className="text-sm font-sans-medium text-muted-foreground">
          Signed in as
        </Text>
        <Text className="mt-1 text-base font-sans-semibold text-primary">
          {displayName}
        </Text>
        {email ? (
          <Text className="mt-1 text-sm text-muted-foreground">{email}</Text>
        ) : null}

        <Pressable
          className="mt-8 rounded-full bg-accent px-5 py-4 items-center"
          onPress={() => signOut()}
        >
          <Text className="text-base font-sans-semibold text-white">
            Sign out
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
