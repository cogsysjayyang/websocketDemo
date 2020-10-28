import * as http from 'http'
import * as io from 'socket.io'

interface bullet {
    desktopID: string,
    mobileMsg: any[]
}
const server = http.createServer((req, res) =>{

})
server.listen(8100)
let clientCount = 0
const ws = io.listen(server)
//let desktopID : any = []
//let mobileMsg : any = []
let bullet : bullet [] = []
ws.on('connection', (socket) =>{
    clientCount++
    socket.setMaxListeners(5)
    let desktopID : string
    socket.on('client', (...msgs) =>{
        console.log(msgs)
        socket.emit('client', 'connected!!!>>>>client')
        socket.on('desktopID', (...msgs) =>{
            console.log('desktopID say:', msgs)
            const desktopID = msgs.toString()
            socket.on(desktopID, (...msgs) =>{
                console.log('mobileMsg say:',"base64", desktopID)
                //const mobileMsg = `sent from server>>>${msgs}`
                bullet.push({desktopID: desktopID, mobileMsg: msgs})
                //mainSocket.emit(desktopID, mobileMsg)
                //console.log('loop>>>',socket.emit(desktopID, mobileMsg))
                socket.emit("ios", (msgs[0] as {fileName:string, file:string}).fileName)
    
            })
            
        })
    })
    socket.on('desktop', (...msgs) =>{
        console.log(msgs)
        socket.emit('desktop', 'connected!!!>>>>desktop')
        socket.on('desktopID', (...msgs) =>{
            desktopID = msgs.toString()
            console.log('get ID', desktopID)
        })

        
        const timer = setInterval(() =>{
            if (bullet.length>0) {
                const sigleBullet = bullet.shift()
                if (sigleBullet.desktopID === desktopID) {
                    console.log("sent to", desktopID)
                    socket.emit(sigleBullet.desktopID, sigleBullet.mobileMsg)
                    desktopID = undefined
                    socket.once('desktopID', (...msgs) =>{
                        desktopID = msgs.toString()
                    })
                } else{
                    bullet.push(sigleBullet)
                }   
            } else{
                console.log(`bullet is empty  ${clientCount}`, Date.now())
                if (socket.disconnected) {
                    clearInterval(timer)
                }
            }
        }, 1000)
        
    })

    socket.on('disconnect', ()=>{
        clientCount--
    })


})
