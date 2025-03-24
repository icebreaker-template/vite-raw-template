import { defineConfig } from 'vite'
import path from 'node:path'
import fs from 'fs/promises'
debugger
const r = r => {
    return path.relative(__dirname, r)
}
export default defineConfig(

    {
        logLevel: 'silent',
        build: {
            minify: false,

        },
        plugins: [
            {
                name: 'test-plugin',
                enforce: 'pre',
                resolveId(source, importer, options) {
                    console.log('resolveId', source, importer)

                },
                async transform(code, id) {
                    console.log('transform', r(id))
                    if (r(id).includes('src/style.css')) {
                        const resolveId = await this.resolve(path.resolve(__dirname, 'src/other.css'), path.resolve(__dirname, 'src/style.css'))
                        if (resolveId) {
                            const otherCss = await this.load(resolveId);
                            const xxx = await this.load({
                                id: path.resolve(__dirname, 'src/other.css'),
                                moduleSideEffects: 'no-treeshake'
                            });
                            // console.log('otherCss', otherCss.code, xxx)
                            // const code = await fs.readFile(path.resolve(__dirname, 'src/other.css'), 'utf-8')
                            console.log('code', code, xxx.code)
                            if (otherCss) {
                                // 合并 src/style.css 和 src/other.css 的内容
                                const combinedCss = `${code}\n${xxx.code}`;
                                return combinedCss;
                            }
                        }
                    }
                    //  else if (r(id).includes('src/other.css')) {
                    //     return await fs.readFile(path.resolve(__dirname, 'src/other.css'), 'utf-8')
                    // }
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