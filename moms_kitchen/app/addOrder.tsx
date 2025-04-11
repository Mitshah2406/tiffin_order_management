import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Sample data for customers
const sampleCustomers = [
  { id: "67f3bc7df632155056b8424c", name: "Atharva Bakri" },
  { id: "67f3bc7df632155056b8424d", name: "Rahul Sharma" },
  { id: "67f3bc7df632155056b8424e", name: "Priya Patel" },
  { id: "67f3bc7df632155056b8424f", name: "Amit Verma" },
  { id: "67f3bc7df632155056b84250", name: "Sneha Gupta" },
  { id: "67f3bc7df632155056b84251", name: "Vikram Singh" },
  { id: "67f3bc7df632155056b84252", name: "Neha Desai" },
  { id: "67f3bc7df632155056b84253", name: "Rajesh Kumar" },
  { id: "67f3bc7df632155056b84254", name: "Ananya Sharma" },
  { id: "67f3bc7df632155056b84255", name: "Sanjay Patel" },
  { id: "67f3bc7df632155056b84256", name: "Meera Gupta" },
  { id: "67f3bc7df632155056b84257", name: "Anil Singh" },
];

// Sample data for products
const sampleProducts = [
  { id: "67f3bc87f632155056b8424d", name: "Chapati" },
  { id: "67f3bc87f632155056b8424e", name: "Naan" },
  { id: "67f3bc87f632155056b8424f", name: "Roti" },
];

// Sample data for customizations
const sampleCustomizations = [
  {
    id: "67f3bcaaf632155056b84250",
    name: "Plain",
    productId: "67f3bc87f632155056b8424d",
  },
  {
    id: "67f3bcb0f632155056b84251",
    name: "Butter",
    productId: "67f3bc87f632155056b8424d",
  },
  {
    id: "67f3bcb4f632155056b84252",
    name: "Garlic",
    productId: "67f3bc87f632155056b8424e",
  },
  {
    id: "67f3bcb9f632155056b84253",
    name: "Cheese",
    productId: "67f3bc87f632155056b8424e",
  },
  {
    id: "67f3bcbef632155056b84254",
    name: "Masala",
    productId: "67f3bc87f632155056b8424f",
  },
];

// Define interfaces
interface OrderItem {
  productId: string;
  quantity: number;
  customizationId: string;
}

interface OrderData {
  customerId: string;
  orderTime: string;
  items: OrderItem[];
}

const AddOrder = ({ navigation }: any) => {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedOrderTime, setSelectedOrderTime] = useState("EVENING");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { productId: "", quantity: 1, customizationId: "" },
  ]);

  // Dropdown states
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [openProductDropdown, setOpenProductDropdown] = useState(-1);
  const [openCustomizationDropdown, setOpenCustomizationDropdown] =
    useState(-1);

  // Search functionality
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");

  // Filter customers based on search query
  const filteredCustomers = sampleCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(customerSearchQuery.toLowerCase())
  );

  // Handle saving the order
  const handleSaveOrder = () => {
    // Validate all fields are filled
    if (!selectedCustomer || !selectedOrderTime) {
      alert("Please select customer and order time");
      return;
    }

    const validItems = orderItems.filter(
      (item) => item.productId && item.customizationId && item.quantity > 0
    );

    if (validItems.length === 0) {
      alert("Please add at least one valid item");
      return;
    }

    // Create order object
    const order: OrderData = {
      customerId: selectedCustomer,
      orderTime: selectedOrderTime,
      items: validItems,
    };

    // Here you would typically send the order to your API
    console.log("Order saved:", order);

    // Navigate back to previous screen
    navigation.goBack();
  };

  // Update item at specific index
  const handleUpdateItem = (index: number, field: string, value: any) => {
    const newItems = [...orderItems];
    newItems[index] = { ...newItems[index], [field]: value };

    // If product changes, reset customization
    if (field === "productId") {
      newItems[index].customizationId = "";
    }

    setOrderItems(newItems);
  };

  // Remove item at index
  const handleRemoveItem = (index: number) => {
    if (orderItems.length > 1) {
      const newItems = orderItems.filter((_, i) => i !== index);
      setOrderItems(newItems);
    }
  };

  // Add new item
  const handleAddItem = () => {
    setOrderItems([
      ...orderItems,
      { productId: "", quantity: 1, customizationId: "" },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-bg">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="bg-primary px-4 py-4 shadow-md">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Pressable className="mr-3" onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>
            <Text className="text-white text-xl font-bold">Add New Order</Text>
          </View>
        </View>
      </View>

      {/* Form Content */}
      <ScrollView className="flex-1 p-4">
        {/* Customer Dropdown */}
        <View className="mb-4">
          <Text className="text-text-secondary mb-1">Customer</Text>
          <View className="relative">
            <Pressable
              className="bg-light rounded-lg p-3 flex-row justify-between items-center"
              onPress={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
            >
              <Text className="text-text-primary">
                {selectedCustomer
                  ? sampleCustomers.find((c) => c.id === selectedCustomer)?.name
                  : "Select Customer"}
              </Text>
              <Ionicons
                name={isCustomerDropdownOpen ? "chevron-up" : "chevron-down"}
                size={16}
                color="#7C84A3"
              />
            </Pressable>

            {isCustomerDropdownOpen && (
              <View className="absolute top-14 left-0 right-0 bg-white rounded-lg shadow-lg border border-accent z-50 max-h-48">
                <ScrollView>
                  {sampleCustomers.map((customer) => (
                    <Pressable
                      key={customer.id}
                      className={`p-3 border-b border-light ${
                        selectedCustomer === customer.id
                          ? "bg-accent bg-opacity-20"
                          : ""
                      }`}
                      onPress={() => {
                        setSelectedCustomer(customer.id);
                        setIsCustomerDropdownOpen(false);
                      }}
                    >
                      <Text
                        className={`${
                          selectedCustomer === customer.id
                            ? "text-primary font-medium"
                            : "text-text-primary"
                        }`}
                      >
                        {customer.name}
                      </Text>
                    </Pressable>
                  ))}

                  {filteredCustomers.length === 0 && (
                    <View className="p-4 items-center">
                      <Text className="text-text-secondary">
                        No customers found
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}
          </View>
        </View>

        {/* Order Time Selector */}
        <View className="mb-4">
          <Text className="text-text-secondary mb-1">Order Time</Text>
          <View className="flex-row">
            <Pressable
              className={`flex-1 py-3 ${
                selectedOrderTime === "MORNING" ? "bg-primary" : "bg-light"
              } rounded-lg mr-2`}
              onPress={() => setSelectedOrderTime("MORNING")}
            >
              <Text
                className={`text-center font-medium ${
                  selectedOrderTime === "MORNING"
                    ? "text-white"
                    : "text-text-primary"
                }`}
              >
                Morning
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 py-3 ${
                selectedOrderTime === "EVENING" ? "bg-primary" : "bg-light"
              } rounded-lg`}
              onPress={() => setSelectedOrderTime("EVENING")}
            >
              <Text
                className={`text-center font-medium ${
                  selectedOrderTime === "EVENING"
                    ? "text-white"
                    : "text-text-primary"
                }`}
              >
                Evening
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Items List */}
        <Text className="text-text-primary font-bold text-lg mb-3">
          Order Items
        </Text>

        {orderItems.map((item, index) => (
          <View
            key={index}
            className="bg-white rounded-xl p-4 shadow-md border border-accent mb-4"
          >
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-text-primary font-bold">
                Item {index + 1}
              </Text>
              <Pressable
                className="p-2"
                onPress={() => handleRemoveItem(index)}
              >
                <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
              </Pressable>
            </View>

            {/* Product Dropdown */}
            <View className="mb-4">
              <Text className="text-text-secondary mb-1">Product</Text>
              <View className="relative">
                <Pressable
                  className="bg-light rounded-lg p-3 flex-row justify-between items-center"
                  onPress={() => {
                    setOpenProductDropdown(
                      openProductDropdown === index ? -1 : index
                    );
                    setOpenCustomizationDropdown(-1);
                  }}
                >
                  <Text className="text-text-primary">
                    {item.productId
                      ? sampleProducts.find((p) => p.id === item.productId)
                          ?.name
                      : "Select Product"}
                  </Text>
                  <Ionicons
                    name={
                      openProductDropdown === index
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={16}
                    color="#7C84A3"
                  />
                </Pressable>

                {openProductDropdown === index && (
                  <View className="absolute top-14 left-0 right-0 bg-white rounded-lg shadow-lg border border-accent z-50">
                    <ScrollView>
                      {sampleProducts.map((product) => (
                        <Pressable
                          key={product.id}
                          className={`p-3 border-b border-light ${
                            item.productId === product.id
                              ? "bg-accent bg-opacity-20"
                              : ""
                          }`}
                          onPress={() => {
                            handleUpdateItem(index, "productId", product.id);
                            setOpenProductDropdown(-1);
                          }}
                        >
                          <Text
                            className={`${
                              item.productId === product.id
                                ? "text-primary font-medium"
                                : "text-text-primary"
                            }`}
                          >
                            {product.name}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            {/* Customization Dropdown */}
            <View className="mb-4">
              <Text className="text-text-secondary mb-1">Customization</Text>
              <View className="relative">
                <Pressable
                  className="bg-light rounded-lg p-3 flex-row justify-between items-center"
                  onPress={() => {
                    if (item.productId) {
                      setOpenCustomizationDropdown(
                        openCustomizationDropdown === index ? -1 : index
                      );
                      setOpenProductDropdown(-1);
                    } else {
                      alert("Please select a product first");
                    }
                  }}
                >
                  <Text
                    className={`${
                      item.customizationId
                        ? "text-text-primary"
                        : "text-text-secondary"
                    }`}
                  >
                    {item.customizationId
                      ? sampleCustomizations.find(
                          (c) => c.id === item.customizationId
                        )?.name
                      : "Select Customization"}
                  </Text>
                  <Ionicons
                    name={
                      openCustomizationDropdown === index
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={16}
                    color="#7C84A3"
                  />
                </Pressable>

                {openCustomizationDropdown === index && (
                  <View className="absolute top-14 left-0 right-0 bg-white rounded-lg shadow-lg border border-accent z-50">
                    <ScrollView>
                      {sampleCustomizations
                        .filter((c) => c.productId === item.productId)
                        .map((customization) => (
                          <Pressable
                            key={customization.id}
                            className={`p-3 border-b border-light ${
                              item.customizationId === customization.id
                                ? "bg-accent bg-opacity-20"
                                : ""
                            }`}
                            onPress={() => {
                              handleUpdateItem(
                                index,
                                "customizationId",
                                customization.id
                              );
                              setOpenCustomizationDropdown(-1);
                            }}
                          >
                            <Text
                              className={`${
                                item.customizationId === customization.id
                                  ? "text-primary font-medium"
                                  : "text-text-primary"
                              }`}
                            >
                              {customization.name}
                            </Text>
                          </Pressable>
                        ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            {/* Quantity Input */}
            <View className="mb-2">
              <Text className="text-text-secondary mb-1">Quantity</Text>
              <View className="flex-row items-center">
                <Pressable
                  className="bg-light h-10 w-10 rounded-lg items-center justify-center"
                  onPress={() => {
                    const newQuantity = Math.max(1, item.quantity - 1);
                    handleUpdateItem(index, "quantity", newQuantity);
                  }}
                >
                  <Ionicons name="remove" size={20} color="#7C84A3" />
                </Pressable>

                <TextInput
                  className="bg-light rounded-lg p-2 mx-2 flex-1 text-center text-text-primary"
                  value={item.quantity.toString()}
                  onChangeText={(value) => {
                    const newQuantity = parseInt(value) || 1;
                    handleUpdateItem(index, "quantity", newQuantity);
                  }}
                  keyboardType="numeric"
                />

                <Pressable
                  className="bg-light h-10 w-10 rounded-lg items-center justify-center"
                  onPress={() => {
                    const newQuantity = item.quantity + 1;
                    handleUpdateItem(index, "quantity", newQuantity);
                  }}
                >
                  <Ionicons name="add" size={20} color="#7C84A3" />
                </Pressable>
              </View>
            </View>
          </View>
        ))}

        {/* Add Item Button */}
        <Pressable
          className="bg-accent bg-opacity-30 p-3 rounded-lg flex-row justify-center items-center mb-4"
          onPress={handleAddItem}
        >
          <Ionicons name="add-circle-outline" size={20} color="#1672EC" />
          <Text className="text-primary font-medium ml-2">
            Add Another Item
          </Text>
        </Pressable>

        {/* Save Button (Bottom) */}
        <Pressable
          className="bg-primary rounded-lg py-3 mb-10"
          onPress={handleSaveOrder}
        >
          <Text className="text-white font-medium text-center">Save Order</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddOrder;
