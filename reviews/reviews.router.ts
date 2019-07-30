import * as mongoose from 'mongoose';
import { validateCPF } from '../common/validators';
import * as bcrypt from 'bcrypt'
import { environmentes } from '../common/environment';
import { Review } from './reviews.model';
import { ModelRouter } from '../common/model-router';
import * as restify from 'restify';

class ReviewRouter extends ModelRouter<Review>{
    constructor(){
        super(Review)
        this.on('beforeRender', document=>{
            document.password = undefined
            //delete documente.password
        })
    }

    envelope(document){
        let resource = super.envelope(document)
        const restId = document.restaurant._id ? document.restaurant._id : document.restaurant
        resource._links.restaurant = `/restaurants/${restId}`
        return resource
    }

    //overwrite
    protected prepereOne(query: mongoose.DocumentQuery<Review, Review>): mongoose.DocumentQuery<Review, Review>{
        return query.populate('user', 'name')
        .populate('restaurant')
    }
    // findById = (req, resp, next)=>{ 
    //     this.model.findById(req.params.id)
    //     .populate('user', 'name')
    //     .populate('restaurant')
    //     .then(this.render(resp, next))
    //     .catch(next)
    // }

    applyRouters(aplication: restify.Server){
        aplication.get(`${this.basepath}`, this.findAll)
        aplication.get(`${this.basepath}/:id`, [this.validateId, this.findById])
        aplication.post(`${this.basepath}`, this.save)
    }
}

export const reviewRouter = new ReviewRouter()