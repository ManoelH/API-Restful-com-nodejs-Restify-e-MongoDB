import * as mongoose from 'mongoose';
import { validateCPF } from '../common/validators';
import * as bcrypt from 'bcrypt'
import { environmentes } from '../common/environment';

export interface User extends mongoose.Document{
    name: string,
    email: string,
    password: string
}

export interface UserModel extends mongoose.Model<User>{
    findByEmail(email:string): Promise<User> //return a promise user
}

const userSchema = new  mongoose.Schema({
    name:{
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3
    },
    email:{
        type: String,
        required: true,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password:{
        type: String,
        select: false,
        required: true
    },
    gender:{
        type: String,
        required: false,
        enum: ['Male', 'Female']
    },
    cpf:{
        type: String,
        required: false,
        validate:{
            validator: validateCPF,
            message: '{PATH}: Invalid cpf ({VALUE})'
        }
    }

})

    userSchema.statics.findByEmail = function({email: string}){
        return this.findOne({email: this.email}) //{email: email}
    }

    const hashPasswoord = (obj, next)=>{
        bcrypt.hash(obj.password, environmentes.security.saltRounds)
        .then(hash=>{
            obj.password = hash
            next()
        }).catch(next)
    }

    const saveMiddleware = function(next){ //to use traditional functions to keep this = object document
        const user: User = this
        if(!user.isModified('password'))
            return next()
        else
            hashPasswoord(user, next)
    }

    const updateMiddleware = function(next){
        if(!this.getUpdate().password)
            return next()
        else
            hashPasswoord(this.getUpdate(), next)
    }

    userSchema.pre('save', saveMiddleware)
    userSchema.pre('findOneAndUpdate', updateMiddleware)
    userSchema.pre('update', updateMiddleware)

    export const User = mongoose.model<User, UserModel>('User', userSchema)