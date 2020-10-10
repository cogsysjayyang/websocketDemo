import * as http from 'http'
import * as io from 'socket.io'

interface bullet {
    desktopID: string,
    mobileMsg: string
}
const server = http.createServer((req, res) =>{

})
server.listen(8080)

const ws = io.listen(server)
//let desktopID : any = []
//let mobileMsg : any = []
let bullet : bullet [] = []
ws.on('connection', (socket) =>{
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
                bullet.push({desktopID: desktopID, mobileMsg: msgs.toString()})
                //mainSocket.emit(desktopID, mobileMsg)
                //console.log('loop>>>',socket.emit(desktopID, mobileMsg))
    
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
    })

    setInterval(() =>{
        if (bullet.length>0) {
            const sigleBullet = bullet.shift()
            if (sigleBullet.desktopID === desktopID) {
                console.log("sent to", desktopID)
                socket.emit(sigleBullet.desktopID, sigleBullet.mobileMsg)
                desktopID = undefined
                socket.on('desktopID', (...msgs) =>{
                    desktopID = msgs.toString()
                })
            } else{
                bullet.push(sigleBullet)
            }   
        } else{
            console.log('bullet is empty')
        }
    }, 1000)
})
