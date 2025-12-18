export type Font = {
    sources: any[];
    charAspectRatio?: number;
    lineHeightMultiplier?: number;
};

export type FontMap = Record<string, Font>;



export const DEFAULT_FONTS: FontMap = {
    CourierPrime: {
        sources: [require('./CourierPrime-Regular.ttf')],
        charAspectRatio: 0.6,
        lineHeightMultiplier: 1
    },
    DejaVuSansMono: {
        sources: [require('./DejaVuSansMono.ttf')],
        charAspectRatio: 0.55,
        lineHeightMultiplier: 1.1
    }
};



export const DEFAULT_FONT = 'CourierPrime';
export const DEFAULT_CHAR_ASPECT_RATIO = 0.6;
export const DEFAULT_LINE_HEIGHT_MULTIPLIER = 1.0;