import React, { useImperativeHandle, useState, useRef, useEffect } from 'react';
import { Image, 
         StyleSheet, 
         Text,
         View,
         TouchableOpacity, 
         Dimensions,
         Animated,
         SafeAreaView } from 'react-native';
import { Video } from 'expo-av';
import SlidingUpPanel from 'rn-sliding-up-panel';
import InViewPort from '@coffeebeanslabs/react-native-inviewport';
import AppIcon from '../components/AppIcon';
import Indicator from './Indicator';

// height is 896
const {height, width}= Dimensions.get('window')

const background = [{"key": require('../../assets/images/man.jpg')},
                    {"key": require('../../assets/images/woman.jpg')},
                    {"key": require('../../assets/images/woman2.jpg')}]

const MediaPanel = React.forwardRef((props, ref) => {
    const scrollX = useRef(new Animated.Value(0)).current
    const [isDrag, setIsDrag] = useState(true)

    let panel = useRef()
    let video = useRef()

    // TODO: implement some sort of post-rendering update on indicatorWidth and translateX
    const Indicator = ({measures, scrollX}) => {
        const inputRange = Object.entries(props).map((_, i) => i * width)
    
        var indicatorWidth = scrollX.interpolate({
            inputRange,
            outputRange: [63, 63, 64] //Hardcoded, should be: measures.map((measure) => measure.width)
        })
        var translateX =  scrollX.interpolate({
            inputRange,
            outputRange: [56.5, 176, 294.5] //Hardcoded, should be: measures.map((measure) => measure.x)
        })
        
        return <Animated.View style={{
                    height: 4,
                    width: indicatorWidth,
                    left: 0,
                    bottom: 0,
                    backgroundColor: "black",
                    borderRadius:15,
                    transform: [{
                        translateX
                    }]
                }}/>
    }

    const Tab = React.forwardRef(({item}, ref) => {
        return (
            <View ref={ref}>
                <Text style={{
                        fontSize: 45/Object.keys(props).length,
                        fontWeight:"500",
                        textTransform:"uppercase"
                       }}>
                    {item.title}
                    </Text>
            </View>
        )
    })

    const Tabs = ({data, scrollX}) => {
        const [measures, setMeasures] = useState([])
        const containerRef = useRef()

        useEffect(() => {
            let mounted = true

            // TODO: idk how, but it won't update the damn state to have 3 measuremnents
            data.forEach((item) => {
                item.ref.current.measureLayout(
                    containerRef.current, 
                    (x, y, width, height) => {
                        if (mounted)
                        setMeasures([...measures,{x, y, width, height}]) // update measurements
                    }
                )
                })
            return () => {mounted = false}
        }, [containerRef.current])


        console.log(measures)
        return (
            <View>
                <View style={{flexDirection: "row", justifyContent:"space-evenly"}}
                      ref={containerRef}>
                    {data.map((item) => {
                        return <Tab key={item.key + item.title} item={item} ref={item.ref}/>
                    })}
                </View>

                {measures.length > 0  && <Indicator measures={measures} scrollX={scrollX}/>}
            </View>
        )
    }

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
    }
    

    const renderImages = ({item}) => {
        return typeof(item.key) !== "number" ? 
                                     <Image source={{uri: item.key}} style={styles.image}/> :
                                     <Image source={item.key} style={styles.image} /> // only for numbered keys (i.e from required(_) source)
    }

    const renderVideos = ({item}) => {
        return (
            <TouchableOpacity style={styles.image}>
                <InViewPort onChange={isVisible => checkVisibile(isVisible)} style={{flex:1}}>
                    <Video style={{flex:1}}
                        ref= {video}
                        source={{uri: item.key}} 
                        paused={setPaused}
                        useNativeControls={false}
                        isLooping
                        isMuted
                        resizeMode='cover'/> 
                </InViewPort>
            </TouchableOpacity>
        )
    }

    useImperativeHandle(ref, () => ({
        show: () => { panel.show() }
    }))

    // console.log(Object.values(props), Object.keys(props).length)

    return (
            <SlidingUpPanel ref={c => (panel = c)}
                            draggableRange={{top: height, bottom:0}}
                            snappingPoints={[0, height]}
                            friction={0.6}
                            style={styles.container}
                            allowDragging={false}
                            >

                <SafeAreaView style={styles.panel}>
                    
                    {/* Header */}
                    <View style={styles.header}>
                        <AppIcon AntName="down" size={25} style={{backgroundColor:"white"}} onPress={() => panel.hide()}/>
                        <Text style={styles.title} allowFontScaling>Captures</Text>
                        <AppIcon MaterialName="touch-app" size={25} style={{backgroundColor:"white"}}/>
                    </View>

                    {/* Tabs */}
                    <Tabs scrollX={scrollX} data={Object.values(props)}/>

                    <Animated.FlatList 
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        bounces={false}
                        onScroll={Animated.event(
                            [{nativeEvent: {contentOffset: {x : scrollX}}}],
                            {useNativeDriver: false}
                        )}
                        data ={Object.values(props)}
                        keyExtractor={item => { return item.key}}
                        renderItem={({item}) => {
                            if (item.title === 'Images'){
                                return <Image source={background[0].key} style={{
                                    flex:1,
                                    top: 10, 
                                    height: height*0.8, 
                                    width: width*0.975, 
                                    borderRadius: 15, 
                                    margin: 5}} />
                            }

                            if (item.title === 'Videos'){
                                return <Image source={background[1].key} style={{
                                    flex:1,
                                    top: 10, 
                                    height: height*0.8, 
                                    width: width*0.975, 
                                    borderRadius: 15, 
                                    margin: 5}} />
                            }

                            if (item.title === 'Lapses'){
                                return <Image source={background[2].key} style={{
                                    flex:1,
                                    top: 10, 
                                    height: height*0.8, 
                                    width: width*0.975, 
                                    borderRadius: 15, 
                                    margin: 5}} />
                            }
                            // if (images){
                            //     <FlatList data={props.images}
                            //         numColumns={2}
                            //         renderItem={renderImages}
                            //         contentContainerStyle={styles.imageContainer}
                            //         onScrollBeginDrag={() => {setIsDrag(false)}}
                            //         onScrollEndDrag={() => {setIsDrag(true)}}
                            //     />
                            // }

                        }}
                    />

                    {/* TODO: extract Flatlist to a separate component where it's reusable to host image/videos/timelapses separately. */}
                    {/* <FlatList data={props.images}
                              numColumns={2}
                              renderItem={renderImages}
                              contentContainerStyle={styles.imageContainer}
                              onScrollBeginDrag={() => {setIsDrag(false)}}
                              onScrollEndDrag={() => {setIsDrag(true)}}
                              /> */}


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
        marginVertical:20, 
    },
    image:{
        flex:1,
        height: height*0.38, 
        width: width*0.475, 
        borderRadius: 15, 
        margin: 5,
    },
    video:{
        height: height*0.38, 
        width: width*0.475, 
        borderRadius: 15, 
        margin: 5,
        overflow:"hidden"
    }
})

export default MediaPanel