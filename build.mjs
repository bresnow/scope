import esbuild from 'esbuild'
import { $, chalk } from "zx"
import "zx/globals"
const index = 'src/index.ts'
$.verbose = false
try {
    await esbuild
        .build({
            outdir: "lib",
            entryPoints: {
                index
            },
            platform: "node",
            format: "esm",
            bundle: false,
            write: true,
        })

    // eslint-disable-next-line no-undef
    await $`tsc --build `

} catch (error) {
    console.error(chalk.yellow(error))

}