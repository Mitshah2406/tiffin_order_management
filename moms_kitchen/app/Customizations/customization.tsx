import React, { useCallback, useEffect, useState } from "react";
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
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Customization, NodeResponse, Product } from "@/interfaces/interface";
import useFetch from "@/hooks/useFetch";
import {
  createCustomization,
  deleteCustomization,
  getAllCustomizations,
  getAllProducts,
} from "@/services/api";
import LoadingButton from "@/components/loadingBtn";
import { useFocusEffect } from "expo-router";
import Indicator from "@/components/indicator";

const CustomizationPage = ({ navigation, route }: any) => {
  const {
    data: apiResponse,
    error: productError,
    loading: productLoading,
    refetch,
    reset,
  } = useFetch<NodeResponse>(() => getAllProducts());
  const {
    data: customizationResponse,
    error: customizationError,
    loading: customizationLoading,
    refetch: customizationRefetch,
  } = useFetch<NodeResponse>(() => getAllCustomizations());

  const [customizations, setCustomizations] = useState<Customization[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedProductName, setSelectedProductName] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [customizationToDelete, setCustomizationToDelete] =
    useState<Customization | null>(null);

  // Loading states
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (
      apiResponse?.success &&
      apiResponse.data &&
      Array.isArray(apiResponse.data)
    ) {
      setProducts(apiResponse.data);
    }

    if (
      customizationResponse?.success &&
      customizationResponse.data &&
      Array.isArray(customizationResponse.data)
    ) {
      setCustomizations(customizationResponse.data);
    }
  }, [apiResponse, customizationResponse]);

  // Handle add new customization
  const handleAddCustomization = async () => {
    try {
      setIsAdding(true);

      if (
        description.trim() === "" ||
        price.trim() === "" ||
        selectedProduct === ""
      ) {
        ToastAndroid.showWithGravityAndOffset(
          "Please enter a valid customization for the product",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        return;
      }

      let response: NodeResponse = await createCustomization(
        description.trim(),
        parseFloat(price.trim()),
        selectedProduct
      );

      if (response.success) {
        await customizationRefetch();

        ToastAndroid.showWithGravityAndOffset(
          response.message ||
            `Customization added successfully for the product ${selectedProductName}`,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } else {
        ToastAndroid.showWithGravityAndOffset(
          response.message ||
            `Failed to add Customization for ${selectedProductName}`,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        return;
      }

      // Clear the form
      setDescription("");
      setPrice("");
      setSelectedProduct("");
      setSelectedProductName("");
    } catch (error) {
      console.log("Here" + error);
    } finally {
      setIsAdding(false);
    }
  };

  // Navigate to edit page
  const handleEditCustomization = (customization: Customization) => {
    navigation.navigate("editCustomization", {
      customization,
    });
  };

  // Show delete confirmation modal
  const handleShowDeleteModal = (customization: Customization) => {
    setCustomizationToDelete(customization);
    setIsDeleteModalVisible(true);
  };

  // Handle actual deletion
  const handleDeleteCustomization = async () => {
    try {
      setIsDeleting(true);

      if (!customizationToDelete) {
        ToastAndroid.showWithGravityAndOffset(
          "Please select a customization to delete",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        return;
      }

      let response: NodeResponse = await deleteCustomization(
        customizationToDelete.id!
      );

      if (response.success) {
        await customizationRefetch();

        ToastAndroid.showWithGravityAndOffset(
          response.message || `Customization deleted successfully`,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } else {
        ToastAndroid.showWithGravityAndOffset(
          response.message || `Failed to delete Customization`,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        return;
      }

      setIsDeleteModalVisible(false);
      setCustomizationToDelete(null);
    } catch (error) {
      console.log("Error deleting customization:", error);
    } finally {
      setIsDeleting(false);
    }
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
                {item.product?.name}
              </Text>
            </View>
            <Text className="text-text-primary mb-1">{item.description}</Text>
            <Text className="text-primary font-bold">₹ {item.price}</Text>
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

  const isModalOpen = isDeleteModalVisible;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (customizationLoading) {
      setIsLoading(true);
    } else if (customizations.length > 0) {
      setIsLoading(false);
    } else if (!customizationLoading && customizationResponse) {
      setIsLoading(false);
    }
  }, [customizationLoading, customizations, customizationResponse]);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1 bg-primary-bg">
        <View className="flex-1" style={{ opacity: isModalOpen ? 0.3 : 1 }}>
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
              <TouchableOpacity onPress={() => refetch()}>
                <Ionicons name="refresh" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            <View className="p-4 flex-1">
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
                      {products.map((product: Product) => (
                        <TouchableOpacity
                          key={product.id}
                          className="p-3 border-b border-light"
                          onPress={() =>
                            handleSelectProduct(product.id!, product.name)
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
                  <LoadingButton
                    isLoading={isAdding}
                    onPress={handleAddCustomization}
                    defaultText="Add Customization"
                    loadingText="Adding Customization"
                    disabled={isAdding}
                    className="bg-primary rounded-lg px-5 py-2"
                  />
                </View>
              </View>

              <Text className="text-text-primary font-bold text-lg mb-3">
                Your Customizations
              </Text>

              {isLoading ? (
                <View className="bg-white rounded-xl p-6 shadow-md border border-accent items-center justify-center">
                  <Indicator size="large" />
                  <Text className="text-text-primary mt-4">
                    Loading customizations...
                  </Text>
                </View>
              ) : customizations.length > 0 ? (
                <FlatList
                  data={customizations}
                  renderItem={renderCustomizationItem}
                  keyExtractor={(item) => item.id!}
                  scrollEnabled={true}
                  showsVerticalScrollIndicator={true}
                  style={{
                    maxHeight: 600,
                  }}
                  contentContainerStyle={{ paddingBottom: 10 }}
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
            </View>
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
                {customizationToDelete?.product?.name}"? This action cannot be
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
                <LoadingButton
                  isLoading={isDeleting}
                  onPress={handleDeleteCustomization}
                  defaultText="Delete"
                  loadingText="Deleting"
                  disabled={isDeleting}
                  className="flex-1 bg-red-500 rounded-lg py-3 ml-2"
                />
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

export default CustomizationPage;
