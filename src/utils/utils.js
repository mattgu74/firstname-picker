

export function getEloRank(firstnameObj, currentUser) {
    if (firstnameObj.rankEloUser === undefined) {
        return 1000;
    }

    if (firstnameObj.rankEloUser[currentUser.uid] === undefined) {
        return 1000;
    }

    return firstnameObj.rankEloUser[currentUser.uid];
};

export function getHide(firstnameObj, currentUser) {
    if (firstnameObj.hideUser === undefined) {
        return false;
    }

    if (firstnameObj.hideUser[currentUser.uid] === undefined) {
        return false;
    }

    return firstnameObj.hideUser[currentUser.uid];
};