import "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
  interface Session {
    user: {
      _id?: string;
      isVerifies?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    } & DefaultSession['user'];
  }
  interface JWT {
    _id?: string;
    isVerifies?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}