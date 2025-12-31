import { Entity, AnimationComponent } from 'react-native-ascii';

import { FRAMES_SNOW } from './frames';



export class Snowflake extends Entity {
    constructor(id: string, x: number, y: number) {
        super({
            id,
            x,
            y,
            frame: FRAMES_SNOW[0]
        });

        const animationComponent = new AnimationComponent(
            this,
            {
                frames: FRAMES_SNOW,
                loop: true,
                speed: 3
            }
        );

        this.addComponent('animation', animationComponent)
    }
}