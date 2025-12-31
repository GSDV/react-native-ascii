import { Frame } from 'react-native-ascii';

import colorData from './loading.json';



export const FRAMES_COLOR: Frame[] = colorData.frames.map(frame => ({ pixels: frame.cells }));