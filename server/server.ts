import * as restify from 'restify';
import { environmentes } from '../common/environment';


export class Server{
    
    aplication: restify.Server

    initRoutes(): Promise<any>{
        return new Promise((resolve, reject)=>{
            try{
                this.aplication = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                })
                
                this.aplication.use(restify.plugins.queryParser())

                //routers
                this.aplication.get('/info', [(req, resp, next)=>{
                    if(req.userAgent() && req.userAgent().includes('MSIE 7.0')){
                        //resp.json({message: 'Please install other browser'})
                        //resp.status(400)
                        //return next(false)
            
                        let error:any = new Error()
                        error.message = 'Please install other browser'
                        error.statusCode = 400
                        return next(error)
                    }
                    return next()
                },
                (req, resp, next)=>{
                
                //resp.contentType = 'aplication/json' 
                //resp.setHeader('Content-Type', 'aplication/json')
            
                //resp.send({message:'Hello'})
                //resp.status(400)
                resp.json({
                    browser: req.userAgent(),
                    method: req.method,
                    url: req.url,
                    href: req.href(),
                    path: req.path(),
                    query: req.query,
                })
                return next()
            }]
            )            

                
                this.aplication.listen(environmentes.server.porta, ()=>{
                    resolve(this.aplication)
                })
            }catch(error){
                reject(error)
            }
        })
    }
    
    bootstrap(): Promise<Server>{
        return this.initRoutes().then(()=>this)
    }
}