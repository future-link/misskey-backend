import general from './general'

import { Post, PostLike, UserFollowing } from '../db'

const count = (ret) => {
  const counters = [
    {
      name: 'posts',
      processor: Post.count.bind(Post),
      gen_argument: (ret) => { return { user: ret.id } }
    },
    {
      name: 'likes',
      processor: PostLike.count.bind(PostLike),
      gen_argument: ret => { return { user: ret.id } }
    },
    {
      name: 'followees',
      processor: UserFollowing.count.bind(UserFollowing),
      gen_argument: ret => { return { follower: ret.id } }
    },
    {
      name: 'followers',
      processor: UserFollowing.count.bind(UserFollowing),
      gen_argument: ret => { return { followee: ret.id } }
    }
  ]
  const done = []
  ret.counts = {}
  counters.forEach(counter => {
    counter.processor(counter.gen_argument(ret)).then(counts => {
      ret.counts[counter.name] = counts
      done.push(counter.name)
    })
  })
  // mongooseのtransformはPromise非対応っぽいので無理やり止めたい
  const tick = 0
  while (counters.length > done.length) {
    tick++
  }
  console.log(tick)
  return
}

export default (doc, ret) => {
  general(doc, ret)
  // 利用されていない・不要な情報
  delete ret.birthday
  delete ret.color
  delete ret.credit
  delete ret.pinnedPost
  delete ret.avatarPath
  delete ret.bannerPath
  delete ret.wallpaperPath
  delete ret.isDeleted
  delete ret.isPrivate
  delete ret.isPro
  delete ret.isStaff
  delete ret.isSuspended
  delete ret.isVerified
  delete ret.isEmailVerified
  delete ret.wallpaper
  delete ret.latestPost
  // 他のフィールドと使用用途が被っていて、なおかつ使用されていない情報
  delete ret.description
  // パブリックに開示する必要のない情報
  delete ret.timelineReadCursor
  delete ret.screenNameLower
  // 機密にすべき情報
  delete ret.email
  delete ret.encryptedPassword
  // その場で計上するため必要のない情報
  delete ret.postsCount
  delete ret.likesCount
  delete ret.likedCount
  delete ret.followingCount
  delete ret.followersCount
  // 計上
  count(ret)
}
