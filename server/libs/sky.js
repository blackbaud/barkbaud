const constituentBaseUri = 'constituent/v1/';
const requestPromise = require('request-promise');

/**
 * Proxy method to the RENXT api.
 * Validates the session before initiating request.
 * @private
 * @name proxy
 * @param {Object} request
 * @param {string} method
 * @param {string} endpoint
 * @param {Object} body
 */
function proxy(request, method, endpoint, body) {
  function makeRequest() {
    return requestPromise({
      json: true,
      method: method,
      body: body,
      timeout: 29000,
      url: 'https://api.sky.blackbaud.com/' + endpoint,
      headers: {
        'bb-api-subscription-key': process.env.AUTH_SUBSCRIPTION_KEY,
        'Authorization': 'Bearer ' + request.session.ticket.access_token
      }
    });
  }

  return makeRequest()
    .catch((error) => {
      return new Promise((resolve, reject) => {
        if (error.response.statuscode === 429) {
          setTimeout(() => {
            resolve(makeRequest());
          }, parseInt(error.response.headers['retry-after']) * 1000);
        } else {
          reject(error);
        }
      });
    });
}

/**
 * Wrap all GET proxy calls.
 * @private
 * @name get
 * @param {Object} request
 * @param {String} endpoint
 */
function get(request, endpoint) {
  return proxy(request, 'GET', endpoint, '');
}

/**
 * Wrap all POST proxy calls.
 * @private
 * @name get
 * @param {Object} request
 * @param {String} endpoint
 */
function post(request, endpoint, body) {
  return proxy(request, 'POST', endpoint, body);
}

/**
 * Wrap all PATCH proxy calls.
 * @private
 * @name patch
 * @param {Object} request
 * @param {String} endpoint
 */
function patch(request, endpoint, body) {
  return proxy(request, 'PATCH', endpoint, body);
}

/**
 * Wrap all DELETE proxy calls.
 * @private
 * @name delete
 * @param {Object} request
 * @param {String} endpoint
 */
function del(request, endpoint) {
  return proxy(request, 'DELETE', endpoint, '');
}

/**
 * Gets the requested constituent.
 * @name getConstituent
 * @param {Object} request
 * @param {string} constituentId Id of the constituent to retrieve
 */
function getConstituent(request, constituentId) {
  return get(request, `${constituentBaseUri}constituents/${constituentId}`);
}

/**
 * Gets the constituent note types.
 * @name getConstituentNoteTypes
 * @param {Object} request
 */
function getConstituentNoteTypes(request) {
  return get(request, `${constituentBaseUri}notetypes`);
}

/**
 * Searches for a constituent.
 * @name getConstituent
 * @param {Object} request
 * @param {string} name Name of the constituent to search for.
 */
function getConstituentSearch(request, name) {
  return get(request, `${constituentBaseUri}constituents/search?search_text=${name}`);
}

/**
 * Searches for a constituent.
 * @name getConstituent
 * @param {Object} request
 * @param {string} name Name of the constituent to search for.
 */
function getConstituentByIds(request, ids) {
  const searchIds = ids.map(id => `constituent_id=${id}`).join('&');
  const url = `${constituentBaseUri}constituents?${searchIds}`;
  return get(request, url);
}

/**
 * Gets the requested constituent profile picture.
 * @name getConstituentProfilePicture
 * @param {Object} request
 * @param {string} constituentId Id of the constituent to retrieve
 */
function getConstituentProfilePicture(request, constituentId) {
  return get(request, `${constituentBaseUri}constituents/${constituentId}/profilepicture`);
}

/**
 * Posts a note to the specified constituent
 * @name postNotes
 * @param {Object} request
 * @param {string} constituentId Id of the constituent to retrieve
 */
function postNotes(request, body) {
  return post(request, `${constituentBaseUri}notes`, body);
}

/**
 * Gets ratings for a constituent
 * @name getConstituentRatings
 * @param {Object} request
 * @param {string} constituentId Id of the constituent to retrieve
 */
function getConstituentRatings(request, constituentId) {
  return get(request, `${constituentBaseUri}${constituentId}/ratings`);
}

/**
 * Gets the list of rating categories
 * @name getConstituentRatingCategories
 * @param {Object} request
 * @param {string} sources Name of the source associated with the category
 */
function getConstituentRatingCategories(request, sourceName) {
  return get(request, `${constituentBaseUri}/ratings/categories?source_name=${sourceName}` || '');
}

/**
 * Gets the list of rating sources
 * @name getConstituentRatingSources
 * @param {Object} request
 */
function getConstituentRatingSources(request) {
  return get(request, `${constituentBaseUri}/ratings/sources`);
}

/**
 * Gets the list values for a rating category
 * @name getConstituentRatingCategoryValues
 * @param {Object} request
 * @param {string} categoryName
 * @param {string} sourceName
 */
function getConstituentRatingCategoryValues(request, categoryName, sourceName) {
  let optional = '';

  if (sourceName) {
    optional = '&source_name=' + encodeURIComponent(sourceName);
  }

  return get(request, `${constituentBaseUri}ratings/categories/values?category_name=${encodeURIComponent(categoryName)}${optional}`);
}

/**
 * Creates a constituent rating
 * @name postConstituentRating
 * @param {Object} request
 */
function postConstituentRatings(request, body) {
  return post(request, `${constituentBaseUri}ratings`, body);
}

/**
 * Updates a constituent rating
 * @name patchConstituentRating
 * @param {Object} request
 * @param {string} ratingId Id of the rating to edit
 */
function patchConstituentRating(request, ratingId, body) {
  return patch(request, `${constituentBaseUri}ratings/${ratingId}`, body);
}

/**
 * Deletes a rating from a constituent
 * @name getConstituentRatings
 * @param {Object} request
 * @param {string} ratingId Id of the rating to delete
 */
function deleteConstituentRating(request, ratingId) {
  return del(request, `${constituentBaseUri}ratings/${ratingId}`);
}

module.exports = {
  getConstituent,
  getConstituentByIds,
  getConstituentNoteTypes,
  getConstituentSearch,
  getConstituentProfilePicture,
  postNotes,
  getConstituentRatings,
  getConstituentRatingCategories,
  getConstituentRatingSources,
  getConstituentRatingCategoryValues,
  postConstituentRatings,
  patchConstituentRating,
  deleteConstituentRating
};
