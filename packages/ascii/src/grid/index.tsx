import { useEffect, useRef, useState } from 'react';

import { StyleSheet, View } from 'react-native';

import { Canvas, Paragraph, Skia, useFonts } from '@shopify/react-native-skia';

import { GameContext } from '@/src/context';
import { EntityManager } from '@/src/entity';
import { Frame } from '@/src/frames';

import { DEFAULT_FONTS, DEFAULT_FONT } from '@/src/assets/fonts';



export interface GridProps {
    entityManager: EntityManager;
    frameRate: number;

    width: number;
    height: number;

    heightMultiplier?: number;

    fonts?: Record<string, any>;
    selectedFont?: string;
}

export function Grid({
    entityManager,
    frameRate,
    width: gridWeight,
    height: gridHeight,
    heightMultiplier = 1,
    fonts,
    selectedFont = DEFAULT_FONT
}: GridProps) {
    const entityManagerRef = useRef<EntityManager>(entityManager);
    const [, forceUpdate] = useState({});
    const [fontSize, setFontSize] = useState(10);
    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 470 });

    const mergedFonts = {
        ...DEFAULT_FONTS,
        ...(fonts ?? {}),
    };
    const fontMgr = useFonts(mergedFonts);

    const charHeight = fontSize;

    const handleLayout = (event: any) => {
        const { width, height } = event.nativeEvent.layout;
        const availableWidth = width - 20;
        const calculatedSize = (availableWidth / gridWeight) / 0.6;
        const clampedSize = Math.max(4, Math.min(16, calculatedSize));
        
        setFontSize(clampedSize);
        setCanvasSize({ width, height: height - 20 });
    };

    // Build a 2D grid representation.
    const buildGrid = (): Frame => {
        // Initialize empty grid.
        const grid: Frame = Array.from({ length: gridHeight }, () =>
            Array.from({ length: gridWeight }, () => ({ char: ' ', fgC: 'white', bgC: 'transparent' }))
        );

        // Populate grid with entity characters.
        entityManagerRef.current?.entities.forEach(entity => {
            if (!entity.active) return;

            const { x, y, frame } = entity;
            const width = entity.width();
            const height = entity.height();

            for (let dy = 0; dy < height; dy++) {
                for (let dx = 0; dx < width; dx++) {
                    const gridY = y + dy;
                    const gridX = x + dx;

                    // Bounds check
                    if (gridY >= 0 && gridY < gridHeight && 
                        gridX >= 0 && gridX < gridWeight) {
                        const pixel = frame[dy]?.[dx];

                        if (pixel && pixel.char !== ' ') {
                            grid[gridY][gridX] = pixel;
                        }
                    }
                }
            }
        });

        return grid;
    };

    // Build paragraph from grid using Paragraph API.
    const paragraph = (() => {
        if (!fontMgr) return null;

        const grid = buildGrid();
        const builder = Skia.ParagraphBuilder.Make({}, fontMgr);

        // Build the text line by line with color styling
        for (let row = 0; row < gridHeight; row++) {
            let currentColor = grid[row][0]?.fgC || 'white';
            let textBuffer = '';

            for (let col = 0; col < gridWeight; col++) {
                const cell = grid[row][col];
                
                // If color changes, push the buffered text with the previous color
                if (cell.fgC !== currentColor && textBuffer.length > 0) {
                    builder.pushStyle({
                        color: Skia.Color(currentColor),
                        fontFamilies: [selectedFont],
                        fontSize: fontSize,
                        heightMultiplier
                    });
                    builder.addText(textBuffer);
                    builder.pop();
                    
                    textBuffer = '';
                    currentColor = cell.fgC;
                }
                
                textBuffer += cell.char;
            }

            // Add remaining buffered text for this row.
            if (textBuffer.length > 0) {
                builder.pushStyle({
                    color: Skia.Color(currentColor),
                    fontFamilies: [selectedFont],
                    fontSize: fontSize,
                    heightMultiplier
                });
                builder.addText(textBuffer);
                builder.pop();
            }

            // Add newline except for last row.
            if (row < gridHeight - 1) {
                builder.pushStyle({
                    color: Skia.Color('white'),
                    fontFamilies: [selectedFont],
                    fontSize: fontSize,
                    heightMultiplier
                });
                builder.addText('\n');
                builder.pop();
            }
        }

        const para = builder.build();
        para.layout(canvasSize.width);
        return para;
    })();




    // If a new entityManager ref is passed (should not happen).
    useEffect(() => {
        entityManagerRef.current = entityManager;
    }, [entityManager]);


    // Game Loop.
    useEffect(() => {
        const gameLoop = setInterval(() => {
            const context: GameContext = { deltaTime: 1000 / frameRate };
            entityManagerRef.current?.updateAll(context);
            forceUpdate({});
        }, 1000 / frameRate);

        return () => clearInterval(gameLoop);
    }, []);



    if (!fontMgr || !paragraph) {
        return null;
    }

    return (
        <View style={styles.gridContainer} onLayout={handleLayout}>
            <Canvas style={[styles.canvas, canvasSize]}>
                <Paragraph 
                    paragraph={paragraph} 
                    x={0} 
                    y={charHeight} 
                    width={canvasSize.width} 
                />
            </Canvas>
        </View>
    );
};



const styles = StyleSheet.create({
    gridContainer: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'center',
        width: '100%',
        flex: 1,
    },
    canvas: {
        backgroundColor: '#000',
    }
});