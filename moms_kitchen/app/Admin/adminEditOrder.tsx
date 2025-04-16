import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  ScrollView,
  TextInput,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { updateOrderAdmin } from "../../services/adminsApi";
import { getAllProductsWithCustomizations } from "../../services/momsApi";
import LoadingButton from "@/components/loadingBtn";

const screenWidth = Dimensions.get("window").width;

// Custom Dropdown Component
const Dropdown = ({
  options,
  selectedValue,
  onSelect,
  label,
}: {
  options: { label: string; value: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
  label: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className="mb-4">
      <View className="flex-row items-center mb-2">
        <Ionicons
          name={label.includes("Time") ? "time-outline" : "bookmark-outline"}
          size={18}
          color="#1672EC"
        />
        <Text className="text-text-primary font-medium ml-2">{label}</Text>
      </View>

      <View className="relative">
        <TouchableOpacity
          className="bg-light rounded-lg p-3 flex-row justify-between items-center border border-accent border-opacity-30"
          onPress={() => setIsOpen(!isOpen)}
        >
          <Text className="text-text-primary font-medium">
            {options.find((option) => option.value === selectedValue)?.label ||
              "Select an option"}
          </Text>
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={16}
            color="#1672EC"
          />
        </TouchableOpacity>

        {isOpen && (
          <View className="absolute top-12 left-0 right-0 bg-white rounded-lg shadow-xl border border-accent z-50">
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                className={`p-3 ${
                  selectedValue === option.value ? "bg-primary-bg" : ""
                } ${
                  option !== options[options.length - 1]
                    ? "border-b border-light"
                    : ""
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
    </View>
  );
};

const AdminEditOrderScreen = ({ navigation, route }: any) => {
  const { order } = route.params;

  console.log("Order");
  console.log(order);
  console.log(order.orderAmount);

  const [orderTime, setOrderTime] = useState<string>(order.orderTime);
  const [orderStatus, setOrderStatus] = useState<string>(order.orderStatus);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [orderItems, setOrderItems] = useState<any[]>(order.Item);
  const [totalAmount, setTotalAmount] = useState<number>(order.orderAmount);
  const [products, setProducts] = useState<any[]>([]);
  const [isProductModalVisible, setIsProductModalVisible] =
    useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedCustomization, setSelectedCustomization] = useState<any>(null);
  const [itemQuantity, setItemQuantity] = useState<string>("1");
  const [editingItemIndex, setEditingItemIndex] = useState<number>(-1);

  // Time options
  const timeOptions = [
    { label: "Morning", value: "MORNING" },
    { label: "Evening", value: "EVENING" },
  ];

  // Status options
  const statusOptions = [
    { label: "Paid", value: "PAID" },
    { label: "Unpaid", value: "UNPAID" },
  ];

  useEffect(() => {
    // Fetch products with customizations
    fetchProducts();
  }, []);

  useEffect(() => {
    // Recalculate total amount when order items change
    calculateTotalAmount();
  }, [orderItems]);

  const fetchProducts = async () => {
    try {
      const response = await getAllProductsWithCustomizations();
      if (response.success) {
        setProducts(response.data || []);
      } else {
        ToastAndroid.showWithGravityAndOffset(
          "Failed to fetch products",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      ToastAndroid.showWithGravityAndOffset(
        "Error loading products",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  };

  const calculateTotalAmount = () => {
    const total = orderItems.reduce((sum, item) => {
      // Ensure we're using the correct price value
      const customizationPrice = parseFloat(item.customization?.price || 0);
      const quantity = parseInt(item.quantity || 0);
      return sum + customizationPrice * quantity;
    }, 0);

    setTotalAmount(total);
  };

  const handleUpdateOrder = async () => {
    try {
      setIsUpdating(true);

      if (orderItems.length === 0) {
        ToastAndroid.showWithGravityAndOffset(
          "Please add at least one item to the order",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        return;
      }

      // Prepare items data
      const itemsData = orderItems.map((item) => ({
        id: item.id,
        productId: item.product?.id || item.productId,
        customizationId: item.customization?.id || item.customizationId,
        quantity: parseInt(item.quantity),
      }));

      console.log("Updatinggg...");

      // Call API to update the order
      const response = await updateOrderAdmin(
        order.id,
        orderTime,
        orderStatus,
        itemsData,
        totalAmount
      );

      if (response.success) {
        ToastAndroid.showWithGravityAndOffset(
          response.message || "Order updated successfully",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        navigation.reset({
          index: 1, // This indicates that the second screen (index 1) is the active one
          routes: [
            { name: "adminDashboard" }, // First in stack (index 0)
            { name: "adminOrders" }, // Second in stack, currently visible (index 1)
          ],
        });
      } else {
        ToastAndroid.showWithGravityAndOffset(
          response.message || "Failed to update order",
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
      setIsUpdating(false);
    }
  };

  const handleAddItem = () => {
    // Reset selected values
    setSelectedProduct(null);
    setSelectedCustomization(null);
    setItemQuantity("1");
    setEditingItemIndex(-1);

    // Show product selection modal
    setIsProductModalVisible(true);
  };

  const handleEditItem = (index: number) => {
    const item = orderItems[index];

    // Set values for editing
    setSelectedProduct(item.product);
    setSelectedCustomization(item.customization);
    setItemQuantity(item.quantity.toString());
    setEditingItemIndex(index);

    // Show product selection modal
    setIsProductModalVisible(true);
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = [...orderItems];
    updatedItems.splice(index, 1);
    setOrderItems(updatedItems);
  };

  const handleSaveItem = () => {
    if (!selectedProduct || !selectedCustomization || !itemQuantity) {
      ToastAndroid.showWithGravityAndOffset(
        "Please select product, customization and quantity",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }

    const quantity = parseInt(itemQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      ToastAndroid.showWithGravityAndOffset(
        "Please enter a valid quantity",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }

    const newItem = {
      id:
        editingItemIndex >= 0
          ? orderItems[editingItemIndex].id
          : `temp-${Date.now()}`,
      product: selectedProduct,
      customization: selectedCustomization,
      quantity: quantity,
      productId: selectedProduct.id,
      customizationId: selectedCustomization.id,
    };

    let updatedItems;
    if (editingItemIndex >= 0) {
      // Edit existing item
      updatedItems = [...orderItems];
      updatedItems[editingItemIndex] = newItem;
    } else {
      // Add new item
      updatedItems = [...orderItems, newItem];
    }

    setOrderItems(updatedItems);
    setIsProductModalVisible(false);
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

  // Calculate item price
  const calculateItemPrice = (item: any) => {
    const price = parseFloat(item.customization?.price || 0);
    const quantity = parseInt(item.quantity || 0);
    return (price * quantity).toFixed(2);
  };

  // Render order items
  const renderOrderItems = () => {
    return orderItems.map((item, index) => (
      <View
        key={item.id || index}
        className="bg-white rounded-xl p-4 mb-3 border border-light shadow-sm"
        style={{ opacity: isProductModalVisible ? 0.5 : 1 }}
      >
        {/* Header with product info and action buttons */}
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 bg-accent rounded-full items-center justify-center mr-3">
              <Ionicons name="cafe-outline" size={18} color="#1672EC" />
            </View>
            <View className="flex-1">
              <Text className="text-text-primary font-bold text-base">
                {item.product?.name || "Unknown Product"}
              </Text>
              <Text className="text-text-secondary text-xs">
                {item.customization?.description || ""}
              </Text>
            </View>
          </View>

          <View className="flex-row">
            <TouchableOpacity
              className="bg-amber-500 rounded-full w-9 h-9 items-center justify-center mr-2 shadow-sm"
              onPress={() => handleEditItem(index)}
            >
              <Ionicons name="pencil" size={16} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-red-500 rounded-full w-9 h-9 items-center justify-center shadow-sm"
              onPress={() => handleDeleteItem(index)}
            >
              <Ionicons name="trash" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Item details */}
        <View className="flex-row justify-between items-center mt-2 pb-2 pt-2 bg-light bg-opacity-50 rounded-lg px-3">
          <View className="flex-row items-center">
            <Ionicons name="cube-outline" size={16} color="#7C84A3" />
            <Text className="text-text-secondary ml-1">
              Qty:{" "}
              <Text className="text-text-primary font-medium">
                {item.quantity}
              </Text>
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="pricetag-outline" size={16} color="#7C84A3" />
            <Text className="text-text-secondary ml-1">
              Price:{" "}
              <Text className="text-primary font-bold">
                ₹{calculateItemPrice(item)}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    ));
  };

  // Render product selection modal
  const renderProductModal = () => {
    return (
      <Modal
        visible={isProductModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsProductModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center p-4">
          <View
            className="bg-white rounded-xl w-full p-5 shadow-xl"
            style={{ maxHeight: screenWidth * 1.5 }} // Increased max height for better content display
          >
            {/* Modal Header */}
            <View className="flex-row justify-between items-center mb-5 border-b border-light pb-3">
              <Text className="text-text-primary font-bold text-xl">
                {editingItemIndex >= 0 ? "Edit Item" : "Add New Item"}
              </Text>
              <TouchableOpacity
                className="bg-light rounded-full p-1"
                onPress={() => setIsProductModalVisible(false)}
              >
                <Ionicons name="close" size={22} color="#7C84A3" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
              {/* Product Selection Section */}
              <View className="mb-4">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="cafe-outline" size={18} color="#1672EC" />
                  <Text className="text-text-primary font-medium ml-2">
                    Product
                  </Text>
                </View>

                <View className="bg-light rounded-lg p-3 border border-accent border-opacity-40">
                  <ScrollView
                    className="max-h-28"
                    showsVerticalScrollIndicator={false}
                  >
                    {products.map((product) => (
                      <TouchableOpacity
                        key={product.id}
                        className={`py-3 px-3 mb-1 rounded-lg ${
                          selectedProduct?.id === product.id
                            ? "bg-primary-bg bg-opacity-10 border border-primary border-opacity-30"
                            : "border border-transparent"
                        }`}
                        onPress={() => {
                          setSelectedProduct(product);
                          setSelectedCustomization(null);
                        }}
                      >
                        <Text
                          className={`${
                            selectedProduct?.id === product.id
                              ? "text-primary font-medium"
                              : "text-text-primary"
                          }`}
                        >
                          {product.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              {/* Customization Selection - Only shown if product is selected */}
              {selectedProduct && (
                <View className="mb-4">
                  <View className="flex-row items-center mb-2">
                    <Ionicons
                      name="options-outline"
                      size={18}
                      color="#1672EC"
                    />
                    <Text className="text-text-primary font-medium ml-2">
                      Customization
                    </Text>
                  </View>

                  <View className="bg-light rounded-lg p-3 border border-accent border-opacity-40">
                    <ScrollView
                      className="max-h-32"
                      showsVerticalScrollIndicator={false}
                    >
                      {selectedProduct.Customizations?.map(
                        (customization: any) => (
                          <TouchableOpacity
                            key={customization.id}
                            className={`py-3 px-3 mb-1 rounded-lg ${
                              selectedCustomization?.id === customization.id
                                ? "bg-primary-bg bg-opacity-10 border border-primary border-opacity-30"
                                : "border border-transparent"
                            }`}
                            onPress={() =>
                              setSelectedCustomization(customization)
                            }
                          >
                            <View className="flex-row justify-between items-center">
                              <Text
                                className={`${
                                  selectedCustomization?.id === customization.id
                                    ? "text-primary font-medium"
                                    : "text-text-primary"
                                }`}
                              >
                                {customization.description}
                              </Text>
                              <View className="bg-white px-3 py-1 rounded-full shadow-sm">
                                <Text
                                  className={`${
                                    selectedCustomization?.id ===
                                    customization.id
                                      ? "text-primary font-medium"
                                      : "text-text-secondary"
                                  }`}
                                >
                                  ₹{parseFloat(customization.price).toFixed(2)}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        )
                      )}
                    </ScrollView>
                  </View>
                </View>
              )}

              {/* Quantity Selector */}
              <View className="mb-5">
                <View className="flex-row items-center mb-2">
                  <Ionicons
                    name="calculator-outline"
                    size={18}
                    color="#1672EC"
                  />
                  <Text className="text-text-primary font-medium ml-2">
                    Quantity
                  </Text>
                </View>

                <View className="flex-row items-center justify-center bg-light rounded-lg p-2 border border-accent border-opacity-40">
                  <TouchableOpacity
                    className="bg-primary w-12 h-12 rounded-l-lg items-center justify-center"
                    onPress={() => {
                      const currentValue = parseInt(itemQuantity) || 0;
                      if (currentValue > 1) {
                        setItemQuantity((currentValue - 1).toString());
                      }
                    }}
                  >
                    <Ionicons name="remove" size={24} color="white" />
                  </TouchableOpacity>

                  <TextInput
                    className="bg-white h-12 text-center text-text-primary flex-1 text-xl font-bold mx-2 rounded-lg shadow-sm"
                    keyboardType="number-pad"
                    value={itemQuantity}
                    onChangeText={setItemQuantity}
                  />

                  <TouchableOpacity
                    className="bg-primary w-12 h-12 rounded-r-lg items-center justify-center"
                    onPress={() => {
                      const currentValue = parseInt(itemQuantity) || 0;
                      setItemQuantity((currentValue + 1).toString());
                    }}
                  >
                    <Ionicons name="add" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Preview Card */}
              {selectedProduct &&
                selectedCustomization &&
                itemQuantity &&
                parseInt(itemQuantity) > 0 && (
                  <View className="bg-accent bg-opacity-20 rounded-xl p-4 mb-5 border border-primary border-opacity-20">
                    <Text className="text-primary font-medium mb-2">
                      Preview
                    </Text>
                    <View className="flex-row justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                      <View className="flex-1">
                        <Text className="text-text-primary font-medium text-lg">
                          {selectedProduct.name}
                        </Text>
                        <Text className="text-text-secondary">
                          {selectedCustomization.description}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-primary font-bold text-lg">
                          ₹
                          {(
                            parseFloat(selectedCustomization.price) *
                            parseInt(itemQuantity)
                          ).toFixed(2)}
                        </Text>
                        <Text className="text-text-secondary text-xs text-right">
                          ({parseInt(itemQuantity)} × ₹
                          {parseFloat(selectedCustomization.price).toFixed(2)})
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
            </ScrollView>

            {/* Action Buttons */}
            <View className="flex-row justify-between pt-3 border-t border-light">
              <TouchableOpacity
                className="flex-1 bg-light rounded-xl py-3 mr-3 border border-accent border-opacity-30"
                onPress={() => setIsProductModalVisible(false)}
              >
                <Text className="text-text-secondary font-medium text-center">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-1 rounded-xl py-3 ${
                  selectedProduct &&
                  selectedCustomization &&
                  itemQuantity &&
                  parseInt(itemQuantity) > 0
                    ? "bg-primary"
                    : "bg-primary opacity-50"
                }`}
                onPress={handleSaveItem}
                disabled={
                  !selectedProduct ||
                  !selectedCustomization ||
                  !itemQuantity ||
                  parseInt(itemQuantity) <= 0
                }
              >
                <Text className="text-white font-bold text-center">
                  {editingItemIndex >= 0 ? "Update Item" : "Add to Order"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <>
      <StatusBar className="bg-primary" />
      <SafeAreaView
        className="flex-1 bg-primary-bg"
        style={{ opacity: isProductModalVisible ? 0.5 : 1 }}
      >
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
              <Text className="text-white text-xl font-bold">Edit Order</Text>
            </View>
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 p-4"
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Main Content Card */}
            <View className="bg-white rounded-xl p-5 shadow-md border border-accent mb-5">
              {/* Order Header */}
              <View className="items-center mb-5 pb-4 border-b border-light">
                <View className="w-16 h-16 bg-accent rounded-full items-center justify-center mb-3">
                  <Ionicons name="receipt-outline" size={30} color="#1672EC" />
                </View>
                <Text className="text-text-primary font-bold text-xl mb-1">
                  Update Order Details
                </Text>
                <Text className="text-text-secondary text-center">
                  Make changes to this order and save when done
                </Text>
              </View>

              {/* Customer Information */}
              <View className="mb-4">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="person-outline" size={18} color="#1672EC" />
                  <Text className="text-text-primary font-medium ml-2">
                    Customer
                  </Text>
                </View>
                <View className="bg-light rounded-lg p-3 border border-accent border-opacity-30 flex-row items-center">
                  <View className="w-8 h-8 bg-primary-bg bg-opacity-20 rounded-full items-center justify-center mr-2">
                    <Text className="text-primary font-bold">
                      {order.customer?.name?.[0] || "C"}
                    </Text>
                  </View>
                  <Text className="text-text-primary font-medium">
                    {order.customer?.name}
                  </Text>
                </View>
              </View>

              {/* Order Date */}
              <View className="mb-4">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="calendar-outline" size={18} color="#1672EC" />
                  <Text className="text-text-primary font-medium ml-2">
                    Order Date
                  </Text>
                </View>
                <View className="bg-light rounded-lg p-3 border border-accent border-opacity-30">
                  <Text className="text-text-primary">
                    {formatDate(order.orderDate)}
                  </Text>
                </View>
              </View>

              {/* Order Time and Status Dropdowns */}
              <Dropdown
                options={timeOptions}
                selectedValue={orderTime}
                onSelect={setOrderTime}
                label="Order Time"
              />

              <Dropdown
                options={statusOptions}
                selectedValue={orderStatus}
                onSelect={setOrderStatus}
                label="Order Status"
              />

              {/* Order Items Section */}
              <View className="mb-5 mt-2">
                <View className="flex-row justify-between items-center mb-3 pb-2 border-b border-light">
                  <View className="flex-row items-center">
                    <Ionicons name="list-outline" size={18} color="#1672EC" />
                    <Text className="text-text-primary font-medium ml-2">
                      Order Items
                    </Text>
                  </View>
                  <TouchableOpacity
                    className="bg-primary rounded-lg px-4 py-2 shadow-sm"
                    onPress={handleAddItem}
                  >
                    <View className="flex-row items-center">
                      <Ionicons
                        name="add-circle-outline"
                        size={16}
                        color="white"
                      />
                      <Text className="text-white font-medium text-sm ml-1">
                        Add Item
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {orderItems.length > 0 ? (
                  <View>
                    {renderOrderItems()}
                    <View className="bg-accent bg-opacity-10 rounded-xl p-4 mt-3 border border-primary border-opacity-20">
                      <View className="flex-row justify-between items-center pb-2 mb-2 border-b border-accent border-opacity-20">
                        <Text className="text-text-primary font-medium">
                          Items Count:
                        </Text>
                        <View className="bg-primary rounded-full px-3 py-1">
                          <Text className="text-white font-bold">
                            {orderItems.length}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row justify-between items-center">
                        <Text className="text-text-primary font-bold">
                          Total Amount:
                        </Text>
                        <Text className="text-primary font-bold text-xl">
                          ₹{totalAmount.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View className="bg-light rounded-xl p-6 items-center border border-accent border-opacity-30">
                    <Ionicons name="cart-outline" size={40} color="#7C84A3" />
                    <Text className="text-text-secondary mt-3 text-center">
                      No items in this order.{"\n"}Click "Add Item" to add some
                      products.
                    </Text>
                  </View>
                )}
              </View>

              {/* Action Buttons */}
              <View className="flex-row justify-between mt-4 pt-3 border-t border-light">
                <TouchableOpacity
                  className="flex-1 bg-light rounded-xl py-3 mr-3 border border-accent border-opacity-30"
                  onPress={() => navigation.goBack()}
                  disabled={isUpdating}
                >
                  <Text className="text-text-secondary font-medium text-center">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <LoadingButton
                  onPress={handleUpdateOrder}
                  isLoading={isUpdating}
                  loadingText="Updating..."
                  defaultText="Save Changes"
                  disabled={isUpdating}
                  className="flex-1 bg-primary rounded-xl py-3 items-center justify-center"
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {renderProductModal()}
      </SafeAreaView>
    </>
  );
};

export default AdminEditOrderScreen;
