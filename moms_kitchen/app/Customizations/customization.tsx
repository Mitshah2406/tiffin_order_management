import React, { useState } from "react";
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
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Customization } from "@/interfaces/interface";

// Sample initial products (for dropdown)
const productOptions = [
  { id: "1", name: "Handmade Soap" },
  { id: "2", name: "Lavender Candle" },
  { id: "3", name: "Essential Oil Set" },
];

// Sample initial customizations
const initialCustomizations = [
  {
    id: "1",
    description: "Lavender Scent with Blue Packaging",
    price: "25.99",
    productId: "2",
    productName: "Lavender Candle",
  },
  {
    id: "2",
    description: "Charcoal with Mint Scent",
    price: "12.50",
    productId: "1",
    productName: "Handmade Soap",
  },
  {
    id: "3",
    description: "Three Pack Sampler",
    price: "35.00",
    productId: "3",
    productName: "Essential Oil Set",
  },
];

const CustomizationPage = ({ navigation, route }: any) => {
  const [customizations, setCustomizations] = useState<Customization[]>(
    initialCustomizations
  );
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedProductName, setSelectedProductName] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [customizationToDelete, setCustomizationToDelete] =
    useState<Customization | null>(null);

  // Handle add new customization
  const handleAddCustomization = () => {
    if (
      description.trim() === "" ||
      price.trim() === "" ||
      selectedProduct === ""
    )
      return;

    const newCustomization = {
      id: Date.now().toString(),
      description: description.trim(),
      price: price.trim(),
      productId: selectedProduct,
      productName:
        productOptions.find((product) => product.id === selectedProduct)
          ?.name || "",
    };

    setCustomizations([...customizations, newCustomization]);
    // Clear the form
    setDescription("");
    setPrice("");
    setSelectedProduct("");
    setSelectedProductName("");
  };

  // Navigate to edit page
  const handleEditCustomization = (customization: Customization) => {
    navigation.navigate("editCustomization", {
      customization,
      onUpdate: handleUpdateCustomization,
    });
  };

  // Handle update from edit page
  const handleUpdateCustomization = (updatedCustomization: Customization) => {
    const updatedCustomizations = customizations.map((item) =>
      item.id === updatedCustomization.id ? updatedCustomization : item
    );
    setCustomizations(updatedCustomizations);
  };

  // Show delete confirmation modal
  const handleShowDeleteModal = (customization: Customization) => {
    setCustomizationToDelete(customization);
    setIsDeleteModalVisible(true);
  };

  // Handle actual deletion
  const handleDeleteCustomization = () => {
    if (!customizationToDelete) return;

    const filteredCustomizations = customizations.filter(
      (item) => item.id !== customizationToDelete.id
    );

    setCustomizations(filteredCustomizations);
    setIsDeleteModalVisible(false);
    setCustomizationToDelete(null);
  };

  // Handle select product from dropdown
  const handleSelectProduct = (id: string, name: string) => {
    setSelectedProduct(id);
    setSelectedProductName(name);
    setIsDropdownOpen(false);
  };

  // Render each customization item
  const renderCustomizationItem = ({ item }: { item: Customization }) => {
    return (
      <View className="bg-white rounded-xl p-4 shadow-md border border-accent mb-3">
        <View className="flex-row justify-between">
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <View className="w-10 h-10 bg-accent rounded-full items-center justify-center mr-3">
                <Ionicons
                  name="color-palette-outline"
                  size={18}
                  color="#1672EC"
                />
              </View>
              <Text className="text-text-primary text-lg font-bold flex-1">
                {item.productName}
              </Text>
            </View>
            <Text className="text-text-primary mb-1">{item.description}</Text>
            <Text className="text-primary font-bold">${item.price}</Text>
          </View>
          <View className="flex-row items-start">
            <TouchableOpacity
              className="p-2 mr-1"
              onPress={() => handleEditCustomization(item)}
            >
              <Ionicons name="pencil-outline" size={20} color="#7C84A3" />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-2"
              onPress={() => handleShowDeleteModal(item)}
            >
              <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Determine if main content should be faded
  const isModalOpen = isDeleteModalVisible;

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
                <Text className="text-white text-xl font-bold">
                  Customizations
                </Text>
              </View>
            </View>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            <ScrollView className="p-4">
              <View className="bg-white rounded-xl p-5 shadow-lg border border-accent mb-5">
                <Text className="text-text-primary font-bold text-lg mb-3">
                  Add New Customization
                </Text>

                {/* Product Dropdown */}
                <View className="mb-3">
                  <Text className="text-text-secondary mb-1">Product</Text>
                  <TouchableOpacity
                    className="bg-light rounded-lg p-3 text-text-primary flex-row justify-between items-center"
                    onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <Text
                      className={
                        selectedProductName
                          ? "text-text-primary"
                          : "text-text-secondary"
                      }
                    >
                      {selectedProductName || "Select a product"}
                    </Text>
                    <Ionicons
                      name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                      size={18}
                      color="#7C84A3"
                    />
                  </TouchableOpacity>

                  {isDropdownOpen && (
                    <View className="bg-white rounded-lg mt-1 shadow-md border border-accent overflow-hidden">
                      {productOptions.map((product) => (
                        <TouchableOpacity
                          key={product.id}
                          className="p-3 border-b border-light"
                          onPress={() =>
                            handleSelectProduct(product.id, product.name)
                          }
                        >
                          <Text className="text-text-primary">
                            {product.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Description Input */}
                <View className="mb-3">
                  <Text className="text-text-secondary mb-1">Description</Text>
                  <TextInput
                    className="bg-light rounded-lg p-3 text-text-primary"
                    placeholder="Enter customization details"
                    value={description}
                    onChangeText={setDescription}
                    multiline={true}
                    numberOfLines={2}
                  />
                </View>

                {/* Price Input */}
                <View className="mb-4">
                  <Text className="text-text-secondary mb-1">Price</Text>
                  <TextInput
                    className="bg-light rounded-lg p-3 text-text-primary"
                    placeholder="Enter price"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="decimal-pad"
                  />
                </View>

                <View className="flex-row justify-end">
                  <TouchableOpacity
                    className="bg-primary rounded-lg px-5 py-2"
                    onPress={handleAddCustomization}
                  >
                    <Text className="text-white font-medium">
                      Add Customization
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text className="text-text-primary font-bold text-lg mb-3">
                Your Customizations
              </Text>

              {customizations.length > 0 ? (
                <FlatList
                  data={customizations}
                  renderItem={renderCustomizationItem}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  className="mb-20"
                  scrollEnabled={false}
                />
              ) : (
                <View className="bg-white rounded-xl p-6 shadow-md border border-accent items-center justify-center">
                  <Ionicons
                    name="color-palette-outline"
                    size={50}
                    color="#1672EC"
                  />
                  <Text className="text-text-primary text-lg font-bold mt-3">
                    No Customizations Yet
                  </Text>
                  <Text className="text-text-secondary text-center mt-1">
                    Add your first customization using the form above
                  </Text>
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>

        {/* Delete Modal */}
        {isDeleteModalVisible && (
          <View className="absolute inset-0 justify-center items-center px-5 z-10">
            <View className="bg-white rounded-xl w-full p-5 shadow-xl">
              <View className="items-center mb-2">
                <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="trash-outline" size={30} color="#FF6B6B" />
                </View>
                <Text className="text-text-primary font-bold text-xl">
                  Delete Customization?
                </Text>
              </View>

              <Text className="text-text-secondary text-center my-4">
                Are you sure you want to delete this customization for "
                {customizationToDelete?.productName}"? This action cannot be
                undone.
              </Text>

              <View className="flex-row justify-between">
                <TouchableOpacity
                  className="flex-1 bg-light rounded-lg py-3 mr-2"
                  onPress={() => setIsDeleteModalVisible(false)}
                >
                  <Text className="text-text-secondary font-medium text-center">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-red-500 rounded-lg py-3"
                  onPress={handleDeleteCustomization}
                >
                  <Text className="text-white font-medium text-center">
                    Delete
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

export default CustomizationPage;
