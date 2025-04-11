import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Order, OrderItem } from "@/interfaces/interface";

// Sample customer data
const sampleCustomer = {
  id: "67f5721677531af399d12422",
  name: "Atharva Bakri",
  mobileNumber: "9653288604",
};

// Sample order data
const sampleOrders = [
  {
    id: "67f5737e77531af399d12429",
    orderTime: "EVENING",
    orderDate: "2025-04-08T19:05:34.649Z",
    customerId: "67f5721677531af399d12422",
    orderAmount: 20,
    orderStatus: "PAID",
    totalItems: 3,
    createdAt: "2025-04-08T19:05:34.649Z",
    customer: {
      id: "67f5721677531af399d12422",
      name: "Atharva bakri",
      mobileNumber: 9653288604,
      createdAt: "2025-04-08T18:59:34.282Z",
      updatedAt: "2025-04-08T18:59:34.282Z",
    },
    Item: [
      {
        id: "67f5737e77531af399d1242a",
        productId: "67f5722777531af399d12423",
        quantity: 2,
        customizationId: "67f5726c77531af399d12425",
        orderId: "67f5737e77531af399d12429",
        createdAt: "2025-04-08T19:05:34.708Z",
        updatedAt: "2025-04-08T19:05:34.708Z",
        product: {
          id: "67f5722777531af399d12423",
          name: "Chapati",
        },
      },
      {
        id: "67f5737e77531af399d1242b",
        productId: "67f5722777531af399d12423",
        quantity: 1,
        customizationId: "67f5735777531af399d12428",
        orderId: "67f5737e77531af399d12429",
        createdAt: "2025-04-08T19:05:34.766Z",
        updatedAt: "2025-04-08T19:05:34.766Z",
        product: {
          id: "67f5722777531af399d12423",
          name: "Chapati",
        },
      },
    ],
  },
  {
    id: "67f573cf77531af399d1242c",
    orderTime: "MORNING",
    orderDate: "2025-04-08T10:15:34.649Z",
    customerId: "67f5721677531af399d12422",
    orderAmount: 35,
    orderStatus: "UNPAID",
    totalItems: 2,
    createdAt: "2025-04-08T10:15:34.649Z",
    customer: {
      id: "67f5721677531af399d12422",
      name: "Atharva bakri",
      mobileNumber: 9653288604,
      createdAt: "2025-04-08T18:59:34.282Z",
      updatedAt: "2025-04-08T18:59:34.282Z",
    },
    Item: [
      {
        id: "67f573cf77531af399d1242d",
        productId: "67f5722777531af399d12424",
        quantity: 1,
        customizationId: "67f5726c77531af399d12426",
        orderId: "67f573cf77531af399d1242c",
        createdAt: "2025-04-08T10:15:34.708Z",
        updatedAt: "2025-04-08T10:15:34.708Z",
        product: {
          id: "67f5722777531af399d12424",
          name: "Naan",
        },
      },
    ],
  },
  {
    id: "67f574cf77531af399d1242e",
    orderTime: "AFTERNOON",
    orderDate: "2025-03-15T14:30:34.649Z",
    customerId: "67f5721677531af399d12422",
    orderAmount: 45,
    orderStatus: "PAID",
    totalItems: 4,
    createdAt: "2025-03-15T14:30:34.649Z",
    customer: {
      id: "67f5721677531af399d12422",
      name: "Atharva bakri",
      mobileNumber: 9653288604,
      createdAt: "2025-04-08T18:59:34.282Z",
      updatedAt: "2025-04-08T18:59:34.282Z",
    },
    Item: [
      {
        id: "67f574cf77531af399d1242f",
        productId: "67f5722777531af399d12423",
        quantity: 4,
        customizationId: "67f5726c77531af399d12425",
        orderId: "67f574cf77531af399d1242e",
        createdAt: "2025-03-15T14:30:34.708Z",
        updatedAt: "2025-03-15T14:30:34.708Z",
        product: {
          id: "67f5722777531af399d12423",
          name: "Chapati",
        },
      },
    ],
  },
  {
    id: "67f575cf77531af399d12430",
    orderTime: "EVENING",
    orderDate: "2025-02-22T18:45:34.649Z",
    customerId: "67f5721677531af399d12422",
    orderAmount: 30,
    orderStatus: "UNPAID",
    totalItems: 2,
    createdAt: "2025-02-22T18:45:34.649Z",
    customer: {
      id: "67f5721677531af399d12422",
      name: "Atharva bakri",
      mobileNumber: 9653288604,
      createdAt: "2025-04-08T18:59:34.282Z",
      updatedAt: "2025-04-08T18:59:34.282Z",
    },
    Item: [
      {
        id: "67f575cf77531af399d12431",
        productId: "67f5722777531af399d12424",
        quantity: 2,
        customizationId: "67f5726c77531af399d12426",
        orderId: "67f575cf77531af399d12430",
        createdAt: "2025-02-22T18:45:34.708Z",
        updatedAt: "2025-02-22T18:45:34.708Z",
        product: {
          id: "67f5722777531af399d12424",
          name: "Naan",
        },
      },
    ],
  },
];

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

const CustomerDetailsScreen = ({ navigation, route }: any) => {
  // In a real app, you would get the customer from route params
  // const { customer } = route.params as { customer: Customer };
  const customer = sampleCustomer;

  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [orderFilter, setOrderFilter] = useState<string>("ALL");
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
  const [totalUnpaidAmount, setTotalUnpaidAmount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] =
    useState<boolean>(false);

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
    { label: "All Orders", value: "ALL" },
    { label: "Paid Orders", value: "PAID" },
    { label: "Unpaid Orders", value: "UNPAID" },
  ];

  // Update modal open state
  useEffect(() => {
    setIsModalOpen(isDatePickerVisible || isMarkPaidModalVisible);
  }, [isDatePickerVisible, isMarkPaidModalVisible]);

  // Filter orders based on selected month, year and payment status
  useEffect(() => {
    try {
      // Filter by selected month and year
      const monthYearFiltered = orders.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return (
          orderDate.getMonth() === selectedMonth &&
          orderDate.getFullYear() === selectedYear
        );
      });

      // Further filter by payment status if needed
      let statusFiltered = monthYearFiltered;
      if (orderFilter === "PAID") {
        statusFiltered = monthYearFiltered.filter(
          (order) => order.orderStatus === "PAID"
        );
      } else if (orderFilter === "UNPAID") {
        statusFiltered = monthYearFiltered.filter(
          (order) => order.orderStatus === "UNPAID"
        );
      }

      setFilteredOrders(statusFiltered);

      // Calculate total unpaid amount for selected month
      const unpaidOrders = monthYearFiltered.filter(
        (order) => order.orderStatus === "UNPAID"
      );
      const totalUnpaid = unpaidOrders.reduce(
        (sum, order) => sum + order.orderAmount,
        0
      );
      setTotalUnpaidAmount(totalUnpaid);
    } catch (error) {
      console.error("Error filtering orders:", error);
      // Fallback to showing all orders
      setFilteredOrders(orders);
    }
  }, [orders, orderFilter, selectedMonth, selectedYear]);

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
      //   case "AFTERNOON":
      //     return "Afternoon";
      case "EVENING":
        return "Evening";
      default:
        return timeString;
    }
  };

  // Handle marking all unpaid orders as paid
  const handleMarkAllAsPaid = () => {
    const updatedOrders = orders.map((order) => {
      // Only update orders from selected month/year
      const orderDate = new Date(order.orderDate);
      if (
        orderDate.getMonth() === selectedMonth &&
        orderDate.getFullYear() === selectedYear &&
        order.orderStatus === "UNPAID"
      ) {
        return { ...order, orderStatus: "PAID" };
      }
      return order;
    });

    setOrders(updatedOrders);
    setIsMarkPaidModalVisible(false);
  };

  // Handle toggling individual order payment status
  const handleToggleOrderStatus = (orderId: string) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          orderStatus: order.orderStatus === "PAID" ? "UNPAID" : "PAID",
        };
      }
      return order;
    });

    setOrders(updatedOrders);
  };

  // Render order items
  const renderOrderItems = (items: OrderItem[]) => {
    return items.map((item, index) => (
      <View key={item.id} className="flex-row justify-between py-1">
        <Text className="text-text-primary">
          {item.quantity} x {item.product.name}
        </Text>
        <Text className="text-text-primary font-medium">
          ${(item.quantity * 10).toFixed(2)}
        </Text>
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

          <Pressable onPress={() => handleToggleOrderStatus(item.id)}>
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

        <View className="flex-row justify-between">
          <Text className="text-text-primary font-medium">Total</Text>
          <Text className="text-primary font-bold text-lg">
            ${item.orderAmount.toFixed(2)}
          </Text>
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
            onPress={() => setIsDatePickerVisible(false)}
          >
            <Text className="text-white font-medium text-center">Apply</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  // Calculate total amount for the month
  const totalMonthAmount = filteredOrders.reduce(
    (sum, order) => sum + order.orderAmount,
    0
  );

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
                <Pressable
                  className="mr-3"
                  onPress={() => {
                    navigation.goBack();
                    console.log("Go back");
                  }}
                >
                  <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>
                <Text className="text-white text-xl font-bold">
                  Customer Details
                </Text>
              </View>
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

                {totalUnpaidAmount > 0 && (
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
                    ${totalMonthAmount.toFixed(2)}
                  </Text>
                </View>
                <View className="flex-1 pl-4">
                  <Text className="text-text-secondary">Unpaid Amount</Text>
                  <Text className="text-red-500 font-bold text-xl">
                    ${totalUnpaidAmount.toFixed(2)}
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
          {filteredOrders.length > 0 ? (
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
                  {orderFilter !== "ALL"
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
                Total: ${totalUnpaidAmount.toFixed(2)}
              </Text>

              <View className="flex-row justify-between">
                <Pressable
                  className="flex-1 bg-light rounded-lg py-3 mr-2"
                  onPress={() => setIsMarkPaidModalVisible(false)}
                >
                  <Text className="text-text-secondary font-medium text-center">
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  className="flex-1 bg-green-500 rounded-lg py-3"
                  onPress={handleMarkAllAsPaid}
                >
                  <Text className="text-white font-medium text-center">
                    Mark as Paid
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

export default CustomerDetailsScreen;
