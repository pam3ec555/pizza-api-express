(() => {
  const submitBtn = document.querySelector(`#order-submit-btn`);
  const errorBlock = document.querySelector('#order-form-error');
  if (submitBtn && errorBlock) {
    const onSubmit = () => submitHandler({
      formId: 'order-form',
      url: '/orders',
      requestParams: {
        method: `POST`,
        headers: { token: auth.token },
      },
      onSuccess: (resp) => {
        resp.json().then((payload) => {
          if (resp.status !== 200) {
            errorBlock.classList.remove('hidden');
            errorBlock.innerHTML = JSON.stringify(payload);
            throw new Error();
          }
          const { message } = payload;
          if (message) {
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
