const arrAging = [];
const trello_token = localStorage.getItem('trello_token');
if (!trello_token) {
  var script = document.createElement('script');
  script.src = 'https://api.trello.com/1/client.js?key=05b346464415bc4c17b95472a274deee';
  document.getElementsByTagName('head')[0].appendChild(script);

  const button = document.createElement('button');
  button.style.position = 'absolute';
  button.style.top = '200px';
  button.style.left = '200px';
  button.innerText = 'авторизовать в трело'
  button.onclick = () => {

    var trello_token = localStorage.getItem('trello_token');
    if (!trello_token) {

      window.Trello.authorize({
        type: 'popup',
        name: 'card life progress',
        scope: {
          read: 'true',
          write: 'true'
        },
        expiration: 'never',
        success: authenticationSuccess,
        error: authenticationFailure
      });
    }
  };
  document.body.appendChild(button);

} else {
  fetch('https://api.trello.com/1/boards/QMD3GB8y/cards/?fields=dateLastActivity&fields=name,url,idShort&members=true&member_fields=fullName&key=05b346464415bc4c17b95472a274deee&token=' + trello_token)
    .then(function (response) {

      return response.json();
    })
    .then(function (response) {
      const now = Date.now();
      response.forEach(item => {
        let time = Math.round((now - Date.parse(item.dateLastActivity)) / (3600 * 1000 ));
        item.time = time;
        // console.log('name ' + item.name + ' idShort = ' + item.idShort + ' | время с последнего обновления - ' + time);
        // console.log(item.url.substr(18));
        arrAging[item.idShort] = item;
      });
        return arrAging;
    })
    .then(res => {
      const listCardTitles = document.querySelectorAll('.list-card-title');
      listCardTitles.forEach(item => {
        const hour = +res[item.firstChild.innerText.substr(1)].time;
        let color, title;
        if(hour <= 24){
          color = 'green';
          title = 'день';
        }
        if(24 < hour && hour <= 168){
          color = 'blue';
          title = 'неделя';

        }
        if(168 < hour && hour <= 720){
          color = 'red';
          title = 'месяц';

        }
        if(hour > 720 ){
          color = 'black';
          title = 'более месяца';
        }
        item.style.backgroundColor = color;
        item.setAttribute('title' , title);
      })
    })
    .catch(alert);
}


var authenticationSuccess = function () {
  console.log('authenticationSuccess');
  location.reload();
};

var authenticationFailure = function () {
  console.log('Failed authentication');
};

