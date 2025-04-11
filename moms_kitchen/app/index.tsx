import { createStackNavigator } from "@react-navigation/stack";
import "./global.css";
import Dashboard from "./dashboard";
import AddProduct from "./Products/products";
import { StatusBar, View, Text, StyleSheet } from "react-native";
import CustomizationPage from "./Customizations/customization";
import EditCustomizationPage from "./Customizations/editCustomization";
import CustomerScreen from "./Customers/customers";
import CustomerDetailsScreen from "./Customers/customerDetails";
import AddOrderModal from "./addOrder";
import AddOrder from "./addOrder";
import CustomerTransactionsScreen from "./Payments/pendingPayments";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";

const Stack = createStackNavigator();

// Custom Splash Screen Component
function CustomSplashScreen() {
  return (
    <View style={styles.splashContainer}>
      <Text style={styles.splashText}>Mom's Kitchen</Text>
    </View>
  );
}

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const [loaded, error] = useFonts({
    Emilys: require("../assets/fonts/EmilysCandy-Regular.ttf"),
  });

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (loaded || error) {
      // Add a slight delay before hiding the splash screen for better user experience
      setTimeout(() => {
        SplashScreen.hideAsync();
        setShowSplash(false);
      }, 2000); // 2 seconds delay
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  if (showSplash) {
    return <CustomSplashScreen />;
  }

  return (
    <>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="products"
          component={AddProduct}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="customization"
          component={CustomizationPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="editCustomization"
          component={EditCustomizationPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="customers"
          component={CustomerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="customerDetails"
          component={CustomerDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="addOrder"
          component={AddOrder}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="pendingPayments"
          component={CustomerTransactionsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  splashText: {
    fontFamily: "Emilys",
    fontSize: 40,
    color: "#1672EC",
    textAlign: "center",
  },
});
