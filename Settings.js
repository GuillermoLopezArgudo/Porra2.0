import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { auth } from "./firebase";
import { TextInput } from "react-native-gesture-handler";
import { updateEmail, updatePassword } from "firebase/auth";


const Settings = () => {
  const [modalEmailOpen, setModalEmailOpen] = useState(false);
  const [modalPasswordOpen, setModalPasswordOpen] = useState(false);

  const [text, setText] = useState("");

  const UpdateEmail = (email) => {
    if (
      /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(email)
    ) {
      updateEmail(auth.currentUser, email)
        .then(() => {
          alert("Correo Actualizado!");
          setText("");
          setModalEmailOpen(false);
        })
        .catch((error) => {
          alert(error.message);
        });
    } else {
      alert("La dirección de email es incorrecta.");
    }
  };

  const UpdatePassword = (password) => {
    if (password.length > 7) {
      updatePassword(auth.currentUser, password)
        .then(() => {
          alert("Contraseña Actualizada!");
          setText("");
          setModalPasswordOpen(false);
        })
        .catch((error) => {
          alert(error.message);
        });
    } else {
      alert("ERROR");
    }
  };

return (
  <View style={styles.container}>
    <Image
      style={styles.logo}
      source={{
        uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
      }}
    />
    <View>
      <TouchableOpacity
        onPress={() => setModalEmailOpen(true)}
        style={styles.button2}
      >
        <Text style={styles.buttonText}>CAMBIAR CORREO</Text>
      </TouchableOpacity>
    </View>

    <View>
      <TouchableOpacity
        onPress={() => setModalPasswordOpen(true)}
        style={styles.button2}
      >
        <Text style={styles.buttonText}>CAMBIAR CONTRASEÑA</Text>
      </TouchableOpacity>
    </View>

    <Modal visible={modalEmailOpen}>
      <View>
        <Text style={styles.input2}>ESCRIBE EL NUEVO CORREO:</Text>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          onChangeText={(text) => setText(text)}
          placeholder="Nuevo Correo"
        />
      </View>
      <TouchableOpacity
        onPress={() => UpdateEmail(text)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>CONFIRMAR</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setModalEmailOpen(false)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>ATRÁS</Text>
      </TouchableOpacity>
    </Modal>

    <Modal visible={modalPasswordOpen}>
      <View>
        <Text style={styles.input2}>ESCRIBE LA NUEVA CONTRASEÑA:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setText(text)}
          placeholder="Contraseña Nueva"
          secureTextEntry
        />
      </View>
      <TouchableOpacity
        onPress={() => UpdatePassword(text)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>CONFIRMAR</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setModalPasswordOpen(false)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>ATRÁS</Text>
      </TouchableOpacity>
    </Modal>
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#6C63FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  button2: {
    backgroundColor: "#6C63FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  input2: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 18,
  }
  
})
export default Settings;
