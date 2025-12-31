import { Frame } from 'react-native-ascii';

import snowflakeData from './snowflake.json'



export const ORIGINAL_FRAMES: Frame[] = snowflakeData.frames.map(frame => ({ pixels: frame.cells }));

export const FRAMES_SNOW: Frame[] = [
    ...ORIGINAL_FRAMES,
    ORIGINAL_FRAMES[2],
    ORIGINAL_FRAMES[1]
];