import { Router } from './router';
import * as mongoose from 'mongoose';
import {NotFoundError} from 'restify-errors'
import { Review } from '../reviews/reviews.model';

export abstract class ModelRouter<D extends mongoose.Document> extends Router{

    basepath: string
    pageSize = 2

    constructor(protected model: mongoose.Model<D>) {
        super();
        this.basepath = `/${this.model.collection.name}`
    }

    protected prepereOne(query: mongoose.DocumentQuery<D, D>): mongoose.DocumentQuery<D, D>{
        return query
    }

    envelope(document: any):any{
        let resource = Object.assign({_links:{}}, document.toJSON())
        resource._links.self = `${this.basepath}/${resource._id}`
        return resource
    }

    envelopeAll(documents: any[], options:any = {}):any{
        const resouce: any = {
            _links:{
                self: `${options.url}`,

            },
            items: documents
        }
        if(options.page && options.count && options.pageSize){
            if(options.page > 1)
                resouce._links.previous = `${this.basepath}?_page=${options.page-1}`
            const remaning = options.count - (options.page * options.pageSize)
            console.log(options.count)
            console.log(options.page)
            console.log(options.pageSize)
            console.log(remaning)
            if(remaning > 0)    
                resouce._links.next = `${this.basepath}?_page=${options.page+1}`    
        }
        return resouce
    }

    validateId = (req, resp, next)=>{
        if(!mongoose.Types.ObjectId.isValid(req.params.id))
            next(new NotFoundError('Document not found'))
        else
            next()
    }

    findAll = (req, resp, next)=>{
        let page =  parseInt(req.query._page || 1)
        page = page > 0 ? page : 1
        const skip = (page - 1) * this.pageSize

        this.model.count({}).exec().then(count=>
            this.model.find()
            .skip(skip)
            .limit(this.pageSize)
            .then(this.renderAll(resp, next, {page,  count, pageSize:this.pageSize, url:req.url
            })).catch(next)
        ) 
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