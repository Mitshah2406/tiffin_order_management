import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  StatusBar,
  SafeAreaView,
  ToastAndroid,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Order, OrderItem } from "@/interfaces/interface";
import {
  getCustomerOrders,
  markOrderAsPaid,
  markOrderAsUnpaid,
  markMultipleOrdersAsPaid,
} from "../../services/momsApi";
import { deleteOrderAdmin } from "../../services/adminsApi";
import LoadingButton from "@/components/loadingBtn";

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
      <Pressable
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
      </Pressable>

      {isOpen && (
        <View className="absolute top-12 left-0 right-0 bg-white rounded-lg shadow-lg border border-accent z-50">
          {options.map((option) => (
            <Pressable
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
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

const AdminCustomerDetailsScreen = ({ navigation, route }: any) => {
  // Get customer from route params
  const { customer } = route.params;

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [orderFilter, setOrderFilter] = useState<string>("BOTH");
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [isDatePickerVisible, setIsDatePickerVisible] =
    useState<boolean>(false);
  const [isMarkPaidModalVisible, setIsMarkPaidModalVisible] =
    useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [unpaidAmount, setUnpaidAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMarkingPaid, setIsMarkingPaid] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Month names for display
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

  // Filter options for the dropdown
  const filterOptions = [
    { label: "All Orders", value: "BOTH" },
    { label: "Paid Orders", value: "PAID" },
    { label: "Unpaid Orders", value: "UNPAID" },
  ];

  // Update modal open state
  useEffect(() => {
    setIsModalOpen(isDatePickerVisible || isMarkPaidModalVisible);
  }, [isDatePickerVisible, isMarkPaidModalVisible]);

  // Fetch customer orders when component mounts or filters change
  useEffect(() => {
    fetchCustomerOrders();
  }, [customer.id, selectedMonth, selectedYear, orderFilter]);

  const fetchCustomerOrders = async () => {
    if (!customer || !customer.id) return;

    try {
      setIsLoading(true);

      const response = await getCustomerOrders(
        customer.id,
        selectedYear,
        selectedMonth,
        orderFilter
      );

      if (response.success) {
        // Set orders and financial data
        setOrders(response.data.orders || []);
        setFilteredOrders(response.data.orders || []);
        setTotalAmount(response.data.totalAmount || 0);
        setUnpaidAmount(
          response.data.unpaidAmount >= 0 ? response.data.unpaidAmount : 0
        );
      } else {
        ToastAndroid.showWithGravityAndOffset(
          response.message || "Failed to fetch orders",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        // Set empty data if there's an error
        setOrders([]);
        setFilteredOrders([]);
        setTotalAmount(0);
        setUnpaidAmount(0);
      }
    } catch (error) {
      console.error("Error fetching customer orders:", error);
      ToastAndroid.showWithGravityAndOffset(
        "Error loading customer orders",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      // Set empty data if there's an error
      setOrders([]);
      setFilteredOrders([]);
      setTotalAmount(0);
      setUnpaidAmount(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Format time from string constant
  const formatTime = (timeString: string) => {
    switch (timeString) {
      case "MORNING":
        return "Morning";
      case "AFTERNOON":
        return "Afternoon";
      case "EVENING":
        return "Evening";
      default:
        return timeString;
    }
  };

  // Handle marking all unpaid orders as paid
  const handleMarkAllAsPaid = async () => {
    try {
      setIsMarkingPaid(true);

      // Get IDs of all unpaid orders
      const unpaidOrderIds = orders
        .filter((order) => order.orderStatus === "UNPAID")
        .map((order) => order.id);

      if (unpaidOrderIds.length === 0) {
        ToastAndroid.showWithGravityAndOffset(
          "No unpaid orders to mark as paid",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        setIsMarkPaidModalVisible(false);
        setIsMarkingPaid(false);
        return;
      }

      // Call API to mark multiple orders as paid
      const response = await markMultipleOrdersAsPaid(unpaidOrderIds);

      if (response.success) {
        ToastAndroid.showWithGravityAndOffset(
          response.message || "All orders marked as paid successfully",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );

        // Refresh the order list
        await fetchCustomerOrders();
      } else {
        ToastAndroid.showWithGravityAndOffset(
          response.message || "Failed to mark orders as paid",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }
    } catch (error) {
      console.error("Error marking all orders as paid:", error);
      ToastAndroid.showWithGravityAndOffset(
        "Error marking orders as paid",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setIsMarkingPaid(false);
      setIsMarkPaidModalVisible(false);
    }
  };

  // Handle toggling individual order payment status
  const handleToggleOrderStatus = async (
    orderId: string,
    currentStatus: string
  ) => {
    try {
      let response;

      if (currentStatus === "PAID") {
        // Mark as unpaid
        response = await markOrderAsUnpaid(orderId);
      } else {
        // Mark as paid
        response = await markOrderAsPaid(orderId);
      }

      if (response.success) {
        ToastAndroid.showWithGravityAndOffset(
          response.message ||
            `Order marked as ${currentStatus === "PAID" ? "unpaid" : "paid"}`,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50
        );

        // Refresh the order list
        await fetchCustomerOrders();
      } else {
        ToastAndroid.showWithGravityAndOffset(
          response.message || "Failed to update order status",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }
    } catch (error) {
      console.error("Error toggling order status:", error);
      ToastAndroid.showWithGravityAndOffset(
        "Error updating order status",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  };

  // Handle deleting an order
  const handleDeleteOrder = async (orderId: string) => {
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

              const response = await deleteOrderAdmin(orderId);

              if (response.success) {
                ToastAndroid.showWithGravityAndOffset(
                  response.message || "Order deleted successfully",
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                  25,
                  50
                );

                // Refresh the order list
                await fetchCustomerOrders();
              } else {
                ToastAndroid.showWithGravityAndOffset(
                  response.message || "Failed to delete order",
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                  25,
                  50
                );
              }
            } catch (error) {
              console.error("Error deleting order:", error);
              ToastAndroid.showWithGravityAndOffset(
                "Error deleting order",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  // Handle editing an order
  const handleEditOrder = (order: Order) => {
    navigation.navigate("editOrder", { order });
  };

  // Apply date filter
  const handleApplyDateFilter = () => {
    setIsDatePickerVisible(false);
    // The orders will be fetched automatically due to the useEffect dependency
  };

  // Render order items
  const renderOrderItems = (items: OrderItem[]) => {
    return items.map((item, index) => (
      <View key={item.id} className="flex-row justify-between py-1">
        <View className="flex-1">
          <Text className="text-text-primary">
            {item.quantity} x {item.product?.name || "Unknown Product"}
          </Text>
          <Text className="text-text-secondary text-xs">
            {item.customization?.description || ""}
          </Text>
        </View>
        <View>
          <Text className="text-text-primary font-medium text-right">
            ₹{((item.customization?.price || 0) * item.quantity).toFixed(2)}
          </Text>
          <Text className="text-text-secondary text-xs text-right">
            (₹{(item.customization?.price || 0).toFixed(2)} each)
          </Text>
        </View>
      </View>
    ));
  };

  // Render each order item
  const renderOrderItem = ({ item }: { item: Order }) => {
    return (
      <View className="bg-white rounded-xl p-4 shadow-md border border-accent mb-3">
        <View className="flex-row justify-between items-start mb-3">
          <View>
            <Text className="text-text-primary font-bold text-lg">
              {formatDate(item.orderDate)}
            </Text>
            <Text className="text-text-secondary">
              {formatTime(item.orderTime)}
            </Text>
          </View>

          <Pressable
            onPress={() => handleToggleOrderStatus(item.id, item.orderStatus)}
          >
            <View
              className={`px-3 py-1 rounded-full ${
                item.orderStatus === "PAID" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <Text
                className={`font-medium ${
                  item.orderStatus === "PAID"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {item.orderStatus}
              </Text>
            </View>
          </Pressable>
        </View>

        <View className="border-t border-b border-light py-3 mb-3">
          {renderOrderItems(item.Item)}
        </View>

        <View className="flex-row justify-between mb-3">
          <Text className="text-text-primary font-medium">Total</Text>
          <Text className="text-primary font-bold text-lg">
            ₹{item.orderAmount.toFixed(2)}
          </Text>
        </View>

        {/* Admin Action Buttons */}
        <View className="flex-row justify-between">
          <Pressable
            className="flex-1 bg-amber-500 rounded-lg py-2 mr-2"
            onPress={() => handleEditOrder(item)}
          >
            <Text className="text-white font-medium text-center">Edit</Text>
          </Pressable>
          <Pressable
            className="flex-1 bg-red-500 rounded-lg py-2"
            onPress={() => handleDeleteOrder(item.id)}
            disabled={isDeleting}
          >
            <Text className="text-white font-medium text-center">Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  // Render month picker
  const renderMonthPicker = () => {
    return (
      <View className="px-5 py-4 bg-white rounded-xl border border-accent shadow-md">
        <Text className="text-text-primary font-bold text-lg mb-4 text-center">
          Select Month & Year
        </Text>

        {/* Year Picker */}
        <Text className="text-text-secondary mb-2">Year</Text>
        <View className="flex-row flex-wrap mb-4">
          {years.map((year) => (
            <Pressable
              key={year}
              className={`py-2 px-4 m-1 rounded-lg ${
                selectedYear === year ? "bg-primary" : "bg-light"
              }`}
              onPress={() => setSelectedYear(year)}
            >
              <Text
                className={`${
                  selectedYear === year ? "text-white" : "text-text-primary"
                } font-medium`}
              >
                {year}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Month Picker */}
        <Text className="text-text-secondary mb-2">Month</Text>
        <View className="flex-row flex-wrap">
          {monthNames.map((month, index) => (
            <Pressable
              key={month}
              className={`py-2 px-3 m-1 rounded-lg ${
                selectedMonth === index ? "bg-primary" : "bg-light"
              }`}
              onPress={() => setSelectedMonth(index)}
            >
              <Text
                className={`${
                  selectedMonth === index ? "text-white" : "text-text-primary"
                } font-medium`}
              >
                {month.substring(0, 3)}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="flex-row mt-5">
          <Pressable
            className="flex-1 bg-light rounded-lg py-3 mr-2"
            onPress={() => setIsDatePickerVisible(false)}
          >
            <Text className="text-text-secondary font-medium text-center">
              Cancel
            </Text>
          </Pressable>
          <Pressable
            className="flex-1 bg-primary rounded-lg py-3"
            onPress={handleApplyDateFilter}
          >
            <Text className="text-white font-medium text-center">Apply</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1 bg-primary-bg">
        {/* Main Content - will fade out when modal is visible */}
        <View className="flex-1" style={{ opacity: isModalOpen ? 0.3 : 1 }}>
          {/* Header */}
          <View className="bg-primary px-4 py-4 shadow-md">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Pressable className="mr-3" onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>
                <Text className="text-white text-xl font-bold">
                  Customer Details
                </Text>
              </View>
              <Pressable onPress={() => fetchCustomerOrders()}>
                <Ionicons name="refresh" size={24} color="white" />
              </Pressable>
            </View>
          </View>

          {/* Customer Info Card */}
          <View className="px-4 pt-4">
            <View className="bg-white rounded-xl p-4 shadow-md border border-accent mb-5">
              <View className="flex-row items-center mb-2">
                <View className="w-14 h-14 bg-accent rounded-full items-center justify-center mr-3">
                  <Ionicons name="person" size={28} color="#1672EC" />
                </View>
                <View>
                  <Text className="text-text-primary font-bold text-xl">
                    {customer.name}
                  </Text>
                  <View className="flex-row items-center">
                    <Ionicons name="call-outline" size={14} color="#7C84A3" />
                    <Text className="text-text-secondary ml-1">
                      {customer.mobileNumber}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row mt-3">
                <Pressable
                  className="flex-1 bg-amber-500 rounded-lg py-2 mr-2"
                  onPress={() =>
                    navigation.navigate("editCustomer", { customer })
                  }
                >
                  <Text className="text-white font-medium text-center">
                    Edit Customer
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Month Selection and Summary */}
          <View className="px-4 mb-3">
            <View className="bg-white rounded-xl p-4 shadow-md border border-accent">
              <View className="flex-row justify-between items-center mb-4">
                <Pressable
                  className="flex-row items-center"
                  onPress={() => setIsDatePickerVisible(true)}
                >
                  <Text className="text-primary font-bold text-lg mr-1">
                    {monthNames[selectedMonth]} {selectedYear}
                  </Text>
                  <Ionicons name="calendar-outline" size={18} color="#1672EC" />
                </Pressable>

                {unpaidAmount > 0 && (
                  <Pressable
                    className="bg-primary rounded-lg px-3 py-1"
                    onPress={() => setIsMarkPaidModalVisible(true)}
                  >
                    <Text className="text-white font-medium">
                      Mark All Paid
                    </Text>
                  </Pressable>
                )}
              </View>

              <View className="flex-row">
                <View className="flex-1 border-r border-light pr-4">
                  <Text className="text-text-secondary">Total Amount</Text>
                  <Text className="text-text-primary font-bold text-xl">
                    ₹{totalAmount.toFixed(2)}
                  </Text>
                </View>
                <View className="flex-1 pl-4">
                  <Text className="text-text-secondary">Unpaid Amount</Text>
                  <Text className="text-red-500 font-bold text-xl">
                    ₹{unpaidAmount.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Filter Dropdown */}
          <View className="px-4 pb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-text-primary font-bold text-lg">
                Orders
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
          </View>

          {/* Orders List */}
          {isLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#1672EC" />
              <Text className="text-text-primary mt-2">Loading orders...</Text>
            </View>
          ) : filteredOrders.length > 0 ? (
            <FlatList
              data={filteredOrders}
              renderItem={renderOrderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 40,
              }}
              showsVerticalScrollIndicator={true}
            />
          ) : (
            <View className="flex-1 px-4 items-center justify-center">
              <View className="rounded-xl p-6 items-center justify-center w-full">
                <Ionicons name="receipt-outline" size={50} color="#1672EC" />
                <Text className="text-text-primary text-lg font-bold mt-3">
                  No Orders Found
                </Text>
                <Text className="text-text-secondary text-center mt-1">
                  {orderFilter !== "BOTH"
                    ? `No ${orderFilter.toLowerCase()} orders for ${
                        monthNames[selectedMonth]
                      } ${selectedYear}`
                    : `No orders for ${monthNames[selectedMonth]} ${selectedYear}`}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Month/Year Picker Modal */}
        {isDatePickerVisible && (
          <View className="absolute inset-0 justify-center items-center px-5 z-10">
            {renderMonthPicker()}
          </View>
        )}

        {/* Mark All As Paid Confirmation Modal */}
        {isMarkPaidModalVisible && (
          <View className="absolute inset-0 justify-center items-center px-5 z-10">
            <View className="bg-white rounded-xl p-5 shadow-xl">
              <View className="items-center mb-4">
                <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="checkmark-circle" size={30} color="#10b981" />
                </View>
                <Text className="text-text-primary font-bold text-xl">
                  Mark All Orders as Paid?
                </Text>
              </View>

              <Text className="text-text-secondary text-center mb-2">
                This will mark all unpaid orders for {monthNames[selectedMonth]}{" "}
                {selectedYear} as paid.
              </Text>

              <Text className="text-primary font-bold text-center text-lg mb-4">
                Total: ₹{unpaidAmount.toFixed(2)}
              </Text>

              <View className="flex-row justify-between">
                <Pressable
                  className="flex-1 bg-light rounded-lg py-3 mr-2"
                  onPress={() => setIsMarkPaidModalVisible(false)}
                  disabled={isMarkingPaid}
                >
                  <Text className="text-text-secondary font-medium text-center">
                    Cancel
                  </Text>
                </Pressable>
                <LoadingButton
                  className="flex-1 bg-green-500 rounded-lg py-3"
                  isLoading={isMarkingPaid}
                  loadingText="Processing..."
                  defaultText="Mark as Paid"
                  onPress={handleMarkAllAsPaid}
                  disabled={isMarkingPaid}
                />
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

export default AdminCustomerDetailsScreen;
