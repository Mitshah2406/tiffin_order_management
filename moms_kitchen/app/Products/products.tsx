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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Product } from "@/interfaces/interface";

const initialProducts = [
  { id: "1", name: "Chapati" },
  { id: "2", name: "Roti" },
  { id: "3", name: "Naan" },
];

const AddProduct = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [newProductName, setNewProductName] = useState<string>("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [editedProductName, setEditedProductName] = useState<string>("");

  // Handle add new product
  const handleAddProduct = () => {
    if (newProductName.trim() === "") return;

    const newProduct = {
      id: Date.now().toString(),
      name: newProductName.trim(),
    };

    setProducts([...products, newProduct]);
    setNewProductName("");
  };

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setEditedProductName(product.name);
    setIsEditModalVisible(true);
  };

  // Save edited product
  const handleSaveEdit = () => {
    if (!productToEdit || editedProductName.trim() === "") return;

    const updatedProducts = products.map((product) =>
      product.id === productToEdit.id
        ? { ...product, name: editedProductName.trim() }
        : product
    );

    setProducts(updatedProducts);
    setIsEditModalVisible(false);
    setProductToEdit(null);
  };

  // Show delete confirmation modal
  const handleShowDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalVisible(true);
  };

  // Handle actual deletion
  const handleDeleteProduct = () => {
    if (!productToDelete) return;

    const filteredProducts = products.filter(
      (product) => product.id !== productToDelete.id
    );

    setProducts(filteredProducts);
    setIsDeleteModalVisible(false);
    setProductToDelete(null);
  };

  // Render each product item
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
            onPress={() => handleEditProduct(item)}
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

  // Determine if main content should be faded
  const isModalOpen = isEditModalVisible || isDeleteModalVisible;

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1 bg-primary-bg">
        {/* Main Content - with opacity based on modal state */}
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
                <Text className="text-white text-xl font-bold">Products</Text>
              </View>
            </View>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            <View className="p-4">
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
                  <TouchableOpacity
                    className="bg-primary rounded-lg px-5 py-2"
                    onPress={handleAddProduct}
                  >
                    <Text className="text-white font-medium">Add Product</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text className="text-text-primary font-bold text-lg mb-3">
                Your Products
              </Text>

              {products.length > 0 ? (
                <FlatList
                  data={products}
                  renderItem={renderProductItem}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  className="mb-20"
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

        {/* Edit Modal */}
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
                <TouchableOpacity
                  className="flex-1 bg-primary rounded-lg py-3"
                  onPress={handleSaveEdit}
                >
                  <Text className="text-white font-medium text-center">
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Delete Modal */}
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
                <TouchableOpacity
                  className="flex-1 bg-red-500 rounded-lg py-3"
                  onPress={handleDeleteProduct}
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

export default AddProduct;
