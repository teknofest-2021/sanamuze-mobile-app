import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ModalBox from "react-native-modalbox";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as ImagePicker from "expo-image-picker";

const FontSize = require("../assets/styles/FontSize");
const Colors = require("../assets/styles/Colors");
const defaultImage =
  "https://raw.githubusercontent.com/rknyryn/Sanamuze/main/assets/defaultWelcomeScreenImage.jpg?token=ASPREERB2FLK6OQVIEFQNCTBGK2EU";

export default function Main({ navigation }) {
  const [canOpen, setcanOpen] = useState(false);

  const [modalOpenCG, setmodalOpenCG] = useState(false); //modal open camera/gallery
  const [modalOpenQR, setModalOpenQR] = useState(false); //modal open QR-scanner
  const [modalOpenSI, setModalOpenSI] = useState(false); //modal open send image

  const [scannedImage, setScannedImage] = useState("");
  const [choosedImage, setChoosedImage] = useState("");
  const [image, setImage] = useState(defaultImage);

  const createAlert = (msg) => {
    Alert.alert("SanAmuze", msg, [{ text: "Tamam" }], { cancelable: true });
  };

  //------------------- QR ---------------------
  const [isScanned, setIsScanned] = useState(false);

  const QRCodeScanner = async () => {
    // console.info(
    //   "[INFO]--[QRCodeScanner]-#############################-[FUNCTION]"
    // );

    const permissionQR = await BarCodeScanner.requestPermissionsAsync();
    if (permissionQR.granted === false) {
      return alert("Kamera izni yok!");
    }
  };

  const handleQRScanned = ({ type, data }) => {
    // console.info(
    //   "[INFO]--[handleQRScanned]-#############################-[FUNCTION]"
    // );

    setIsScanned(false);
    setModalOpenQR(false);

    let imagePrefix = data.split(".");

    var formdata = new FormData();
    formdata.append("imageName", data);

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch(
      "http://194.31.79.154:6065/api/similarity/getImageBase64FromQR",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setScannedImage(data);
        setImage(
          "data:image/" + imagePrefix[1] + ";base64," + result.imageBase64
        );
        setcanOpen(true);
      })
      .catch((error) => {
        createAlert("Fotoğrafı alırken bir sorun oldu.");
      });

    // console.info("[INFO]--[handleQRScanned]- : " + scannedImage + "-[FUNCTION]");
  };

  //------------------- QR END -----------------

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            QRCodeScanner();
            setModalOpenQR(true);
          }}
        >
          <Ionicons
            name="qr-code-outline"
            size={FontSize.normalizeFont(28)}
            color={Colors.primary}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  //------------------- CAMERA/GALLERY ---------------------
  const showImagePickerCamera = async () => {
    // console.info(
    //   "[INFO]--[showImagePickerCamera]-#############################-[FUNCTION]"
    // );

    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Uygulamanın kameranıza erişmesine izin vermeyi reddettiniz!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ base64: true });
    if (!result.cancelled) {
      setChoosedImage(result);
      setmodalOpenCG(false);
      setModalOpenSI(true);
      // console.info(
      //   "[INFO]--[showImagePickerCamera]-" + result.uri + "-[FUNCTION]"
      // );
    }
  };

  const showImagePickerMediaLibrary = async () => {
    // console.info(
    //   "[INFO]--[showImagePickerMediaLibrary]-#############################-[FUNCTION]"
    // );

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert(
        "Uygulamanın fotoğraflarınıza erişmesine izin vermeyi reddettiniz!"
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ base64: true });
    if (!result.cancelled) {
      setChoosedImage(result);
      setmodalOpenCG(false);
      setModalOpenSI(true);
      // console.info(
      //   "[INFO]--[showImagePickerMediaLibrary]-" + result.uri + "-[FUNCTION]"
      // );
    }
  };

  //------------------- CAMERA/GALLERY END -----------------

  const getSimilaritiyRateFromImage = () => {
    // console.info(
    //   "[INFO]--[getSimilaritiyRateFromImage]-#############################-[FUNCTION]"
    // );
    var formdata = new FormData();
    formdata.append("compareImageName", scannedImage);
    formdata.append("imageBase64", choosedImage.base64);

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch(
      "http://194.31.79.154:6065/api/similarity/getSimilaritiyRateFromImage",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setModalOpenSI(false);
        createAlert("Benzerlik Oranı: " + result.similarityRate);
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* BACKGROUND */}
      <View style={[StyleSheet.absoluteFillObject]}>
        <Image
          style={StyleSheet.absoluteFillObject}
          source={{ uri: image }}
          blurRadius={5}
          resizeMode="cover"
        />
      </View>
      {/* BACKGROUND END */}
      
      <Image resizeMode="cover" style={styles.image} source={{ uri: image }} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          canOpen
            ? setmodalOpenCG(true)
            : createAlert("Lütfen önce eserin QR kodunu okutunuz.");
        }}
      >
        <Text
          style={{
            color: Colors.textPrimary,
            fontSize: FontSize.normalizeFont(14),
          }}
        >
          Karşılaştır
        </Text>
      </TouchableOpacity>

      {/* QR-SCANNER MODAL */}
      <ModalBox
        isOpen={modalOpenQR}
        position={"bottom"}
        entry={"bottom"}
        onClosed={() => setModalOpenQR(false)}
      >
        <View style={{ flex: 1 }}>
          <BarCodeScanner
            onBarCodeScanned={isScanned ? undefined : handleQRScanned}
            style={{ flex: 1 }}
          >
            <View style={{ flex: 1, alignItems: "center" }}>
              <View
                style={{
                  marginTop: "15%",
                  width: "70%",
                  height: "10%",
                  backgroundColor: Colors.seconday + "AA",
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: Colors.textPrimary,
                    fontSize: FontSize.normalizeFont(16),
                  }}
                >
                  QR Kodunu Okutunuz
                </Text>
              </View>

              <View
                style={{
                  height: "50%",
                  width: "70%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="scan"
                  size={FontSize.normalizeFont(220)}
                  color={Colors.iconSecondary}
                />
              </View>

              <View
                style={{
                  marginTop: "10%",
                  width: "30%",
                  height: "7%",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: Colors.seconday + "AA",
                  borderRadius: 12,
                }}
              >
                <TouchableOpacity onPress={() => setModalOpenQR(false)}>
                  <Text
                    style={{
                      color: Colors.textPrimary,
                      fontSize: FontSize.normalizeFont(16),
                      fontWeight: "bold",
                    }}
                  >
                    İptal
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BarCodeScanner>
        </View>
      </ModalBox>
      {/* QR-SCANNER MODAL END */}

      {/* CAMERA/GALLERY MODAL */}
      <ModalBox
        isOpen={modalOpenCG}
        position={"bottom"}
        entry={"bottom"}
        onClosed={() => setmodalOpenCG(false)}
        style={styles.modal}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <TouchableOpacity
            style={styles.modalButton}
            onPress={showImagePickerCamera}
          >
            <Text
              style={{
                color: Colors.textPrimary,
                fontSize: FontSize.normalizeFont(14),
              }}
            >
              Kamera
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={showImagePickerMediaLibrary}
          >
            <Text
              style={{
                color: Colors.textPrimary,
                fontSize: FontSize.normalizeFont(14),
              }}
            >
              Galeri
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: Colors.danger }]}
            onPress={() => setmodalOpenCG(false)}
          >
            <Text
              style={{
                color: Colors.textPrimary,
                fontSize: FontSize.normalizeFont(14),
              }}
            >
              İptal
            </Text>
          </TouchableOpacity>
        </View>
      </ModalBox>
      {/* CAMERA/GALLERY MODAL */}

      {/* SEND IMAGE MODAL */}
      <ModalBox
        isOpen={modalOpenSI}
        position={"center"}
        entry={"center"}
        onClosed={() => setModalOpenSI(false)}
        style={styles.modalSI}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{ flex: 7, alignItems: "center", justifyContent: "center" }}
          >
            <Image
              resizeMode="cover"
              style={{ width: "90%", height: "90%", borderRadius: 12 }}
              source={{ uri: choosedImage.uri }}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity
              style={[styles.modalButton2, { backgroundColor: Colors.danger }]}
              onPress={() => setModalOpenSI(false)}
            >
              <Text
                style={{
                  color: Colors.textPrimary,
                  fontSize: FontSize.normalizeFont(14),
                }}
              >
                İptal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton2}
              onPress={getSimilaritiyRateFromImage}
            >
              <Text
                style={{
                  color: Colors.textPrimary,
                  fontSize: FontSize.normalizeFont(14),
                }}
              >
                Gönder
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalBox>
      {/* SEND IMAGE MODAL END */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },
  image: {
    height: "80%",
    width: "80%",
    borderRadius: 12,
    alignSelf: "center",
  },
  button: {
    marginTop: "5%",
    height: "7%",
    width: "80%",
    backgroundColor: Colors.seconday,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 0.3,
    borderColor: Colors.primary,
  },
  modal: {
    width: "100%",
    height: "30%",
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  modalSI: {
    width: "90%",
    height: "90%",
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  modalButton: {
    margin: "1%",
    width: "80%",
    height: "22%",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.seconday,
  },
  modalButton2: {
    marginTop: "1%",
    height: "60%",
    width: "40%",
    backgroundColor: Colors.accept,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
