import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  ToastAndroid,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Helper from "@/utils/helpers";
import {
  getDashboardStats,
  getCustomersWithPendingPayments,
} from "@/services/api";

// Define types for our service items
interface ServiceItem {
  id: string;
  name: string;
  icon:
    | "people-outline"
    | "cube-outline"
    | "color-palette-outline"
    | "cart-outline"
    | "wallet-outline";
  count: string;
  onTap: () => void;
}

// Define pending customer type
interface PendingCustomer {
  id: string;
  name: string;
  pendingMonths: {
    month: string;
    year: number;
    amount: number;
  }[];
  totalAmount: number;
}

// Define dashboard stats type
interface DashboardStats {
  counts: {
    products: number;
    customizations: number;
    customers: number;
  };
  financial: {
    earnedAmount: number;
    pendingAmount: number;
  };
}

const Dashboard = ({ navigation, route }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    counts: {
      products: 0,
      customizations: 0,
      customers: 0,
    },
    financial: {
      earnedAmount: 0,
      pendingAmount: 0,
    },
  });
  const [pendingCustomers, setPendingCustomers] = useState<PendingCustomer[]>(
    []
  );

  // Load dashboard data on component mount and when returning to the screen
  useEffect(() => {
    loadDashboardData();

    // Set up a listener for when the screen comes into focus
    const unsubscribe = navigation.addListener("focus", () => {
      loadDashboardData();
    });

    // Clean up the listener when the component is unmounted
    return unsubscribe;
  }, [navigation]);

  // Fetch dashboard data from API
  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch dashboard stats
      const statsResponse = await getDashboardStats();
      if (statsResponse.success) {
        setDashboardStats(statsResponse.data);
      } else {
        ToastAndroid.showWithGravityAndOffset(
          statsResponse.message || "Failed to load dashboard stats",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }

      // Fetch pending customers
      const pendingResponse = await getCustomersWithPendingPayments();
      if (pendingResponse.success) {
        setPendingCustomers(pendingResponse.data || []);
      } else {
        ToastAndroid.showWithGravityAndOffset(
          pendingResponse.message || "Failed to load pending payments",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
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

  // Handle pull-to-refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadDashboardData();
  };

  // Services grid data
  const services: ServiceItem[] = [
    {
      id: "1",
      name: "Products",
      icon: "cube-outline",
      count: `${dashboardStats.counts.products} items`,
      onTap: () => {
        navigation.navigate("products");
      },
    },
    {
      id: "2",
      name: "Customizations",
      icon: "color-palette-outline",
      count: `${dashboardStats.counts.customizations} options`,
      onTap: () => {
        navigation.navigate("customization");
      },
    },
    {
      id: "3",
      name: "Customers",
      icon: "people-outline",
      count: `${dashboardStats.counts.customers} active`,
      onTap: () => {
        navigation.navigate("customers");
      },
    },
  ];

  const renderServiceRow = (service1: ServiceItem, service2?: ServiceItem) => {
    if (service1 != null && service2 == null) {
      return (
        <TouchableOpacity
          key={`${service1.id}-single`}
          onPress={service1.onTap}
          className="flex-1 flex-row bg-white rounded-xl p-5 shadow-lg border border-accent mb-4"
        >
          <View className="flex-1 flex-row items-center justify-between">
            <View>
              <Text className="text-text-primary font-bold text-lg mb-1">
                {service1.name}
              </Text>
              <Text className="text-text-secondary">{service1.count}</Text>
            </View>

            <View className="w-12 h-12 bg-accent rounded-full items-center justify-center mb-3">
              <Ionicons name={service1.icon} size={22} color="#1672EC" />
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <View
        className="flex-row gap-4 mb-4"
        key={`${service1.id}-${service2?.id || "empty"}`}
      >
        <TouchableOpacity
          onPress={service1.onTap}
          className="flex-1 bg-white rounded-xl p-5 shadow-lg border border-accent"
        >
          <View>
            <View className="w-12 h-12 bg-accent rounded-full items-center justify-center mb-3">
              <Ionicons name={service1.icon} size={22} color="#1672EC" />
            </View>
            <Text className="text-text-primary font-bold text-lg mb-1">
              {service1.name}
            </Text>
            <Text className="text-text-secondary">{service1.count}</Text>
          </View>
        </TouchableOpacity>

        {service2 && (
          <TouchableOpacity
            onPress={service2.onTap}
            className="flex-1 bg-white rounded-xl p-5 shadow-lg border border-accent"
          >
            <View>
              <View className="w-12 h-12 bg-accent rounded-full items-center justify-center mb-3">
                <Ionicons name={service2.icon} size={22} color="#1672EC" />
              </View>
              <Text className="text-text-primary font-bold text-lg mb-1">
                {service2.name}
              </Text>
              <Text className="text-text-secondary">{service2.count}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Group services into pairs for the grid layout
  const renderServiceGrid = () => {
    const rows = [];
    for (let i = 0; i < services.length; i += 2) {
      if (i + 1 < services.length) {
        rows.push(renderServiceRow(services[i], services[i + 1]));
      } else {
        rows.push(renderServiceRow(services[i]));
      }
    }
    return rows;
  };

  // Render each pending customer item
  const renderPendingCustomerItem = (item: PendingCustomer) => {
    return (
      <View
        key={item.id}
        className="bg-white rounded-xl p-4 mb-3 shadow-md border border-accent"
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-accent rounded-full items-center justify-center mr-3">
              <Ionicons name="person" size={20} color="#1672EC" />
            </View>
            <View>
              <Text className="text-text-primary font-bold text-lg">
                {item.name}
              </Text>
              <Text className="text-red-500 font-medium">
                {Helper.formatRupees(item.totalAmount)}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="bg-primary rounded-lg px-3 py-1"
            onPress={() =>
              navigation.navigate("pendingPayments", { customer: item })
            }
          >
            <Text className="text-white font-medium">See Transactions</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-primary-bg justify-center items-center">
        <StatusBar className="bg-primary" />
        <ActivityIndicator size="large" color="#1672EC" />
        <Text className="text-text-primary mt-4">Loading dashboard...</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar className="bg-primary" />
      <SafeAreaView className="flex-1 bg-primary-bg">
        <View className="bg-primary px-4 py-4 shadow-md">
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-2xl font-bold">Hello, mom</Text>
            <TouchableOpacity className="p-2" onPress={loadDashboardData}>
              <Ionicons name="refresh-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Single ScrollView for the entire content */}
        <ScrollView
          className="flex-1 px-4 py-6"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={["#1672EC"]}
            />
          }
        >
          {/* Service Grid Section */}
          {renderServiceGrid()}

          {/* Summary Grid */}
          <View className="flex-row gap-4 mb-4">
            <View className="flex-1 bg-white rounded-xl p-5 shadow-lg border border-accent">
              <View className="w-12 h-12 bg-lightError rounded-full items-center justify-center mb-3">
                <Ionicons name="wallet-outline" size={22} color="#FF4D4F" />
              </View>
              <Text className="text-text-primary font-bold text-lg mb-1">
                Pending Amount
              </Text>
              <Text className="text-text-secondary">
                {Helper.formatRupees(dashboardStats.financial.pendingAmount)}
              </Text>
            </View>

            <View className="flex-1 bg-white rounded-xl p-5 shadow-lg border border-accent">
              <View className="w-12 h-12 bg-lightSuccess rounded-full items-center justify-center mb-3">
                <Ionicons
                  name="trending-up-outline"
                  size={22}
                  color="#4CAF50"
                />
              </View>
              <Text className="text-text-primary font-bold text-lg mb-1">
                Earned Amount
              </Text>
              <Text className="text-text-secondary">
                {Helper.formatRupees(dashboardStats.financial.earnedAmount)}
              </Text>
            </View>
          </View>

          {/* Pending Payments Section */}
          <View>
            <View className="flex-row justify-between py-4 items-center">
              <Text className="text-text-primary font-bold text-lg">
                Pending Payments
              </Text>
            </View>

            <View>
              {pendingCustomers.length > 0 ? (
                pendingCustomers.map((item) => renderPendingCustomerItem(item))
              ) : (
                <View className="bg-white rounded-xl p-6 shadow-md border border-accent items-center justify-center">
                  <Ionicons name="checkmark-circle" size={50} color="#4CAF50" />
                  <Text className="text-text-primary text-lg font-bold mt-3">
                    No Pending Payments
                  </Text>
                  <Text className="text-text-secondary text-center mt-1">
                    All customers are up to date with their payments
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Add some bottom padding to ensure the FAB doesn't cover content */}
          <View className="h-20" />
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("addOrder")}
          className="absolute bottom-6 right-6 w-14 h-14 bg-button-primary rounded-full items-center justify-center shadow-lg"
        >
          <Ionicons name="add" size={40} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

export default Dashboard;
