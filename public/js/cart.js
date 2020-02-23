(async () => {
  const listElem = document.querySelector('#cart-list');
  const emptyListMessageElem = document.querySelector('#cart-empty-list-message');
  const resultBlock = document.querySelector('#cart-result-block');
  const resultTotal = document.querySelector('#cart-result-total');
  if (listElem && emptyListMessageElem && resultBlock && resultTotal) {
    const listState = {
      total: 0,
      items: [],
    };
    let menuData = [];

    const updateTotal = () => {
      listState.total = listState.items.reduce((result, { count, price }) => {
        return result + (count * price);
      }, 0);
      resultTotal.innerHTML = listState.total;
    };

    const initializeListState = (data) => {
      listState.items = data.map(({ itemId, count }) => {
        const item = menuData.find(({ id }) => id === itemId);
        if (item) {
          const { price } = item;

          return { price, count, id: itemId };
        }

        return null;
      }).filter(item => item);

      updateTotal();
    };

    const removePizza = (itemId) => {
      listState.items = listState.items.filter(({ id }) => id !== itemId);
      updateTotal();
    };

    const changeCountOfPizza = (itemId, count) => {
      listState.items = listState.items.map((item) => itemId === item.id ? ({ ...item, count }) : item);
      updateTotal();
    };

    menuData = await fetch('/menu').then(resp => resp.json());
    if (Array.isArray(menuData) && menuData.length > 0) {
      const data = await fetch('/cart', {
        headers: { token: auth.token },
      }).then(resp => resp.json());
      if (Array.isArray(data) && data.length > 0) {
        emptyListMessageElem.remove();

        initializeListState(data);

        resultBlock.classList.remove('hidden');

        listElem.innerHTML = data.reduce((result, { count, itemId }) => {
          const item = menuData.find(({ id }) => itemId === id);
          if (!item) {
            return result;
          }

          return result + `<li class="cart__item" id="item-${itemId}">
    <span class="cart__item-title">${item.name}</span>
    <input class="cart__item-count" type="number" id="count-field-${itemId}" value="${count}" min="1">
    <button type="button" class="btn" id="delete-btn-${itemId}">Remove</button>
</li>`
        }, '');

        data.forEach(({ itemId }) => {
          const countField = document.getElementById(`count-field-${itemId}`);
          const deleteBtn = document.getElementById(`delete-btn-${itemId}`);
          const itemElem = document.getElementById(`item-${itemId}`);
          const item = menuData.find(({ id }) => itemId === id);

          if (countField && deleteBtn && itemElem && item) {
            deleteBtn.onclick = () => {
              fetch(`cart?itemId=${itemId}`, {
                method: 'DELETE',
                headers: { token: auth.token },
              })
                .then((resp) => {
                  if (resp.status === 204) {
                    itemElem.remove();
                    removePizza(itemId);
                  } else {
                    alert('Oops. Server error. Try again later');
                  }
                });
            };

            countField.onchange = (e) => {
              const { value } = e.target;
              if (value) {
                const count = +value;

                fetch(`cart?itemId=${itemId}`, {
                  method: 'PUT',
                  body: JSON.stringify({ count }),
                  headers: { token: auth.token },
                })
                  .then((resp) => {
                    if (resp.status !== 204) {
                      alert('Oops. Server error. Try again later');
                    } else {
                      changeCountOfPizza(itemId, count);
                    }
                  });
              }
            };
          }
        });
      }
    }
  }
})();
