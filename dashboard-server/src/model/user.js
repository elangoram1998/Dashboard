const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value) && !validator.matches(value, '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')) {
                throw new Error('Email is not valid');
            }
        }
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        validate(value) {
            if (!validator.matches(value, '[0-9 ]{10}')) {
                throw new Error('Phone number is not valid');
            }
        }
    },
    age: {
        type: Number,
        required: true,
        min: 12,
        max: 85
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.matches(value, '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&]).{8,}')) {
                throw new Error('Password is not valid');
            }
        }
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
},{
    timestamps:true
});

userSchema.pre('save',async function(next){
    const user=this;
    console.log('Before saving the user in database..');
    if(user.isModified('password'))
    {
        user.password=await bcrypt.hash(user.password,8);
    }
    next();
});

userSchema.methods.generateToken=async function()
{
    const user=this;
    const token=await jwt.sign({_id:user._id.toString()},'hellotoken');
    user.tokens=user.tokens.concat({token});

    await user.save();

    return token;
};

userSchema.methods.toJSON=function()
{
    const user=this;

    const userObject=user.toObject();
    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.statics.findByCredentials=async function(username,password)
{
    console.log(`User name: ${username} and Password: ${password}`);

    const user=await User.findOne({username});
    if(!user)
    {
        throw new Error('Unable to find user');
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch)
    {
        throw new Error('Unable to login');
    }
    return user;
}

const User=mongoose.model('User',userSchema);

module.exports=User;