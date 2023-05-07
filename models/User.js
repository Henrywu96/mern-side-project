import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        minlength: 3,
        maxlength: 20,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        validate: {
            validator: validator.isEmail,
            message: "Please provide valid email",
        },
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
        select: false,
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: 20,
        default: "lastName",
    },
    location: {
        type: String,
        trim: true,
        maxlength: 20,
        default: "my city",
    },
});

// user schema
UserSchema.pre("save", async function () {
    // console.log(this.modifiedPaths());
    // console.log(this.isModified('name'));

    if (!this.isModified('password')) return;
    // generate salt
    const salt = await bcrypt.genSalt(10);
    // hashed the password
    this.password = await bcrypt.hash(this.password, salt);
});

// create JWT
UserSchema.methods.createJWT = function() {
    return jwt.sign({ userId: this._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
    );
}

// compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}

export default mongoose.model("User", UserSchema);
