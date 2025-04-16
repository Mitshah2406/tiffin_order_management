import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  FlatList,
  ActivityIndicator,
  ToastAndroid,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getDashboardStats,
  getCustomersWithPendingPayments,
} from "../../services/momsApi";
import { getAllOrdersAdmin } from "../../services/adminsApi";
import Indicator from "@/components/indicator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NodeResponse } from "@/interfaces/interface";

const AdminDashboardScreen = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<any>({
    customerCount: 0,
    orderCount: 0,
    totalRevenue: 0,
    unpaidAmount: 0,
  });
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [adminName, setAdminName] = useState<string>("Admin");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    getAdminName();
  }, [navigation]);

  const getAdminName = async () => {
    try {
      const adminDataStr = await AsyncStorage.getItem("adminData");

      console.log("Admin Data");

      console.log(adminDataStr);

      if (adminDataStr) {
        const adminData = JSON.parse(adminDataStr);
        if (adminData && adminData.name) {
          setAdminName(adminData.name);
        }
      }
    } catch (error) {
      console.error("Error fetching admin name:", error);
    }
  };

  // Handle pull-to-refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData();
  };

  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            // Clear admin data from AsyncStorage
            await AsyncStorage.removeItem("adminData");

            ToastAndroid.showWithGravityAndOffset(
              "Logged out successfully",
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
            );

            // Navigate back to login screen
            navigation.replace("adminlogin");
          } catch (error) {
            console.error("Error logging out:", error);
            ToastAndroid.showWithGravityAndOffset(
              "Error logging out",
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
            );
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch dashboard statistics
      const statsResponse: NodeResponse = await getDashboardStats();

      console.log("Stats Response", statsResponse);

      if (statsResponse.success) {
        setStats({
          customerCount: statsResponse.data.counts.customers || 0,
          orderCount: statsResponse.data.counts.orders || 0,
          totalRevenue: statsResponse.data.financial.earnedAmount || 0,
          unpaidAmount: statsResponse.data.financial.unpaidAmount || 0,
        });
      }

      // Fetch customers with pending payments
      const pendingResponse = await getCustomersWithPendingPayments();
      if (pendingResponse.success) {
        console.log("Success");
        console.log(pendingResponse.data);
        setPendingPayments(pendingResponse.data.slice(0, 5)); // Show only top 5
      }

      // Fetch recent orders
      const ordersResponse = await getAllOrdersAdmin();
      if (ordersResponse.success) {
        setRecentOrders(ordersResponse.data.slice(0, 5)); // Show only top 5 recent orders
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      ToastAndroid.showWithGravityAndOffset(
        "Error loading dashboard data",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
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
      case "EVENING":
        return "Evening";
      default:
        return timeString;
    }
  };

  const renderPendingPaymentItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        className="bg-white rounded-lg p-4 shadow-sm border border-accent mb-3"
        onPress={() =>
          navigation.navigate("adminCustomerDetails", {
            customer: item.customer,
          })
        }
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-accent rounded-full items-center justify-center mr-3">
              <Ionicons name="person-outline" size={16} color="#1672EC" />
            </View>
            <View>
              <Text className="text-text-primary font-medium">{item.name}</Text>
              <Text className="text-text-secondary text-sm mt-2">
                {item.customer.mobileNumber}
              </Text>
            </View>
          </View>
          <View>
            <Text className="text-red-500 font-bold">
              ₹{item.totalAmount.toFixed(2)}
            </Text>
            <Text className="text-text-secondary text-sm mt-2 text-right">
              {item.pendingMonths.length} orders
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRecentOrderItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        className="bg-white rounded-lg p-4 shadow-sm border border-accent mb-3"
        onPress={() => navigation.navigate("editOrder", { order: item })}
      >
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="text-text-primary font-medium">
              {formatDate(item.orderDate)} - {formatTime(item.orderTime)}
            </Text>
            <Text className="text-text-secondary text-sm mt-3">
              {item.customer?.name || "Unknown Customer"}
            </Text>
          </View>
          <View>
            <Text className="text-primary font-bold">
              ₹{item.orderAmount.toFixed(2)}
            </Text>
            <View
              className={`px-2 rounded-full mt-3 ${
                item.orderStatus === "PAID" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <Text
                className={`text-sm font-medium text-center ${
                  item.orderStatus === "PAID"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {item.orderStatus}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary-bg">
        <Indicator size="large" />
        <Text className="text-text-primary mt-4">Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar className="bg-primary" />
      <SafeAreaView className="flex-1 bg-primary-bg">
        <View className="bg-primary px-4 py-4 shadow-md">
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-xl font-bold">
              Admin Dashboard
            </Text>
            <View className="flex-row">
              <TouchableOpacity onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1 p-4"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={["#1672EC"]}
            />
          }
        >
          {/* Welcome Message */}
          <View className="bg-white rounded-xl p-4 shadow-md border border-accent mb-5">
            <Text className="text-text-primary text-lg font-medium">
              Welcome, {adminName}!
            </Text>
            <Text className="text-text-secondary">
              Here's an overview of your business
            </Text>
          </View>
          {/* Statistics Cards */}
          <View className="flex-row flex-wrap justify-between mb-5">
            <View className="bg-white w-[48%] rounded-xl p-4 shadow-md border border-accent mb-3">
              <View className="flex-row items-center mb-2">
                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-2">
                  <Ionicons name="people" size={20} color="#1672EC" />
                </View>
                <Text className="text-text-secondary">Customers</Text>
              </View>
              <Text className="text-text-primary font-bold text-xl">
                {stats.customerCount}
              </Text>
            </View>

            <View className="bg-white w-[48%] rounded-xl p-4 shadow-md border border-accent mb-3">
              <View className="flex-row items-center mb-2">
                <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-2">
                  <Ionicons name="receipt" size={20} color="#10b981" />
                </View>
                <Text className="text-text-secondary">Orders</Text>
              </View>
              <Text className="text-text-primary font-bold text-xl">
                {stats.orderCount}
              </Text>
            </View>

            <View className="bg-white w-[48%] rounded-xl p-4 shadow-md border border-accent">
              <View className="flex-row items-center mb-2">
                <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-2">
                  <Ionicons name="cash" size={20} color="#8b5cf6" />
                </View>
                <Text className="text-text-secondary">Revenue</Text>
              </View>
              <Text className="text-text-primary font-bold text-xl">
                ₹{stats.totalRevenue.toFixed(2)}
              </Text>
            </View>

            <View className="bg-white w-[48%] rounded-xl p-4 shadow-md border border-accent">
              <View className="flex-row items-center mb-2">
                <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-2">
                  <Ionicons name="alert-circle" size={20} color="#ef4444" />
                </View>
                <Text className="text-text-secondary">Unpaid</Text>
              </View>
              <Text className="text-red-500 font-bold text-xl">
                ₹{stats.unpaidAmount.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Quick Access Buttons */}
          <View className="bg-white rounded-xl p-4 shadow-md border border-accent mb-5">
            <Text className="text-text-primary font-bold text-lg mb-3">
              Quick Access
            </Text>
            <View className="flex-row flex-wrap justify-between">
              <TouchableOpacity
                className="w-[48%] bg-primary rounded-lg py-3 px-4 mb-3"
                onPress={() => navigation.navigate("adminCustomers")}
              >
                <Ionicons name="people" size={20} color="white" />
                <Text className="text-white font-medium mt-4">Customers</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="w-[48%] bg-amber-500 rounded-lg py-3 px-4 mb-3"
                onPress={() => navigation.navigate("adminOrders")}
              >
                <Ionicons name="receipt" size={20} color="white" />
                <Text className="text-white font-medium mt-4">Orders</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                className="w-[48%] bg-purple-500 rounded-lg py-3 px-4"
                onPress={() => navigation.navigate("addCustomer")}
              >
                <View className="flex-row items-center">
                  <Ionicons name="person-add" size={20} color="white" />
                  <Text className="ml-2 text-white font-medium">
                    Add Customer
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="w-[48%] bg-green-500 rounded-lg py-3 px-4"
                onPress={() => navigation.navigate("pendingPayments")}
              >
                <View className="flex-row items-center">
                  <Ionicons name="cash" size={20} color="white" />
                  <Text className="ml-2 text-white font-medium">Payments</Text>
                </View>
              </TouchableOpacity> */}
            </View>
          </View>

          {/* Pending Payments Section */}
          <View className="mb-5">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-text-primary font-bold text-lg">
                Pending Payments
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("adminPendingPayments")}
              >
                <Text className="text-primary">View All</Text>
              </TouchableOpacity>
            </View>

            {pendingPayments.length > 0 ? (
              <FlatList
                data={pendingPayments}
                renderItem={renderPendingPaymentItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : (
              <View className="bg-white rounded-lg p-4 shadow-sm border border-accent items-center">
                <Ionicons name="checkmark-circle" size={30} color="#10b981" />
                <Text className="text-text-primary mt-2">
                  No pending payments
                </Text>
              </View>
            )}
          </View>

          {/* Recent Orders Section */}
          <View className="mb-5">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-text-primary font-bold text-lg">
                Recent Orders
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("adminOrders")}
              >
                <Text className="text-primary">View All</Text>
              </TouchableOpacity>
            </View>

            {recentOrders.length > 0 ? (
              <FlatList
                data={recentOrders}
                renderItem={renderRecentOrderItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : (
              <View className="bg-white rounded-lg p-4 shadow-sm border border-accent items-center">
                <Ionicons name="receipt-outline" size={30} color="#1672EC" />
                <Text className="text-text-primary mt-2">No recent orders</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default AdminDashboardScreen;
