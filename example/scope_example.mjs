import Gun from "gun"
import "../lib/index.js"

const gun = Gun()

gun.scope(["./example/mock_files/**/*"],(path, event , matches)=>{
    console.log(path, event)

}, {alias:'example' , encoding: 'base64'})
