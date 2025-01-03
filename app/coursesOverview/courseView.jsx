import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import body from "@/constants/Colors";
import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { Video } from "expo-av";
import * as Speech from "expo-speech";
import useTitleStore from "../store/titleStore";

export default function Page() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [play, setPlay] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const setMessage = useTitleStore((state) => state.setMessage);

  useEffect(() => {
    const fetchData = async () => {
      const { topicsByCourseId } = useAuth();
      const data = await topicsByCourseId(setLoading, setError);
      setTitle(data[progress]?.course?.title);
      setResponse(data);
      setMessage(data[progress]);
      setError(false);
      console.log("data overview", data);
      if (data.length === 0) {
        setIsDone(true);
      }
    };
    fetchData();
  }, []);

  const handleFetch = async () => {
    const { topicsByCourseId } = useAuth();
    const data = await topicsByCourseId(setLoading, setError);
    setResponse(data);
    setMessage(response[progress]?.course?.title);
    console.log("data overview", data);
    if (data.length === 0) {
      setIsDone(true);
    }
  };

  const handleNext = () => {
    if (progress + 1 >= response.length) {
      setIsDone(true);
    } else {
      setProgress(progress + 1);
      setIsDone(false);
    }
  };
  const handleBack = async () => {
    setProgress(progress - 1);
  };

  const playAudio = async () => {
    setPlay(true);
    Speech.speak(response[progress]?.note || "", {
      onDone: () => {
        console.log("Speech completed");
        setPlay(false);
      },
      onError: (error) => {
        console.error("Speech error:", error);
        setPlay(false);
      },
    });
  };

  const stopAudio = () => {
    Speech.stop();
    setPlay(false);
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
        <>
          <View
            style={{ width: "100%", paddingHorizontal: 20, paddingTop: 30 }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 5,
              }}
            >
              <Text style={{ color: "white", fontWeight: 800, fontSize: 20 }}>
                {response[progress]?.title}
              </Text>
              <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
                <FontAwesome name="list" size={25} color={body.tertiary} />
              </TouchableOpacity>
              {isMenuOpen && (
                <Modal transparent={true}>
                  <View
                    style={styles.modalContainer}
                    onPress={() => {
                      setIsMenuOpen(false);
                    }}
                  >
                    <View style={styles.modalContent}>
                      <Text
                        style={{
                          color: body.dominant,
                          fontSize: 20,
                          paddingVertical: 20,
                          paddingHorizontal: 10,
                          borderBottomWidth: 1,
                        }}
                      >
                        Lessons
                      </Text>
                      <FlatList
                        data={response}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                          <TouchableOpacity
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 20,
                              borderBottomWidth: 1,
                              borderColor: body.dominant,
                            }}
                            onPress={() => {
                              setProgress(index);
                              setIsMenuOpen(false);
                            }}
                          >
                            <Text style={{ fontWeight: 600 }}>
                              {item?.title}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                    <TouchableOpacity
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "transparent",
                      }}
                      onPress={() => setIsMenuOpen(false)}
                    ></TouchableOpacity>
                  </View>
                </Modal>
              )}
            </View>
            {response[progress]?.video && (
              <Video
                posterSource={{ uri: response[progress]?.thumbnail }}
                source={{ uri: response[progress]?.video }}
                style={styles.video}
                resizeMode="contain"
                useNativeControls
                onLoadStart={() => console.log("Video loaded successfully")}
                onLoad={() => console.log("Loading video...")}
                onError={(error) => console.log("Video error:", error)}
              />
            )}
          </View>
          <View style={styles.OverviewContainer}>
            <View style={styles.playBtnCta}>
              {play ? (
                <View>
                  <TouchableOpacity>
                    <FontAwesome
                      name="stop-circle"
                      size={40}
                      color={body.dominant}
                      onPress={stopAudio}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity>
                  <FontAwesome
                    name="play-circle"
                    size={40}
                    color={body.dominant}
                    onPress={playAudio}
                  />
                </TouchableOpacity>
              )}
            </View>
            <ScrollView>
              <View style={styles.contentContainer}>
                <Text style={styles.contentText}>
                  {response[progress]?.note}{" "}
                </Text>
              </View>
              <View style={styles.btnCta}>
                {isDone ? (
                  <>
                    <Text style={styles.doneText}>
                      You are done with this course
                    </Text>
                    <TouchableOpacity
                      style={styles.nextBtn}
                      onPress={() => router.back()}
                    >
                      <Text style={styles.btnText}>Done</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {progress > 0 && (
                      <TouchableOpacity
                        style={styles.nextBtn}
                        onPress={handleBack}
                      >
                        <Text style={styles.btnText}>Back</Text>
                      </TouchableOpacity>
                    )}
                    {progress < response.length - 1 && (
                      <TouchableOpacity
                        style={[styles.nextBtn, progress > 0 && styles.spacing]}
                        onPress={handleNext}
                      >
                        <Text style={styles.btnText}>Next</Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: body.dominant,
    alignItems: "center",
    overflow: "scroll",
  },
  text: {
    color: body.tertiary,
    fontSize: 20,
    marginLeft: 20,
    fontWeight: "800",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 20,
  },
  video: {
    width: "100%",
    height: 300,
  },
  OverviewContainer: {
    backgroundColor: body.tertiary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    flex: 1,
  },
  contentContainer: {
    padding: 10,
    paddingHorizontal: 20,
    width: "100%",
    flex: 1,
  },
  contentText: {
    color: body.textDark,
    fontSize: 15,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  button: {
    padding: 15,
    width: "100%",
    backgroundColor: body.tertiary,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
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
  nextBtn: {
    padding: 10,
    alignItems: "center",
    backgroundColor: body.dominant2,
  },
  btnCta: {
    width: "100%",
    padding: 20,
  },
  playBtnCta: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 9999,
  },
  nextBtn: {
    padding: 15,
    alignItems: "center",
    backgroundColor: body.dominant2,
    borderRadius: 5,
  },
  btnText: {
    color: "white",
    fontWeight: "700",
  },
  btnCta: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  doneText: {
    color: "white",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  spacing: {
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },

  modalContent: {
    width: 250,
    height: "100%",
    backgroundColor: body.tertiary,
    marginRight: 10,
    borderRadius: 5,
    paddingTop: 20,
  },
  modalContentBtn: {
    width: "100%",
    padding: 10,
    justifyContent: "center",
  },
});
