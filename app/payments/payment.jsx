import { useEffect, useState } from "react";
import { PayWithFlutterwave } from "flutterwave-react-native";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import body from "@/constants/Colors";
import useAuth from "@/hooks/useAuth";
import { router } from "expo-router";
import { PUBLIC_KEY } from "@env";

export default function Page() {
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const { coursesById, account } = useAuth();
      setLoading(true);
      setError(false);

      try {
        const data = await coursesById(setLoading, setError);
        const fetchedAccountData = await account(setLoading, setError);
        console.log("Fetched Data:", data);
        setResponse(data);
        setEmail(fetchedAccountData.email);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [useAuth]); // Include dependencies

  const handleFetch = async () => {
    const { coursesById } = useAuth();
    setLoading(true);
    setError(false);

    try {
      const data = await coursesById(setLoading, setError);
      console.log("Refreshed Data:", data);
      setResponse(data);
    } catch (err) {
      console.error("Error refreshing data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOnRedirect = async (data) => {
    const { createPayment } = useAuth();
    if (data.status === "successful") {
      Alert.alert(
        "Payment Successful",
        `Transaction ID: ${data.transaction_id}\nReference: ${data.tx_ref}`,
        [{ text: "OK" }]
      );
      await createPayment(
        response?.id,
        data.transaction_id,
        data.tx_ref,
        setLoading,
        setError
      );
      router.dismiss(2);
    } else {
      Alert.alert("Payment Cancelled", "You cancelled the transaction.", [
        { text: "OK" },
      ]);
      console.log("Transaction cancelled:", data);
    }
  };

  const generateTransactionRef = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return `flw_tx_ref_${result}`;
  };

  const paymentOptions = {
    tx_ref: generateTransactionRef(10),
    authorization: PUBLIC_KEY,
    customer: {
      email: email,
    },
    amount: response?.price,
    currency: "USD",
    payment_options: "card, banktransfer, ussd",
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          size={50}
          color={"white"}
          style={styles.activityIndicator}
        />
      ) : error ? (
        <View style={styles.errorContainer}>
          <View style={styles.errorContainerContent}>
            <Text style={styles.errorText}>Network Connection Error</Text>
            <TouchableOpacity style={styles.errorBtn} onPress={handleFetch}>
              <Text style={styles.errorText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.container2}>
          <ScrollView>
            {response?.thumbnail && (
              <Image
                source={{ uri: response.thumbnail }}
                style={styles.thumbnail}
              />
            )}
            <Text style={styles.pageTitle}>
              {response?.title || "Make a Payment"}
            </Text>
            <Text style={{ fontSize: 37, fontWeight: 900 }}>
              ${response?.price}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <View style={styles.paymentReview}>
                <View style={styles.paymentReviewTopics}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 900,
                      textAlign: "center",
                    }}
                  >
                    {response?.topics?.length || 0}
                  </Text>
                </View>
                <Text
                  style={{
                    textAlign: "flex-start",
                    fontSize: 18,
                    fontWeight: 900,
                  }}
                >
                  Topics
                </Text>
              </View>
              <View style={styles.paymentReview}>
                <View style={styles.paymentReviewTopics}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 900,
                      textAlign: "center",
                    }}
                  >
                    {response?.reviews}
                  </Text>
                </View>
                <Text
                  style={{
                    textAlign: "flex-start",
                    fontSize: 18,
                    fontWeight: 900,
                  }}
                >
                  Reviews
                </Text>
              </View>
            </View>
            <Text style={{ fontSize: 18, fontWeight: 900, marginTop: 30 }}>
              About Course
            </Text>

            <View style={{ flex: 1 }}>
              <Text>{response?.description}</Text>
            </View>

            <PayWithFlutterwave
              onRedirect={handleOnRedirect}
              options={paymentOptions}
              customButton={(props) => (
                <View>
                  <TouchableOpacity
                    style={styles.paymentButton}
                    onPress={props.onPress}
                    disabled={props.disabled}
                  >
                    <Text style={styles.paymentButtonText}>
                      Pay {paymentOptions.currency} {paymentOptions.amount}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: body.dominant,
    paddingTop: 30,
    paddingHorizontal: 0,
  },
  container2: {
    flex: 1,
    width: "100%",
    backgroundColor: body.tertiary,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainerContent: {
    width: 200,
    padding: 20,
    backgroundColor: body.darkDominant,
  },
  errorText: {
    color: body.tertiary,
    fontSize: 15,
  },
  errorBtn: {
    width: "100%",
    padding: 10,
    alignItems: "center",
    marginTop: 10,
    backgroundColor: body.dominant2,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  paymentButton: {
    width: "100%",
    padding: 15,
    borderRadius: 30,
    backgroundColor: body.dominant,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  paymentButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  thumbnail: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  paymentReview: {
    flexDirection: "column",
    alignItems: "flex-starts",
    justifyContent: "center",
  },
  paymentReviewTopics: {
    width: 80,
    padding: 20,
    backgroundColor: body.darkDominant,
    marginRight: 30,
    borderRadius: 5,
  },
});
