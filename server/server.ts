import * as restify from 'restify';
import { environmentes } from '../common/environment';
import { Router } from '../common/router';
import * as mongoose from 'mongoose';
import { mergePatchBodyParser } from './merge-pacth.parser';


export class Server{
    
    aplication: restify.Server

    initiazeDb(): mongoose.MongooseThenable{
        (<any>mongoose.Promise) = global.Promise
        return mongoose.connect(environmentes.db.url, {
            useMongoClient: true
        })
    } 

    initRoutes(routers:Router[]): Promise<any>{
        return new Promise((resolve, reject)=>{
            try{
                this.aplication = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                })
                
                this.aplication.use(restify.plugins.queryParser())
                this.aplication.use(restify.plugins.bodyParser())
                this.aplication.use(mergePatchBodyParser)

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
        return this.initiazeDb().then(()=> this.initRoutes(routers).then(()=>this))
    }
}