import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import useAuth from "@/hooks/useAuth";
import body from "@/constants/Colors";
export default function Page() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <Text style={styles.textTitle}>How Can We Help?</Text>
        {/* <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Search Help Center "
          />
          <FontAwesome
            name={"search"}
            color="black"
            size={18}
            style={styles.eyeIcon}
          />
        </View> */}
        <Text style={{ fontWeight: 800, marginBottom: 20 }}>Help Topics</Text>
        <TouchableOpacity
          style={styles.helpContent}
          onPress={() => router.navigate("/settings/help/getStarted/")}
        >
          <FontAwesome name="flag" size={18} />
          <Text style={styles.helpContentText}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.helpContent}
          onPress={() => router.navigate("/settings/help/courses/")}
        >
          <FontAwesome name="laptop" size={18} />
          <Text style={styles.helpContentText}>Courses</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.helpContent}
          onPress={() => router.navigate("/settings/help/FAQs/")}
        >
          <FontAwesome name="question" size={20} />
          <Text style={styles.helpContentText}>FAQs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.helpContent}
          onPress={() => router.navigate("/settings/help/troubleshoot/")}
        >
          <MaterialIcons name="troubleshoot" size={20} />
          <Text style={styles.helpContentText}>Troubleshooting</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.helpContent}
          onPress={() => router.navigate("/settings/help/advanceHelpTopics/")}
        >
          <MaterialIcons name="topic" size={20} />
          <Text style={styles.helpContentText}>Advance help topics</Text>
        </TouchableOpacity>
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
    height: "100%",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 20,
  },
  textTitle: {
    textAlign: "center",
    fontWeight: "900",
    fontSize: 18,
  },
  passwordInput: {
    width: Dimensions.get("window").width - 80,
    borderRadius: 0,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    padding: 10,
    paddingVertical: 15,
    fontSize: 18,
    fontWeight: "500",
  },
  passwordInputContainer: {
    width: Dimensions.get("window").width - 50,
    backgroundColor: "#E2E2E2",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 0,
    marginVertical: 20,
    borderRadius: 30,
  },
  helpContent: {
    flexDirection: "row",
    width: 220,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  helpContentText: {
    fontSize: 18,
    fontWeight: 900,
    marginLeft: 30,
  },
});
