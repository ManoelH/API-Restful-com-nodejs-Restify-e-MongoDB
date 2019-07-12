import { Router } from '../common/router';
import * as restify from 'restify';
import { User } from './users.model';


class UserRouter extends Router{
    applyRouters(aplication: restify.Server){
        
        aplication.get('/users', (req, resp, next)=>{
            User.find().then(users=>{
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

        aplication.post('/users', (req, resp, next)=>{
            let user = new User(req.body);
            user.save().then(user=>{
                user.password = undefined //used to ocult the password after to be saved
                resp.json(user)
                return next()
            })
        })

        aplication.put('/users/:id', (req, resp, next)=>{
            const options = {overwrite:true}
            User.update({_id:req.params.id}, req.body, options).exec().then(result=>{
                if(result.n)
                    return User.findById(req.params.id)
                else
                    resp.send(404)
            }).then(user=>{
                resp.json(user)
                return next()
            })
        })
    }


}

export const userRouter = new UserRouter()    