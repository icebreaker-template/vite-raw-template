import { defineConfig } from 'vite'
import path from 'node:path'
const r = r => {
    return path.relative(__dirname, r)
}
export default defineConfig(
    {
        build: {
            minify: false
        },
        plugins: [
            {
                name: 'test-plugin',
                apply: 'build',
                resolveId(source, importer, options) {
                    console.log('resolveId', source, importer)

                },
                async transform(code, id) {
                    console.log('transform', r(id))
                    if (r(id).includes('src/style.css')) {
                        const resolveId = await this.resolve(path.resolve(__dirname, 'src/other.css'), path.resolve(__dirname, 'src/main.ts'))
                        if (resolveId) {
                            await this.load(resolveId)
                        }
                    }
                },
                load(id, options) {
                    console.log('load', r(id))
                },
                buildEnd(error) {
                    const ids = [... this.getModuleIds()]
                    console.log('buildEnd', ids)
                    const watchedFiles = this.getWatchFiles()
                    console.log('watchedFiles', watchedFiles)

                },
            }
        ]
    }
)