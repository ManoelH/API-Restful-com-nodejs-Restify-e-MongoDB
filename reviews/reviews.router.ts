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
        aplication.get('/reviews', this.findAll)
        aplication.get('/reviews/:id', [this.validateId, this.findById])
        aplication.post('/reviews', this.save)
    }
}

export const reviewRouter = new ReviewRouter()