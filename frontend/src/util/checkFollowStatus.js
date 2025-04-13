import { FollowServices } from '~/services';

export const checkFollowStatus = async (followerId, followingId) => {
    const [isFollowingRes, isFollowedBackRes] = await Promise.all([
        FollowServices.checkFollow(followerId, followingId),
        FollowServices.checkFollow(followingId, followerId),
    ]);
    if (isFollowingRes.code === 'OK' && isFollowedBackRes.code === 'OK') {
        if (isFollowingRes.data && isFollowedBackRes.data) {
            return 3; // Bạn bè
        } else if (isFollowingRes.data) {
            return 1; // Đang follow
        } else if (isFollowedBackRes.data) {
            return 2; // Đang được follow
        } else {
            return 0; // Chưa follow
        }
    }
};
