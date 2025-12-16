import leaderBoardNamespace from './leaderBoard.namespace'
import loggedInUserUpdateNamespace from './loggedInUserUpdate.namespace'
import adminNotificationsNamespace from './adminNotifications.namespace'
import adminJackpotNamespace from './adminJackpot.namespace'

export default function (io) {
  loggedInUserUpdateNamespace(io)
  leaderBoardNamespace(io)
  adminNotificationsNamespace(io)
  adminJackpotNamespace(io)
}
