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
  button.innerText = 'авторизовать в трело';
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
  window.onload = function () {
    const a = document.querySelector('a.js-open-board');
    const boardHref = a.getAttribute('href');
    const board = boardHref.split('/')[2];

    fetch('https://api.trello.com/1/boards/' + board + '/cards/?fields=dateLastActivity&fields=name,url,idShort&members=true&member_fields=fullName&key=05b346464415bc4c17b95472a274deee&token=' + trello_token)
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
          item.firstChild.classList.remove('hide');
          let units, progress, color, title;
          if(hour <= 24){
            progress = Math.floor(hour/24*100);
            color = 'green';
            title = 'часы';
            units =  Math.floor(hour);
            if (units == 1){
              title = 'час назад';
              units = '';
            }
          }
          if(24 < hour && hour <= 168){
            color = 'blue';
            title = 'дни';
            progress = Math.floor(hour / 24 /7*100);
            units =  Math.floor(hour/24);
            if (units == 1){
              title = 'вчера';
              units = '';
            }
          }
          if(168 < hour && hour <= 720){
            color = 'red';
            title = 'недели';
            progress = Math.floor(hour / 168 /4*100);
            units =  Math.floor(hour/168);

          }
          if(hour > 720 ){
            color = 'black';
            title = 'месяцы';
            progress = Math.floor(hour / 720 /12*100);
            units =  Math.floor(hour/720);

          }
          // item.style.backgroundColor = color;
          // item.setAttribute('title' , title);

          const progressAging = document.createElement('div');
          progressAging.className = 'progress-aging';

          const titleProg = document.createElement('div');
          titleProg.className = 'title';
          titleProg.innerText =  title;

          const scale  = document.createElement('div');
          scale .className = 'scale ';
          scale .style.width = progress + '%';
          scale .style.backgroundColor = color;

          progressAging.appendChild(scale );
          progressAging.appendChild(titleProg);


          item.parentNode.parentNode.appendChild(progressAging);
          item.parentNode.parentNode.setAttribute('title', units );
      })

    })
    .catch(alert);
  }
}


var authenticationSuccess = function () {
  console.log('authenticationSuccess');
  location.reload();
};

var authenticationFailure = function () {
  console.log('Failed authentication');
};

