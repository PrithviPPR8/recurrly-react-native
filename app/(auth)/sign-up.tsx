import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const SignUp = () => {
  return (
    <View>
      <Text>SignUp</Text>
      <Text>
        Already have an Account?
        <Link href="/(auth)/sign-in">
          <Text className="text-blue-500">Sign In</Text>
        </Link>
      </Text>
    </View>
  );
};

export default SignUp;
