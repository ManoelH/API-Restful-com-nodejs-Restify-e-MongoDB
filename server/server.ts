import * as restify from 'restify';
import { environmentes } from '../common/environment';
import { Router } from '../common/router';


export class Server{
    
    aplication: restify.Server

    initRoutes(routers:Router[]): Promise<any>{
        return new Promise((resolve, reject)=>{
            try{
                this.aplication = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                })
                
                this.aplication.use(restify.plugins.queryParser())

                //routers
                for(let router of routers){
                    router.applyRouters(this.aplication)
                }
            

                
                this.aplication.listen(environmentes.server.porta, ()=>{
                    resolve(this.aplication)
                })
            }catch(error){
                reject(error)
            }
        })
    }
    
    bootstrap(routers:Router[] = []): Promise<Server>{
        return this.initRoutes(routers).then(()=>this)
    }
}