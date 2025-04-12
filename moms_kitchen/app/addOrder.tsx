import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StatusBar,
  SafeAreaView,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Customer,
  Customization,
  NodeResponse,
  Product,
} from "@/interfaces/interface";
import useFetch from "@/hooks/useFetch";
import {
  getAllCustomers,
  getAllCustomizations,
  getAllProducts,
  createOrder,
} from "@/services/api";
import LoadingButton from "@/components/loadingBtn"; // Import the LoadingButton component

// Define interfaces
interface OrderItem {
  productId: string;
  quantity: number;
  customizationId: string;
}

const AddOrder = ({ navigation }: any) => {
  const { data: customerResponse } = useFetch<NodeResponse>(() =>
    getAllCustomers()
  );
  const { data: productResponse } = useFetch<NodeResponse>(() =>
    getAllProducts()
  );
  const { data: customizationResponse } = useFetch<NodeResponse>(() =>
    getAllCustomizations()
  );

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customizations, setCustomizations] = useState<Customization[]>([]);
  const [isSaving, setIsSaving] = useState(false); // Add loading state for save operation

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedOrderTime, setSelectedOrderTime] = useState("MORNING");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { productId: "", quantity: 1, customizationId: "" },
  ]);

  // Dropdown states
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [openProductDropdown, setOpenProductDropdown] = useState(-1);
  const [openCustomizationDropdown, setOpenCustomizationDropdown] =
    useState(-1);

  useEffect(() => {
    if (
      customerResponse?.success &&
      customerResponse.data &&
      Array.isArray(customerResponse.data)
    ) {
      setCustomers(customerResponse.data);
    }

    if (
      productResponse?.success &&
      productResponse.data &&
      Array.isArray(productResponse.data)
    ) {
      setProducts(productResponse.data);
    }

    if (
      customizationResponse?.success &&
      customizationResponse.data &&
      Array.isArray(customizationResponse.data)
    ) {
      setCustomizations(customizationResponse.data);
    }
  }, [customerResponse, productResponse, customizationResponse]);

  // Handle saving the order
  const handleSaveOrder = async () => {
    // Validate all fields are filled
    if (!selectedCustomer || !selectedOrderTime) {
      ToastAndroid.showWithGravityAndOffset(
        "Please select customer and order time",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }

    const validItems = orderItems.filter(
      (item) => item.productId && item.customizationId && item.quantity > 0
    );

    if (validItems.length === 0) {
      ToastAndroid.showWithGravityAndOffset(
        "Please add at least one valid item",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }

    try {
      setIsSaving(true);

      // Call the API to create the order
      const response = await createOrder(
        selectedCustomer,
        selectedOrderTime,
        validItems
      );

      ToastAndroid.showWithGravityAndOffset(
        response.message || "Order created successfully",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

      // Navigate back to previous screen
      navigation.goBack();
    } catch (error) {
      console.error("Error creating order:", error);

      // Show error message
      ToastAndroid.showWithGravityAndOffset(
        error instanceof Error ? error.message : "Failed to create order",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setIsSaving(false);
    }
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
                  ? customers.find((c) => c.id === selectedCustomer)?.name
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
                  {customers.map((customer: Customer) => (
                    <Pressable
                      key={customer.id}
                      className={`p-3 border-b border-light ${
                        selectedCustomer === customer.id
                          ? "bg-accent bg-opacity-20"
                          : ""
                      }`}
                      onPress={() => {
                        setSelectedCustomer(customer.id!);
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
                      ? products.find((p) => p.id === item.productId)?.name
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
                      {products.map((product: Product) => (
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
                      ToastAndroid.showWithGravityAndOffset(
                        "Please select a product first",
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                      );
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
                      ? customizations.find(
                          (c) => c.id === item.customizationId
                        )?.description
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
                      {customizations
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
                              {customization.description}
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

        {/* Save Button (Bottom) - Replace with LoadingButton */}
        <LoadingButton
          className="bg-primary rounded-lg py-3 mb-10"
          isLoading={isSaving}
          loadingText="Saving Order"
          defaultText="Save Order"
          onPress={handleSaveOrder}
          disabled={isSaving}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddOrder;
