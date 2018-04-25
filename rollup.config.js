import uglify from 'rollup-plugin-uglify'

export default {
    input: './src/index.js',
    output: {
        file: './dist/CMap.min.js',
        format: 'es'
    },
    sourceMap: true,
    plugins: [
        uglify()
    ]
}