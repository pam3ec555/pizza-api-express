(() => {
  const submitBtn = document.querySelector(`#sign-in-submit-btn`);
  const errorBlock = document.querySelector('#sign-in-form-error');
  if (submitBtn && errorBlock) {
    const onSubmit = () => submitHandler({
      formId: 'sign-in-form',
      url: '/login',
      requestParams: {
        method: `POST`,
      },
      onSuccess: (resp) => {
        resp.json().then((payload) => {
          if (resp.status !== 200) {
            errorBlock.classList.remove('hidden');
            errorBlock.innerHTML = JSON.stringify(payload);
            throw new Error();
          }
          const { token } = payload;
          if (token) {
            auth.token = token;
            location.href = '/';
            if (!errorBlock.classList.contains('hidden')) {
              errorBlock.classList.remove('hidden');
              errorBlock.innerHTML = '';
            }
          } else {
            throw new Error('Server error');
          }
        });
      },
    });
    submitBtn.onclick = () => {
      onSubmit();
    };
    window.onkeypress = (e) => {
      if (e.keyCode === 13) {
        onSubmit();
      }
    }
  }
})();
