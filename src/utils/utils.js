

export function getEloRank(firstnameObj, currentUser) {
    if (firstnameObj.rankEloUser === undefined) {
        return 1000;
    }

    if (firstnameObj.rankEloUser[currentUser.uid] === undefined) {
        return 1000;
    }

    return firstnameObj.rankEloUser[currentUser.uid];
};