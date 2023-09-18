
export interface AdblockStateInterface
{
  status: string,
  userSettings: {
    whitelist: Array<string>,
    userDisabledFilters: Array<number>
  }
}
