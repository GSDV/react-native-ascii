import { GameContext, Entity } from '@/src';



export type ComponentConfig = {
    id: string;
    entity: Entity;
    active: boolean;
}

export abstract class Component {
    id: string;
    entity: Entity;
    active: boolean;

    constructor(config: ComponentConfig) {
        this.id = config.id;
        this.entity = config.entity;
        this.active = config.active;
    }

    abstract update(context: GameContext): void;
}