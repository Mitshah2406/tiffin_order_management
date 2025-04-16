import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Modal,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Helper from "@/utils/helpers";
import {
  getCustomerPendingPayments,
  markAllCustomerPaymentsAsPaid,
  markMonthPaymentAsPaid,
  markMonthPaymentAsUnpaid,
} from "@/services/momsApi";
import LoadingButton from "@/components/loadingBtn";

// Define pending month type
interface PendingMonth {
  month: string;
  year: number;
  amount: number;
  orders: string[];
}

// Define pending customer type
interface PendingCustomer {
  id: string;
  name: string;
  pendingMonths: PendingMonth[];
  totalAmount: number;
}

const CustomerTransactionsScreen = ({ navigation, route }: any) => {
  const { customer: routeCustomer } = route.params as {
    customer: PendingCustomer;
  };

  const [isLoading, setIsLoading] = useState(true);
  const [customer, setCustomer] = useState<{ id: string; name: string }>({
    id: routeCustomer.id,
    name: routeCustomer.name,
  });
  const [pendingMonths, setPendingMonths] = useState<PendingMonth[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState<PendingMonth | null>(null);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);
  const [isMarkingAllPaid, setIsMarkingAllPaid] = useState(false);

  // Load customer pending payments on component mount
  useEffect(() => {
    loadCustomerPendingPayments();
  }, []);

  // Fetch customer pending payments from API
  const loadCustomerPendingPayments = async () => {
    try {
      setIsLoading(true);

      const response = await getCustomerPendingPayments(customer.id);

      if (response.success) {
        setCustomer(response.data.customer);
        setPendingMonths(response.data.pendingMonths || []);
        setTotalAmount(response.data.totalAmount || 0);
      } else {
        ToastAndroid.showWithGravityAndOffset(
          response.message || "Failed to load pending payments",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }
    } catch (error) {
      console.error("Error loading customer pending payments:", error);
      ToastAndroid.showWithGravityAndOffset(
        "Error loading pending payments",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setIsLoading(false);
    }
  };

  // State for checking if payment is being marked as paid or unpaid
  const [markingAsPaid, setMarkingAsPaid] = useState(true);

  // Handle mark single month as paid
  const handleMarkMonthPaid = (month: PendingMonth) => {
    setSelectedMonth(month);
    setMarkingAsPaid(true);
    setIsPaymentModalVisible(true);
  };

  // Handle mark single month as unpaid
  const handleMarkMonthUnpaid = async (month: PendingMonth) => {
    try {
      setIsMarkingPaid(true);

      // Month names to month numbers (0-indexed)
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const monthIndex = monthNames.indexOf(month.month);

      if (monthIndex === -1) {
        ToastAndroid.showWithGravityAndOffset(
          "Invalid month name",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        return;
      }

      const response = await markMonthPaymentAsUnpaid(
        customer.id,
        month.year,
        monthIndex
      );

      if (response.success) {
        ToastAndroid.showWithGravityAndOffset(
          response.message || "Payment marked as unpaid",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );

        // Refresh the payments data
        await loadCustomerPendingPayments();
      } else {
        ToastAndroid.showWithGravityAndOffset(
          response.message || "Failed to mark payment as unpaid",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }
    } catch (error) {
      console.error("Error marking payment as unpaid:", error);
      ToastAndroid.showWithGravityAndOffset(
        "Error marking payment as unpaid",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setIsMarkingPaid(false);
    }
  };

  // Handle mark all pending months as paid
  const handleMarkAllPaid = async () => {
    if (pendingMonths.length === 0) return;

    try {
      setIsMarkingAllPaid(true);

      const response = await markAllCustomerPaymentsAsPaid(customer.id);

      if (response.success) {
        ToastAndroid.showWithGravityAndOffset(
          response.message || "All payments marked as paid",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );

        // Refresh the payments data
        await loadCustomerPendingPayments();
      } else {
        ToastAndroid.showWithGravityAndOffset(
          response.message || "Failed to mark payments as paid",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }
    } catch (error) {
      console.error("Error marking all payments as paid:", error);
      ToastAndroid.showWithGravityAndOffset(
        "Error marking payments as paid",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setIsMarkingAllPaid(false);
    }
  };

  // Confirm single month payment status change
  const confirmSinglePayment = async () => {
    if (!selectedMonth) return;

    try {
      setIsMarkingPaid(true);

      // Month names to month numbers (0-indexed)
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const monthIndex = monthNames.indexOf(selectedMonth.month);

      if (monthIndex === -1) {
        ToastAndroid.showWithGravityAndOffset(
          "Invalid month name",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        return;
      }

      let response;
      if (markingAsPaid) {
        response = await markMonthPaymentAsPaid(
          customer.id,
          selectedMonth.year,
          monthIndex
        );
      } else {
        response = await markMonthPaymentAsUnpaid(
          customer.id,
          selectedMonth.year,
          monthIndex
        );
      }

      if (response.success) {
        ToastAndroid.showWithGravityAndOffset(
          response.message ||
            `Payment marked as ${markingAsPaid ? "paid" : "unpaid"}`,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );

        // Refresh the payments data
        await loadCustomerPendingPayments();
      } else {
        ToastAndroid.showWithGravityAndOffset(
          response.message ||
            `Failed to mark payment as ${markingAsPaid ? "paid" : "unpaid"}`,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }
    } catch (error) {
      console.error(
        `Error marking payment as ${markingAsPaid ? "paid" : "unpaid"}:`,
        error
      );
      ToastAndroid.showWithGravityAndOffset(
        `Error marking payment as ${markingAsPaid ? "paid" : "unpaid"}`,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setIsMarkingPaid(false);
      setIsPaymentModalVisible(false);
      setSelectedMonth(null);
    }
  };

  // Render each pending month item
  const renderPendingMonthItem = ({ item }: { item: PendingMonth }) => {
    return (
      <View className="bg-white rounded-xl p-4 mb-3 shadow-md border border-accent">
        <View className="flex-row justify-between items-center">
          <View>
            <View className="flex-row items-center">
              <Ionicons
                name="calendar-outline"
                size={18}
                color="#1672EC"
                className="mr-2"
              />
              <Text className="text-text-primary font-bold text-lg">
                {item.month} {item.year}
              </Text>
            </View>
            <Text className="text-red-500 font-medium mt-1">
              {Helper.formatRupees(item.amount)} pending
            </Text>
          </View>
          <View className="flex-row">
            <TouchableOpacity
              className="bg-primary rounded-lg px-3 py-2"
              onPress={() => handleMarkMonthPaid(item)}
            >
              <Text className="text-white font-medium">Mark Paid</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-primary-bg justify-center items-center">
        <StatusBar className="bg-primary" />
        <ActivityIndicator size="large" color="#1672EC" />
        <Text className="text-text-primary mt-4">Loading transactions...</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar className="bg-primary" />
      <SafeAreaView
        className="flex-1 bg-primary-bg"
        style={{ opacity: isPaymentModalVisible ? 0.3 : 1 }}
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
              <Text className="text-white text-xl font-bold">
                Pending Transactions
              </Text>
            </View>
            <TouchableOpacity onPress={loadCustomerPendingPayments}>
              <Ionicons name="refresh-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Customer Info Card */}
        <View className="px-4 pt-4">
          <View className="bg-white rounded-xl p-4 shadow-md border border-accent mb-5">
            <View className="flex-row items-center mb-2">
              <View className="w-14 h-14 bg-accent rounded-full items-center justify-center mr-3">
                <Ionicons name="person" size={28} color="#1672EC" />
              </View>
              <View>
                <Text className="text-text-primary font-bold text-xl">
                  {customer.name}
                </Text>
                <Text className="text-text-secondary">Customer</Text>
              </View>
            </View>

            <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-light">
              <Text className="text-text-primary font-bold">
                Total Pending Amount
              </Text>
              <Text className="text-red-500 font-bold text-xl">
                {Helper.formatRupees(totalAmount)}
              </Text>
            </View>

            {pendingMonths.length > 0 && (
              <LoadingButton
                className="bg-primary rounded-lg py-2 mt-3"
                isLoading={isMarkingAllPaid}
                loadingText="Processing..."
                defaultText="Mark All Paid"
                onPress={handleMarkAllPaid}
                disabled={isMarkingAllPaid}
              />
            )}
          </View>
        </View>

        {/* Pending Months List */}
        <View className="px-4 flex-1">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-text-primary font-bold text-lg">
              Monthly Transactions
            </Text>
            <Text className="text-text-secondary">
              {pendingMonths.length} pending
            </Text>
          </View>

          {pendingMonths.length > 0 ? (
            <FlatList
              data={pendingMonths}
              renderItem={renderPendingMonthItem}
              keyExtractor={(item, index) =>
                `${item.month}-${item.year}-${index}`
              }
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <View className="bg-white rounded-xl p-6 shadow-md border border-accent items-center justify-center">
              <Ionicons name="checkmark-circle" size={50} color="#4CAF50" />
              <Text className="text-text-primary text-lg font-bold mt-3">
                All Payments Cleared
              </Text>
              <Text className="text-text-secondary text-center mt-1">
                This customer has no pending payments
              </Text>
            </View>
          )}
        </View>

        {/* Single Month Payment Confirmation Modal */}
        {isPaymentModalVisible && selectedMonth && (
          <Modal
            transparent={true}
            animationType="fade"
            visible={isPaymentModalVisible}
            onRequestClose={() => {
              if (!isMarkingPaid) {
                setIsPaymentModalVisible(false);
                setSelectedMonth(null);
              }
            }}
          >
            <View className="flex-1 justify-center items-center z-10">
              <View className="bg-white rounded-xl p-5 shadow-xl w-5/6">
                <View className="items-center mb-4">
                  <View
                    className={`w-16 h-16 ${
                      markingAsPaid ? "bg-green-100" : "bg-red-100"
                    } rounded-full items-center justify-center mb-2`}
                  >
                    <Ionicons
                      name="cash-outline"
                      size={30}
                      color={markingAsPaid ? "#4CAF50" : "#FF4D4F"}
                    />
                  </View>
                  <Text className="text-text-primary font-bold text-xl text-center">
                    Confirm {markingAsPaid ? "Payment" : "Unpaid Status"}
                  </Text>
                </View>

                <Text className="text-text-secondary text-center mb-2">
                  Are you sure you want to mark the payment for{" "}
                  {selectedMonth.month} {selectedMonth.year} as{" "}
                  {markingAsPaid ? "paid" : "unpaid"}?
                </Text>

                <View className="bg-light rounded-lg p-3 mb-4">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-text-primary font-medium">
                      Amount:
                    </Text>
                    <Text className="text-primary font-bold text-lg">
                      {Helper.formatRupees(selectedMonth.amount)}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between">
                  <TouchableOpacity
                    className="flex-1 bg-light rounded-lg py-3 mr-2"
                    onPress={() => {
                      setIsPaymentModalVisible(false);
                      setSelectedMonth(null);
                    }}
                    disabled={isMarkingPaid}
                  >
                    <Text className="text-text-secondary font-medium text-center">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <LoadingButton
                    className={`flex-1 ${
                      markingAsPaid ? "bg-green-500" : "bg-red-500"
                    } rounded-lg py-3`}
                    isLoading={isMarkingPaid}
                    loadingText="Processing..."
                    defaultText={
                      markingAsPaid ? "Confirm Payment" : "Mark As Unpaid"
                    }
                    onPress={confirmSinglePayment}
                    disabled={isMarkingPaid}
                  />
                </View>
              </View>
            </View>
          </Modal>
        )}
      </SafeAreaView>
    </>
  );
};

export default CustomerTransactionsScreen;
