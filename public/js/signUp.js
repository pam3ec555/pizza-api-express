(() => {
  const submitBtn = document.querySelector(`#sign-up-submit-btn`);
  const errorBlock = document.querySelector('#sign-up-form-error');
  if (submitBtn && errorBlock) {
    const onSubmit = () => submitHandler({
      formId: 'sign-up-form',
      url: '/users',
      requestParams: {
        method: `POST`,
      },
      onSuccess: (resp) => {
        if (resp.status === 204) {
          location.href = '/sign-in';
        } else {
          resp.json().then((payload) => {
            errorBlock.classList.remove('hidden');
            errorBlock.innerHTML = JSON.stringify(payload);
            throw new Error();
          });
        }
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
