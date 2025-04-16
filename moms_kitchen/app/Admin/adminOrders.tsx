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
import { Order } from "@/interfaces/interface";
import { getAllOrdersAdmin, deleteOrderAdmin } from "../../services/adminsApi";
import useFetch from "@/hooks/useFetch";
import Indicator from "@/components/indicator";

// Custom Dropdown Component
const Dropdown = ({
  options,
  selectedValue,
  onSelect,
  placeholder,
}: {
  options: { label: string; value: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className="relative">
      <TouchableOpacity
        className="bg-light rounded-lg p-3 flex-row justify-between items-center"
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text className="text-text-primary">
          {selectedValue
            ? options.find((option) => option.value === selectedValue)?.label
            : placeholder || "Select an option"}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={16}
          color="#7C84A3"
        />
      </TouchableOpacity>

      {isOpen && (
        <View className="absolute top-12 left-0 right-0 bg-white rounded-lg shadow-lg border border-accent z-50">
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              className={`p-3 border-b border-light ${
                selectedValue === option.value ? "bg-accent bg-opacity-20" : ""
              }`}
              onPress={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
            >
              <Text
                className={`${
                  selectedValue === option.value
                    ? "text-primary font-medium"
                    : "text-text-primary"
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const AdminOrdersScreen = ({ navigation }: any) => {
  const {
    data: apiResponse,
    loading: ordersLoading,
    error: ordersError,
    refetch,
  } = useFetch<any>(() => getAllOrdersAdmin());

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [orderFilter, setOrderFilter] = useState<string>("ALL");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Filter options for the dropdown
  const filterOptions = [
    { label: "All Orders", value: "ALL" },
    { label: "Paid Orders", value: "PAID" },
    { label: "Unpaid Orders", value: "UNPAID" },
  ];

  useEffect(() => {
    if (apiResponse && apiResponse.success && apiResponse.data) {
      const ordersData = Array.isArray(apiResponse.data)
        ? apiResponse.data
        : apiResponse.data;

      setOrders(ordersData);
      applyFilters(ordersData, searchQuery, orderFilter);
    }
  }, [apiResponse]);

  useEffect(() => {
    applyFilters(orders, searchQuery, orderFilter);
  }, [searchQuery, orderFilter]);

  const applyFilters = (allOrders: Order[], search: string, filter: string) => {
    let result = [...allOrders];

    // Apply status filter
    if (filter !== "ALL") {
      result = result.filter((order) => order.orderStatus === filter);
    }

    // Apply search filter (search by customer name)
    if (search.trim() !== "") {
      result = result.filter((order) =>
        order.customer?.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredOrders(result);
  };

  const handleEditOrder = (order: Order) => {
    navigation.navigate("editOrder", { order });
  };

  const handleDeleteOrder = async (order: Order) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this order? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);

              const response = await deleteOrderAdmin(order.id);

              if (response.success) {
                ToastAndroid.showWithGravityAndOffset(
                  response.message || "Order deleted successfully",
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                  25,
                  50
                );

                // Refresh the order list
                await refetch();
              } else {
                ToastAndroid.showWithGravityAndOffset(
                  response.message || "Failed to delete order",
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
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleViewCustomer = (order: Order) => {
    if (order.customer) {
      navigation.navigate("adminCustomerDetails", { customer: order.customer });
    } else {
      ToastAndroid.showWithGravityAndOffset(
        "Customer information not available",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Format time from string constant
  const formatTime = (timeString: string) => {
    switch (timeString) {
      case "MORNING":
        return "Morning";
      case "EVENING":
        return "Evening";
      default:
        return timeString;
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    return (
      <View className="bg-white rounded-xl p-4 shadow-md border border-accent mb-3">
        <View className="flex-row justify-between items-start mb-2">
          <View>
            <Text className="text-text-primary font-bold text-lg">
              Order #{item.id.substring(item.id.length - 6)}
            </Text>
            <Text className="text-text-secondary">
              {formatDate(item.orderDate)} - {formatTime(item.orderTime)}
            </Text>
          </View>

          <View
            className={`px-3 py-1 rounded-full ${
              item.orderStatus === "PAID" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <Text
              className={`font-medium ${
                item.orderStatus === "PAID" ? "text-green-600" : "text-red-600"
              }`}
            >
              {item.orderStatus}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="flex-row items-center mb-3"
          onPress={() => handleViewCustomer(item)}
        >
          <Ionicons name="person-circle-outline" size={20} color="#1672EC" />
          <Text className="text-primary ml-1 font-medium">
            {item.customer?.name || "Unknown Customer"}
          </Text>
        </TouchableOpacity>

        <View className="border-t border-light pt-2 mb-3">
          <View className="flex-row justify-between">
            <Text className="text-text-secondary">Total Items</Text>
            <Text className="text-text-primary font-medium">
              {item.totalItems}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-text-secondary">Amount</Text>
            <Text className="text-primary font-bold">
              ₹{item.orderAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between">
          <TouchableOpacity
            className="flex-1 bg-amber-500 rounded-lg py-2 mr-2"
            onPress={() => handleEditOrder(item)}
          >
            <Text className="text-white font-medium text-center">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-red-500 rounded-lg py-2"
            onPress={() => handleDeleteOrder(item)}
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
    if (ordersLoading) {
      setIsLoading(true);
    } else if (orders.length > 0) {
      setIsLoading(false);
    } else if (!ordersLoading && apiResponse) {
      setIsLoading(false);
    }
  }, [ordersLoading, orders, apiResponse]);

  if (ordersError) {
    return (
      <View className="flex-1 items-center justify-center bg-primary-bg">
        <Ionicons name="alert-circle-outline" size={50} color="#FF6B6B" />
        <Text className="text-text-primary text-center mt-4">
          Error: {ordersError.message}
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
              <Text className="text-white text-xl font-bold">All Orders</Text>
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

          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-text-primary font-bold text-lg">
              Orders ({filteredOrders.length})
            </Text>
            <View className="w-40">
              <Dropdown
                options={filterOptions}
                selectedValue={orderFilter}
                onSelect={setOrderFilter}
                placeholder="Filter Orders"
              />
            </View>
          </View>

          {isLoading ? (
            <View className="bg-white rounded-xl p-6 shadow-md border border-accent items-center justify-center">
              <Indicator size="large" />
              <Text className="text-text-primary mt-4">Loading orders...</Text>
            </View>
          ) : filteredOrders.length > 0 ? (
            <FlatList
              data={filteredOrders}
              renderItem={renderOrderItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingBottom: 40 }}
              className="mb-40"
            />
          ) : (
            <View className="bg-white rounded-xl p-6 shadow-md border border-accent items-center justify-center">
              <Ionicons name="receipt-outline" size={50} color="#1672EC" />
              <Text className="text-text-primary text-lg font-bold mt-3">
                No Orders Found
              </Text>
              <Text className="text-text-secondary text-center mt-1">
                {searchQuery.trim() !== ""
                  ? "Try a different search term"
                  : orderFilter !== "ALL"
                  ? `No ${orderFilter.toLowerCase()} orders available`
                  : "No orders available in the system"}
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default AdminOrdersScreen;
