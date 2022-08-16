import React, { useImperativeHandle, useState, useRef } from 'react';
import { Image, 
         StyleSheet, 
         Text,
         View,
         TouchableOpacity, 
         Dimensions, 
         SafeAreaView } from 'react-native';
import { Video } from 'expo-av';
import SlidingUpPanel from 'rn-sliding-up-panel';
import InViewPort from '@coffeebeanslabs/react-native-inviewport';
import { FlatList } from 'react-native-gesture-handler'
import AppIcon from '../components/AppIcon';

const {height, width}= Dimensions.get('window')

// TODO: pass in saved media like photo, video, timelapses
const MediaPanel = React.forwardRef((props, ref) => {
    

    // height is 896
    const [state, setState] = useState({})


    let panel = useRef()
    let video = useRef()

    let setPlay = async () => {
        if (video)
            video.current.playAsync()
    }

    let setPaused = async () => {
        if (video)
            video.current.pauseAsync()
    }

    let checkVisibile = (isVisible) => {
        isVisible? setPlay() : setPaused()
        setState({visible: isVisible})
    }
    

    const renderImages = ({item}) => {

        var fileName = typeof(item.key) !== "number" ? item.key.split('.').pop() : ""// jpg, mov, etc.

        return typeof(item.key) !== "number" ? 
                fileName === "mov" ? <TouchableOpacity style={styles.imageAndVideo}>
                                        <InViewPort onChange={isVisible => checkVisibile(isVisible)} style={{flex:1}}>
                                            <Video style={{flex:1}}
                                                ref= {video}
                                                source={{uri: item.key}} 
                                                paused={setPaused}
                                                useNativeControls={false}
                                                isLooping 
                                                resizeMode='cover'/> 
                                        </InViewPort>

                                     </TouchableOpacity>  :
                                     <Image source={{uri: item.key}} style={styles.imageAndVideo}/> :
                                     <Image source={item.key} style={styles.imageAndVideo} /> // only for numbered keys (i.e from required(_) source)
    }

    useImperativeHandle(ref, () => ({
        show: () => { panel.show() }
    }))

    return (
            <SlidingUpPanel ref={c => (panel = c)}
                            draggableRange={{top: height, bottom:0}}
                            snappingPoints={[0, height]}
                            friction={0.6}
                            style={styles.container}>

                <SafeAreaView style={styles.panel}>
                    
                    <View style={styles.header}>
                        <AppIcon AntName="down" size={25} style={{backgroundColor:"white"}} onPress={() => panel.hide()}/>

                        <Text style={styles.title} allowFontScaling>Captures</Text>

                        <AppIcon MaterialName="touch-app" size={25} style={{backgroundColor:"white"}}/>
                    </View>

                    {/* TODO: extract Flatlist to a separate component where it's reusable to host image/videos/timelapses separately. */}
                    <FlatList data={props.images}
                              numColumns={2}
                              renderItem={renderImages}
                              contentContainerStyle={styles.imageContainer}/>
                </SafeAreaView>
            </SlidingUpPanel>
    )
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    panel: {
        flex: 1,
        justifyContent:"center",
        backgroundColor: "white",
        borderRadius: 15
    },
    header:{
        justifyContent: "space-between",
        flexDirection: "row",
        width:"100%"
    },
    title :{
        alignSelf:"center",
        fontSize:20,
        fontFamily:"Damascus",
        fontWeight:"bold"
    },
    imageContainer: {
        flex: 1,
        marginVertical:20, 
    },
    imageAndVideo:{
        height: height*0.38, 
        width: width*0.45, 
        borderRadius: 15, 
        margin: 10,
        overflow:"hidden"
    }
})

export default MediaPanel