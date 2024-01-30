const $body = $("body");
const $random_list = $("#random_list");
const $catch_button = $("#catch-em-all");
let baseURL = "https://pokeapi.co/api/v2/pokemon";

function randomInts(num) {
  let threeInts = [];
  while (threeInts.length < 3) {
    const randNum = Math.floor(Math.random() * num);
    if (!threeInts.includes(randNum)) {
      threeInts.push(randNum);
    }
  }
  return threeInts;
}

$catch_button.on("click", function (e) {
  e.preventDefault();
  $random_list.empty();
  axios.get(baseURL).then((res) => {
    let poke_promises = [];
    let random_mon_ids = randomInts(res.data.count);

    poke_promises.push(axios.get(`${baseURL}?limit=${res.data.count}`));

    Promise.all(poke_promises).then((res) => {
      $pokeDex = res[0].data.results;
      let randPokeURLArr = [];

      for (ids of random_mon_ids) {
        let $new_rand_poke = $(
          `<div class="pokerow_div" id="pokeDiv_${$pokeDex[ids].name}">`
        );
        let $new_rand_poke_name = $(
          `<p class="poke-name" id="${$pokeDex[ids].name}">`
        ).text($pokeDex[ids].name);
        $new_rand_poke.append($new_rand_poke_name);
        $random_list.append($new_rand_poke);

        randPokeURLArr.push(axios.get($pokeDex[ids].url));
      }

      Promise.all(randPokeURLArr).then((urlres) => {
        let flavorTextPromises = [];
        for (res of urlres) {
          $new_poke_sprite = $(
            `<img class="poke-image" src="${res.data.sprites.front_default}">`
          );

          let $pokediv = $(`#pokeDiv_${res.data.name}`);
          let $entrydiv = $(`<div class="entry-${res.data.species.name}">`);

          $pokediv.append($new_poke_sprite);
          $pokediv.append($entrydiv);
          flavorTextPromises.push(axios.get(res.data.species.url));
        }

        Promise.all(flavorTextPromises).then((textRes) => {
          for (res of textRes) {
            let text = res.data.flavor_text_entries;
            let english_text = text.filter(function (val) {
              return val.language.name == "en";
            });

            if (english_text.length === 0) {
              let $no_entry = $(
                `<p class="pokeText pokeEntry-${res.data.name}">`
              ).text("No entries have been added yet");
              let $entrydiv = $(`.entry-${res.data.name}`);
              $entrydiv.append($no_entry);
            } else {
              let $new_entry = $(
                `<p class="pokeText pokeEntry-${res.data.name}">`
              ).text(english_text[0].flavor_text);
              let $entrydiv = $(`.entry-${res.data.name}`);
              $entrydiv.append($new_entry);
            }
          }
        });
      });
    });
  });
});
