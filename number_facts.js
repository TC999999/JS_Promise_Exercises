const $my_favorite_number_fact = $("#my_favorite_number_fact");
const $random_facts_list = $("#random_facts_list");
const $favorite_facts_list = $("#favorite_facts_list");
const $fav_number_form = $("#fav_number_form");
const $fav_number_input = $("#fav_number_input");
const $submit_number = $("#submit_number");

let baseURL = "http://numbersapi.com";

axios.get(`${baseURL}/15?json`).then((fact) => {
  let $new_fact = $("<li>").text(`${fact.data.text}`);
  $my_favorite_number_fact.append($new_fact);
});

const random_num_promises = [];
let favorite_num_promises = [];

for (let i = 0; i < 4; i++) {
  random_num_promises.push(axios.get(`${baseURL}/random?json`));
}

Promise.all(random_num_promises)
  .then((num_facts) => {
    for (fact of num_facts) {
      let $new_fact = $("<li>").text(`${fact.data.text}`);
      $random_facts_list.append($new_fact);
    }
  })
  .catch((err) => console.log(err));

$submit_number.on("click", function (e) {
  e.preventDefault();
  $favorite_facts_list.empty();
  let $num = $fav_number_input.val();
  let $str_num = $num.toString();
  for (let i = 0; i < 4; i++) {
    favorite_num_promises.push(axios.get(`${baseURL}/${$str_num}?json`));
  }
  $fav_number_input.val("");

  Promise.all(favorite_num_promises)
    .then((num_facts) => {
      for (fact of num_facts) {
        let $new_fact = $("<li>").text(`${fact.data.text}`);
        $favorite_facts_list.append($new_fact);
      }
    })
    .catch((err) => console.log(err));

  favorite_num_promises = [];
});
