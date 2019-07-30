import * as restify from 'restify';
import { Restaurant } from './restaurants.model';
import { ModelRouter } from '../common/model-router';
import { NotFoundError } from 'restify-errors';

class RestaurantRouter extends ModelRouter<Restaurant>{
    
    constructor(){
        super(Restaurant);
    }

    envelope(document){
        let resource = super.envelope(document)
        resource._links.self = `${this.basepath}/${resource._id}/menu`
        return resource
    }

    findMenu = (req, resp, next)=>{
        Restaurant.findById(req.params.id, '+menu').then(rest=>{ //+menu (Projection)
            if(!rest)
                throw new NotFoundError('Restaurant not found')
            else{
                resp.json(rest.menu)    
                return next()
            }
        }).catch(next)
    }

    replaceMenu = (req, resp, next)=>{
        Restaurant.findById(req.params.id).then(rest=>{
            if(!rest)
                throw new NotFoundError('Restaurant not found')
            else{
                rest.menu = req.body
                return rest.save()
            }
        }).then(rest=>{
            resp.json(rest.menu)
            return next()
        }).catch(next)
    }

    applyRouters(aplication: restify.Server){
        aplication.get(`${this.basepath}`, this.findAll)
        aplication.get(`${this.basepath}/:id`, [this.validateId, this.findById])
        aplication.post(`${this.basepath}`, this.save)
        aplication.put(`${this.basepath}/:id`, [this.validateId, this.replace])
        aplication.patch(`${this.basepath}/:id`, [this.validateId, this.update])
        aplication.del(`${this.basepath}/:id`, [this.validateId, this.delete]) 
        //MENU ROUTERS
        aplication.get(`${this.basepath}/:id/menu`, [this.validateId, this.findMenu])
        aplication.put(`${this.basepath}/:id/menu`, [this.validateId, this.replaceMenu])
    }
}

export const restaurantRouter = new RestaurantRouter()