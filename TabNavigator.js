import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


import User from "./User";
import Settings from "./Settings";
import MatchResults from "./MatchResults";

import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const Tab = createBottomTabNavigator();
//Navegacion Tab para navegar entre las distintas pantallas (Usuario,Ajustes,Apuesta)
const TabNavigator = () => {
  return (
      <Tab.Navigator
        screenOptions={ ({ route }) => ({
          headerShown: false,
          tabBarIcon: ({color, size}) => {
              let iconName = "";
              switch(route.name){
                case "Usuario":
                  iconName= "account"
                  break;
                case "Ajustes":
                  iconName = "cog-outline"
                  break;
                case "Apuesta":
                  iconName = "soccer-field"
                  break;
              }
              return <MaterialCommunityIcons name= {iconName} size={size} color={color} />
          }
        })}
      >
        <Tab.Screen name ="Usuario" component={User} />
        <Tab.Screen name ="Ajustes" component={Settings} />
        <Tab.Screen name ="Apuesta" component={MatchResults} />

      </Tab.Navigator>
  );
};

export default TabNavigator;
