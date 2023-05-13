import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Account from "./Account";
import MatchResults from "./MatchResults";
import TabNavigator from "./TabNavigator";


const Stack = createStackNavigator();
//Navegacion  Stack entre tres pantallas 
//(Account: Donde se inicia sesion)
//(MatchResults: Donde se pone los resultados de los partiodos)
//(TabNavigator: Donde se hace una navegación Tab entre diferentes pantallas)
export default function App() {
  return (
<NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Account"
            component={Account}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="MatchResults"
            component={MatchResults}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="TabNavigator"
            component={TabNavigator}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
