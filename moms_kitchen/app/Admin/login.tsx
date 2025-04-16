import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { adminLogin } from "../../services/adminsApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NodeResponse } from "@/interfaces/interface";

const AdminLogin = ({ navigation }: any) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Check if admin is already logged in
  useLayoutEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const adminData = await AsyncStorage.getItem("adminData");

      if (adminData) {
        // Admin is already logged in, navigate to admin dashboard
        navigation.replace("adminDashboard");
      }
    } catch (error) {
      console.error("Error checking admin auth:", error);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const navigateToMomsPortal = () => {
    navigation.navigate("Dashboard");
  };

  const handleLogin = async () => {
    try {
      // Basic validation
      if (!email.trim() || !password.trim()) {
        ToastAndroid.showWithGravityAndOffset(
          "Please enter both email and password",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        return;
      }

      setIsLoading(true);

      const response: NodeResponse = await adminLogin(email.trim(), password);

      if (response.success) {
        // Store admin data and token in AsyncStorage
        await AsyncStorage.setItem(
          "adminToken",
          response.data.token || "admin-token"
        );
        await AsyncStorage.setItem(
          "adminData",
          JSON.stringify(response.data || {})
        );

        ToastAndroid.showWithGravityAndOffset(
          response.message || "Login successful",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );

        // Navigate to admin dashboard
        navigation.replace("adminDashboard");
      } else {
        ToastAndroid.showWithGravityAndOffset(
          response.message || "Invalid credentials",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message || "An error occurred",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      console.log(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <View className="flex-1 justify-center items-center bg-primary-bg">
        <ActivityIndicator size="large" color="#1672EC" />
        <Text className="text-text-primary mt-4">Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar className="bg-primary" />
      <SafeAreaView className="flex-1 bg-primary-bg">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="p-6 flex-1 justify-center">
            <View className="items-center mb-8">
              <View className="w-24 h-24 bg-primary rounded-full items-center justify-center mb-4">
                <Ionicons name="shield" size={60} color="white" />
              </View>
              <Text className="text-text-primary font-bold text-2xl">
                Admin Login
              </Text>
              <Text className="text-text-secondary text-center mt-2">
                Enter your credentials to access the admin dashboard
              </Text>
            </View>

            <View className="bg-white rounded-xl p-5 shadow-md border border-accent">
              <View className="mb-4">
                <Text className="text-text-secondary mb-1">Email</Text>
                <View className="flex-row items-center bg-light rounded-lg px-3 py-2">
                  <Ionicons name="mail-outline" size={20} color="#7C84A3" />
                  <TextInput
                    className="flex-1 ml-2 text-text-primary"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-text-secondary mb-1">Password</Text>
                <View className="flex-row items-center bg-light rounded-lg px-3 py-2">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#7C84A3"
                  />
                  <TextInput
                    className="flex-1 ml-2 text-text-primary"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    <Ionicons
                      name={
                        isPasswordVisible ? "eye-off-outline" : "eye-outline"
                      }
                      size={20}
                      color="#7C84A3"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                className={`rounded-lg py-3 items-center justify-center ${
                  isLoading ? "bg-primary opacity-70" : "bg-primary"
                }`}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-bold">Login</Text>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="bg-accent rounded-xl p-4 mt-4 shadow-md border border-accent mb-3 flex-row justify-center items-center"
              onPress={navigateToMomsPortal}
            >
              <Ionicons name="heart-outline" size={24} color="#1672EC" />
              <Text className="text-primary font-bold text-lg ml-3">
                Mom's Portal
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default AdminLogin;
