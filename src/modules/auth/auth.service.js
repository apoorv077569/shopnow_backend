import pkg from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const{PrismaClient} = pkg;

const pool = new Pool({
      host: "localhost",
  port: 5432,
  user: "postgres",
  password: "Nikhil@2025", // RAW password (NO encoding here)
  database: "shopnow",
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

console.log("DATABASE_URL =>", process.env.DATABASE_URL);


const generateToken = (user) =>{
    return jwt.sign(
        {userId:user.id,email:user.email},
        process.env.JWT_SECRET,
        {expiresIn:"30m"}
    );
};

// signup

export const signup = async({name,email,password})=>{
    if(!name || !email || !password){
        throw new Error("All Fields are required");
    }
    const existingUser = await prisma.user.findUnique({
        where:{email},
    });
    if(existingUser){
        throw new Error("User already exist");
    }
    if(password.length < 8){
        throw new Error("Password have atleast 8 characters");
    }
    const passwordHash = await bcrypt.hash(password,10);
    const user = await prisma.user.create({
        data:{
            name,
            email,
            passwordHash: passwordHash,
            provider:"LOCAL",
        },
    });
    return {
        message:"Signup Successfull",
        user:{
            id:user.id,
            name:user.name,
            email:user.email,
        },
    };
};

export const login = async({email,password}) =>{
    if(!email || !password){
        throw new Error("Email and Password required");
    }
    const user = await prisma.user.findUnique({
        where:{email},
    });
    if(!user || !user.passwordHash){
        throw new Error("Invalid Credentials");
    }
    const isMatch = await bcrypt.compare(password,user.passwordHash);
    if(!isMatch){
        throw new Error("Invalid Password");
    }
    const token = generateToken(user);
    return{
        token,
        user:{
            id:user.id,
            name:user.name,
            email:user.email,
        },
    };
};