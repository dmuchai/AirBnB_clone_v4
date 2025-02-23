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

  // Check API status
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  // Function to load places
  function loadPlaces (filters = {}) {
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      data: JSON.stringify(filters),
      contentType: 'application/json',
      success: function (data) {
        $('section.places').empty(); // Clear previous results

        $.each(data, function (index, place) {
          const article = $('<article></article>');

          const title_box = $('<div class="title_box"></div>');
          title_box.append(`<h2>${place.name}</h2>`);
          title_box.append(`<div class="price_by_night">$${place.price_by_night}</div>`);

          const information = $('<div class="information"></div>');
          information.append(`<div class="max_guest">${place.max_guest} Guests</div>`);
          information.append(`<div class="number_rooms">${place.number_rooms} Rooms</div>`);
          information.append(`<div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>`);

          const description = $('<div class="description"></div>').html(place.description);

          article.append(title_box, information, description);

          // Fetch owner data
          $.get('http://0.0.0.0:5001/api/v1/users/' + place.user_id, function (user) {
            const userDiv = $('<div class="owner"></div>').html(`<b>Owner:</b> ${user.first_name} ${user.last_name}`);
            article.append(userDiv);
          });

          $('section.places').append(article);
        });
      }
    });
  }

  // Initial load with empty filters
  loadPlaces({});

  // When the search button is clicked, filter by amenities
  $('button').click(function () {
    loadPlaces({ amenities: Object.keys(checkedAmenities) });
  });
});
