# React Native ASCII

A React Native library for rendering ASCII/ANSI animations using an entity-component system. Built on React Native Skia and Reanimated.

```text
  _____                 _     _   _       _   _                       _____  _____ _____ _____ 
 |  __ \               | |   | \ | |     | | (_)               /\    / ____|/ ____|_   _|_   _|
 | |__) |___  __ _  ___| |_  |  \| | __ _| |_ ___   _____     /  \  | (___ | |      | |   | |  
 |  _  // _ \/ _` |/ __| __| | . ` |/ _` | __| \ \ / / _ \   / /\ \  \___ \| |      | |   | |  
 | | \ \  __/ (_| | (__| |_  | |\  | (_| | |_| |\ V /  __/  / ____ \ ____) | |____ _| |_ _| |_ 
 |_|  \_\___|\__,_|\___|\__| |_| \_|\__,_|\__|_| \_/ \___| /_/    \_\_____/ \_____|_____|_____|
```

<p>
  <img src="https://raw.githubusercontent.com/GSDV/react-native-ascii/main/packages/ascii/assets/demo-apple.gif" height="400" />
  <img src="https://raw.githubusercontent.com/GSDV/react-native-ascii/main/packages/ascii/assets/demo-game.gif" height="400" />
</p>



[![npm version](https://badge.fury.io/js/react-native-ascii.svg)](https://badge.fury.io/js/react-native-ascii)
[![license](https://img.shields.io/npm/l/react-native-ascii.svg)](https://github.com/GSDV/solomo/blob/main/LICENSE)




## Installation

```bash
npm install react-native-ascii
```

**Peer dependencies:**
- `@shopify/react-native-skia` >= 2.4.7
- `react-native-reanimated` >= 4.0.0

## Quick Start

```tsx
import { Grid, EntityManager, Entity, Frame, AnimationComponent } from 'react-native-ascii';

// 1. Create an entity manager
const entityManager = new EntityManager();

// 2. Define a frame (2D grid of pixels)
const frame: Frame = {
  pixels: [
    [
      { char: '*', fgC: 'yellow', bgC: 'transparent' },
      { char: '*', fgC: 'yellow', bgC: 'transparent' },
    ],
  ],
};

// 3. Create an entity
const star = new Entity({ id: 'star', x: 10, y: 5, frame });
entityManager.addEntity(star);

// 4. Render the grid
<Grid
  entityManager={entityManager}
  frameRate={30}
  width={40}
  height={30}
/>
```

## Animated Entities

Create animated entities with the `AnimationComponent`:

```tsx
class AnimatedSprite extends Entity {
  constructor(id: string, x: number, y: number, frames: Frame[]) {
    super({ id, x, y, frame: frames[0] });

    const animation = new AnimationComponent(this, {
      frames,
      loop: true,
      speed: 3, // Higher = slower
    });
    this.addComponent('animation', animation);
  }
}

const sprite = new AnimatedSprite('player', 5, 5, myFrames);
entityManager.addEntity(sprite);
```

## Grid Props

| Prop | Type | Description |
|------|------|-------------|
| `entityManager` | `EntityManager` | Manages all entities to render |
| `frameRate` | `number` | Target FPS (e.g., 30) |
| `width` | `number` | Grid columns |
| `height` | `number` | Grid rows |
| `fonts` | `FontMap` | Custom fonts map (optional) |
| `selectedFont` | `string` | Font to use (`'CourierPrime'`, `'DejaVuSansMono'`, or one from `fonts`) |
| `containerStyle` | `ViewStyle` | Style for container |
| `canvasStyle` | `ViewStyle` | Style for canvas |

## Pixel Format

Each pixel in a frame has:

```ts
type Pixel = {
  char: string;  // Character to display
  fgC: string;   // Foreground color (CSS color or hex)
  bgC: string;   // Background color (or 'transparent')
};
```

## Entity-Component System

Entities can have custom components for game logic:

```tsx
class MyComponent extends Component {
  update(context: GameContext) {
    // Access this.entity to modify position, frame, etc.
    this.entity.x += 1;
  }
}

const entity = new Entity({ id: 'test', x: 0, y: 0, frame });
entity.addComponent('movement', new MyComponent(entity));
```

The `GameContext` provides `deltaTime` for frame-independent movement.

## License

MIT © [Gabriele Scotto di Vettimo](https://github.com/GSDV)

## Contributing

Issues and pull requests are welcome! Check out the [GitHub repository](https://github.com/GSDV/react-native-ascii).