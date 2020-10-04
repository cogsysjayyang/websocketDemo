import * as io from 'socket.io-client'

let desktopID : any = 'FromDesktop'
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
        socket.emit('desktopID', desktopID)
    })
})
// socket.on('mobileMsg', (...msgs) =>{
//     mobileMsg = msgs
//     console.log('desktopGetMsgsFromMobile:', mobileMsg)
// })

// socket.on('timer', (time) =>{
//     console.log('timer', time)
// })