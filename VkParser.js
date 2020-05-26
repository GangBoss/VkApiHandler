var fetch = require('node-fetch');

main()
function main() {
    let args = getArgs().slice(2);
    let key = args[0];
    let userid = args[1];
    getFriendsUrl(userid, key)
        .then(userUrl => GetData(userUrl))
        .then(r => analizeResponse(r))
        .then(r => r.items)
        .then(u => parseUserInfo(u))
        .then(info => console.log(info))
        .catch(reject => console.log(reject));

    getGroupsUrl(userid, key)
        .then(groupUrl => GetData(groupUrl))
        .then(r => analizeResponse(r))
        .then(g => getGroupsByIDUrl(g.groups.items, key))
        .then(url => GetData(url))
        .then(r => analizeResponse(r))
        .then(g => showGroups(g))
        .then(info => console.log(info))
        .catch(reject => console.log(reject));
}


function getArgs() {
    let args = process.argv;
    if (args == undefined || args.length < 4) {
        let keyUrl = "https://vk.com/editapp?act=create";
        console.log("Введите ключ доступа от приложения\n" +
            "Можно получить по ссылке: " + keyUrl +
            "\nВведите id пользователя\n" +
            "Usage: node VkParser [key] [id] "
        );
        process.exit(1);
    }
    return args;
}

function analizeResponse(answer) {
    if (answer == undefined)
        return Promise.reject("smth goes wrong, can't get answer");
    if (answer.response == undefined)
        return Promise.reject(answer.error.error_msg);
    return answer.response;
}


function showGroups(subscriptions) {
    user_info = "Всего интересных страниц: " + subscriptions.length + "\n";
    var newTabLine = "\n" + String.fromCharCode(9);
    for (var i = 0; i < subscriptions.length; i++) {
        element = subscriptions[i]
        user_info += "Группа номер:" + i + newTabLine +
            "Название группы:" + element.name + newTabLine +
            "Ссылка на группу: " + "https://vk.com/id" + element.id + "\n";
    }
    return user_info;
}

function parseUserInfo(subscriptions) {
    user_info = "Всего друзей у пользователя: " + subscriptions.length + "\n";
    var newTabLine = "\n" + String.fromCharCode(9);
    for (var i = 0; i < subscriptions.length; i++) {
        element = subscriptions[i]
        user_info += "Друг:" + i + newTabLine +
            "Имя:" + element.first_name + newTabLine +
            "Фамилия:" + element.last_name + newTabLine +
            "ссылка на страницу: " + "https://vk.com/id" + element.id + "\n";
    }
    return user_info;
}

function getGroupsByIDUrl(groups, key) {
    return Promise.resolve("https://api.vk.com/method/groups.getById?group_ids=" + groups.join(',') +
        "&access_token=" +
        key + "&v=5.52");
}

function getFriendsUrl(userid, key) {
    return Promise.resolve("https://api.vk.com/method/friends.get?user_id=" + userid +
        "&fields=nickname&access_token=" +
        key + "&v=5.52");
}
function getGroupsUrl(userid, key) {
    return Promise.resolve("https://api.vk.com/method/users.getSubscriptions?user_id=" + userid +
        "&fields=name&access_token="
        + key + "&v=5.52");
}

async function GetData(url = '') {
    return await fetch(url, {
        method: 'GET'
    }).then((response) => {
        return response.json();
    });
}