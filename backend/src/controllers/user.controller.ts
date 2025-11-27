import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = req.body;
    const user = await userService.createUser(dto);
    return res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = req.body;
    const result = await userService.authenticateUser(dto);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const user = await userService.getUserById(id);
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
