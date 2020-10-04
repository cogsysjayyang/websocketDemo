import * as io from 'socket.io-client'
import * as fs from 'fs'
let desktopID : any = 'FromDesktop2'
let mobileMsg : any = ['cl1', 'cl2']
let index = 0
const socket = io.connect('ws://localhost:8080/')

socket.emit('client', 'i am client')

socket.on('client', (...msgs) =>{
    console.log('msg', msgs)
    socket.emit('desktopID', desktopID)
    setInterval(() =>{
        let data = fs.readFileSync('/Users/jay/Documents/js_workspace/websocketDemo/imagesforclients/2.png')
        let base64 = Buffer.from(data).toString('base64') 
        index++
        //socket.emit(desktopID, `${new Date().getTime()} from Android<<<`)
        socket.emit(desktopID, base64)

        console.log(index)
    }, 5000)
})
// socket.on('timer', (time) =>{
//     console.log('timer', time)
// })
//socket.emit('mobileMsg', mobileMsg)