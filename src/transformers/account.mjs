import common from './common'

import { Post } from '../db'

export default async raw => {
  const post = common(raw, Post)
  // 利用されていない・不要な情報
  delete post.birthday
  delete post.color
  delete post.credit
  delete post.pinnedPost
  delete post.avatarPath
  delete post.bannerPath
  delete post.wallpaperPath
  delete post.isDeleted
  delete post.isPrivate
  delete post.isPro
  delete post.isStaff
  delete post.isSuspended
  delete post.isVerified
  delete post.isEmailVerified
  delete post.wallpaper
  delete post.latestPost
  // 他のフィールドと使用用途が被っていて、なおかつ使用されていない情報
  delete post.description
  // パブリックに開示する必要のない情報
  delete post.timelineReadCursor
  delete post.screenNameLower
  // 機密にすべき情報
  delete post.email
  delete post.encryptedPassword
  // その場で計上するため必要のない情報
  delete post.postsCount
  delete post.likesCount
  delete post.likedCount
  delete post.followingCount
  delete post.followersCount
  return post
}
