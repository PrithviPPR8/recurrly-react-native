import { useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const isVerifying =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address");
  const isBusy = fetchStatus === "fetching";
  const canSubmit =
    !isBusy && emailAddress.trim().length > 0 && password.length >= 8;
  const canVerify = !isBusy && code.trim().length > 0;

  const finalizeSignUp = async () => {
    await signUp.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          return;
        }

        const url = decorateUrl("/(tabs)");
        return router.replace(url as Href);
      },
    });
  };

  const handleSubmit = async () => {
    setFormError(null);

    if (!EMAIL_REGEX.test(emailAddress.trim())) {
      setFormError("Enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    const { error } = await signUp.password({
      emailAddress: emailAddress.trim(),
      password,
    });

    if (error) {
      setFormError(
        error.longMessage ?? error.message ?? "Unable to create your account.",
      );
      return;
    }

    if (signUp.status === "complete") {
      await finalizeSignUp();
      return;
    }

    if (isVerifying) {
      await signUp.verifications.sendEmailCode();
      return;
    }

    setFormError("Check your inbox for a verification code.");
  };

  const handleVerify = async () => {
    if (!code.trim()) {
      setFormError("Enter the verification code.");
      return;
    }

    setFormError(null);

    await signUp.verifications.verifyEmailCode({ code: code.trim() });

    if (signUp.status === "complete") {
      await finalizeSignUp();
      return;
    }

    setFormError("That code didn’t work. Please try again.");
  };

  const handleReset = async () => {
    setFormError(null);
    setCode("");
    await signUp.reset();
  };

  const emailError = errors.fields.emailAddress?.message;
  const passwordError = errors.fields.password?.message;
  const codeError = errors.fields.code?.message;

  return (
    <SafeAreaView className="flex-1 bg-background px-5 py-6">
      <View className="mt-8 rounded-4xl bg-card p-6 shadow-lg shadow-black/5">
        <View className="mb-6 items-center">
          <View className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-accent">
            <Text className="text-3xl font-sans-bold text-white">R</Text>
          </View>
          <Text className="text-3xl font-sans-bold text-primary">
            Create an account
          </Text>
          <Text className="mt-2 text-center text-base font-sans-medium text-muted-foreground">
            Secure your subscription dashboard with a fast, modern sign-up
            experience.
          </Text>
        </View>

        {isVerifying ? (
          <>
            <Text className="mb-1 text-sm font-sans-semibold text-primary">
              Email verification
            </Text>
            <TextInput
              className="mb-3 rounded-3xl border border-border bg-background px-4 py-4 text-base text-primary"
              value={code}
              placeholder="Enter verification code"
              placeholderTextColor="#8A8A8A"
              onChangeText={setCode}
              keyboardType="numeric"
            />
            {(codeError || formError) && (
              <Text className="mb-3 text-sm text-destructive">
                {codeError ?? formError}
              </Text>
            )}
            <Pressable
              className={`mb-3 rounded-full bg-primary px-5 py-4 items-center ${
                !canVerify ? "opacity-50" : ""
              }`}
              onPress={handleVerify}
              disabled={!canVerify}
            >
              {isBusy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-base font-sans-semibold text-white">
                  Verify code
                </Text>
              )}
            </Pressable>
            <Pressable
              className="items-center"
              onPress={() => signUp.verifications.sendEmailCode()}
            >
              <Text className="text-sm font-sans-semibold text-accent">
                Resend code
              </Text>
            </Pressable>
            <Pressable className="mt-4 items-center" onPress={handleReset}>
              <Text className="text-sm font-sans-semibold text-muted-foreground">
                Start over
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text className="mb-1 text-sm font-sans-semibold text-primary">
              Email address
            </Text>
            <TextInput
              className="mb-3 rounded-3xl border border-border bg-background px-4 py-4 text-base text-primary"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Enter your email"
              placeholderTextColor="#8A8A8A"
              value={emailAddress}
              onChangeText={setEmailAddress}
            />
            {emailError && (
              <Text className="mb-3 text-sm text-destructive">
                {emailError}
              </Text>
            )}

            <Text className="mb-1 text-sm font-sans-semibold text-primary">
              Password
            </Text>
            <TextInput
              className="mb-3 rounded-3xl border border-border bg-background px-4 py-4 text-base text-primary"
              secureTextEntry
              placeholder="Create a password"
              placeholderTextColor="#8A8A8A"
              value={password}
              onChangeText={setPassword}
            />
            {passwordError && (
              <Text className="mb-3 text-sm text-destructive">
                {passwordError}
              </Text>
            )}
            {formError && !emailError && !passwordError && (
              <Text className="mb-3 text-sm text-destructive">{formError}</Text>
            )}

            <Pressable
              className={`mb-3 rounded-full bg-primary px-5 py-4 items-center ${
                !canSubmit ? "opacity-50" : ""
              }`}
              onPress={handleSubmit}
              disabled={!canSubmit}
            >
              {isBusy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-base font-sans-semibold text-white">
                  Create account
                </Text>
              )}
            </Pressable>
          </>
        )}

        <View className="mt-6 flex-row justify-center gap-1">
          <Text className="text-sm text-muted-foreground">
            Already have an account?
          </Text>
          <Link href="/(auth)/sign-in">
            <Text className="text-sm font-sans-semibold text-accent">
              Sign in
            </Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
