/* eslint-disable no-underscore-dangle */
const init = () => {
  const name = localStorage.getItem('name');
  if (name) {
    document.getElementById('welcome').innerHTML = `Bienvenido(a) ${name}`;
    loadTweets();
    document.getElementById('private').style.display = 'block';
  } else {
    document.getElementById('public').style.display = 'flex';
  }
};

const loadTweets = () => {
  const url = '/api/tweets';
  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      const tweets = json?.data;
      let html = '';
      tweets.forEach((tweet) => {
        html += `<li>
      <p class='username'>
      <a class="user"  href='users.html?id=${tweet.user?._id}'> ${tweet.user?.name}</a> @${tweet.user?.username}</p>
      <p>${tweet.content}</p>
      <div class="interactionButtons">
      <div class="comments">
      <a class="link comment" href='users.html?id=${tweet?._id}'> <i class="far fa-comment"></i> </a>
      <span>${tweet.comments.length}</span>
      </div>
      <div class="likes">
      <a class="link like" href='#'> <i class="far fa-heart"></i> </a>
      <span>${tweet.likes}</span>
      </div>
      </div>
      <p class='tweet-date'>${tweet.createdAt}</p>
      </li>`;
      });
      document.getElementById('tweets').innerHTML = `<ul>${html}</ul>`;
    });
};

const createUser = () => {
  const url = '/api/users';
  const user = {
    name: document.getElementById('signup_name').value,
    username: document.getElementById('signup_username').value,
    email: document.getElementById('signup_email').value,
    password: document.getElementById('signup_password').value,
    passwordConfirmation: document.getElementById('signup_passwordConfirmation').value,
  };
  const options = {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json',
    },
  };
  fetch(url, options)
    .then((res) => res.json())
    .then(() => {
      document.getElementById('signup_name').value = '';
      document.getElementById('signup_username').value = '';
      document.getElementById('signup_email').value = '';
      document.getElementById('signup_password').value = '';
      document.getElementById('signup_passwordConfirmation').value = '';
    });
};

const login = () => {
  const url = '/api/users/login';
  const user = {
    username: document.getElementById('login_username').value,
    password: document.getElementById('login_password').value,
  };
  const options = {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json',
    },
  };
  fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      if (json.message === 'ok') {
        localStorage.setItem('username', json.data.username);
        localStorage.setItem('name', json.data.name);
        const name = localStorage.getItem('name');
        document.getElementById('message').style.display = 'block'; // yo
        document.getElementById('message').innerHTML = 'user authenticated!';
        document.getElementById('welcome').innerHTML = `Bienvenido(a) ${name}`; // yo
        loadTweets();
        document.getElementById('private').style.display = 'block';
        document.getElementById('public').style.display = 'none';
      } else {
        document.getElementById('login_username').value = '';
        document.getElementById('message').style.display = 'block'; //
        document.getElementById('message').innerHTML = json.message;
      }
      document.getElementById('login_password').value = '';
    });
};

const logout = () => {
  const url = '/api/users/logout';
  fetch(url);
  localStorage.clear();
  document.getElementById('message').innerHTML = '';
  document.getElementById('message').style.display = 'none';
  document.getElementById('private').style.display = 'none';
  document.getElementById('public').style.display = 'flex';
};
