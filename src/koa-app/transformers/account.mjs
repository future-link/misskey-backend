import common from './common'

import { Account } from '../../db'

import { getAccountStatusByAccountInstance } from '../resources/accounts'

export default async raw => {
  const target = common(raw, Account)
  // 利用されていない・不要な情報
  delete target.birthday
  delete target.color
  delete target.credit
  delete target.pinnedPost
  delete target.avatarPath
  delete target.bannerPath
  delete target.wallpaperPath
  delete target.isDeleted
  delete target.isPrivate
  delete target.isPro
  delete target.isStaff
  delete target.isSuspended
  delete target.isVerified
  delete target.isEmailVerified
  delete target.wallpaper
  delete target.latestPost
  // 他のフィールドと使用用途が被っていて、なおかつ使用されていない情報
  delete target.description
  // パブリックに開示する必要のない情報
  delete target.timelineReadCursor
  delete target.screenNameLower
  // 機密にすべき情報
  delete target.email
  delete target.encryptedPassword
  // 配置を変更するため一旦削除する情報
  delete target.postsCount
  delete target.likesCount
  delete target.likedCount
  delete target.followingCount
  delete target.followersCount
  // /status の内容は統合される
  Object.assign(target, await getAccountStatusByAccountInstance(raw))
  return target
}
