import * as restify from 'restify';
import { User } from './users.model';
import { ModelRouter } from '../common/model-router';


class UserRouter extends ModelRouter<User>{

    constructor(){
        super(User)
        this.on('beforeRender', document=>{
            document.password = undefined
            //delete documente.password
        })
    }

    applyRouters(aplication: restify.Server){
        
        aplication.get('/users', this.findAll)
        aplication.get('/users/:id', [this.validateId, this.findById])
        aplication.post('/users', this.save)
        aplication.put('/users/:id', [this.validateId, this.replace])
        aplication.patch('/users/:id', [this.validateId, this.update])
        aplication.del('/users/:id', [this.validateId, this.delete]) 
    }


}

export const userRouter = new UserRouter()    