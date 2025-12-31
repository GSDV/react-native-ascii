import { GameContext, Entity } from '@/src';



export class EntityManager {
    entities: Map<string, Entity>;

    constructor() {
        this.entities = new Map();
    }

    addEntity(entity: Entity) {
        this.entities.set(entity.id, entity);
    }

    removeEntity(id: string) {
        this.entities.delete(id);
    }

    getEntity(id: string): Entity | undefined {
        return this.entities.get(id);
    }

    updateAll(context: GameContext) {
        this.entities.forEach(entity => entity.update(context));
    }
}