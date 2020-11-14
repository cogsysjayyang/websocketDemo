import * as io from 'socket.io-client'
import * as fs from 'fs'
import * as glob from 'glob'
let serverAddress = "ws://www.olknow.com:8100/"
let isOnline = false
let desktopID : any = 'fromTricubs'
let mobileMsg : any = []
let index = 0
if (process.argv[2] === 'dev') {
    serverAddress = "ws://localhost:8100"
}
console.log("server address", serverAddress)
const socket = io.connect(serverAddress)
function open(socket : SocketIOClient.Socket ) {
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
            fs.writeFileSync(`/Volumes/PostProcess/kidsHome/${fileName}`, buffer)
    
            socket.emit('desktopID', desktopID)
        })
    
        const imgFileList =  glob.sync(`/Volumes/PostProcess/kidsHome/*.*`)
        for (let index = 0; index < imgFileList.length; index++) {
            const element = imgFileList[index]
            const elements = element.split("/")
            imgFileList[index] = elements[elements.length - 1]
        }
        //console.log(imgFileList)
        socket.emit(`${desktopID}/list`, imgFileList)
        console.log("send list when connected", imgFileList)
        
        socket.on(`${desktopID}/list`, () =>{
            const imgFileList =  glob.sync(`/Volumes/PostProcess/kidsHome/*.*`)
            for (let index = 0; index < imgFileList.length; index++) {
                const element = imgFileList[index]
                const elements = element.split("/")
                imgFileList[index] = elements[elements.length - 1]
            }
            
            socket.emit(`${desktopID}/list`, imgFileList)
            console.log("send list lenght", imgFileList.length)
        })
    })
    isOnline = true
}
function close(socket : SocketIOClient.Socket)  {
    socket.off('desktop')
    socket.off(desktopID)
    socket.off(`${desktopID}/list`)
}
const timer = setInterval(() =>{
    if (socket.connected && isOnline) {
        socket.emit('online')   
    } else if (socket.connected) {
            open(socket)
    } else {
        isOnline = false
        close(socket)
        socket.connect()
        console.log("try")
    }
}, 1000)
process.on('SIGINT',() => {
    socket.disconnect()
    console.log("mac_desktop exited!!!")
    clearInterval(timer)
})
// socket.on('mobileMsg', (...msgs) =>{
//     //mobileMsg = msgs
//     console.log('desktopGetMsgsFromMobile:', msgs)
// })

// socket.on('timer', (time) =>{
//     console.log('timer', time)
// })