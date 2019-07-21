import { Router } from '../common/router';
import * as restify from 'restify';
import {NotFoundError} from 'restify-errors'
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
            User.find().then(this.render(resp, next)).catch(next)
        })

        aplication.get('users/:id', (req, resp, next)=>{
            User.findById(req.params.id).then(this.render(resp, next)).catch(next)
        })

        aplication.post('/users', (req, resp, next)=>{
            let user = new User(req.body);
            user.save().then(this.render(resp, next)).catch(next)
        })

        aplication.put('/users/:id', (req, resp, next)=>{
            const options = {runValidators:true, overwrite:true}  //'runValidator'it will be used validations, 'overwrite' used to indicate the old user will be replaced for new user
            User.update({_id:req.params.id}, req.body, options).exec().then(result=>{
                if(result.n)
                    return User.findById(req.params.id)
                else
                    throw new NotFoundError('Document not found')
            }).then(this.render(resp, next)).catch(next)
        })

        aplication.patch('/users/:id', (req, resp, next)=>{
            const options = {runValidators:true, new: true} //'new' used to indicate that the new user will be showed in resp.json and don't the old user
            User.findByIdAndUpdate(req.params.id, req.body, options).then(this.render(resp, next)).catch(next)
        })

        aplication.del('/users/:id', (req, resp, next)=>{
            User.remove({_id: req.params.id}).exec().then((cmdResult: any)=>{
                if(cmdResult.result.n)
                    resp.send(204)
                else
                    throw new NotFoundError('Document not found')
                return next()    
            }).catch(next)
        })
    }


}

export const userRouter = new UserRouter()    