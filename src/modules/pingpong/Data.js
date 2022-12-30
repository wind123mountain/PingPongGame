userData = {
    name: 'Guest',
    bestScore: 0
};

test = {
    name: 'Test',
    bestScore: 0
}

RANK = [test];
lenRank = 10;

function saveUser(data){
    cc.sys.localStorage.setItem('userData', JSON.stringify(data));
}

function getUsername(){
    var user = JSON.parse(cc.sys.localStorage.getItem('userData'));

    return user == null? null : user.name;
}

function getUserData(){
    var user = JSON.parse(cc.sys.localStorage.getItem('userData'));
    return user;
}

function getRanking(){
    var ranking = JSON.parse(cc.sys.localStorage.getItem('Ranking'));
    return ranking;
}

function saveRanking(ranking){
    ranking.sort(comp);
    cc.sys.localStorage.setItem('Ranking', JSON.stringify(ranking));
}

function findUserRanking(user_data, ranking){
    for (let i = 0; i < ranking.length; i++){
        if(ranking[i].name == user_data.name){
            return i;
        }
    }

    return -1;
}

function comp(a, b){
    return parseFloat(b.bestScore) - parseFloat(a.bestScore);
}

function rank(user_data) {
    let ranking = getRanking();

    if(ranking == null){
        ranking = [];
        ranking.push(user_data);
        saveRanking(ranking);
        return ranking;
    }

    let rank = findUserRanking(user_data, ranking);
    if (rank != -1){
        if (parseFloat(ranking[rank].bestScore) >= parseFloat(user_data.bestScore)) {
            console.log("Khong bang thanh tich tot nhat");
        }
        else {
            ranking.splice(rank, 1, user_data);
            ranking.sort(comp);
        }
    }
    else {
        ranking.push(user_data);
        ranking.sort(comp);
        if(ranking.length > lenRank){
            ranking.pop();
        }
    }

    saveRanking(ranking);

    return ranking;
}