import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Helper from "@/utils/helpers";

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

const Dashboard = ({ navigation, route }: any) => {
  // Sample pending customers data
  const [pendingCustomers, setPendingCustomers] = useState<PendingCustomer[]>([
    {
      id: "1",
      name: "Atharva Bakri",
      pendingMonths: [
        { month: "February", year: 2025, amount: 250 },
        { month: "March", year: 2025, amount: 350 },
      ],
      totalAmount: 600,
    },
    {
      id: "2",
      name: "Rahul Sharma",
      pendingMonths: [{ month: "March", year: 2025, amount: 420 }],
      totalAmount: 420,
    },
    {
      id: "3",
      name: "Priya Patel",
      pendingMonths: [
        { month: "January", year: 2025, amount: 180 },
        { month: "February", year: 2025, amount: 220 },
        { month: "March", year: 2025, amount: 200 },
      ],
      totalAmount: 600,
    },
    {
      id: "4",
      name: "Amit Verma",
      pendingMonths: [{ month: "March", year: 2025, amount: 350 }],
      totalAmount: 350,
    },
    {
      id: "5",
      name: "Neha Desai",
      pendingMonths: [{ month: "February", year: 2025, amount: 480 }],
      totalAmount: 480,
    },
  ]);

  // Services grid data
  const services: ServiceItem[] = [
    {
      id: "1",
      name: "Products",
      icon: "cube-outline",
      count: "43 items",
      onTap: () => {
        navigation.navigate("products");
      },
    },
    {
      id: "2",
      name: "Customizations",
      icon: "color-palette-outline",
      count: "12 options",
      onTap: () => {
        navigation.navigate("customization");
      },
    },
    {
      id: "3",
      name: "Customers",
      icon: "people-outline",
      count: "152 active",
      onTap: () => {
        navigation.navigate("customers");
      },
    },
  ];

  const renderServiceRow = (service1: ServiceItem, service2?: ServiceItem) => {
    if (service1 != null && service2 == null) {
      return (
        <TouchableOpacity
          key={`${service1.id} || "empty"}`}
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

  // Calculate total pending amount from all customers
  const totalPendingAmount = pendingCustomers.reduce(
    (sum, customer) => sum + customer.totalAmount,
    0
  );

  // Render each pending customer item
  const renderPendingCustomerItem = ({ item }: { item: PendingCustomer }) => {
    return (
      <View className="bg-white rounded-xl p-4 mb-3 shadow-md border border-accent">
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
                {Helper.formatRupees(item.totalAmount)} pending
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

  return (
    <>
      <StatusBar className="bg-primary" />
      <SafeAreaView className="flex-1 bg-primary-bg">
        <View className="bg-primary px-4 py-4 shadow-md">
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-2xl font-bold">Hello, mom</Text>
            <TouchableOpacity className="p-2">
              <Ionicons name="person-circle-outline" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-1">
          <ScrollView className="flex-1 px-4 py-6" nestedScrollEnabled={false}>
            {renderServiceGrid()}

            {/* Summary Grid */}
            <View className="flex-row gap-4 mb-6">
              <View className="flex-1 bg-white rounded-xl p-5 shadow-lg border border-accent">
                <View className="w-12 h-12 bg-lightError rounded-full items-center justify-center mb-3">
                  <Ionicons name="wallet-outline" size={22} color="#FF4D4F" />
                </View>
                <Text className="text-text-primary font-bold text-lg mb-1">
                  Pending Amount
                </Text>
                <Text className="text-text-secondary">
                  {Helper.formatRupees(totalPendingAmount)}
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
                  {Helper.formatRupees(1000)}
                </Text>
              </View>
            </View>

            {/* Pending Payments Section Header */}
          </ScrollView>
          <View className="flex-1">
            <View className="flex-row justify-between px-4 py-4 items-center">
              <Text className="text-text-primary font-bold text-lg">
                Pending Payments
              </Text>
              {/* <TouchableOpacity
                onPress={() => navigation.navigate("allPendingPayments")}
                className="flex-row items-center"
              >
                <Text className="text-primary mr-1">View All</Text>
                <Ionicons name="chevron-forward" size={16} color="#1672EC" />
              </TouchableOpacity> */}
            </View>

            <View className="px-4 mb-4" style={{ height: 400 }}>
              {pendingCustomers.length > 0 ? (
                <FlatList
                  data={pendingCustomers}
                  renderItem={renderPendingCustomerItem}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={true}
                  className="mb-20"
                />
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
        </View>

        {/* Floating Action Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("addOrder")}
          className="absolute bottom-6 right-6 w-14 h-14 bg-button-primary rounded-full items-center justify-center shadow-lg"
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

export default Dashboard;
