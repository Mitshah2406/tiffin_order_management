import { createStackNavigator } from "@react-navigation/stack";
import "./global.css";
import Dashboard from "./dashboard";
import AddProduct from "./Products/products";
import CustomizationPage from "./Customizations/customization";
import EditCustomizationPage from "./Customizations/editCustomization";
import CustomerScreen from "./Customers/customers";
import CustomerDetailsScreen from "./Customers/customerDetails";
import AddOrder from "./addOrder";
import CustomerTransactionsScreen from "./Payments/pendingPayments";

import { LogBox } from "react-native";

// Ignore all log notifications (both warnings and errors)
LogBox.ignoreAllLogs();

// Ignore specific log patterns
LogBox.ignoreLogs(["Warning: ..."]);
// You can use regex patterns too
LogBox.ignoreLogs([/deprecated/i]);

const Stack = createStackNavigator();

export default function Index() {
  return (
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
  );
}
