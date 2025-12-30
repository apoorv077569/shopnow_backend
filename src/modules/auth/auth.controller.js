import * as authService from "./auth.service.js";

export const signup = async(req,res) =>{
    try {
        const user = await authService.signup(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({
            
            error:err.message});
    }
};

export const login = async(req,res) =>{
    try {
        const data = await authService.login(req.body);
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({error:err.message});
    }
};