// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'
import formatCurrentTime from '../formatCurrentTime'

export const updateConfig = async (context: HookContext) => {
  const user = context.params.user
  if (!user) {
    console.log('User not found!')
    return
  }
    const driver = context.app.get('mysqlClient')
  await driver("config").where('name', 'author').update({
      value: user.email
    })
  await driver("config").where('name', 'last_login').update({
      value: formatCurrentTime()
  })
  console.log(`Updated the last logged in user to ${user.email}`)
  console.log(`Updated the last logged in time to ${formatCurrentTime(   )}`)

}
