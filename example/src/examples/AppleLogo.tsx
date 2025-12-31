import { useEffect, useRef } from 'react';

import { StyleSheet, View, StatusBar } from 'react-native';

import { Grid, EntityManager } from 'react-native-ascii';

import { Apple } from '@/src/entities/apple';
import { Loading } from '@/src/entities/loading';



export default function AppleLogo() {
    const entityManagerRef = useRef(new EntityManager());
    const entityManager = entityManagerRef.current;

    const appleRef = useRef(new Apple('apple', 4, 0));
    const apple = appleRef.current;

    const loadingRef = useRef(new Loading('loading', 15, 30));
    const loading = loadingRef.current;


    useEffect(() => {
        const targetY = 10;
        const stiffness = 0.10;
        const damping = 0.82;
        let velocity = 0;
        let physicsY = 0;
        let animationFrame: number;

        const animateSpring = async () => {
            const distance = targetY - physicsY;

            velocity += distance * stiffness;
            velocity *= damping;
            physicsY += velocity;
            apple.y = Math.max(0, Math.round(physicsY));

            if (Math.abs(velocity) < 0.1 && Math.abs(targetY - physicsY) < 0.5) {
                apple.y = targetY;
                await (new Promise(resolve => setTimeout(resolve, 500)));
                entityManager.addEntity(loading);
                return;
            }

            animationFrame = requestAnimationFrame(animateSpring);
        };

        const startTimeout = setTimeout(() => {
            entityManager.addEntity(apple);
            animateSpring();
        }, 5000);

        return () => {
            clearTimeout(startTimeout);
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, []);


    return (
        <>
        <StatusBar hidden />
        <View style={styles.container}>
            <View style={styles.gridWrapper}>
                <Grid
                    selectedFont='DejaVuSansMono'
                    entityManager={entityManager}
                    frameRate={30}
                    width={40}
                    height={45}
                    containerStyle={styles.gridContainer}
                    canvasStyle={{ backgroundColor: '#fff' }}
                />
            </View>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333',
    },
    gridWrapper: {
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