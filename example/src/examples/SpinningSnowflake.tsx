import { useEffect } from 'react';

import { StyleSheet, View } from 'react-native';

import { Grid, EntityManager } from 'react-native-ascii';

import { Snowflake } from '@/src/entities/snowflake';



export default function SpinningSnowflake() {
    const entityManager = new EntityManager();


    useEffect(() => {
        const snowflake = new Snowflake('snowflake', 4, 1);
        entityManager.addEntity(snowflake);
    }, []);


    return (
        <View style={styles.container}>
            <View style={styles.gridWrapper}>
                <Grid
                    selectedFont='DejaVuSansMono'
                    entityManager={entityManager}
                    frameRate={30}
                    width={30}
                    height={15}
                    containerStyle={styles.gridContainer}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    gridWrapper: {
        width: '90%',
        aspectRatio: 1,
        borderRadius: 20,
        overflow: 'hidden'
    },
    gridContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center' 
    }
});