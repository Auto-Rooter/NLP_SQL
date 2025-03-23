import { AppContext, IAuth } from '@/interfaces/auth.interface';
import { AuthService } from '@/services/auth/AuthService';

export const AuthResolver = {
  Query: {
    async checkCurrentUser(_: undefined, __: undefined, contextValue: AppContext) {
      const { req } = contextValue;

      return {
        user: {
          id: req?.currentUser?.userId,
          email: req?.currentUser?.email
        },
        projectIds: [],
        collections: []
      }
    }
  },
  Mutation: {
    async loginUser(_: undefined, args: { email: string, password: string }, contextValue: AppContext){
      const user: IAuth = { email: args?.email, password: args?.password };
      return AuthService.login(user, contextValue);
    },
    async registerUser(_: undefined, args: { user: IAuth }, contextValue: AppContext){
      const user = args?.user;
      return AuthService.register(user, contextValue);
    },
    async logout(_: undefined, __: undefined, contextValue: AppContext){
      return AuthService.logout(contextValue);
    },
  }
};