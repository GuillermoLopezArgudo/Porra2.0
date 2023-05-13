import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { getDoc, doc, collection } from "firebase/firestore";
import { fetch } from "node-fetch";

const User = () => {
  const navigation = useNavigation();
  const API_KEY = "c127303480ab4eec989ae6e83f52ab57";
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

  useEffect(() => {

    const jornadaDocRef = doc(db, "Apuestas",`Jornada-undefined`);
    const partidoRef = collection(jornadaDocRef,`RC Celta de Vigo-Valencia CF`);
    const userApuestaRef = doc(partidoRef, auth.currentUser.uid);

    getDoc(userApuestaRef).then((doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setApuestas([data]);
      } else {
        console.log("No such document!");
      }
    });
  }, []);

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

      <FlatList
        data={apuestas}
        renderItem={({ item }) => (
          <View style={styles.apuestaContainer}>
            <Text>Usuario: {item.Usuario}</Text>
            <Text>Apuesta: {item.resultado}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
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
  },
})