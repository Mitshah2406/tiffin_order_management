import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
  SafeAreaView,
  ToastAndroid,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getCustomersWithPendingPayments,
  markAllCustomerPaymentsAsPaid,
} from "../../services/momsApi";
import useFetch from "@/hooks/useFetch";
import Indicator from "@/components/indicator";
import LoadingButton from "@/components/loadingBtn";

const AdminPendingPaymentsScreen = ({ navigation }: any) => {
  const {
    data: apiResponse,
    loading: paymentsLoading,
    error: paymentsError,
    refetch,
  } = useFetch<any>(() => getCustomersWithPendingPayments());

  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (apiResponse && apiResponse.success && apiResponse.data) {
      const paymentsData = Array.isArray(apiResponse.data)
        ? apiResponse.data
        : apiResponse.data;

      setPendingPayments(paymentsData);
      applySearch(paymentsData, searchQuery);
    }
  }, [apiResponse]);

  useEffect(() => {
    applySearch(pendingPayments, searchQuery);
  }, [searchQuery]);

  const applySearch = (allPayments: any[], search: string) => {
    if (search.trim() === "") {
      setFilteredPayments(allPayments);
    } else {
      const filtered = allPayments.filter((payment) =>
        payment.customer.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredPayments(filtered);
    }
  };

  const handleViewCustomer = (customer: any) => {
    navigation.navigate("adminCustomerDetails", { customer });
  };

  const handleMarkAllPaid = async (
    customerId: string,
    customerName: string
  ) => {
    Alert.alert(
      "Confirm Action",
      `Are you sure you want to mark all payments for ${customerName} as paid?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Mark Paid",
          style: "default",
          onPress: async () => {
            try {
              setIsProcessing(true);

              const response = await markAllCustomerPaymentsAsPaid(customerId);

              if (response.success) {
                ToastAndroid.showWithGravityAndOffset(
                  response.message ||
                    "All payments marked as paid successfully",
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                  25,
                  50
                );

                // Refresh the payments list
                await refetch();
              } else {
                ToastAndroid.showWithGravityAndOffset(
                  response.message || "Failed to mark payments as paid",
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
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  const renderPendingPaymentItem = ({ item }: { item: any }) => {
    return (
      <View className="bg-white rounded-xl p-4 shadow-md border border-accent mb-3">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-accent rounded-full items-center justify-center mr-3">
              <Ionicons name="person" size={24} color="#1672EC" />
            </View>
            <View>
              <Text className="text-text-primary font-bold text-lg">
                {item.customer.name}
              </Text>
              <View className="flex-row items-center">
                <Ionicons name="call-outline" size={14} color="#7C84A3" />
                <Text className="text-text-secondary ml-1">
                  {item.customer.mobileNumber}
                </Text>
              </View>
            </View>
          </View>
          <View className="bg-red-100 px-3 py-1 rounded-full">
            <Text className="text-red-600 font-medium">
              {item.pendingMonths.length} Orders
            </Text>
          </View>
        </View>

        <View className="bg-light rounded-lg p-3 mb-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-text-secondary">Total Amount</Text>
            <Text className="text-text-primary font-bold text-xl">
              ₹{item.totalAmount.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row justify-between items-center mt-1">
            {/* <Text className="text-text-secondary">Unpaid Amount</Text>
            <Text className="text-red-500 font-bold text-lg">
              ₹{item.pendingMonths.length}
            </Text> */}
          </View>
        </View>

        <View className="flex-row justify-between">
          <TouchableOpacity
            className="flex-1 bg-primary rounded-lg py-2 mr-2"
            onPress={() => handleViewCustomer(item.customer)}
          >
            <Text className="text-white font-medium text-center">
              View Details
            </Text>
          </TouchableOpacity>
          <LoadingButton
            className="flex-1 bg-green-500 rounded-lg py-2"
            isLoading={isProcessing}
            loadingText="Processing..."
            defaultText="Mark All Paid"
            onPress={() =>
              handleMarkAllPaid(item.customer.id, item.customer.name)
            }
            disabled={isProcessing}
          />
        </View>
      </View>
    );
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (paymentsLoading) {
      setIsLoading(true);
    } else if (pendingPayments.length > 0) {
      setIsLoading(false);
    } else if (!paymentsLoading && apiResponse) {
      setIsLoading(false);
    }
  }, [paymentsLoading, pendingPayments, apiResponse]);

  if (paymentsError) {
    return (
      <View className="flex-1 items-center justify-center bg-primary-bg">
        <Ionicons name="alert-circle-outline" size={50} color="#FF6B6B" />
        <Text className="text-text-primary text-center mt-4">
          Error: {paymentsError.message}
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
                Pending Payments
              </Text>
            </View>
            <TouchableOpacity onPress={() => refetch()}>
              <Ionicons name="refresh" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="p-4">
          <View className="bg-white rounded-xl p-2 shadow-md border border-accent mb-4">
            <View className="flex-row items-center bg-light rounded-lg px-3 py-2">
              <Ionicons name="search-outline" size={20} color="#7C84A3" />
              <TextInput
                className="flex-1 ml-2 text-text-primary"
                placeholder="Search by customer name..."
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
            Customers with Pending Payments ({filteredPayments.length})
          </Text>

          {isLoading ? (
            <View className="bg-white rounded-xl p-6 shadow-md border border-accent items-center justify-center">
              <Indicator size="large" />
              <Text className="text-text-primary mt-4">
                Loading pending payments...
              </Text>
            </View>
          ) : filteredPayments.length > 0 ? (
            <FlatList
              data={filteredPayments}
              renderItem={renderPendingPaymentItem}
              keyExtractor={(item) => item.customer.id}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <View className="bg-white rounded-xl p-6 shadow-md border border-accent items-center justify-center">
              <Ionicons name="checkmark-circle" size={50} color="#10b981" />
              <Text className="text-text-primary text-lg font-bold mt-3">
                No Pending Payments
              </Text>
              <Text className="text-text-secondary text-center mt-1">
                {searchQuery.trim() !== ""
                  ? "Try a different search term"
                  : "All customers are up to date with their payments"}
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default AdminPendingPaymentsScreen;
