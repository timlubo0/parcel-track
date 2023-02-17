import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from "react-native";
import MapView, {  LatLng, Polyline as MPolyline, Marker } from 'react-native-maps';
import Polyline from '@mapbox/polyline';

interface MapProps{
    origin: LatLng;
    destination: LatLng;
    position: LatLng;
}

const Maps = ({ origin, destination, position }: MapProps) => {

    const GOOGLE_MAPS_API_KEY: string = 'AIzaSyAYNauIpdpsYQ9S_fBz1O_QWtR3bn_d_VI';

    const [coords, setCoords] = useState<LatLng[]>([]);

    const getDirections = async (startLoc: string, destinationLoc: string) => {
        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }&key=${GOOGLE_MAPS_API_KEY}`);
            let respJson = await resp.json();
            
            let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            let coords = points.map((point: String[]) => {
                return  {
                    latitude : point[0],
                    longitude : point[1]
                }
            });

            setCoords(coords);

            return coords;
        } catch(error) {
            return error;
        }
    }

    useEffect(() => {
        getDirections(`${origin.latitude}, ${origin.longitude}`, `${destination.latitude}, ${destination.longitude}`);
    }, [null])

    return(
        <MapView
            initialRegion={{
                latitude: position.latitude, 
                longitude: position.longitude, 
                latitudeDelta: 1,
                longitudeDelta: 1
            }}
            style={{ flex: 1 }}>
            <View style={styles.markerFixed}>
                <Marker coordinate={position} />
            </View>
            <MPolyline
                coordinates={coords}
                strokeWidth={3}
                strokeColor="red"/>
        </MapView>
    )

}

const styles = StyleSheet.create({
    markerFixed: {
      left: "50%",
      marginLeft: -24,
      marginTop: -48,
      position: "absolute",
      top: "50%",
    },
 
  });

export default Maps;