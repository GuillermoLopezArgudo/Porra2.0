import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { getDoc, doc, collection } from "firebase/firestore";

const User = () => {
  const navigation = useNavigation();
  const API_KEY = "c127303480ab4eec989ae6e83f52ab57";
  const [jornadas, setJornadas] = useState([]);
  const [jornadaActual, setJornadaActual] = useState(null);
  const jornadaNumbers = Array.from(
    new Set(jornadas.map((item) => item.matchday))
  );
  const [apuestas, setApuestas] = useState([]);
  const [apuestas2, setApuestas2] = useState([]);

  useEffect(() => {
    fetch(`https://api.football-data.org/v2/competitions/2014/matches`, {
      headers: { "X-Auth-Token": API_KEY },
    })
      .then((response) => response.json())
      .then((data) => setJornadas(data.matches))
      .catch((error) => console.error(error));
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => navigation.replace("Account"))
      .catch((error) => alert(error.message));
  };

  const handleJornadaPress = (jornada) => {
    setJornadaActual(jornada);
    const jornadaDocRef = doc(db, "Apuestas", `Jornada-${jornada}`);
    const filteredMatch = jornadas.find(
      (partido) =>
        partido.matchday === jornada &&
        (partido.homeTeam.name === "Valencia CF" ||
          partido.awayTeam.name === "Valencia CF")
    );

    const filteredMatch2 = jornadas.find(
      (partido) =>
        partido.matchday === jornada &&
        (partido.homeTeam.name.includes("Real Madrid") ||
          partido.awayTeam.name.includes("Real Madrid"))
    );

    const partidoRef = collection(
      jornadaDocRef,
      `${filteredMatch.homeTeam.name}-${filteredMatch.awayTeam.name}`
    );

    const partidoRef2 = collection(
      jornadaDocRef,
      `${filteredMatch2.homeTeam.name}-${filteredMatch2.awayTeam.name}`
    );

    const userApuestaRef = doc(partidoRef, auth.currentUser.uid);

    const userApuestaRef2 = doc(partidoRef2, auth.currentUser.uid);

    getDoc(userApuestaRef).then((doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setApuestas([data]);
      } else {
        console.log("No such document!");
        setApuestas([]);
      }
    });

    getDoc(userApuestaRef2).then((doc) => {
      if (doc.exists()) {
        const data2 = doc.data();
        setApuestas2([data2]);
      } else {
        console.log("No such document!");
        setApuestas2([]);
      }
    });
  };
  const filteredMatches = jornadas.filter(
    (partido) =>
      partido.matchday === jornadaActual &&
      (partido.homeTeam.name === "Valencia CF" ||
        partido.awayTeam.name === "Valencia CF")
  );

  const filteredMatches2 = jornadas.filter(
    (partido) =>
      partido.matchday === jornadaActual &&
      (partido.homeTeam.name.includes("Real Madrid") ||
        partido.awayTeam.name.includes("Real Madrid"))
  );

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={{
          uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
        }}
      />
      <Text style={styles.title}>
        ¡Bienvenido/a, {auth.currentUser?.email.split("@")[0]}!
      </Text>

      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <FlatList
        data={jornadaNumbers}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity
              style={[
                styles.listItem,
                item === jornadaActual && { backgroundColor: "yellow" },
              ]}
              onPress={() => handleJornadaPress(item)}
            >
              <Text style={styles.listItemText}>Jornada {item}</Text>
            </TouchableOpacity>
            {jornadaActual === item && (
              <View style={styles.partidosContainer}>
                <FlatList
                  data={filteredMatches}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.jornadaButton}>
                      <Text style={styles.jornadaButtonText}>
                        {item.homeTeam.name} - {item.awayTeam.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                {apuestas.length > 0 ? (
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
                ) : (
                  <Text style={styles.infoText}>
                    No se tiene información almacenada
                  </Text>
                )}
                <FlatList
                  data={filteredMatches2}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.jornadaButton}>
                      <Text style={styles.jornadaButtonText}>
                        {item.homeTeam.name} - {item.awayTeam.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                {apuestas2.length > 0 ? (
                  <FlatList
                    data={apuestas2}
                    renderItem={({ item }) => (
                      <View style={styles.apuestaContainer}>
                        <Text>Usuario: {item.Usuario}</Text>
                        <Text>Apuesta: {item.resultado}</Text>
                      </View>
                    )}
                    keyExtractor={(item) => item.id}
                    style={styles.list}
                  />
                ) : (
                  <Text style={styles.infoText}>No se tiene información almacenada</Text>
                )}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 50,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  button: {
    backgroundColor: "#0782F9",
    width: "70%",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  listItem: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  listItemText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  centeredContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  jornadaButton: {
    backgroundColor: "#FFFFFF",
    width: "90%",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  jornadaButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  infoText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    color: "#333",
  },
  apuestaContainer: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#F5F5F5",
  },
  list: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
});

export default User;
