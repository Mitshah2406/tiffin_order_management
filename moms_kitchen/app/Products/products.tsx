import React, { useEffect, useState } from "react";
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
  ToastAndroid,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NodeResponse, Product } from "@/interfaces/interface";
import {
  createProduct,
  deleteProduct,
  editProduct,
  getAllProducts,
} from "@/services/momsApi";
import useFetch from "@/hooks/useFetch";
import LoadingButton from "@/components/loadingBtn";
import Indicator from "@/components/indicator";

const AddProduct = ({ navigation }: any) => {
  const {
    data: apiResponse,
    error: productError,
    loading: productLoading,
    refetch,
    reset,
  } = useFetch<NodeResponse>(() => getAllProducts());

  const [products, setProducts] = useState<Product[]>([]);
  const [newProductName, setNewProductName] = useState<string>("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [editedProductName, setEditedProductName] = useState<string>("");
  const [adding, setAdding] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (
      apiResponse?.success &&
      apiResponse?.data &&
      Array.isArray(apiResponse.data)
    ) {
      setProducts(apiResponse.data);
      setIsLoading(false);
    } else if (apiResponse) {
      setIsLoading(false);
    }
  }, [apiResponse]);

  // Handle add new product
  const handleAddProduct = async () => {
    try {
      setAdding(true);

      if (newProductName.trim() === "") {
        ToastAndroid.showWithGravityAndOffset(
          "Please enter a valid product name",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        return;
      }

      let response: NodeResponse = await createProduct(newProductName.trim());

      if (response.success) {
        // Refetch customers from API instead of manually updating state
        await refetch();

        ToastAndroid.showWithGravityAndOffset(
          response.message || "Product added successfully",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }

      setNewProductName("");
    } catch (error) {
      console.log("Error adding product:", error);
    } finally {
      setAdding(false);
    }
  };

  // Handle edit product
  const handleShowEditProduct = (product: Product) => {
    setProductToEdit(product);
    setEditedProductName(product.name);
    setIsEditModalVisible(true);
  };

  // Show delete confirmation modal
  const handleShowDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalVisible(true);
  };

  // Save edited product
  const handleSaveEdit = async () => {
    try {
      setEditing(true);

      if (!productToEdit || editedProductName.trim() === "") {
        ToastAndroid.showWithGravityAndOffset(
          "Please enter a valid product name",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        return;
      }

      let response: NodeResponse = await editProduct(
        productToEdit.id!,
        editedProductName.trim()
      );

      if (response.success) {
        // Refetch customers from API instead of manually updating state
        await refetch();

        ToastAndroid.showWithGravityAndOffset(
          response.message || "Product updated successfully",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }

      setIsEditModalVisible(false);
      setProductToEdit(null);
    } catch (error) {
      console.log(error);
    } finally {
      setEditing(false);
    }
  };

  // Handle actual deletion
  const handleDeleteProduct = async () => {
    try {
      setDeleting(true);

      if (!productToDelete) return;

      const response: NodeResponse = await deleteProduct(productToDelete.id!);

      if (response.success) {
        await refetch();

        ToastAndroid.showWithGravityAndOffset(
          response.message || "Product deleted successfully",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }
    } catch (error: any) {
      console.log("Error deleting product:", error);

      // If there's an error message from the server, display it
      const errorMessage =
        error.response?.data?.message ||
        "Unable to delete this product as it is being used in an customizations.";

      ToastAndroid.showWithGravityAndOffset(
        errorMessage,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setDeleting(false);
      setIsDeleteModalVisible(false);
      setProductToDelete(null);
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    return (
      <View className="bg-white rounded-xl p-4 shadow-md border border-accent mb-3 flex-row justify-between items-center">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 bg-accent rounded-full items-center justify-center mr-3">
            <Ionicons name="cube-outline" size={18} color="#1672EC" />
          </View>
          <Text className="text-text-primary text-lg flex-1">{item.name}</Text>
        </View>
        <View className="flex-row">
          <TouchableOpacity
            className="p-2 mr-1"
            onPress={() => handleShowEditProduct(item)}
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
    );
  };

  const isModalOpen = isEditModalVisible || isDeleteModalVisible;

  return (
    <>
      <StatusBar className="bg-primary" />
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
                <Text className="text-white text-xl font-bold">Products</Text>
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
            <View className="p-4">
              {/* Add Product Form - Not Scrollable */}
              <View className="bg-white rounded-xl p-5 shadow-lg border border-accent mb-5">
                <Text className="text-text-primary font-bold text-lg mb-3">
                  Add New Product
                </Text>
                <TextInput
                  className="bg-light rounded-lg p-3 mb-3 text-text-primary"
                  placeholder="Enter product name"
                  value={newProductName}
                  onChangeText={setNewProductName}
                />
                <View className="flex-row justify-end">
                  <LoadingButton
                    className="bg-primary rounded-lg px-5 py-2"
                    isLoading={adding}
                    loadingText="Adding Product"
                    defaultText="Add Product"
                    onPress={handleAddProduct}
                    disabled={adding}
                  />
                </View>
              </View>

              <Text className="text-text-primary font-bold text-lg mb-3">
                Your Products
              </Text>

              {isLoading ? (
                <View className="bg-white rounded-xl p-6 shadow-md border border-accent items-center justify-center">
                  <Indicator size="large" />
                  <Text className="text-text-primary text-lg font-bold mt-3">
                    Loading Products...
                  </Text>
                </View>
              ) : products.length > 0 ? (
                <FlatList
                  data={products}
                  renderItem={renderProductItem}
                  keyExtractor={(item) => item.id!}
                  showsVerticalScrollIndicator={true}
                  scrollEnabled={true}
                  style={{
                    maxHeight: 600,
                  }}
                  contentContainerStyle={{ paddingBottom: 20 }}
                />
              ) : (
                <View className="bg-white rounded-xl p-6 shadow-md border border-accent items-center justify-center">
                  <Ionicons name="cube-outline" size={50} color="#1672EC" />
                  <Text className="text-text-primary text-lg font-bold mt-3">
                    No Products Yet
                  </Text>
                  <Text className="text-text-secondary text-center mt-1">
                    Add your first product using the form above
                  </Text>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>

        {isEditModalVisible && (
          <View className="absolute inset-0 justify-center items-center px-5 z-10">
            <View className="bg-white rounded-xl w-full p-5 shadow-2xl">
              <View className="items-center mb-2">
                <View className="w-12 h-12 bg-accent rounded-full items-center justify-center mb-2">
                  <Ionicons name="create-outline" size={24} color="#1672EC" />
                </View>
                <Text className="text-text-primary font-bold text-xl">
                  Edit Product
                </Text>
              </View>

              <TextInput
                className="bg-light rounded-lg p-3 my-4 text-text-primary"
                placeholder="Product name"
                value={editedProductName}
                onChangeText={setEditedProductName}
                autoFocus={true}
              />

              <View className="flex-row justify-between">
                <TouchableOpacity
                  className="flex-1 bg-light rounded-lg py-3 mr-2"
                  onPress={() => setIsEditModalVisible(false)}
                >
                  <Text className="text-text-secondary font-medium text-center">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <LoadingButton
                  className="flex-1 bg-primary rounded-lg py-3"
                  isLoading={editing}
                  loadingText="Saving Product"
                  defaultText="Save"
                  onPress={handleSaveEdit}
                  disabled={editing}
                />
              </View>
            </View>
          </View>
        )}

        {isDeleteModalVisible && (
          <View className="absolute inset-0 justify-center items-center px-5 z-10">
            <View className="bg-white rounded-xl w-full p-5 shadow-xl">
              <View className="items-center mb-2">
                <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="trash-outline" size={30} color="#FF6B6B" />
                </View>
                <Text className="text-text-primary font-bold text-xl">
                  Delete Product?
                </Text>
              </View>

              <Text className="text-text-secondary text-center my-4">
                Are you sure you want to delete "{productToDelete?.name}"? This
                action cannot be undone.
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
                  className="flex-1 bg-red-500 rounded-lg py-3"
                  isLoading={deleting}
                  loadingText="Deleting Product"
                  defaultText="Delete"
                  onPress={handleDeleteProduct}
                  disabled={deleting}
                />
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

export default AddProduct;
