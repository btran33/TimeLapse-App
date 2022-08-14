import React, { useImperativeHandle, useState, useRef } from 'react';
import { Text, 
         Image, 
         View, 
         Button,
         TouchableOpacity, 
         Dimensions, 
         SafeAreaView } from 'react-native';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { FlatList } from 'react-native-gesture-handler';
import AppIcon from "../components/AppIcon"

const IMGS = [ 
    {"key": require("../../assets/images/man.jpg")}, 
    {"key": require('../../assets/images/man2.jpg')}, 
    {"key": require('../../assets/images/woman.jpg')}, 
    {"key": require('../../assets/images/woman2.jpg')}]

// import IMGS from '../../assets/images/images.json'

// TODO: pass in saved media like photo, video, timelapses
const MediaPanel = React.forwardRef((props, ref) => {

    // height is 896
    const {height, width} = Dimensions.get('window')
    let panel = useRef()

    const styles = {
        container: {
            flex: 1,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center'
        },
        panel: {
            flex: 1,
            backgroundColor: "yellow",
            alignItems: 'center'
        },
        imageContainer: {
            flex: 1,
            marginVertical:20, 
        }
    }

    // console.log(IMGS)

    const renderImages = ({item}) => {
        console.log(item, typeof(item), item.key, typeof(item.key))
        return <Image source={item.key} style={{height:height*0.4, width:width*0.44, borderRadius:15, margin:10}} />
    }

    useImperativeHandle(ref, () => ({
        show: () => { panel.show() }
    }))

    return (
            <SlidingUpPanel ref={c => (panel = c)}
                            draggableRange={{top: height, bottom:0}}
                            snappingPoints={[0, height]}
                            friction={0.6}>

                <SafeAreaView style={styles.panel}>
                    <Button title='Hide' onPress={() => panel.hide()} />
                    
                    <FlatList data={IMGS}
                              numColumns={2}
                              renderItem={renderImages}
                              contentContainerStyle={styles.imageContainer}/>
                </SafeAreaView>
            </SlidingUpPanel>
    )
})

export default MediaPanel