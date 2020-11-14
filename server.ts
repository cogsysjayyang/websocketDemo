import * as http from 'http'
import * as io from 'socket.io'
interface savedList {
    desktopID: string,
    list: string[]
}
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
let savedList : savedList [] = []
let bullet : bullet [] = []
ws.on('connection', (socket) =>{
    clientCount++
    //socket.setMaxListeners(5)

    socket.on('client', (...msgs) =>{
        console.log(msgs)
        //socket.emit('client', 'connected!!!>>>>client')
        socket.on('desktopID', (...msgs) =>{
            console.log('desktopID say:', msgs)
            const desktopID = msgs.toString()
            socket.on(desktopID, (...msgs) =>{
                console.log('mobileMsg say:',"base64", desktopID)
                //const mobileMsg = `sent from server>>>${msgs}`

                bullet.push({desktopID: desktopID, mobileMsg: msgs})
                
                //mainSocket.emit(desktopID, mobileMsg)
                //console.log('loop>>>',socket.emit(desktopID, mobileMsg))
                // socket.emit("ios", (msgs[0] as {fileName:string, file:string}).fileName)
                //socket.emit("ios", savedList.filter(item => item.desktopID === desktopID)[0].list[0])
                //socket.emit(`${desktopID}/list`, savedList.filter(item => item.desktopID === desktopID)[0].list[0])
    
            })
            //savedList.push({desktopID: desktopID, list: []})
            //console.log("will go", savedList.filter(item => item.desktopID === desktopID)[0].list[0])
            socket.emit(`${desktopID}/list`, savedList.filter(item => item.desktopID === desktopID)[0].list[0])
            
        })
    })
    socket.on('desktop', (...msgs) =>{
        let desktopID : string
        console.log(msgs)
        socket.emit('desktop', 'connected!!!>>>>desktop')
        socket.once('desktopID', (...msgs) =>{
            desktopID = msgs.toString()
            console.log('get ID for first check from desktop!!!', desktopID)
            
            socket.once(`${desktopID}/list`, (...msgs) =>{
                //console.log("list", msgs)
                savedList = savedList.filter(item => item.desktopID !== desktopID)
                savedList.push({desktopID: desktopID, list: msgs})
            })
        
        })

        socket.on('online', (...msgs)=>{
            console.log('check online', msgs)


            if (bullet.length>0) {
                const sigleBullet = bullet.shift()
                if (sigleBullet.desktopID === desktopID) {
                    console.log("sent to", desktopID)
                    socket.emit(sigleBullet.desktopID, sigleBullet.mobileMsg)
                    desktopID = undefined
                    socket.once('desktopID', (...msgs) =>{
                        desktopID = msgs.toString()
                        socket.emit(`${desktopID}/list`)
                        socket.once(`${desktopID}/list`, (...msgs) =>{
                            //console.log("list", msgs)
                            savedList = savedList.filter(item => item.desktopID !== desktopID)
                            savedList.push({desktopID: desktopID, list: msgs})
                        })
                    })
                } else{
                    bullet.push(sigleBullet)
                }   
            } else{
                console.log(`bullet is empty  ${clientCount}`, Date.now())
                if (socket.disconnected) {
                    console.log(`closed : `, desktopID)
                }
            }

        })
        
        // const timer = setInterval(() =>{
        //     if (bullet.length>0) {
        //         const sigleBullet = bullet.shift()
        //         if (sigleBullet.desktopID === desktopID) {
        //             console.log("sent to", desktopID)
        //             socket.emit(sigleBullet.desktopID, sigleBullet.mobileMsg)
        //             desktopID = undefined
        //             socket.once('desktopID', (...msgs) =>{
        //                 desktopID = msgs.toString()
        //                 socket.emit(`${desktopID}/list`)
        //             })
        //         } else{
        //             bullet.push(sigleBullet)
        //         }   
        //     } else{
        //         console.log(`bullet is empty  ${clientCount}`, Date.now())
        //         if (socket.disconnected) {
        //             clearInterval(timer)
        //         }
        //     }
        // }, 1000)
        
    })

    socket.on('disconnect', ()=>{
        clientCount--
    })


})
