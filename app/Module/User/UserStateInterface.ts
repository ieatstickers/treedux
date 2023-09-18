
export interface UserStateInterface
{
  user: {
    name: string
  },
  plan: {
    code: string,
    name: string,
    expiry: Date,
    status: string
  }
}
