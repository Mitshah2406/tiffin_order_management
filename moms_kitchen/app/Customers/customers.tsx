import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Customer, NodeResponse } from "@/interfaces/interface";
import Helper from "@/utils/helpers";
import { createCustomer, getAllCustomers } from "@/services/api";
import useFetch from "@/hooks/useFetch";
import Indicator from "@/components/indicator";
import LoadingButton from "@/components/loadingBtn";

const CustomerScreen = ({ navigation, route }: any) => {
  const {
    data: apiResponse,
    loading: customerLoading,
    error: customerError,
    refetch,
  } = useFetch<NodeResponse>(() => getAllCustomers());

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newCustomerName, setNewCustomerName] = useState<string>("");
  const [newCustomerMobile, setNewCustomerMobile] = useState<string>("");
  const [isAdding, setAdding] = useState<boolean>(false);

  useEffect(() => {
    if (apiResponse && apiResponse.success && apiResponse.data) {
      const customerData = Array.isArray(apiResponse.data)
        ? apiResponse.data
        : apiResponse.data.customers || apiResponse.data;

      setCustomers(customerData);
      setFilteredCustomers(customerData);
    }
  }, [apiResponse]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchQuery, customers]);

  const handleAddCustomer = async () => {
    try {
      setAdding(true);

      if (
        newCustomerName.trim() === "" ||
        !Helper.mobileNumberRegex.test(newCustomerMobile.toString())
      ) {
        ToastAndroid.showWithGravityAndOffset(
          "Please enter a valid name and mobile number",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        return;
      }

      let response: NodeResponse = await createCustomer(
        newCustomerName.trim(),
        newCustomerMobile
      );

      if (response.success) {
        // Refetch customers from API instead of manually updating state
        await refetch();

        ToastAndroid.showWithGravityAndOffset(
          response.message || "Customer added successfully",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } else {
        ToastAndroid.showWithGravityAndOffset(
          response.message || "Failed to add customer",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        return;
      }

      setNewCustomerName("");
      setNewCustomerMobile("");
      setIsAddModalVisible(false);
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
      setAdding(false);
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    navigation.navigate("customerDetails", { customer });
  };

  const renderCustomerItem = ({ item }: { item: Customer }) => {
    return (
      <View className="bg-white rounded-xl p-4 shadow-md border border-accent mb-3 flex-row justify-between items-center">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 bg-accent rounded-full items-center justify-center mr-3">
            <Ionicons name="person-outline" size={18} color="#1672EC" />
          </View>
          <View className="flex-1">
            <Text className="text-text-primary text-lg">{item.name}</Text>
            <Text className="text-text-secondary">{item.mobileNumber}</Text>
          </View>
        </View>
        <TouchableOpacity
          className="bg-primary rounded-lg px-4 py-2"
          onPress={() => handleViewCustomer(item)}
        >
          <Text className="text-white font-medium">View</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const isModalOpen = isAddModalVisible;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (customerLoading) {
      setIsLoading(true);
    } else if (customers.length > 0) {
      setIsLoading(false);
    } else if (!customerLoading && apiResponse) {
      setIsLoading(false);
    }
  }, [customerLoading, customers, apiResponse]);

  if (customerError) {
    return (
      <View className="flex-1 items-center justify-center bg-primary-bg">
        <Ionicons name="alert-circle-outline" size={50} color="#FF6B6B" />
        <Text className="text-text-primary text-center mt-4">
          Error: {customerError.message}
        </Text>
        <TouchableOpacity
          className="mt-4 bg-primary rounded-lg px-6 py-2"
          onPress={() => refetch()}
        >
          <Text className="text-white font-medium">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1 bg-primary-bg">
        <View className="flex-1" style={{ opacity: isModalOpen ? 0.3 : 1 }}>
          <View className="bg-primary px-4 py-4 shadow-md">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <TouchableOpacity
                  className="mr-3"
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold">Customers</Text>
              </View>
              <TouchableOpacity onPress={() => refetch()}>
                <Ionicons name="refresh" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            <View className="p-4">
              <View className="bg-white rounded-xl p-2 shadow-md border border-accent mb-5">
                <View className="flex-row items-center bg-light rounded-lg px-3 py-2">
                  <Ionicons name="search-outline" size={20} color="#7C84A3" />
                  <TextInput
                    className="flex-1 ml-2 text-text-primary"
                    placeholder="Search customers..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                      <Ionicons name="close-circle" size={20} color="#7C84A3" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <Text className="text-text-primary font-bold text-lg mb-3">
                Your Customers
              </Text>

              {isLoading ? (
                <View className="bg-white rounded-xl p-6 shadow-md border border-accent items-center justify-center">
                  <Indicator size="large" />
                  <Text className="text-text-primary mt-4">
                    Loading customers...
                  </Text>
                </View>
              ) : filteredCustomers.length > 0 ? (
                <FlatList
                  data={filteredCustomers}
                  renderItem={renderCustomerItem}
                  keyExtractor={(item) => item.id!}
                  showsVerticalScrollIndicator={true}
                  className="mb-40"
                  contentContainerStyle={{ paddingBottom: 20 }}
                />
              ) : (
                <View className="bg-white rounded-xl p-6 shadow-md border border-accent items-center justify-center">
                  <Ionicons name="people-outline" size={50} color="#1672EC" />
                  <Text className="text-text-primary text-lg font-bold mt-3">
                    No Customers Found
                  </Text>
                  <Text className="text-text-secondary text-center mt-1">
                    {searchQuery.trim() !== ""
                      ? "Try a different search term or add a new customer"
                      : "Add your first customer using the + button below"}
                  </Text>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>

          <TouchableOpacity
            className="absolute bottom-6 right-6 w-14 h-14 bg-button-primary rounded-full items-center justify-center shadow-lg"
            onPress={() => setIsAddModalVisible(true)}
          >
            <Ionicons name="add" size={30} color="white" />
          </TouchableOpacity>
        </View>

        {isAddModalVisible && (
          <View className="absolute inset-0 justify-center items-center px-5 z-10">
            <View className="bg-white rounded-xl w-full p-5 shadow-xl">
              <View className="items-center mb-4">
                <View className="w-16 h-16 bg-accent rounded-full items-center justify-center mb-2">
                  <Ionicons
                    name="person-add-outline"
                    size={30}
                    color="#1672EC"
                  />
                </View>
                <Text className="text-text-primary font-bold text-xl">
                  Add New Customer
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-text-secondary mb-1">Name</Text>
                <TextInput
                  className="bg-light rounded-lg p-3 text-text-primary"
                  placeholder="Customer name"
                  value={newCustomerName}
                  onChangeText={setNewCustomerName}
                />
              </View>

              <View className="mb-5">
                <Text className="text-text-secondary mb-1">Mobile Number</Text>
                <TextInput
                  className="bg-light rounded-lg p-3 text-text-primary"
                  placeholder="Mobile number"
                  value={newCustomerMobile}
                  onChangeText={setNewCustomerMobile}
                  keyboardType="phone-pad"
                />
              </View>

              <View className="flex-row justify-between">
                <TouchableOpacity
                  className="flex-1 bg-light rounded-lg py-3 mr-2"
                  onPress={() => {
                    setIsAddModalVisible(false);
                    setNewCustomerName("");
                    setNewCustomerMobile("");
                  }}
                >
                  <Text className="text-text-secondary font-medium text-center">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <LoadingButton
                  onPress={handleAddCustomer}
                  isLoading={isAdding}
                  loadingText="Adding Customer"
                  defaultText="Add Customer"
                  disabled={isAdding}
                  className="flex-1 bg-primary rounded-lg py-3 items-center justify-center"
                />
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

export default CustomerScreen;
