function addToCartHandler(id, name) {
  openModal({
    title: name,
    content: `<input type="number" id="pizza-count-field" value="1" min="1"/>`,
    onSuccess: () => {
      const countField = document.querySelector('#pizza-count-field');
      if (countField && +countField.value >= 1 && typeof id === 'number') {
        fetch('/cart', {
          method: 'POST',
          body: JSON.stringify({ itemId: id, count: +countField.value }),
          headers: { token: auth.token },
        })
          .then((resp) => {
            switch (resp.status) {
              case 204:
                alert(`${name} successfully added to cart!`);
                break;
              case 401:
                auth.reset();
                location.href = '/sign-in';
                break;
              default:
                alert('Some error');
            }
          })
          .finally(() => closeModal());
      } else {
        closeModal();
      }
    },
  });
}

(async () => {
  const listElem = document.querySelector('#menu-list');
  const emptyListMessageElem = document.querySelector('#menu-empty-list-message');
  if (listElem && emptyListMessageElem) {
    const data = await fetch('/menu').then(resp => resp.json());
    if (Array.isArray(data) && data.length > 0) {
      emptyListMessageElem.remove();
      listElem.innerHTML = data.reduce((result, { image, name, price, size, id }) => {
        return result + `<li class="menu__item">
    <img src="${image}" alt="" class="menu__item-image">
    <h4 class="menu__item-title">${name}</h4>
    <div class="menu__item-info">
        <span>Price: $${price}</span>
        <span>Size: ${size}</span>
    </div>
    ${auth.isLoggedIn ?
      `<button class="btn" type="button" onclick="addToCartHandler(${id}, '${name}')">Add to cart</button>` :
      ``
    }
</li>`
      }, '');
    }
  }
})();
