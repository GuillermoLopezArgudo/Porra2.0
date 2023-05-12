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
          <Text style={styles.buttonText}>Cambiar Correo</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity
          onPress={() => setModalPasswordOpen(true)}
          style={styles.button2}
        >
          <Text style={styles.buttonText}>Cambiar Contraseña</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalEmailOpen}>
        <Image
          source={{
            uri: "https://logovtor.com/wp-content/uploads/2020/12/dr-schneider-unternehmensgruppe-logo-vector.png",
          }}
          style={styles.image}
        />
        <View>
          <Text style={styles.input2}>Escribe el nuevo correo:</Text>
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
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalEmailOpen(false)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Atras</Text>
        </TouchableOpacity>
      </Modal>

      <Modal visible={modalPasswordOpen}>
        <Image
          source={{
            uri: "https://logovtor.com/wp-content/uploads/2020/12/dr-schneider-unternehmensgruppe-logo-vector.png",
          }}
          style={styles.image}
        />
        <View>
          <Text style={styles.input2}>Escribe la nueva contraseña:</Text>
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
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalPasswordOpen(false)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Atras</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    margin: 20,
    padding: 5,
  },
  logo: {
    margin: 10,
    width: 100,
    height: 100,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 40,
    marginLeft: 100,
  },
  button2: {
    backgroundColor: "black",
    width: "70%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 40,
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  input: {
    height: 40,
    margin: 15,
    borderWidth: 1,
    padding: 10,
  },
  input2: {
    height: 40,
    marginLeft: 15,
  },
  image: {
    width: "90%",
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
});
