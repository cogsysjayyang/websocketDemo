import * as io from 'socket.io-client'
import * as fs from 'fs'
let desktopID : any = 'FromDesktop2'
let mobileMsg : any = []
let index = 0
const socket = io.connect('ws://www.olknow.com:8100/')

socket.emit('desktop', 'i am desktop')

socket.on('desktop', (...msgs) =>{
    console.log('msg', msgs)
    socket.emit('desktopID', desktopID)
    socket.on(desktopID, (...msgs) =>{
        index++
        console.log('desktopGetIDFromMobile:', "base64")
        console.log(index)
        // const buffer = Buffer.from(msgs.toString(), 'base64')
        const file = (msgs[0][0] as {fileName:string, file:string}).file
        const fileName = (msgs[0][0] as {fileName:string, file:string}).fileName
        const buffer = Buffer.from(file)
        fs.writeFileSync(`/Volumes/PostProcess/PassPhotosLib/${fileName}`, buffer)

        socket.emit('desktopID', desktopID)
    })
})
process.on('SIGINT',() => {
    socket.disconnect()
    console.log("mac_desktop exited!!!")
})
// socket.on('mobileMsg', (...msgs) =>{
//     //mobileMsg = msgs
//     console.log('desktopGetMsgsFromMobile:', msgs)
// })

// socket.on('timer', (time) =>{
//     console.log('timer', time)
// })