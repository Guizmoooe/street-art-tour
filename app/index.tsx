import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Asset } from 'expo-asset';
import { useState } from "react";
import { FlatList, Image,  StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Callout, Marker } from 'react-native-maps';
import { StatusBar } from "expo-status-bar";


function HomeScreen({navigation}: any) {
  return (<>
<StatusBar style="auto" hidden={true} />
    <View style={styles.home}>
      <Text>Street Art'Magnac</Text>
      <Text>Actualités</Text>
      <Image
              source={require('../assets/images/affiche.jpg')}
              style={styles.homeImage}
      />
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => {
          /* 1. Navigate to the Details route with params */
          navigation.navigate('Map');
        }}
      >
        <Text>Carte des fresques</Text>
      </TouchableOpacity>
    </View>
    </>
  );
}

function MapScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', 'Street Art', 'Graffiti', 'Peinture'];
 
  const markersData = [
    {
      id: 1,
      title: "Fresque 1",
      description: "Superbe fresque de l'artiste Sun C",
      coordinate: {
        latitude: 43.867901, 
        longitude: 0.104118
      },
      category: "Street Art",
      image: 'sunc.jpg',
      imageIndex : 0
    },
    {
      id: 2,
      title: "Fresque 2",
      description: "Superbe fresque de l'artiste Xab.Xab",
      coordinate: {
        latitude: 43.867837, 
        longitude: 0.104061
      },
      category: "Street Art",
      image: 'xab.jpg',
      imageIndex : 1
    },
    {
      id: 3,
      title: "Fresque 3",
      description: "Superbe fresque de l'artiste Doudou Style",
      coordinate: {
        latitude: 43.867754,
        longitude:  0.104020
      },
      category: "Graffiti",
      image: 'doudou.jpg',
      imageIndex : 2
    },
    {
      id: 4,
      title: "Fresque 4",
      description: "Superbe fresque de l'artiste Kafé Korsé",
      coordinate: {
        latitude: 43.861491, 
        longitude: 0.101174
      },
      category: "Peinture",
      image: 'kafe_korse.jpg',
      imageIndex : 3
    }
    // Ajoute d'autres points ici
  ];

   // Fonction de filtrage des marqueurs en fonction de la catégorie sélectionnée
  const filteredMarkers = selectedCategory === 'All'
    ? markersData
    : markersData.filter(marker => marker.category === selectedCategory);

  const initialRegion = {
    latitude: 43.8623, // Exemple pour Paris
    longitude: 0.10059,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [markers, setMarkers] = useState(markersData);
  const [currentLocation, setCurrentLocation] = useState(initialRegion);
  const [selectedMarker, setSelectedMarker] = useState({latitude: 0, longitude: 0});


  // Liste des images à précharger
const imagesToPreload = [
  require('../assets/images/sunc.jpg'),
  require('../assets/images/xab.jpg'),
  require('../assets/images/doudou.jpg'),
  require('../assets/images/kafe_korse.jpg')
];

const preloadImages = async () => {
  const imageAssets = imagesToPreload.map(image => Asset.fromModule(image).downloadAsync());
  await Promise.all(imageAssets);
};

// useEffect(() => {
//     // Fonction pour demander les permissions sur Android
//     const requestLocationPermission = async () => {
//       if (Platform.OS === 'android') {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//             {
//               title: "Permission de localisation requise",
//               message: "L'application a besoin de votre permission pour accéder à votre localisation.",
//               buttonNeutral: "Plus tard",
//               buttonNegative: "Annuler",
//               buttonPositive: "OK"
//             }
//           );
//           if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             getCurrentLocation();
//           } else {
//             Alert.alert("Permission de localisation refusée");
//           }
//         } catch (err) {
//           console.warn(err);
//         }
//       } else {
//         getCurrentLocation(); // Pour iOS, les permissions sont demandées automatiquement
//       }
//     };

//     // Fonction pour obtenir la localisation courante
//     const getCurrentLocation = () => {
//       Geolocation.getCurrentPosition(
//         (position) => {
//           setCurrentLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//           });
//         },
//         (error) => {
//           console.error("Erreur lors de l'obtention de la localisation : ", error);
//           Alert.alert("Erreur", "Impossible d'obtenir la localisation.");
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 15000,
//           maximumAge: 10000,
//           forceRequestLocation: true, // Force la demande de localisation pour améliorer la précision
//           showLocationDialog: true,   // Affiche le dialogue de localisation sur Android
//         }
//       );
//     };

//     requestLocationPermission();
//   }, []);

 const handleMarkerPress = (marker :any) => setSelectedMarker(marker);
  return (

    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedCategory === item && styles.selectedFilterButton,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={styles.filterText}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
      >
        {filteredMarkers.map(marker => (
          <Marker
            key={marker.id}
            title={marker.title}
            description={marker.description}
            coordinate={marker.coordinate}
            onPress={() => handleMarkerPress(marker)}
          >
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{marker.title}</Text>
                <Image
              source={{uri : Asset.fromModule(imagesToPreload[marker.imageIndex]).uri}}
              style={styles.calloutImage}
            />
                <Text>{marker.description}</Text>
              </View>
            </Callout>
          
            </Marker>
        ))}

         {/* {currentLocation && selectedMarker && (
          <MapViewDirections
            origin={currentLocation}
            destination={{
              latitude: selectedMarker.latitude,
              longitude: selectedMarker.longitude,
            }}
            apikey="AIzaSyCtdXBliUhgewn_r21yzDr-lZwdDI9ApuM" // Remplace par ta clé API Google Maps
            strokeWidth={4}
            strokeColor="blue"
          />
        )} */}

      </MapView>
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcff',
  },
  home: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeImage: {
    width: 300,
    height: 460,
  },  
  button: {
    margin: 10,
    backgroundColor: 'red',
  },
  map: {
    width: '100%',
    height: '100%',
  },
    markerImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Si tu veux des images circulaires
  },
   calloutContainer: {
    width: 150,
    alignItems: 'center',
  },
  calloutTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  calloutImage: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
   filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
  },
  filterButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
  },
  selectedFilterButton: {
    backgroundColor: '#841584',
  },
  filterText: {
    color: '#000',
  },
});

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen}  options={{ title: 'Street Art\'Magnac', headerShown: false }} />
        <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Carte des fresques', headerBackTitle: 'Retour' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
