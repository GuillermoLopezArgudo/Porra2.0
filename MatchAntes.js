import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { auth, db } from "./firebase";
import { collection, getDocs, doc } from "firebase/firestore";
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


      //Muestra Datos Pantallas
      const responsePartidos = await fetch(
        `https://api.football-data.org/v2/competitions/2014/matches?matchday=${jornada}`,
        {
          headers: { "X-Auth-Token": "c127303480ab4eec989ae6e83f52ab57" },
        }
      );
      const dataPartidos = await responsePartidos.json();

      const partido1 = dataPartidos.matches.find(
        (partido) =>
          partido.homeTeam.name === "Valencia CF" ||
          partido.awayTeam.name === "Valencia CF"
      );

      setValenciaMatch(partido1);

      const responsePartidos2 = await fetch(
        `https://api.football-data.org/v2/competitions/2014/matches?matchday=${jornada}`,
        {
          headers: { "X-Auth-Token": "c127303480ab4eec989ae6e83f52ab57" },
        }
      );
      const dataPartidos2 = await responsePartidos2.json();
      
      const partido2 = dataPartidos2.matches.find((partido) => {
        if (
          (partido.homeTeam.name === "Real Madrid CF" &&
            partido.awayTeam.name === "Valencia CF") ||
          (partido.homeTeam.name === "Valencia CF" &&
            partido.awayTeam.name === "Real Madrid CF")
        ) {
          return (
            partido.homeTeam.name === "FC Barcelona" ||
            partido.awayTeam.name === "FC Barcelona"
          );
        } else {
        }
        return (
          partido.homeTeam.name === "Real Madrid CF" ||
          partido.awayTeam.name === "Real Madrid CF"
          
        );
      });
      
      setRealmadridMatch(partido2);

    //Recogida Datos BBDD

    const querySnapshot = await getDocs(collection(db, "Usuarios"));
      const users = querySnapshot.docs.map((doc) => doc.data());
      setUsers(users);
   
    const jornadaDocRef = doc(db, "Apuestas", `Jornada-${jornada}`);
      const partidoRef = collection (
        jornadaDocRef,`${partido1.homeTeam.name}-${partido1.awayTeam.name}`
      );
        
        const userApuestaRef = doc(partidoRef,users.map((item)=> [
            item.uid
            
        ]) )

        getDoc(userApuestaRef).then((doc) => {
            if (doc.exists()) {
              const data = doc.data();
              setApuestas([data]);
            } else {
              console.log("No such document!");
              setApuestas([]);
            }
          });
    };


 
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "Usuarios"));
      const users = querySnapshot.docs.map((doc) => doc.data());
      setUsers(users);
    };
    fetchUsers();


  const tableData = users.map((item) => [
    item.correo?.split("@")[0],
    apuestas,
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
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  refreshText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Match;
