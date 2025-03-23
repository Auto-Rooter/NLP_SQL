import { AppDataSource } from "@/database/config";
import { User } from "@/entities/user.entity";
import { AppContext, IActiveProject, IAuth, TokenPayload } from "@/interfaces/auth.interface";
import { ValidationService } from "./ValidationService";
import { hashPassword, verifyPassword } from "@/utils/utils";
import { generateAccessToken } from "@/utils/token-util";
import { GraphQLError } from "graphql";

export class AuthService {
  static async register(input: IAuth, context: AppContext){
    const userRepository = AppDataSource.getRepository(User);
    const { email, password } = input;
    const { req } = context;

    await ValidationService.validateUser(input, userRepository, 'register');

    const hashedPassword: string = await hashPassword(password);
    const user = userRepository.create({
      email,
      password: hashedPassword
    });
    const userData = await userRepository.save(user);
    const payload: TokenPayload = {
      userId: userData?.id,
      email: userData?.email,
      activeProject: {} as IActiveProject
    };

    const accessToken: string = generateAccessToken(payload);
    req.session = {
      access: accessToken
    };

    return {
      projectIds: [],
      collections: [],
      user: {
        id: user?.id,
        email: user?.email
      }
    }
  }

  static async login(input: IAuth, context: AppContext){
    const userRepository = AppDataSource.getRepository(User);
    const { email, password } = input;
    const { req } = context;

    await ValidationService.validateUser(input, userRepository, 'login');

    const user: User | null = await userRepository.findOne({ where: {email} });
    if(!user){
      throw new GraphQLError('Invalid credentials');
    }

    const isPasswordValid = await verifyPassword(password, user?.password);
    if(!isPasswordValid){
      throw new GraphQLError('Invalid credentials');
    }

    // TODO: get postgresql collections/tables
    const payload: TokenPayload = {
      userId: user?.id,
      email: user?.email,
      // TODO: Change it to get active project
      activeProject: {} as IActiveProject
    };

    const accessToken: string = generateAccessToken(payload);
    req.session = {
      access: accessToken
    };
    return {
      projectIds: [],
      collections: [],
      user: {
        id: user?.id,
        email: user?.email
      }
    }
  }
}