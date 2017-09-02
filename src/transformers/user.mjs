export default (user) => {
  const clone = Object.assign({}, user)
  // 定義から抹消したい情報
  delete clone.avatarPath
  delete clone.bannerPath
  delete clone.wallpaperPath
  // ユーザーにとって必要のない情報
  delete clone.screenNameLower
  // 機密にすべき情報
  delete clone.email
  delete clone.encryptedPassword
  return clone
}
