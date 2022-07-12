import React, {useState, useEffect} from "react"
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import { Camera, CameraType } from 'expo-camera'
import AppIcon from "../components/AppIcon"

const CameraScreen = () => {
    const [allowedCamera, setAllowedCamera] = useState(null)
    const [type, setType] = useState(CameraType.back)

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync()
            setAllowedCamera(status === 'granted')
        })()
    }, [])

    if(allowedCamera === null) {
        return <View/>
    }
    if(allowedCamera === false) {
        return <Text style={styles.notAllowed}> No Camera Access :( </Text>
    }
    
    return (
        <View style={{flex:1}}>
            <Camera style={{flex:1}}>
                <TouchableOpacity style={styles.captureBtn}></TouchableOpacity>

                <View style={styles.header}>
                    <AppIcon AntName="user" color="#eee" size={24}/>
                    <AppIcon AntName="settings-outline" color="#eee" size={24}/>
                </View>

                <View style={styles.sideItems}>
                    <AppIcon IonName="camera-outline" size={20} color="#eee" style={styles.sideIcons}/>
                    <AppIcon IonName="flash-outline" size={20} color="#eee" style={styles.sideIcons}/>
                    <AppIcon IonName="ios-musical-notes-outline" size={20} color="#eee" style={styles.sideIcons}/>
                </View>
            </Camera>
        </View>
    )
}

const styles = StyleSheet.create({
    notAllowed: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    header: {
        position: "absolute",
        top: 40,
        justifyContent: "space-between", 
        padding: 10,
        flexDirection: "row",
        width: "100%"
    },
    sideItems: {
        position: "absolute",
        top: 110,
        right: 0,
        padding: 10,
    },
    sideIcons: {
        width: 50,
        height: 50,
        marginVertical: 10
    },
    captureBtn: {
        position: "absolute",
        bottom: 10,
        width: 80,
        height: 80,
        borderRadius: 100,
        borderBottomColor: "#eee",
        borderWidth: 6,
        alignSelf: "center"
    }
})

export default CameraScreen