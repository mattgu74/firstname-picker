

export function getEloRank(firstnameObj, userId) {
    if (firstnameObj.rankEloUser === undefined) {
        return 1000;
    }

    if (firstnameObj.rankEloUser[userId] === undefined) {
        return 1000;
    }

    return firstnameObj.rankEloUser[userId];
};

export function getHide(firstnameObj, userId) {
    if (firstnameObj.hideUser === undefined) {
        return false;
    }

    if (firstnameObj.hideUser[userId] === undefined) {
        return false;
    }

    return firstnameObj.hideUser[userId];
};