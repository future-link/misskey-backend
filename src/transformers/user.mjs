export default (user) => {
  const clone = Object.assign({}, user)
  // 利用されていない・不要な情報
  delete clone.birthday
  delete clone.color
  delete clone.credit
  delete clone.pinnedPost
  delete clone.avatarPath
  delete clone.bannerPath
  delete clone.wallpaperPath
  delete clone.isDeleted
  delete clone.isPrivate
  delete clone.isPro
  delete clone.isStaff
  delete clone.isSuspended
  delete clone.isVerified
  // 他のフィールドと使用用途が被っていて、なおかつ使用されていない情報
  delete clone.description
  // パブリックに開示する必要のない情報
  delete clone.timelineReadCursor
  delete clone.screenNameLower
  // 機密にすべき情報
  delete clone.email
  delete clone.encryptedPassword
  return clone
}
