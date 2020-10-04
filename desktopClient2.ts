import * as io from 'socket.io-client'
import * as fs from 'fs'
let desktopID : any = 'FromDesktop2'
let mobileMsg : any = []
let index = 0
const socket = io.connect('ws://localhost:8080/')

socket.emit('desktop', 'i am desktop')

socket.on('desktop', (...msgs) =>{
    console.log('msg', msgs)
    socket.emit('desktopID', desktopID)
    socket.on(desktopID, (...msgs) =>{
        index++
        console.log('desktopGetIDFromMobile:', msgs)
        console.log(index)
        const buffer = Buffer.from(msgs.toString(), 'base64')
        fs.writeFileSync('/Users/jay/Documents/js_workspace/websocketDemo/imagesForMac/4.png', buffer)

        socket.emit('desktopID', desktopID)
    })
})
// socket.on('mobileMsg', (...msgs) =>{
//     //mobileMsg = msgs
//     console.log('desktopGetMsgsFromMobile:', msgs)
// })

// socket.on('timer', (time) =>{
//     console.log('timer', time)
// })