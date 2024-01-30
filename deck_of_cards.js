const $body = $("body");
const $deck_info = $("#deck_info");
const $back_of_deck = $("#back_of_deck");
const $draw_card_button = $("#draw_card_button");
const $shuffle_deck_button = $("#shuffle_deck_button");
const $card_images = $("#card_images");
const $card_type = $("#card_type");

let baseURL = "https://deckofcardsapi.com/api/deck";

$body.ready(
  axios.get(`${baseURL}/new/shuffle/?deck_count=1`).then((deck) => {
    $deck_info.text(`${deck.data.remaining} cards left`);

    $draw_card_button.on("click", function (e) {
      e.preventDefault();

      axios
        .get(`${baseURL}/${deck.data.deck_id}/draw?count=1`)
        .then((card) => {
          $deck_info.text(`${card.data.remaining} cards left`);
          $card_type.text(
            `You drew the ${card.data.cards[0].value} of ${card.data.cards[0].suit}`
          );

          let $new_card_image = $(`<img src=${card.data.cards[0].image}>`);
          $card_images.prepend($new_card_image);
          if (card.data.remaining == 0) {
            setInterval(function () {
              $card_type.text(``);
            }, 5000);
            $back_of_deck.hide();
            $draw_card_button.hide();
            $shuffle_deck_button.show();
          }
        })
        .catch((err) => {
          console.log(err);
          $card_type.text("No Cards Left In the Deck");
        });
    });

    $shuffle_deck_button.on("click", function (e) {
      e.preventDefault();
      axios.get(`${baseURL}/${deck.data.deck_id}/shuffle/`).then((shuffle) => {
        $card_images.empty();
        $back_of_deck.show();
        $draw_card_button.show();
        $shuffle_deck_button.hide();
        $deck_info.text(`${shuffle.data.remaining} cards left`);
        $card_type.text("");
      });
    });
  })
);

// axios
//   .get(`${baseURL}/new/shuffle/?deck_count=1`)
//   .then((deck) => {
//     console.log("Draw a card from the deck!");
//     console.log(deck.data);
//     return axios.get(`${baseURL}/${deck.data.deck_id}/draw?count=1`);
//   })
//   .then((card) => {
//     console.log(card.data);
//     console.log(
//       `You drew the ${card.data.cards[0].value} of ${card.data.cards[0].suit}!`
//     );
//     return axios.get(`${baseURL}/${card.data.deck_id}/draw?count=1`);
//   })
//   .then((card) => {
//     console.log(card.data);
//     console.log(
//       `You drew the ${card.data.cards[0].value} of ${card.data.cards[0].suit}!`
//     );
//   });
