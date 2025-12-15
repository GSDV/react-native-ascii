import { GameContext } from '@/src/context';

import { Frame } from '@/src/frames';



export type EntityConfig = {
    id: string;
    x: number;
    y: number;
    frame: Frame;
}

// Never instantiate this Entity class directly.
// It will always be implemented by another class, like character, which will have more info it it like frames, animations, etc.
// All entities are things that will be drawn on the grid (for now, all are "active"). So they all have an x and y.
export class Entity {
    id: string;
    active: boolean = true;
    x: number;
    y: number;
    frame: Frame;
    components: Record<string, Component>;

    constructor(config: EntityConfig) {
        this.id = config.id;
        this.x = config.x;
        this.y = config.y;
        this.frame = config.frame;
        this.components = {};
    }

    addComponent<T extends Component>(key: string, component: T): T {
        this.components[key] = component;
        component.entity = this;
        return component;
    }

    update(context: GameContext) {
        // If the entity itself is not active, ignore.
        if (!this.active) return;

        Object.values(this.components).forEach(comp => {
            if (comp.active) comp.update(context);
        });
    }

    width() {
        return this.frame[0].length;
    }

    height() {
        return this.frame.length;
    }
}





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