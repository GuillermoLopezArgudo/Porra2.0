import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { getDoc } from "firebase/firestore";

const User = () => {
  const navigation = useNavigation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen2, setModalOpen2] = useState(false);
  const [apuestas, setApuestas] = useState([]);

  const handleSingOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Account");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={{
          uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
        }}
      />
      <Text>Usuario: {auth.currentUser?.email.split("@")[0]}</Text>
      <TouchableOpacity onPress={handleSingOut} style={styles.button}>
        <Text style={styles.buttonText}> Cerrar Sesion</Text>
      </TouchableOpacity>

    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 50,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "60%",
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
  logo: {
    width: 66,
    height: 58,
  },

  list: {
    marginTop: 20,
  },

  apuestaContainer: {
    backgroundColor: "#E8E8E8",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    width: "90%",
    alignSelf: "center",
  },
});
