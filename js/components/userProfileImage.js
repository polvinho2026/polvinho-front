export function createUserProfileImage({ src, size = 'medium', border = false } = {}) {
    const img = document.createElement('img')
    img.src = src ?? 'assets/images/user-profile-placeholder.png'

    img.classList.add('user-avatar', `avatar-${size}`)

    if (border) {
        img.classList.add('avatar-bordered')
    }

    return img
}