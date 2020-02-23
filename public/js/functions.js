function closeModal() {
  const modal = document.querySelector('#modal');
  if (modal) {
    modal.remove();
  }
}

/**
 * @param {string} template
 * @return {DocumentFragment}
 */
function createElement(template) {
  const frag = document.createDocumentFragment();
  const emptyElem = document.createElement(`DIV`);
  emptyElem.innerHTML = template;
  Array.from(emptyElem.childNodes).forEach((child) => {
    frag.appendChild(child);
  });

  return frag;
}

/**
 * @param {string} title
 * @param {string} content
 * @param {function} onSuccess
 */
function openModal({
  title,
  content,
  onSuccess,
}) {
  const template = `<div class="modal" id="modal">
  <div class="modal__block">
    <div class="modal__title-wrap">
      <h3 class="modal__title">${title}</h3>
    </div>
    <div class="modal__content">${content}</div>
    <div class="modal__control">
      <button class="btn btn--white" id="modal-accept-btn">Accept</button>
      <button class="btn btn--white" onclick="closeModal()">Cancel</button>
    </div>
  </div>
  <div class="modal__overlay" onclick="closeModal()"></div>
</div>`;
  document.body.appendChild(createElement(template));

  const acceptBtn = document.querySelector('#modal-accept-btn');
  if (acceptBtn) {
    acceptBtn.onclick = onSuccess;
  }
}

/**
 * @param {string} formId
 * @param {string} url
 * @param {RequestInit?} [requestParams={}]
 * @param {function(resp: Response)?} onSuccess
 * @param {function?} onError
 */
function submitHandler({
  formId,
  url,
  requestParams = {},
  onSuccess,
  onError,
}) {
  const form = document.getElementById(formId);
  if (form && url) {
    const fields = form.querySelectorAll('input');
    const values = {};
    fields.forEach((field) => {
      const value = field.type === 'number' ? +field.value : field.value;
      values[field.name] = value;
    });
    fetch(url, { ...requestParams, body: JSON.stringify(values) })
      .then((reps) => {
        if (onSuccess) {
          onSuccess(reps);
        }
      })
      .catch((err) => {
        if (onError) {
          onError(err);
        }
      });
  }
}
