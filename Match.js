import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { auth, db } from "./firebase";
import { collection, getDocs, doc, listCollections } from "firebase/firestore";
import { Table, Row, Rows } from "react-native-table-component";

const Match = () => {
  const [users, setUsers] = useState([]);
  const [jornada, setJornada] = useState(null);
  const [valenciaMatch, setValenciaMatch] = useState(null);
  const [realmadridMatch, setRealmadridMatch] = useState(null);
  const [apuestas, setApuestas] = useState([]);

  const fetchJornada = async () => {
    // Obtener la fecha y hora actual a través de la API de worldtimeapi.org
    const response = await fetch("http://worldtimeapi.org/api/ip");
    const data = await response.json();
    const fechaActual = new Date(data.datetime);
    const fechaActualStr = `${fechaActual.getFullYear()}-${String(
      fechaActual.getMonth() + 1
    ).padStart(2, "0")}-${String(fechaActual.getDate()).padStart(2, "0")}`;

    // Obtener la jornada correspondiente a la fecha actual a través de la API de football-data.org
    const responseJornada = await fetch(
      `https://api.football-data.org/v2/competitions/2014/matches?dateFrom=${fechaActualStr}&dateTo=${fechaActualStr}`,
      {
        headers: { "X-Auth-Token": "c127303480ab4eec989ae6e83f52ab57" },
      }
    );
    const dataJornada = await responseJornada.json();
    setJornada(dataJornada.matches[0].matchday);

    //console.log(dataJornada.matches[0].matchday)

    fetchApuestas(jornada, dataJornada);
  };

const fetchApuestas = async (jornada, DataJornada) => {
  // Filtrar los partidos del Valencia CF en la jornada correspondiente
  const partidosValencia = DataJornada.matches.filter(
    (partido) =>
      partido.matchday === jornada &&
      (partido.homeTeam.name === "Valencia CF" ||
        partido.awayTeam.name === "Valencia CF")
  );
  console.log(jornada)

  console.log("Partidos del Valencia CF:", partidosValencia);

  const querySnapshot = await getDocs(collection(db, "Apuestas"));
  const apuestasDocs = querySnapshot.docs.map((doc) => doc.data());
  setApuestas(apuestasDocs);

  if (apuestasDocs.length === 0) {
    alert(`La Porra se esta actualizando, espere a que acabe el ultimo partido de la Jornda-${jornada}`);
  } else {
    console.log(`Documentos en la colección 'Apuestas':`);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      const subCollection = collection(doc.ref, `Jornada-${jornada}`);
      getDocs(subCollection).then((subCollectionSnapshot) => {
        subCollectionSnapshot.forEach((subDoc) => {
          if (subDoc.data().homeTeam.name === "Valencia CF" || subDoc.data().awayTeam.name === "Valencia CF") {
            console.log(subDoc.id, " => ", subDoc.data());
          }
        });
      });
    });
  }
};

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "Usuarios"));
    const users = querySnapshot.docs.map((doc) => doc.data());
    setUsers(users);
  };

  const tableData = users.map((item) => [
    item.correo?.split("@")[0],
    "No hay resultado",
    "No hay resultado",
  ]);

  const tableHead = [
    "Jugadores",
    valenciaMatch
      ? `${valenciaMatch.homeTeam.name} vs ${valenciaMatch.awayTeam.name}`
      : "Cargando...",
    realmadridMatch
      ? `${realmadridMatch.homeTeam.name} vs ${realmadridMatch.awayTeam.name}`
      : "Cargando...",
  ];

  const handleRefresh = () => {
    fetchJornada();
    fetchUsers();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Jornada {jornada}</Text>
      <View style={styles.card}>
        <Table borderStyle={styles.table}>
          <Row
            data={tableHead}
            style={styles.head}
            textStyle={styles.headText}
          />
          <Rows data={tableData} textStyle={styles.text} />
        </Table>
      </View>
      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.refreshText}>Refrescar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  table: {
    borderWidth: 1,
    borderColor: "#000",
  },
  head: {
    height: 40,
    backgroundColor: "#f1f8ff",
  },
  headText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
  },
  card: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    marginBottom: 20,
    elevation: 5,
  },
  refreshButton: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  refreshText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Match;
