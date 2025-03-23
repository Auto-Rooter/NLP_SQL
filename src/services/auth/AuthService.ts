import { AppDataSource } from "@/database/config";
import { User } from "@/entities/user.entity";
import { AppContext, IActiveProject, IAuth, TokenPayload } from "@/interfaces/auth.interface";
import { ValidationService } from "./ValidationService";
import { hashPassword } from "@/utils/utils";
import { generateAccessToken } from "@/utils/token-util";

export class AuthService {
  static async register(input: IAuth, context: AppContext){
    const userRepository = AppDataSource.getRepository(User);
    const { email, password } = input;
    const { req } = context;

    await ValidationService.validateRegistration(input, userRepository);

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
}