import * as io from 'socket.io-client'

let desktopID : any = 'FromDesktop'
let mobileMsg : any[] = ['cl1', 'cl2']
let index = 0
const socket = io.connect('ws://localhost:8080/')

socket.emit('client', 'i am client')

socket.on('client', (...msgs) =>{
    console.log('msg', msgs)
    socket.emit('desktopID', desktopID)
    setInterval(() =>{
        index++
        //socket.emit(desktopID, `${new Date().getTime()} from IOS<<<`)
        socket.emit(desktopID, ...mobileMsg)
        console.log(index)
    }, 2000)
})
// socket.on('timer', (time) =>{
//     console.log('timer', time)
// })
//socket.emit('mobileMsg', mobileMsg)