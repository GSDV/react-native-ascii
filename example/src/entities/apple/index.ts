import { Entity, AnimationComponent } from 'react-native-ascii';

import { FRAMES_COLOR } from './frames';



export class Apple extends Entity {
    constructor(id: string, x: number, y: number) {
        super({
            id,
            x,
            y,
            frame: FRAMES_COLOR[0]
        });

        const animationComponent = new AnimationComponent(
            this,
            {
                frames: FRAMES_COLOR,
                loop: true,
                speed: 3
            }
        );

        this.addComponent('animation', animationComponent)
    }
}