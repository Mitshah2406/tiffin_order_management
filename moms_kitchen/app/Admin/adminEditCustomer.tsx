import React, { useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Customer } from "@/interfaces/interface";
import Helper from "@/utils/helpers";
import { updateCustomerAdmin } from "../../services/adminsApi";
import LoadingButton from "@/components/loadingBtn";

const AdminEditCustomerScreen = ({ navigation, route }: any) => {
  const { customer } = route.params;

  const [customerName, setCustomerName] = useState<string>(customer.name);
  const [customerMobile, setCustomerMobile] = useState<string>(
    customer.mobileNumber.toString()
  );
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const handleUpdateCustomer = async () => {
    try {
      setIsUpdating(true);

      if (
        customerName.trim() === "" ||
        !Helper.mobileNumberRegex.test(customerMobile.toString())
      ) {
        ToastAndroid.showWithGravityAndOffset(
          "Please enter a valid name and mobile number",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        setIsUpdating(false);
        return;
      }

      const response = await updateCustomerAdmin(
        customer.id,
        customerName.trim(),
        customerMobile
      );

      if (response.success) {
        ToastAndroid.showWithGravityAndOffset(
          response.message || "Customer updated successfully",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        navigation.navigate("adminCustomers");
      } else {
        ToastAndroid.showWithGravityAndOffset(
          response.message || "Failed to update customer",
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
      setIsUpdating(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1 bg-primary-bg">
        <View className="bg-primary px-4 py-4 shadow-md">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <TouchableOpacity
                className="mr-3"
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-white text-xl font-bold">
                Edit Customer
              </Text>
            </View>
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 p-4"
        >
          <View className="bg-white rounded-xl p-5 shadow-md border border-accent mb-5">
            <View className="items-center mb-4">
              <View className="w-16 h-16 bg-accent rounded-full items-center justify-center mb-2">
                <Ionicons name="person-outline" size={30} color="#1672EC" />
              </View>
              <Text className="text-text-primary font-bold text-xl">
                Update Customer
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-text-secondary mb-1">Name</Text>
              <TextInput
                className="bg-light rounded-lg p-3 text-text-primary"
                placeholder="Customer name"
                value={customerName}
                onChangeText={setCustomerName}
              />
            </View>

            <View className="mb-5">
              <Text className="text-text-secondary mb-1">Mobile Number</Text>
              <TextInput
                className="bg-light rounded-lg p-3 text-text-primary"
                placeholder="Mobile number"
                value={customerMobile}
                onChangeText={setCustomerMobile}
                keyboardType="phone-pad"
              />
            </View>

            <View className="flex-row justify-between">
              <TouchableOpacity
                className="flex-1 bg-light rounded-lg py-3 mr-2"
                onPress={() => navigation.goBack()}
                disabled={isUpdating}
              >
                <Text className="text-text-secondary font-medium text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
              <LoadingButton
                onPress={handleUpdateCustomer}
                isLoading={isUpdating}
                loadingText="Updating..."
                defaultText="Update Customer"
                disabled={isUpdating}
                className="flex-1 bg-primary rounded-lg py-3 items-center justify-center"
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default AdminEditCustomerScreen;
