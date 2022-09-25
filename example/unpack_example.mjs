import Gun from "gun"
import "../lib/index.js"

const gun = Gun()

gun.unpack({alias:'example', encoding: 'base64'}) 

