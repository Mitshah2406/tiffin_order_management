import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
import { getAllProducts, updateCustomization } from "@/services/momsApi";
import LoadingButton from "@/components/loadingBtn";

// Sample products (for dropdown)
const productOptions = [
  { id: "1", name: "Handmade Soap" },
  { id: "2", name: "Lavender Candle" },
  { id: "3", name: "Essential Oil Set" },
];

const EditCustomizationPage = ({ navigation, route }: any) => {
  const {
    data: apiResponse,
    error: productError,
    loading: productLoading,
    refetch,
    reset,
  } = useFetch<NodeResponse>(() => getAllProducts());

  const { customization, onUpdate } = route.params as {
    customization: Customization;
    onUpdate: (customization: Customization) => void;
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedProductName, setSelectedProductName] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Initialize form with the customization data
  useEffect(() => {
    if (customization) {
      setDescription(customization.description);
      setPrice(customization.price.toString());
      setSelectedProduct(customization.productId);
      setSelectedProductName(customization.product?.name!);
    }

    if (
      apiResponse?.success &&
      apiResponse.data &&
      Array.isArray(apiResponse.data)
    ) {
      setProducts(apiResponse.data);
    }
  }, [customization, apiResponse]);

  // Handle save changes
  const handleSaveChanges = async () => {
    try {
      setIsEditing(true);

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

      let response: NodeResponse = await updateCustomization(
        customization.id!,
        description.trim(),
        parseFloat(price.trim()),
        selectedProduct
      );

      if (response.success) {
        ToastAndroid.showWithGravityAndOffset(
          response.message ||
            `Customization updated successfully for the product ${selectedProductName}`,
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

      navigation.navigate("customization");
    } catch (error) {
      console.log("Erorr" + error);
    } finally {
      setIsEditing(false);
    }
  };

  // Handle select product from dropdown
  const handleSelectProduct = (id: string, name: string) => {
    setSelectedProduct(id);
    setSelectedProductName(name);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1 bg-primary-bg">
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
                Edit Customization
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
              {/* Product Dropdown */}
              <View className="mb-4">
                <Text className="text-text-primary font-medium mb-1">
                  Product
                </Text>
                <TouchableOpacity
                  className="bg-light rounded-lg p-3 text-text-primary flex-row justify-between items-center"
                  onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <Text className="text-text-primary">
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
              <View className="mb-4">
                <Text className="text-text-primary font-medium mb-1">
                  Description
                </Text>
                <TextInput
                  className="bg-light rounded-lg p-3 text-text-primary"
                  placeholder="Enter customization details"
                  value={description}
                  onChangeText={setDescription}
                  multiline={true}
                  numberOfLines={3}
                />
              </View>

              {/* Price Input */}
              <View className="mb-4">
                <Text className="text-text-primary font-medium mb-1">
                  Price
                </Text>
                <TextInput
                  className="bg-light rounded-lg p-3 text-text-primary"
                  placeholder="Enter price"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View className="flex-row">
              <TouchableOpacity
                className="bg-light rounded-lg py-3 flex-1 mr-2"
                onPress={() => navigation.goBack()}
              >
                <Text className="text-text-secondary font-medium text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
              <LoadingButton
                isLoading={isEditing}
                disabled={isEditing}
                onPress={handleSaveChanges}
                className="bg-primary rounded-lg py-3 flex-1"
                defaultText="Save Changes"
                loadingText="Saving Changes"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default EditCustomizationPage;
