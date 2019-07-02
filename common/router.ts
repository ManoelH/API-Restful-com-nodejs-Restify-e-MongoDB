import * as restify from 'restify';

export abstract class Router {
    abstract applyRouters(aplication: restify.Server)
}