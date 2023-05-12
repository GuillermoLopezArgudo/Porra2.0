import React, {useState} from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Image, Alert } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { auth, db} from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";


const Account = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth,email, password);
      console.log('Inicio de sesión exitoso');
      navigation.replace("TabNavigator");

    } catch (error) {
      console.log('Error de inicio de sesión:', error);
      setError('Error de inicio de sesión');
    }
  };

  const handleSignUp = async () => {
    try {
      const result = await createUserWithEmailAndPassword(auth,email, password);
      console.log('User account created successfully!', result.user);
      // Código adicional para navegar a la pantalla de inicio de sesión
    } catch (error) {
      console.error(error);
    }
  }

  const teams = [
    {id: 1, name: 'Almeria', logo: require('./assets/alm.png')},
    {id: 2, name: 'Atletico Club Bilbao', logo: require('./assets/ath.png')},
    {id: 3, name: 'Atletico de Madrid', logo: require('./assets/atl.png')},
    {id: 4, name: 'Futbol Club Barceolna', logo: require('./assets/bar.png')},
    {id: 5, name: 'Deportivo', logo: require('./assets/dep.png')},
    {id: 6, name: 'Español', logo: require('./assets/esp.png')},
    {id: 7, name: 'Getafe', logo: require('./assets/get.png')},
    {id: 8, name: 'Malaga', logo: require('./assets/mal.png')},
    {id: 9, name: 'Mallorca', logo: require('./assets/mall.png')},
    {id: 10, name: 'Osasuna', logo: require('./assets/osa.png')},
    {id: 11, name: 'Rela Racing Club Santander', logo: require('./assets/rac.png')},
    {id: 12, name: 'Real Madrid', logo: require('./assets/rea.png')},
    {id: 13, name: 'Sevilla', logo: require('./assets/sev.png')},
    {id: 14, name: 'Sporting', logo: require('./assets/spo.png')},
    {id: 15, name: 'Tenerife', logo: require('./assets/ten.png')},
    {id: 16, name: 'Valencia', logo: require('./assets/val.png')},
    {id: 17, name: 'Vallalodid', logo: require('./assets/vall.png')},
    {id: 18, name: 'Villareal', logo: require('./assets/vill.png')},
    {id: 19, name: 'Xerez', logo: require('./assets/xer.png')},
    {id: 20, name: 'Zaragoza', logo: require('./assets/zar.png')},

  ];

  const renderTeamLogo = ({item}) => (
    
    <View style={styles.logoContainer}>
      <Image source={item.logo} style={styles.logo} />
      <Text style={styles.teamName}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Carousel
        data={teams}
        renderItem={renderTeamLogo}
        sliderWidth={300}
        itemWidth={250}
        autoplay={true}
        autoplayInterval={1500}
        loop={true}
      />


      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        onChangeText={text => setEmail(text)}
        value={email}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry={true}
        onChangeText={text => setPassword(text)}
        value={password}
      />
      <Button title="Iniciar sesión" onPress={() => handleLogin()} />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Text style={styles.footerText}>
        ¿No tienes una cuenta?{' '}
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  footerText: {
    marginTop: 20,
  },
  link: {
    color: 'blue',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Account;
