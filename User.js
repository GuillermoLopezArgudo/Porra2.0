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
  const [equipoModificado, setEquipoModificado] = useState("Real Madrid CF");

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

    if (
      (filteredMatch &&
        ((filteredMatch.homeTeam.name === "Valencia CF" &&
          filteredMatch.awayTeam.name === "Real Madrid CF") ||
          (filteredMatch.homeTeam.name === "Real Madrid CF" &&
            filteredMatch.awayTeam.name === "Valencia CF"))) ||
      (filteredMatch2 &&
        ((filteredMatch2.homeTeam.name === "Valencia CF" &&
          filteredMatch2.awayTeam.name === "Real Madrid CF") ||
          (filteredMatch2.homeTeam.name === "Real Madrid CF" &&
            filteredMatch2.awayTeam.name === "Valencia CF")))
    ) {
      setEquipoModificado("FC Barcelona");
    } else {
      setEquipoModificado("Real Madrid CF");
    }

    //Recogida de resultado BBDD
    const filteredMatch2 = jornadas.find(
      (partido) =>
        partido.matchday === jornada &&
        (partido.homeTeam.name.includes(equipoModificado) ||
          partido.awayTeam.name.includes(equipoModificado))
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
  //Muestra partidos por pantalla
  const filteredMatches2 = jornadas.filter(
    (partido) =>
      partido.matchday === jornadaActual &&
      (partido.homeTeam.name.includes(equipoModificado) ||
        partido.awayTeam.name.includes(equipoModificado))
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

    <FlatList
      data={jornadaNumbers}
      keyExtractor={(item) => item.toString()}
      renderItem={({ item }) => (
        <View>
          <TouchableOpacity
            style={[
              styles.listItem,
              item === jornadaActual && { backgroundColor: "#ebbb34" },
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
                      <Text style={styles.apuestaText}>
                        Usuario: {item.Usuario}
                      </Text>
                      <Text style={styles.apuestaText}>
                        Apuesta: {item.resultado}
                      </Text>
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
                      <Text style={styles.apuestaText}>
                        Usuario: {item.Usuario}
                      </Text>
                      <Text style={styles.apuestaText}>
                        Apuesta: {item.resultado}
                      </Text>
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
            </View>
          )}
        </View>
      )}
    />
    <TouchableOpacity onPress={handleSignOut} style={styles.button}>
      <Text style={styles.buttonText}>Cerrar Sesión</Text>
    </TouchableOpacity>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  listItem: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 20,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
  },
  listItemText: {
    fontSize: 16,
    fontWeight: "bold",
    
  },
  partidosContainer: {
    flex: 1,
    width: "100%",
    padding: 20,
  },
  jornadaButton: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 20,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
  },
  jornadaButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  apuestaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f9f9f9",
    marginVertical: 5,
    borderRadius: 5,
  },
  list: {
    maxHeight: 200,
    marginBottom: 20,
  },
  infoText: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#999",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#4a4e4d",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default User;
