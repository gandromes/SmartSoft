"use strict";
// mybase utils any project
var _ = {
    len: (any) => any.length,
    log: (any) => console.log(any),
    error: (any) => console.error(any),
    empty: ''
}
// CONST
var MINLETTERUSERFORM = 3;
var SERVERURL = 'http://127.0.0.1';
var PATHREVIEWICON = "reviewicon.png"


// FORM helpblock
document.getElementById("helpblock").addEventListener('submit', function (e){
    e.preventDefault();

    var name    = this['name'].value.trim();
    var surname = this['surname'].value.trim();
    var message = this['message'].value.trim();
    var email   = this['email'].value.trim();

    if (_.len(name) < MINLETTERUSERFORM) {
        Swal.fire({
            icon: 'warning',
            title: 'Ошибка',
            text: 'Поле Имя должно содержать не менее 3 символов!'
        })
    }
    else if (_.len(surname) < MINLETTERUSERFORM) {
        if (surname !== _.empty) { // по тз фамилия не обезательное поле.
            Swal.fire({
                icon: 'warning',
                title: 'Ошибка',
                text: 'Поле Фамилия должна содержать не менее 3 символов!',
            })
        }
    }
    else if (email == _.empty) {
        Swal.fire({
            icon: 'warning',
            title: 'Ошибка',
            text: 'Поле почты не должно быть пустым!'
        })
    }
    else if (message == _.empty) {
        Swal.fire({
            icon: 'warning',
            title: 'Ошибка',
            text: 'Сообщение не должно быть пустым!',
        })
    }
    else {
        Swal.fire({
            icon: 'success',
            title: 'Сообщение отправлено, ожидайте ответа'
        })
    }

    fetch(SERVERURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, surname, email, message })
    })
    .then(response => {
        _.log("Ок:", response);
    })
    .catch(error => {
        _.error("Ошибка:", error);
    });
})

// FORM orderblock
document.getElementById('orderblock').addEventListener('submit', function (e){
    e.preventDefault();

    var name    = this.elements['full_name'].value.trim();
    var address = this.elements['delivery_address'].value.trim();
    var comment = this.elements['comment'].value.trim();
    var ischeck = this.elements['terms_agreement'].checked;

    if (_.len(name) < MINLETTERUSERFORM) {
        Swal.fire({
            icon: 'warning',
            title: 'Ошибка',
            text: 'Имя должно содержать не менее 3 символов!'
        })
    }
    // Странно должна быть проверка на адрес так как адрес доставки заказа важнейший параметр
    else if (!ischeck) {
            Swal.fire({
            icon: 'warning',
            title: 'Ошибка',
            text: 'Необходимо принять условия договора-оферты'
        })
    }
    else { 
        Swal.fire({
            title: 'Ваш заказ создан!',
            html: `
            <p><strong>Имя:</strong> ${name}</p>
            <p><strong>Адрес:</strong> ${address}</p>
            <p><strong>Комментарий:</strong> ${comment || 'Отсутствует'}</p>
            `,
            icon: 'success',
        });
    }


    fetch(SERVERURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, address, comment})
  })
    .then(response => {
      console.log("Успех:", response);
    })
    .catch(error => {
      console.error("Ошибка:", error);
    });


})

// ПОДГРУЗКА ОТЗЫВОВ
fetch('reviews.json')
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('проблемы с подключением к сети!');
    })
    .then(data => {
        
        var reviewsusersblock = document.getElementById('reviewsusersblock');

        data.forEach(user => {
            var review = document.createElement('div');
            review.className = 'review';

            review.innerHTML = `
            <img class="reviewicon" src="${PATHREVIEWICON}" alt="Отзыв">
            <div class="reviewinfoblock">
                <p class="reviewusername">${user.username}</p>
                <p class="reviewtext">${user.text}</p>
            </div>
            `;

            reviewsusersblock.appendChild(review);
        })

    })
    .catch(error => {
        console.error('Ошибка:', error);
    });