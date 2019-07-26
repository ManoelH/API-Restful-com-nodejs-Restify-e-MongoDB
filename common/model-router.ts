import { Router } from './router';
import * as mongoose from 'mongoose';
import {NotFoundError} from 'restify-errors'
import { Review } from '../reviews/reviews.model';

export abstract class ModelRouter<D extends mongoose.Document> extends Router{

    constructor(protected model: mongoose.Model<D>) {
        super();
    }

    protected prepereOne(query: mongoose.DocumentQuery<D, D>): mongoose.DocumentQuery<D, D>{
        return query
    }

    validateId = (req, resp, next)=>{
        if(!mongoose.Types.ObjectId.isValid(req.params.id))
            next(new NotFoundError('Document not found'))
        else
            next()
    }

    findAll = (req, resp, next)=>{
        this.model.find().then(this.renderAll(resp, next)).catch(next)
    }

    findById = (req, resp, next)=>{
        this.prepereOne(this.model.findById(req.params.id))
        .then(this.render(resp, next))
        .catch(next)
    }

    save = (req, resp, next)=>{
        let document = new this.model(req.body);
        document.save().then(this.render(resp, next)).catch(next)
    }

    replace = (req, resp, next)=>{
        const options = {runValidators: true, overwrite: true}  //'runValidator'it will be used validations, 'overwrite' used to indicate the old user will be replaced for new user
        this.model.update({_id: req.params.id}, req.body, options)
            .exec().then(result=>{
            if(result.n)
                return this.model.findById(req.params.id)
            else
                throw new NotFoundError('Document not found')
        }).then(this.render(resp, next))
        .catch(next)
    }

    update = (req, resp, next)=>{
        const options = {runValidators:true, new: true} //'new' used to indicate that the new user will be showed in resp.json and don't the old user
        this.model.findByIdAndUpdate(req.params.id, req.body, options)
        .then(this.render(resp, next))
        .catch(next)
    }

    delete = (req, resp, next)=>{
        this.model.remove({_id: req.params.id}).exec().then((cmdResult: any)=>{
            if(cmdResult.result.n)
                resp.send(204)
            else
                throw new NotFoundError('Document not found')
            return next()    
        }).catch(next)
    }
}