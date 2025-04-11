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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Customer } from "@/interfaces/interface";

// Sample initial customers
const initialCustomers = [
  { id: "1", name: "John Smith", mobileNumber: "555-123-4567" },
  { id: "2", name: "Maria Garcia", mobileNumber: "555-987-6543" },
  { id: "3", name: "Robert Johnson", mobileNumber: "555-456-7890" },
  { id: "4", name: "Sarah Williams", mobileNumber: "555-234-5678" },
  { id: "5", name: "David Lee", mobileNumber: "555-876-5432" },
  { id: "6", name: "Jennifer Brown", mobileNumber: "555-345-6789" },
  { id: "7", name: "Michael Davis", mobileNumber: "555-765-4321" },
  { id: "8", name: "Emily Wilson", mobileNumber: "555-543-2109" },
  { id: "9", name: "James Taylor", mobileNumber: "555-321-0987" },
  { id: "10", name: "Linda Martinez", mobileNumber: "555-654-3210" },
];

const CustomerScreen = ({ navigation, route }: any) => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [filteredCustomers, setFilteredCustomers] =
    useState<Customer[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [newCustomerName, setNewCustomerName] = useState<string>("");
  const [newCustomerMobile, setNewCustomerMobile] = useState<string>("");

  // Filter customers based on search query
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

  // Handle adding a new customer
  const handleAddCustomer = () => {
    if (newCustomerName.trim() === "" || newCustomerMobile.trim() === "")
      return;

    const newCustomer = {
      id: Date.now().toString(),
      name: newCustomerName.trim(),
      mobileNumber: newCustomerMobile.trim(),
    };

    setCustomers([...customers, newCustomer]);

    // Reset form and close modal
    setNewCustomerName("");
    setNewCustomerMobile("");
    setIsAddModalVisible(false);
  };

  // Handle viewing customer details
  const handleViewCustomer = (customer: Customer) => {
    // In a real app, navigate to the customer details page
    navigation.navigate("customerDetails", { customer });
  };

  // Render each customer item
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

  // Determine if main content should be faded
  const isModalOpen = isAddModalVisible;

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1 bg-primary-bg">
        {/* Main Content */}
        <View className="flex-1" style={{ opacity: isModalOpen ? 0.3 : 1 }}>
          {/* Header */}
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
            </View>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            <View className="p-4">
              {/* Search Bar */}
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

              {filteredCustomers.length > 0 ? (
                <FlatList
                  data={filteredCustomers}
                  renderItem={renderCustomerItem}
                  keyExtractor={(item) => item.id}
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

          {/* Floating Add Button */}
          <TouchableOpacity
            className="absolute bottom-6 right-6 w-14 h-14 bg-button-primary rounded-full items-center justify-center shadow-lg"
            onPress={() => setIsAddModalVisible(true)}
          >
            <Ionicons name="add" size={30} color="white" />
          </TouchableOpacity>
        </View>

        {/* Add Customer Modal */}
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

              {/* Name Input */}
              <View className="mb-4">
                <Text className="text-text-secondary mb-1">Name</Text>
                <TextInput
                  className="bg-light rounded-lg p-3 text-text-primary"
                  placeholder="Customer name"
                  value={newCustomerName}
                  onChangeText={setNewCustomerName}
                />
              </View>

              {/* Mobile Input */}
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
                <TouchableOpacity
                  className="flex-1 bg-primary rounded-lg py-3"
                  onPress={handleAddCustomer}
                >
                  <Text className="text-white font-medium text-center">
                    Add Customer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

export default CustomerScreen;
