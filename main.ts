import { Server } from './server/server';
import { userRouter } from './users/users.router';
import { restaurantRouter } from './restaurants/restaurants.router';
import { reviewRouter } from './reviews/reviews.router';
import { mainRouter } from './main.router';

const server = new Server()

server.bootstrap([userRouter, restaurantRouter, reviewRouter, mainRouter]).then(serveRunning=>{
    console.log('Server is running on:', server.aplication.address())
}).catch(error=>{
    console.log('Server failed')
    console.log(error)
    process.exit(1)
})
