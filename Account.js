import React, { useEffect,useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc } from "firebase/firestore";

//Pantalla para loguearse o registrarse

const Account = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]);

  const navigation = useNavigation();
  const API_KEY = "c127303480ab4eec989ae6e83f52ab57";
  const URL = "https://api.football-data.org/v2/competitions/2014/teams";
  
  useEffect(() => {
    fetch(URL, { headers: { "X-Auth-Token": API_KEY } })
      .then((response) => response.json())
      .then((data) => {
        const teams = data.teams.map((team) => ({
          id: team.id,
          name: team.name,
          logoUrl: team.crestUrl.replace(/^http:\/\//i, "https://"),
        }));
        setTeams(teams);
      })
      .catch((error) => console.error(error));
  }, []);

  //Funcion handleLogin: Esta se dedica comporbar si el usuario esta registrado en BBDD (firebase)
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      console.log("Inicio de sesión exitoso");
      navigation.replace("TabNavigator");
    } catch (error) {
      console.log("Error de inicio de sesión:", error);
      setError("Error de inicio de sesión");
    }
  };
  //Funcion handleDingUp: Esta se dedica a registrar en la BBDD (Authentication firebase)
  //Tambien crea una BBDD llamada Usuarios para almacenar su correo y su uid
  const handleSignUp = async () => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User account created successfully!", result.user);

      const myDoc = doc(db, "Usuarios", email?.split("@")[0]);

      await setDoc(myDoc, { correo: auth.currentUser?.email, uid:auth.currentUser.uid });
      navigation.replace("TabNavigator");

      // Código adicional para navegar a la pantalla de inicio de sesión
    } catch (error) {
      console.error(error);
    }
  };

  const renderTeamLogo = ({ item }) => (
    <View style={styles.BoxContaier}>
    <View style={styles.logoContainer}>
    <Image
      source={{ uri: item.logoUrl }}
      style={[styles.logo, { borderRadius: 10 }]}
    />
    <Text>{item.name}</Text>
  </View>
  </View>
  );

  return (
<View style={styles.container}>
<Carousel
        data={teams}
        renderItem={renderTeamLogo}
        sliderWidth={300}
        itemWidth={100}
        loop={true}
        autoplay={true}
        scrollAnimationDuration={1000}
      />

  <Text style={styles.title}>¡Inicia sesión y apuesta por tu equipo!</Text>

  <TextInput
    style={styles.input}
    placeholder="Correo electrónico"
    onChangeText={(text) => setEmail(text)}
    value={email}
    keyboardType="email-address"
  />

  <TextInput
    style={styles.input}
    placeholder="Contraseña"
    secureTextEntry={true}
    onChangeText={(text) => setPassword(text)}
    value={password}
  />

  <Button title="Iniciar sesión" onPress={() => handleLogin()} />

  {error && <Text style={styles.errorText}>{error}</Text>}

  <Text style={styles.footerText}>
    ¿Aún no tienes cuenta?{" "}
    <Text style={styles.link} onPress={() => handleSignUp()}>
      Regístrate
    </Text>
  </Text>
</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#0047ab",
    textShadowColor: "#a0a0a0",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  input: {
    height: 40,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },

  errorText: {
    color: "#f00",
    marginTop: 10,
    textAlign: "center",
  },

  footerText: {
    marginTop: 20,
    color: "#333",
    fontSize: 16,
  },

  link: {
    color: "#0047ab",
    textDecorationLine: "underline",
  },
  logoContainer: {
    width: "80%",
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignSelf: "center",
  },
  logo: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  BoxContaier: {
marginTop:50,
  },
});


export default Account;
