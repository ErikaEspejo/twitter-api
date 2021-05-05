/* eslint-disable no-underscore-dangle */
const loadTweets = () => {
  const url = '/api/tweets';
  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      const tweets = json?.tweets;
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
                      <a class="link like" href='users.html?id=${tweet?._id}'> <i class="far fa-heart"></i> </a>
                      <span>${tweet.likes}</span>
                    </div>
                  </div>
                  <p>${tweet.createdAt}</p>
                </li>`;
      });
      document.getElementById('tweets').innerHTML = `<ul>${html}</ul>`;
    });
};

const createUser = () => {
  const url = '/api/users';
  const user = {
    name: document.getElementById('name').value,
    username: document.getElementById('username').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    passwordConfirmation: document.getElementById('passwordConfirmation').value,
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
      document.getElementById('name').value = '';
      document.getElementById('username').value = '';
      document.getElementById('email').value = '';
      document.getElementById('password').value = '';
      document.getElementById('passwordConfirmation').value = '';
    });
};
