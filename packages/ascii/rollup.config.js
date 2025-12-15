import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';

import packageJson from './package.json' assert { type: 'json' };



export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: packageJson.main,
                format: 'cjs',
                exports: 'named',
                sourcemap: true
            },
            {
                file: packageJson.module,
                format: 'esm',
                sourcemap: true
            }
        ],
        plugins: [
            typescript({
                tsconfig: './tsconfig.json',
                declaration: true,
                declarationMap: true,
                declarationDir: 'lib'
            }),
            copy({
                targets: [
                    { 
                        src: 'src/assets/fonts/*.ttf',
                        dest: 'lib'
                    }
                ],
                flatten: true
            })
        ],
        external: [
            'react',
            'react-native',
            '@shopify/react-native-skia'
        ]
    }
];