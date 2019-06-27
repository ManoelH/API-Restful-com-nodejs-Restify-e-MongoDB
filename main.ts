import * as restify from 'restify'

const server = restify.createServer({
    name: 'meat-api',
    version: '1.0.0'
})

server.use(restify.plugins.queryParser())

server.get('/info', [(req, resp, next)=>{
        if(req.userAgent() && req.userAgent().includes('MSIE 7.0')){
            //resp.json({message: 'Please install other browser'})
            //resp.status(400)
            //return next(false)

            let error:any = new Error()
            error.message = 'Please install other browser'
            error.statusCode = 400
            return next(error)
        }
        return next()
    },
    (req, resp, next)=>{
    
    //resp.contentType = 'aplication/json' 
    //resp.setHeader('Content-Type', 'aplication/json')

    //resp.send({message:'Hello'})
    //resp.status(400)
    resp.json({
        browser: req.userAgent(),
        method: req.method,
        url: req.url,
        href: req.href(),
        path: req.path(),
        query: req.query,
    })
    return next()
}]
)

server.listen(3000, ()=>{
    console.log('server is running on http://localhost:3000')
})