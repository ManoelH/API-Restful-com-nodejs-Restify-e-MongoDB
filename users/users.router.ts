import { Router } from '../common/router';
import * as restify from 'restify';
import { User } from './users.model';


class UserRouter extends Router{
    applyRouters(aplication: restify.Server){
        
        aplication.get('/users', (req, resp, next)=>{
            User.findAll().then(users=>{
                resp.json(users)
                return next()
            })
        })

        aplication.get('users/:id', (req, resp, next)=>{
            User.findById(req.params.id).then(user=>{
                if(user){
                    resp.json(user)
                    return next()
                }
                else{
                    resp.send(404)
                    return next()
                }
            })
            
        })
    }


}

export const userRouter = new UserRouter()    