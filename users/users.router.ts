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

    findEmail = (req, resp, next)=>{
        if(req.query.email){
            User.find({email:req.query.email})
            .then(this.renderAll(resp, next))
            .catch(next)
        }
        else
            return next()
    }

    applyRouters(aplication: restify.Server){
        aplication.get({path:`${this.basepath}`, version:'2.0.0'}, [this.findEmail, this.findAll])
        aplication.get({path:`${this.basepath}`, version:'1.0.0'}, this.findAll)
        aplication.get(`${this.basepath}/:id`, [this.validateId, this.findById])
        aplication.post(`${this.basepath}`, this.save)
        aplication.put(`${this.basepath}/:id`, [this.validateId, this.replace])
        aplication.patch(`${this.basepath}/:id`, [this.validateId, this.update])
        aplication.del(`${this.basepath}/:id`, [this.validateId, this.delete]) 
    }


}

export const userRouter = new UserRouter()    