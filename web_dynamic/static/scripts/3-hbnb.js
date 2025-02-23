$(document).ready(function () {
  const checkedAmenities = {};

  $('input[type="checkbox"]').change(function () {
    const amenityId = $(this).attr('data-id');
    const amenityName = $(this).attr('data-name');

    if (this.checked) {
      checkedAmenities[amenityId] = amenityName;
    } else {
      delete checkedAmenities[amenityId];
    }

    // Update the h4 inside the amenities div
    const amenityList = Object.values(checkedAmenities).join(', ');
    $('.amenities h4').text(amenityList);
  });

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
      console.log('Available off');
    }
  });
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'POST',
    data: JSON.stringify({}),
    contentType: 'application/json',
    success: function (data) {
      $.each(data, function (index, place) {
        const article = $('<article></article>');

        const title_box = $('<div></div>');
        const name = $('<h2></h2>').text(place.name);
        const price_by_night = $('<div></div>').text(place.price_by_night);
        title_box.append(name, price_by_night);

        const information = $('<div></div>');
        const max_guest = $('<div></div>').text(place.max_guest);
        const number_rooms = $('<div></div>').text(place.number_rooms);
        const number_bathrooms = $('<div></div>').text(place.number_bathrooms);
        information.append(max_guest, number_rooms, number_bathrooms);

        const urri = '/http://0.0.0.0:5001/api/v1/users/' + place.user_id;
        $.get(urrl, function (data) {
          const user = $('<div></div>');
          user.html('<b>Owner:</b>' + data.first_name + data.last_name);
        });

        const description = $('<div></div>').text(place.description);

        article.append(title_box, information, user, description);

        $('section .places').append(article);
      });
    }
  });
});
