import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import firebase from "./firebase";
import { db, auth } from "./firebase";
import { setDoc, doc, collection, getDoc } from "firebase/firestore";

const MatchResults = () => {
  /*Variales codigo:
  loading:
  ValenciaMatch: Donde se almacena el partido que disputa el equipo Valencia
  realMadridMatch: Donde se almacena el partido que disputa el equipo Real Madrid
  barcelinaMatch: Donde se almacena el partido que disputa el equipo Barcelona
  valenciaResult: Donde se almacena el resultado puesto del partido del Valencia
  realMadridResult: Donde se almacena el resultado puesto del partido del Real Madrid
  barcelonaResult: Donde se almacena el resultado puesto del partido del Barcelona
  jornada: Donde se almacena la jornada del partido en la que esta actualmente
  showBarcelona: Booleana para ocultar el match del Barcelona
  showRealMadrid: Booleana para mostrar el match del Real Madrid
  */
  const [loading, setLoading] = useState(true);
  const [valenciaMatch, setValenciaMatch] = useState({});
  const [realMadridMatch, setRealMadridMatch] = useState({});
  const [barcelonaMatch, setBarcelonaMatch] = useState({});
  const [valenciaResult, setValenciaResult] = useState("");
  const [realMadridResult, setRealMadridResult] = useState("");
  const [barcelonaResult, setBarcelonaResult] = useState({});
  const [jornada, setJornada] = useState(null);
  const [showBarcelona, setShowBarcelona] = useState(false);
  const [showRealMadrid, setShowRealMadrid] = useState(true);

  //Partidos y jornadas traidas de la api (https://api.football-data.org/v2/)
  const API_KEY = "c127303480ab4eec989ae6e83f52ab57";
  const valenciaURL = `https://api.football-data.org/v2/teams/95/matches?status=SCHEDULED&competitions=2014`;
  const realMadridURL = `https://api.football-data.org/v2/teams/86/matches?status=SCHEDULED&competitions=2014`;
  const barcelonaURL = `https://api.football-data.org/v2/teams/81/matches?status=SCHEDULED&competitions=2014`;
  const jornadaURL = `https://api.football-data.org/v2/competitions/2014/matches?matchday=38`;

  //Funcion useEffect funcion que trae de la API los datos necesarios para mostrarlos y tiene un condicional 
  //el cual si juega Valencia vs Madrid se muestra el partido del Barcelona y se oculta el partido del Real Madrid
  useEffect(() => {
    Promise.all([
      fetch(valenciaURL, {
        headers: {
          "X-Auth-Token": API_KEY,
        },
      }),
      fetch(realMadridURL, {
        headers: {
          "X-Auth-Token": API_KEY,
        },
      }),
      fetch(barcelonaURL, {
        headers: {
          "X-Auth-Token": API_KEY,
        },
      }),
      fetch(jornadaURL, {
        headers: {
          "X-Auth-Token": API_KEY,
        },
      }),
    ])
      .then(([valenciaResponse, realMadridResponse,barcelonaResponse, jornadaResponse]) =>
        Promise.all([
          valenciaResponse.json(),
          realMadridResponse.json(),
          barcelonaResponse.json(),
          jornadaResponse.json(),
        ])
      )
      .then(([valenciaJson, realMadridJson,barcelonaJson, jornadaJson]) => {
        if (
          valenciaJson.matches[0].awayTeam.name === "Real Madrid" ||
          valenciaJson.matches[0].homeTeam.name === "Real Madrid"
        ) {
          setValenciaMatch(valenciaJson.matches[1]);
          setShowRealMadrid(true);
        } else {
          setValenciaMatch(valenciaJson.matches[0]);
          setShowBarcelona(false);
        }

        setRealMadridMatch(realMadridJson.matches[0]);
        setBarcelonaMatch(barcelonaJson.matches[0])
        setJornada(jornadaJson.matches[0].season);
        setLoading(false);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);
/*Funcion handleSaveResults:
Esta funcion se dedica a subir los datos a la BBDD (Firebase)
Los sube de la forma (Coleccion:Apuestas),(Documento:Jornada),(Coleccion:Partido),(Documento:IdUser),(Campos: User, Resultado)
*/
  const handleSaveResults = async (match, result, jornada) => {

    const email = auth.currentUser?.email;
    const username = email?.split("@")[0];

    const apuesta = {
      resultado: result,
      Usuario: username,

    };
  
    const jornadaDocRef = doc(db, "Apuestas",`Jornada-${jornada.currentMatchday}`)
    const Partido= collection(jornadaDocRef,`${match.homeTeam.name}-${match.awayTeam.name}`)
    const userApuestaRef = doc(Partido, auth.currentUser.uid);
    try {
      const partidoDoc = await getDoc(userApuestaRef);
      if(partidoDoc.exists()){
        alert("Ya has puesto el resultado");
      }else{
      
      await setDoc(doc(Partido,`${auth.currentUser.uid}`),apuesta,{merge: true});
      alert("Resultado guardado exitosamente");
    }
    } catch (error) {
      alert(`Hubo un error al guardar el resultado: ${error.message}`);
    }
  };
  return (
    <ScrollView>
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          <Text style={styles.title}>Próximos partidos</Text>
          <View style={styles.card}>
            <Text style={styles.subTitle}>Valencia</Text>
            <Text style={styles.text}>Fecha: {valenciaMatch.utcDate}</Text>
            <Text style={styles.text}>
              Local: {valenciaMatch.homeTeam.name}
            </Text>
            <Text style={styles.text}>
              Visitante: {valenciaMatch.awayTeam.name}
            </Text>
            <TextInput
              style={styles.textInput}
              value={valenciaResult}
              onChangeText={(text) => setValenciaResult(text)}
              placeholder="Ingrese el resultado"
            />
            <Button
              title="Guardar resultado"
              onPress={() => handleSaveResults(valenciaMatch, valenciaResult, jornada)}
            />
          </View>
          {showRealMadrid ? (
<>
          <View style={styles.card}>
            <Text style={styles.subTitle}>Real Madrid</Text>
            <Text style={styles.text}>Fecha: {realMadridMatch.utcDate}</Text>
            <Text style={styles.text}>
              Local: {realMadridMatch.homeTeam.name}
            </Text>
            <Text style={styles.text}>
              Visitante: {realMadridMatch.awayTeam.name}
            </Text>
            <TextInput
              style={styles.textInput}
              value={realMadridResult}
              onChangeText={(text) => setRealMadridResult(text)}
              placeholder="Ingrese el resultado"
            />
            <Button
              title="Guardar resultado"
              onPress={() =>
                handleSaveResults(realMadridMatch, realMadridResult, jornada)
              }
            />
          </View>
          </>
) : null}

          {showBarcelona ? (
<>
          <View style={styles.card}>
            <Text style={styles.subTitle}>Barcelona</Text>
            <Text style={styles.text}>Fecha: {barcelonaMatch.utcDate}</Text>
            <Text style={styles.text}>
              Local: {barcelonaMatch.homeTeam.name}
            </Text>
            <Text style={styles.text}>
              Visitante: {barcelonaMatch.awayTeam.name}
            </Text>
            <TextInput
              style={styles.textInput}
              value={barcelonaResult}
              onChangeText={(text) => setBarcelonaResult(text)}
              placeholder="Ingrese el resultado"
            />
            <Button
              title="Guardar resultado"
              onPress={() =>
                handleSaveResults(barcelonaMatch, barcelonaResult, jornada)
              }
            />
          </View>
          </>
) : null}
        </View>
        
      )}
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    marginBottom: 20,
    elevation: 5,
  },
  subTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  textInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
});

export default MatchResults;
