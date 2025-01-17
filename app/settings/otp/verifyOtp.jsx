import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import useAuth from "@/hooks/useAuth";
import body from "@/constants/Colors";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(600);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    const { verifyOtp } = useAuth();
    await verifyOtp(otp, setLoading);
  };

  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <View style={styles.formCta}>
          <View style={{ width: "90%" }}>
            <Text style={{ fontWeight: "bold", marginTop: 20 }}>
              Enter Code
            </Text>
            <Text style={{ fontWeight: "bold", marginTop: 20 }}>
              Please enter the code that was sent to your email
            </Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter Otp Code"
            onChangeText={(text) => {
              setOtp(text);
            }}
          />
          <View
            style={{
              width: "80%",
            }}
          >
            <Text style={{ fontWeight: "bold", marginTop: 20 }}>
              A code will be sent to the email you entered
            </Text>
          </View>
          <View
            style={{
              width: "80%",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Text style={{ fontWeight: "bold", marginTop: 20 }}>
              Expires in {count}s
            </Text>
          </View>
          <TouchableOpacity style={styles.otpBtn} onPress={handleSubmit}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.otpButtonText}>Verify Code</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: body.dominant,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  container2: {
    backgroundColor: body.tertiary,
    width: "100%",
    height: "90%",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  formCta: {
    width: "100%",
    height: "100%",
    flex: 1,
    paddingTop: 20,
    alignItems: "center",
  },
  input: {
    backgroundColor: "#E2E2E2",
    padding: 10,
    width: Dimensions.get("window").width - 50,
    height: 54,
    borderRadius: 10,
    marginTop: 20,
    fontSize: 18,
    fontWeight: "500",
  },
  otpBtn: {
    width: Dimensions.get("window").width - 50,
    backgroundColor: body.dominant,
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    height: 54,
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
  },
  otpButtonText: {
    color: "#f2f2f2",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "500",
  },
});
