import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Helper from "@/utils/helpers";

// Define pending month type
interface PendingMonth {
  month: string;
  year: number;
  amount: number;
}

// Define pending customer type
interface PendingCustomer {
  id: string;
  name: string;
  pendingMonths: PendingMonth[];
  totalAmount: number;
}

const CustomerTransactionsScreen = ({ navigation, route }: any) => {
  const { customer } = route.params as { customer: PendingCustomer };
  const [pendingMonths, setPendingMonths] = useState<PendingMonth[]>(
    customer.pendingMonths
  );
  const [selectedMonth, setSelectedMonth] = useState<PendingMonth | null>(null);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);

  // Calculate remaining total amount
  const totalPendingAmount = pendingMonths.reduce(
    (sum, month) => sum + month.amount,
    0
  );

  // Handle mark single month as paid
  const handleMarkMonthPaid = (month: PendingMonth) => {
    setSelectedMonth(month);
    setIsPaymentModalVisible(true);
  };

  // Handle mark all pending months as paid
  const handleMarkAllPaid = () => {
    if (pendingMonths.length === 0) return;

    Alert.alert(
      "Confirm Payment",
      `Are you sure you want to mark all pending payments (${Helper.formatRupees(
        totalPendingAmount
      )}) for ${customer.name} as paid?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            setPendingMonths([]);
            // Here you would update your backend
          },
        },
      ]
    );
  };

  // Confirm single month payment
  const confirmSinglePayment = () => {
    if (!selectedMonth) return;

    setPendingMonths(
      pendingMonths.filter(
        (month) =>
          !(
            month.month === selectedMonth.month &&
            month.year === selectedMonth.year
          )
      )
    );
    setIsPaymentModalVisible(false);
    setSelectedMonth(null);

    // Here you would update your backend
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
          <TouchableOpacity
            className="bg-primary rounded-lg px-3 py-2"
            onPress={() => handleMarkMonthPaid(item)}
          >
            <Text className="text-white font-medium">Mark Paid</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
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
                {Helper.formatRupees(totalPendingAmount)}
              </Text>
            </View>

            {pendingMonths.length > 0 && (
              <TouchableOpacity
                className="bg-primary rounded-lg py-2 mt-3"
                onPress={handleMarkAllPaid}
              >
                <Text className="text-white font-medium text-center">
                  Mark All Paid
                </Text>
              </TouchableOpacity>
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
            onRequestClose={() => setIsPaymentModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center z-10">
              <View className="bg-white rounded-xl p-5 shadow-xl w-5/6">
                <View className="items-center mb-4">
                  <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-2">
                    <Ionicons name="cash-outline" size={30} color="#4CAF50" />
                  </View>
                  <Text className="text-text-primary font-bold text-xl text-center">
                    Confirm Payment
                  </Text>
                </View>

                <Text className="text-text-secondary text-center mb-2">
                  Are you sure you want to mark the payment for{" "}
                  {selectedMonth.month} {selectedMonth.year} as paid?
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
                    onPress={() => setIsPaymentModalVisible(false)}
                  >
                    <Text className="text-text-secondary font-medium text-center">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 bg-green-500 rounded-lg py-3"
                    onPress={confirmSinglePayment}
                  >
                    <Text className="text-white font-medium text-center">
                      Confirm Payment
                    </Text>
                  </TouchableOpacity>
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
