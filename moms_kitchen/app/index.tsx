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

// Admin Screens
import AdminDashboardScreen from "./Admin/adminDashboard";
import AdminCustomersScreen from "./Admin/adminCustomer";
import AdminEditCustomerScreen from "./Admin/adminEditCustomer";
import AdminCustomerDetailsScreen from "./Admin/adminCustomerDetails";
import AdminOrdersScreen from "./Admin/adminOrders";
import AdminEditOrderScreen from "./Admin/adminEditOrder";
import AdminPendingPaymentsScreen from "./Admin/adminPendingPayment";

import { LogBox } from "react-native";
import AdminLogin from "./Admin/login";

// Ignore all log notifications (both warnings and errors)
LogBox.ignoreAllLogs();

// Ignore specific log patterns
LogBox.ignoreLogs(["Warning: ..."]);
// You can use regex patterns too
LogBox.ignoreLogs([/deprecated/i]);

const Stack = createStackNavigator();

export default function Index() {
  return (
    <Stack.Navigator initialRouteName="adminlogin">
      <Stack.Screen
        name="adminlogin"
        component={AdminLogin}
        options={{ headerShown: false }}
      />
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

      {/* Admin Screens */}
      <Stack.Screen
        name="adminDashboard"
        component={AdminDashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="adminCustomers"
        component={AdminCustomersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="editCustomer"
        component={AdminEditCustomerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="adminCustomerDetails"
        component={AdminCustomerDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="adminOrders"
        component={AdminOrdersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="editOrder"
        component={AdminEditOrderScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="adminPendingPayments"
        component={AdminPendingPaymentsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
