import { Server } from './server/server';

const server = new Server()

server.bootstrap().then(serveRunning=>{
    console.log('Server is running on:', server.aplication.address())
}).catch(error=>{
    console.log('Server failed')
    console.log(error)
    process.exit(1)
})
