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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Customer, NodeResponse } from "@/interfaces/interface";
import {
  getAllCustomersAdmin,
  deleteCustomerAdmin,
} from "../../services/adminsApi";
import useFetch from "@/hooks/useFetch";
import Indicator from "@/components/indicator";
import LoadingButton from "@/components/loadingBtn";

const AdminCustomersScreen = ({ navigation }: any) => {
  const {
    data: apiResponse,
    loading: customerLoading,
    error: customerError,
    refetch,
  } = useFetch<NodeResponse>(() => getAllCustomersAdmin());

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

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

  const handleEditCustomer = (customer: Customer) => {
    console.log("Editing customer:", customer);

    navigation.navigate("editCustomer", { customer });
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    // // Check if customer has orders
    // if (customer.Order && customer.Order.length > 0) {
    //   Alert.alert(
    //     "Cannot Delete",
    //     "This customer has existing orders and cannot be deleted.",
    //     [{ text: "OK" }]
    //   );
    //   return;
    // }

    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete ${customer.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);
              const response = await deleteCustomerAdmin(customer.id!);

              if (response.success) {
                ToastAndroid.showWithGravityAndOffset(
                  response.message || "Customer deleted successfully",
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                  25,
                  50
                );
                await refetch();
              }
            } catch (error: any) {
              ToastAndroid.showWithGravityAndOffset(
                "Customer existing with orders is not deleted",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
              );
              console.log(error.message || "An error occurred");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleViewCustomerOrders = (customer: Customer) => {
    navigation.navigate("adminCustomerDetails", { customer });
  };

  const renderCustomerItem = ({ item }: { item: Customer }) => {
    return (
      <View className="bg-white rounded-xl p-4 shadow-md border border-accent mb-3">
        <View className="flex-row items-center mb-3">
          <View className="w-10 h-10 bg-accent rounded-full items-center justify-center mr-3">
            <Ionicons name="person-outline" size={18} color="#1672EC" />
          </View>
          <View className="flex-1">
            <Text className="text-text-primary text-lg">{item.name}</Text>
            <Text className="text-text-secondary">{item.mobileNumber}</Text>
          </View>
        </View>

        <View className="flex-row justify-between mt-2">
          <TouchableOpacity
            className="bg-primary rounded-lg px-3 py-2 flex-1 mr-2"
            onPress={() => handleViewCustomerOrders(item)}
          >
            <Text className="text-white font-medium text-center">Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-amber-500 rounded-lg px-3 py-2 flex-1 mr-2"
            onPress={() => handleEditCustomer(item)}
          >
            <Text className="text-white font-medium text-center">Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-500 rounded-lg px-3 py-2 flex-1"
            onPress={() => handleDeleteCustomer(item)}
            disabled={isDeleting}
          >
            <Text className="text-white font-medium text-center">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
        <View className="flex-1">
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
                  All Customers
                </Text>
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
                All Customers
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
                      ? "Try a different search term"
                      : "No customers available in the system"}
                  </Text>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default AdminCustomersScreen;
