import * as restify from 'restify';
import { Restaurant } from './restaurants.model';
import { ModelRouter } from '../common/model-router';
import { NotFoundError } from 'restify-errors';

class RestaurantRouter extends ModelRouter<Restaurant>{
    
    constructor(){
        super(Restaurant);
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
        aplication.get('/restaurants', this.findAll)
        aplication.get('/restaurants/:id', [this.validateId, this.findById])
        aplication.post('/restaurants', this.save)
        aplication.put('/restaurants/:id', [this.validateId, this.replace])
        aplication.patch('/restaurants/:id', [this.validateId, this.update])
        aplication.del('/restaurants/:id', [this.validateId, this.delete]) 
        //MENU ROUTERS
        aplication.get('/restaurants/:id/menu', [this.validateId, this.findMenu])
        aplication.put('/restaurants/:id/menu', [this.validateId, this.replaceMenu])
    }
}

export const restaurantRouter = new RestaurantRouter()