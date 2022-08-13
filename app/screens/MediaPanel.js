import { useEffect, useState, useRef } from 'react';
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

const IMGS = [ {key: require('../../assets/man.jpg')}, 
               {key: require('../../assets/man2.jpg')}, 
               {key: require('../../assets/woman.jpg')}, 
               {key: require('../../assets/woman2.jpg')}]

// TODO: pass in saved media like photo, video, timelapses, instead of
// raw examples
const MediaPanel = () => {

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

    const renderImages = ({item}) => {
        return <Image source={item.key} style={{height:height*0.4, width:width*0.44, borderRadius:15, margin:10}} />
    }

    return (
        <View style={styles.container}>
            <Button title='Show panel' onPress={() => panel.show()} />

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

        </View>
    )
}

export default MediaPanel