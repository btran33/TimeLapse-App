import React, {useState, useEffect, useRef} from "react"
import { Text, View, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native'
import { AutoFocus, Camera, CameraType } from 'expo-camera'
import AppIcon from "../components/AppIcon"

const CameraScreen = () => {
    const [allowedCamera, setAllowedCamera] = useState(false)
    const [type, setType] = useState(CameraType.back)
    const [imageScale, setImageScale] = useState([{scaleX: 1}])
    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off)
    const [imagePreview, setImagePreview] = useState(null)

    const cameraRef = useRef(null)

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync()
            setAllowedCamera(status === 'granted')
        })()
    }, [])

    const changeCameraType = () => {
        if (type === CameraType.back) {
            setType(CameraType.front)
            setImageScale([{ scaleX: -1}])
        } else {
            setType(CameraType.back)
            setImageScale([{ scaleX: 1}])
        }
    }

    const changeFlashMode = () => {
        console.log(flashMode)
        if (flashMode === Camera.Constants.FlashMode.off) {
            setFlashMode(Camera.Constants.FlashMode.on)
        } else {
            setFlashMode(Camera.Constants.FlashMode.off)
        }
    }

    
    const takePicture = async () => {
        if (!cameraRef) return

        try {
            const pic = await cameraRef.current.takePictureAsync();
            console.log(pic)
            setImagePreview(pic.uri)
        } catch (error) {
            console.log("Error taking pic :(", error)
        }
    }

    const closePicture = async () => {
        setImagePreview(null)
    }

    // camera access logic
    if(allowedCamera === null) {
        return <View/>
    }
    if(allowedCamera === false) {
        return <Text style={styles.notAllowed}> No Camera Access :( </Text>
    }

    if (imagePreview){
        return(
            <View>
                <Image source={{uri: imagePreview}} style={{height:"100%", width:"100%", transform: imageScale}}/>
                
                <View style={styles.actionBottom}>
                    <AppIcon MaterialName="save-alt" size={25} color="#eee" />
                    
                    <AppIcon IonName="send-outline" size={25} color="#0e153a" style={styles.sendBtn}/>
                </View>

                <View style={styles.closeBtn}>
                    <AppIcon AntName="close" size={30} color="#eee" onPress={closePicture}/>
                </View>
            </View>
        )
    }
    
    // main camera screen
    return (
        <View style={{flex:1}}>
            <Camera style={{flex:1}} 
                    type={type}
                    flashMode={flashMode}
                    autoFocus={AutoFocus.on}
                    ref={cameraRef}>
                <TouchableOpacity style={styles.captureBtn} onPress={takePicture}></TouchableOpacity>

                <View style={styles.header}>
                    <AppIcon AntName="user" color="#eee" size={24}/>
                    <AppIcon AntName="setting" color="#eee" size={24} style={styles.sideIcons}/>
                </View>

                <View style={styles.sideItems}>
                    <AppIcon IonName="camera-outline" size={20} color="#eee" style={styles.sideIcons} onPress={changeCameraType}/>
                    <AppIcon IonName="flash-outline" size={20} color="#eee" style={styles.sideIcons} onPress={changeFlashMode}/>
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
        bottom: 30,
        width: 80,
        height: 80,
        borderRadius: 100,
        borderColor: "#e2f3f5",
        borderWidth: 6,
        alignSelf: "center"
    },
    actionBottom: {
        position: "absolute",
        bottom: 20,
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%"
    },
    sendBtn: {
        backgroundColor: "yellow"
    },
    closeBtn: {
        position: "absolute",
        top: 40,
        padding: 10
    }
})

export default CameraScreen