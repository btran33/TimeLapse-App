import { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { AutoFocus, Camera, CameraType } from 'expo-camera';
import { Video } from 'expo-av';
import AppIcon from "../components/AppIcon"

const CameraScreen = () => {
    const [hasCameraPermission, setHasCameraPermission] = useState()
    const [hasMicrophonePermission, setHasMicrophonePermission] = useState()
    const [cameraType, setCameraType] = useState(CameraType.back)
    const [imageScale, setImageScale] = useState([{scaleX: 1}])

    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off)
    const [isRecording, setIsRecording] = useState(false)

    const [imagePreview, setImagePreview] = useState()
    const [videoPreview, setVideoPreview] = useState()
    
    let cameraRef = useRef()
    let videoRef = useRef()

    useEffect(() => {
        (async () => {
            const cameraPermission = await Camera.requestCameraPermissionsAsync();
            const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
            setHasCameraPermission(cameraPermission.status === "granted");
            setHasMicrophonePermission(microphonePermission.status === "granted");
        })();
    }, []);

    if (hasCameraPermission === undefined || hasMicrophonePermission === undefined) {
        return <Text>Requestion permissions...</Text>
    } else if (!hasCameraPermission) {
        return <Text>Permission for camera not granted.</Text>
    }
    let changeCameraType = () => {
        if (cameraType === CameraType.back) {
            setCameraType(CameraType.front)
            setImageScale([{ scaleX: -1}])
        } else {
            setCameraType(CameraType.back)
            setImageScale([{ scaleX: 1}])
        }
    }

    let changeFlashMode = () => {
        console.log(flashMode)
        if (flashMode === Camera.Constants.FlashMode.off) {
            setFlashMode(Camera.Constants.FlashMode.on)
        } else {
            setFlashMode(Camera.Constants.FlashMode.off)
        }
    }

    let takePicture = async () => {
        if (!cameraRef) return

        try {
            cameraRef.current.takePictureAsync().then((pic) => {
                console.log(pic)
                setImagePreview(pic.uri)
            })
        } catch (error) {
            console.log("Error taking pic: ", error)
        }
    }

    let takeVideo = () => {
        setIsRecording(true);

        cameraRef.current.recordAsync({mirror:cameraType===CameraType.front}).then((recordedVideo) => {
            setVideoPreview(recordedVideo);
        });
    };
    
    let stopVideo = () => {
        setIsRecording(false);
        cameraRef.current.stopRecording();
    };

    let closePreview = async () => {
        setImagePreview(undefined)
        setVideoPreview(undefined)
    }
    // image preview screen
    if (imagePreview){
        console.log("image preview!\n")
        return (
            <View>
                <Image source={{uri: imagePreview}} style={{height:"100%", width:"100%", transform: imageScale}}/>
                
                <View style={styles.actionBottom}>
                    <AppIcon MaterialName="save-alt" size={25} color="#eee" />
                    
                    <AppIcon IonName="send-outline" size={25} color="#0e153a" style={styles.sendBtn}/>
                </View>

                <View style={styles.closeBtn}>
                    <AppIcon AntName="close" size={30} color="#eee" onPress={closePreview}/>
                </View>
            </View>
        )
    }

    // video preview screen
    if (videoPreview) {
        console.log("video preview!\n")
        // let shareVideo = () => {
        //     shareAsync(video.uri).then(() => {
        //     setVideo(undefined);
        //     });
        // };

        // let saveVideo = () => {
        //   MediaLibrary.saveToLibraryAsync(video.uri).then(() => {
        //     setVideo(undefined);
        //   });
        // };

        return (
            <View style={{flex:1}}>
                <Video
                    ref={videoRef}
                    style={styles.video}
                    source={{uri: videoPreview.uri}}
                    useNativeControls={false}
                    isLooping
                    shouldPlay
                />

                <View style={styles.closeBtn}>
                        <AppIcon AntName="close" size={30} color="#eee" onPress={closePreview}/>
                </View>
            </View>
        );
    }

    // main camera screen
    return (
        <Camera style={{flex:1}} 
                type={cameraType}
                flashMode={flashMode}
                autoFocus={AutoFocus.on}
                ref={cameraRef}>
            < TouchableOpacity style={styles.captureBtn} onPress={takePicture} onLongPress={takeVideo} onPressOut={stopVideo}/>

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
    },
    video: {
        flex: 1,
        alignSelf: "stretch"
    }
})

export default CameraScreen