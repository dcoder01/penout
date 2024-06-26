const { Schema, model } = require('mongoose')
const { createHmac, randomBytes} = require('crypto');
const {createTokenforUser}=require('../services/auth')
const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        salt: {
            type: String,
           
        },
        password: {
            type: String,
            required: true,
        },
        profileImageURL: {
            type: String,
            default: "/images/default.png",
        },
        role: {
            type: String,
            enum: ['USER', 'ADMIN'],
            default: 'USER',
        },


    },
    {
        timestamps: true,
    }
)

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return;
    const salt= randomBytes(16).toString();
    const hashedpassword = createHmac('sha256', salt)
               .update(user.password)
               .digest('hex');
    this.salt=salt;
    this.password=hashedpassword;
    next();
})

userSchema.static("matchPasswordandGeneratetoken", async function(email, password){
   const user= await this.findOne({email});
    if(!user) throw new Error('User not Found');
    const salt= user.salt;
    const hashedpassword= user.password;
    const userProvidedhash= createHmac('sha256', salt)
    .update(password)
    .digest('hex');
    if(hashedpassword!==userProvidedhash) throw new Error('Incorrect Password');
    // return {...user._doc, password: undefined, salt: undefined}
    // return user;
    const token= createTokenforUser(user);
    // console.log(token);
    return token
})
const User = model('user', userSchema)
module.exports = User;