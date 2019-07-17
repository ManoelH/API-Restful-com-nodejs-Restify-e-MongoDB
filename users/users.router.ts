import { Router } from '../common/router';
import * as restify from 'restify';
import { User } from './users.model';


class UserRouter extends Router{

    constructor(){
        super()
        this.on('beforeRender', document=>{
            document.password = undefined
            //delete documente.password
        })
    }

    applyRouters(aplication: restify.Server){
        
        aplication.get('/users', (req, resp, next)=>{
            User.find().then(this.render(resp, next))
        })

        aplication.get('users/:id', (req, resp, next)=>{
            User.findById(req.params.id).then(this.render(resp, next))
        })

        aplication.post('/users', (req, resp, next)=>{
            let user = new User(req.body);
            user.save().then(this.render(resp, next))
        })

        aplication.put('/users/:id', (req, resp, next)=>{
            const options = {overwrite:true}  //used to indicate the old user will be replaced for new user
            User.update({_id:req.params.id}, req.body, options).exec().then(result=>{
                if(result.n)
                    return User.findById(req.params.id)
                else
                    resp.send(404)
            }).then(this.render(resp, next))
        })

        aplication.patch('/users/:id', (req, resp, next)=>{
            const options = {new: true} //used to indicate that the new user will be showed in resp.json and don't the old user
            User.findByIdAndUpdate(req.params.id, req.body, options).then(this.render(resp, next))
        })

        aplication.del('/users/:id', (req, resp, next)=>{
            User.remove({_id: req.params.id}).exec().then((cmdResult: any)=>{
                if(cmdResult.result.n)
                    resp.send(204)
                else
                    resp.send(404)
                return next()    
            })
        })
    }


}

export const userRouter = new UserRouter()    