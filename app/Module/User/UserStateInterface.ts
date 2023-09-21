
export interface UserStateInterface
{
  user: {
    name: string,
    email: string
  },
  plan: {
    code: string,
    name: string,
    expiry: Date,
    status: string
  }
}
