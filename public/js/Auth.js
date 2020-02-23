class Auth {
  constructor() {
    this._token = localStorage.getItem('token');
    this._isLoggedIn = !!this._token;
    this._userData = null;
    this._init();
  }

  async _init() {
    await this._profile();
    this._initLogoutBtn();
  }

  _profile() {
    return fetch('/profile', {
      headers: this._getHeaders(),
    })
      .then(resp => {
        if (resp.status === 200) {
          return resp.json();
        } else {
          throw new Error();
        }
      })
      .then(data => this._userData = { ...data })
      .catch(() => this.reset())
      .finally(() => {
        this._toggleBodyClassName();
      });
  }

  _initLogoutBtn() {
    const logoutBtn = document.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.onclick = () => {
        fetch('/logout', {
          method: 'POST',
          headers: this._getHeaders(),
        })
          .finally(() => {
            this.reset();
          });
      };
    }
  }

  _getHeaders() {
    return { token: this._token };
  }

  _toggleBodyClassName() {
    if (this._isLoggedIn) {
      document.body.classList.add('logged-in');
      document.body.classList.remove('guest');
    } else {
      document.body.classList.add('guest');
      document.body.classList.remove('logged-in');
    }
  }

  get token() {
    return this._token;
  }

  set token(token) {
    localStorage.setItem('token', token);
    this._token = token;
    this._toggleBodyClassName();
  }

  get isLoggedIn() {
    return this._isLoggedIn;
  }

  reset() {
    localStorage.removeItem('token');
    this._token = null;
    this._isLoggedIn = false;
    this._userData = null;
    this._toggleBodyClassName();
  }
}

const auth = new Auth();
