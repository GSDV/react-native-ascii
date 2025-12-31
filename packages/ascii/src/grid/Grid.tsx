import {
    useEffect,
    useRef,
    useState,
    useCallback,
    useMemo
} from 'react';

import { StyleProp, View, ViewStyle } from 'react-native';

import {
    Canvas,
    Paragraph,
    Skia,
    useFonts,
    SkTextStyle
} from '@shopify/react-native-skia';

import { GameContext } from '@/src/context';
import { EntityManager } from '@/src/entity';
import { Frame } from '@/src/frames';
import {
    FontMap,
    DEFAULT_FONTS,
    DEFAULT_FONT,
    DEFAULT_CHAR_ASPECT_RATIO,
    DEFAULT_LINE_HEIGHT_MULTIPLIER
} from '@/src/assets/fonts';



const padding = 10;

interface GridDimensions {
    fontSize: number;
    cellWidth: number;
    cellHeight: number;
    canvasWidth: number;
    canvasHeight: number;
}



export interface GridProps {
    entityManager: EntityManager;
    frameRate: number;
    width: number;   // grid columns
    height: number;  // grid rows

    style?: StyleProp<ViewStyle>;

    fonts?: FontMap;
    selectedFont?: string;
}

export function Grid({
    entityManager,
    frameRate,
    width: gridColumns,
    height: gridRows,
    style,
    fonts,
    selectedFont = DEFAULT_FONT
}: GridProps) {
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const entityManagerRef = useRef<EntityManager>(entityManager);
    const [, forceUpdate] = useState({});

    const mergedFonts: FontMap = useMemo(() => ({
        ...DEFAULT_FONTS,
        ...(fonts ?? {}),
    }), [fonts]);

    const fontSources = useMemo(() => 
        Object.fromEntries(
            Object.entries(mergedFonts).map(([name, font]) => [name, font.sources])
        ),
        [mergedFonts]
    );

    const fontMgr = useFonts(fontSources);
    const charAspectRatio = mergedFonts[selectedFont]?.charAspectRatio ?? DEFAULT_CHAR_ASPECT_RATIO;
    const lineHeightMultiplier = mergedFonts[selectedFont]?.lineHeightMultiplier ?? DEFAULT_LINE_HEIGHT_MULTIPLIER;


    const handleLayout = useCallback((event: any) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerSize({ width, height });
    }, []);


    const dimensions = useMemo((): GridDimensions | null => {
        if (!containerSize || containerSize.width === 0 || containerSize.height === 0) return null;

        const availableWidth = containerSize.width - padding * 2;
        const availableHeight = containerSize.height - padding * 2;

        const fontSizeForWidth = availableWidth / (gridColumns * charAspectRatio);
        const fontSizeForHeight = availableHeight / (gridRows * lineHeightMultiplier);
        const calculatedFontSize = Math.min(fontSizeForWidth, fontSizeForHeight);

        const cellWidth = calculatedFontSize * charAspectRatio;
        const cellHeight = calculatedFontSize * lineHeightMultiplier;

        return {
            fontSize: calculatedFontSize,
            cellWidth,
            cellHeight,
            canvasWidth: cellWidth * gridColumns + padding * 2,
            canvasHeight: cellHeight * gridRows + padding * 2,
        };
    }, [containerSize, gridColumns, gridRows, charAspectRatio, lineHeightMultiplier]);


    const buildGrid = useCallback((): Frame => {
        const grid: Frame = {
            pixels: Array.from({ length: gridRows }, () => (
                Array.from({ length: gridColumns }, () => ({ 
                    char: ' ',
                    fgC: 'white',
                    bgC: 'transparent'
                }))
            ))
        };

        entityManagerRef.current?.entities.forEach(entity => {
            if (!entity.active) return;

            const { x, y, frame } = entity;
            const width = entity.width();
            const height = entity.height();

            for (let dy = 0; dy < height; dy++) {
                for (let dx = 0; dx < width; dx++) {
                    const gridY = y + dy;
                    const gridX = x + dx;

                    if (gridY >= 0 && gridY < gridRows && gridX >= 0 && gridX < gridColumns) {
                        const pixel = frame.pixels[dy]?.[dx];
                        if (pixel && pixel.char !== ' ') {
                            grid.pixels[gridY][gridX] = pixel;
                        }
                    }
                }
            }
        });

        return grid;
    }, [gridColumns, gridRows]);


    const paragraph = (() => {
        if (!fontMgr || !dimensions) return null;

        const grid = buildGrid();
        const builder = Skia.ParagraphBuilder.Make({}, fontMgr);
        const { fontSize } = dimensions;

        const addStyledText = ({ text, fgColor, bgColor }: { text: string, fgColor: string, bgColor?: string }) => {
            const style: SkTextStyle = {
                color: Skia.Color(fgColor),
                fontFamilies: [selectedFont],
                fontSize,
                heightMultiplier: lineHeightMultiplier
            };
            
            if (bgColor && bgColor !== 'transparent') style.backgroundColor = Skia.Color(bgColor);
            
            builder.pushStyle(style);
            builder.addText(text);
            builder.pop();
        };

        for (let row = 0; row < gridRows; row++) {
            let currentFgColor = grid.pixels[row][0]?.fgC || 'white';
            let currentBgColor = grid.pixels[row][0]?.bgC || 'transparent';
            let textBuffer = '';

            for (let col = 0; col < gridColumns; col++) {
                const cell = grid.pixels[row][col];

                if ((cell.fgC !== currentFgColor || cell.bgC !== currentBgColor) && textBuffer.length > 0) {
                    addStyledText({
                        text: textBuffer,
                        fgColor: currentFgColor,
                        bgColor: currentBgColor
                    });
                    textBuffer = '';
                    currentFgColor = cell.fgC;
                    currentBgColor = cell.bgC;
                }

                textBuffer += cell.char;
            }

            if (textBuffer.length > 0) {
                addStyledText({
                    text: textBuffer,
                    fgColor: currentFgColor,
                    bgColor: currentBgColor
                });
            }

            if (row < gridRows - 1) {
                addStyledText({
                    text: '\n',
                    fgColor: 'white'
                });
            }
        }

        const para = builder.build();
        para.layout(dimensions.canvasWidth);
        return para;
    })();


    useEffect(() => {
        entityManagerRef.current = entityManager;
    }, [entityManager]);

    useEffect(() => {
        const renderLoop = setInterval(() => {
            const context: GameContext = { deltaTime: 1000 / frameRate };
            entityManagerRef.current?.updateAll(context);
            forceUpdate({});
        }, 1000 / frameRate);
        return () => clearInterval(renderLoop);
    }, [frameRate]);


    if (!fontMgr) return null;

    return (
        <View style={style} onLayout={handleLayout}>
            {dimensions &&
                <Canvas
                    style={{ 
                        width: dimensions.canvasWidth,
                        height: dimensions.canvasHeight,
                        backgroundColor: '#333' 
                    }}
                >
                    {paragraph && dimensions && (
                        <Paragraph
                            paragraph={paragraph}
                            x={padding}
                            y={padding}
                            width={dimensions.canvasWidth}
                        />
                    )}
                </Canvas>
            }
        </View>
    );
}