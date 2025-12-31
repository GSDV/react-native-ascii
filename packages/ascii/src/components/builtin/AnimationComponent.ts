import {
    GameContext,
    Entity,
    Frame,
    Component
} from '@/src';



export type AnimationConfig = {
    frames: Frame[];
    loop: boolean;
    speed: number;
};

export class AnimationComponent extends Component {
    animation: AnimationConfig;
    currentFrameIndex: number = 0;
    frameCounter: number = 0;

    constructor(entity: Entity, animation: AnimationConfig) {
        super({
            id: 'animation',
            entity,
            active: true
        });
        this.animation = animation;
    }

    play() {
        this.currentFrameIndex = 0;
        this.frameCounter = 0;
        this.active = true;
    }

    update(context: GameContext): void {
        const anim = this.animation;
        const speed = anim.speed;

        this.frameCounter++;
        if (this.frameCounter >= speed) {
            this.frameCounter = 0;
            this.currentFrameIndex++;

            if (this.currentFrameIndex >= anim.frames.length) {
                this.currentFrameIndex = 0;
                if (!anim.loop) this.active = false;
            }
        }

        this.entity.frame = this.animation.frames[this.currentFrameIndex];
    }
}