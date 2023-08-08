import { UserApi } from "./data/dataSources/userApi";

export interface Context {
  userApi: UserApi;
}

export const context = () => {
  return {
    userApi: new UserApi(),
  };
};
