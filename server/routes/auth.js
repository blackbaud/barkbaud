const crypto = require('crypto');
const oauth2 = require('simple-oauth2').create({
  client: {
    id: process.env.AUTH_CLIENT_ID,
    secret: process.env.AUTH_CLIENT_SECRET
  },
  auth: {
    tokenHost: process.env.AUTH_SITE_URL || 'https://oauth2.sky.blackbaud.com',
    tokenPath: process.env.AUTH_TOKEN_PATH || '/token',
    authorizePath: process.env.AUTH_PATH || '/authorization'
  }
});

// A bit hacky, but needed currently to support Heroku Preview Apps
// You will need to manually add each pr-preview URL to your app's redirect URI list.
const redirectURI = process.env.HEROKU_APP_NAME 
  ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com/auth/callback` 
  : process.env.AUTH_REDIRECT_URI;


// Properties we expose from the JWT to our session
const jwtToSessionProps = [
  'environment_id',
  'environment_name',
  'legal_entity_id',
  'legal_entity_name',
  'user_id',
  'email',
  'family_name',
  'given_name'
];

/**
 *
 * @name checkSession
 * @param {Object} request
 * @param {Object} response
 * @param {Object} next
 */
function checkSession(request, response, next) {
  validate(request, function (valid) {
    if (valid) {
      next();
    } else {
      response.sendStatus(401);
    }
  });
}

/**
 * An interface for our front-end to see if we're authenticated.
 * @name getUser
 * @param {Object} request
 * @param {Object} response
 */
function getUser(request, response) {
  validate(request, function (success) {
    const json = {
      authenticated: success
    };

    if (success) {
      jwtToSessionProps.forEach(key => {
        json[key] = request.session.ticket[key];
      });
    }

    response.json(json);
  });
}

/**
 * Prepares our initial request to the oauth endpoint and redirects the user.
 * Handles an optional "redirect" querystring parameter, which we redirect to in getCallback.
 * @name getLogin
 * @param {Object} request
 * @param {Object} response
 */
function getLogin(request, response) {
  request.session.redirect = request.query.redirect;
  request.session.state = crypto.randomBytes(48).toString('hex');

  const authorizationUri = oauth2.authorizationCode
    .authorizeURL({
      state: request.session.state,
      redirect_uri: redirectURI
    });

  response.redirect(authorizationUri);
}

/**
 * Handles oauth response.
 * Validates the code and state querystring params.
 * Exchanges code for an access token and redirects user back to app home.
 * @name getCallback
 * @param {Object} request
 * @param {Object} response
 */
function getCallback(request, response) {
  const redirect = request.session.redirect || '/';
  let error;

  console.log(request.session, 'vs', request.query);

  if (request.query.error) {
    error = request.query.error;
  } else if (!request.query.code) {
    error = 'auth_missing_code';
  } else if (!request.query.state) {
    error = 'auth_missing_state';
  } else if (request.session.state !== request.query.state) {
    error = 'auth_invalid_state';
  }

  if (!error) {
    const options = {
      code: request.query.code,
      redirect_uri: redirectURI
    };

    oauth2.authorizationCode.getToken(options, function (errorToken, ticket) {
      if (errorToken) {
        error = errorToken.message;
      } else {
        request.session.redirect = '';
        request.session.state = '';

        saveTicket(request, ticket);
        response.redirect(redirect);
      }
    });
  }

  if (error) {
    const delimiter = redirect.indexOf('?') > -1 ? '&' : '?';
    const url = redirect + delimiter + 'error=' + error;
    response.redirect(url);
  }
}

/**
 * Revokes the tokens, clears our session, and redirects the user.
 * Handles an optional "redirect" querystring parameter.
 * @name getCallback
 * @param {Object} request
 * @param {Object} response
 */
function getLogout(request, response) {
  const redirect = request.query.redirect || '/';

  function go() {
    request.session.destroy();
    response.redirect(redirect);
  }

  if (!request.session.ticket) {
    go();
  } else {
    const token = oauth2.accessToken.create(request.session.ticket);
    token.revoke('access_token', function () {
      token.revoke('refresh_token', go);
    });
  }
}

/**
 * Internal function for saving ticket + expiration.
 * @internal
 * @name saveTicket
 * @param {Object} request
 * @param {Object} ticket
 */
function saveTicket(request, ticket) {
  request.session.ticket = ticket;
  request.session.expires = (new Date().getTime() + (1000 * ticket.expires_in));
}

/**
 *
 * @internal
 * @name validate
 * @param {Object} request
 * @param {Object} onComplete
 */
function validate(request, onComplete) {
  if (request && request.session && request.session.ticket && request.session.expires) {
    const dtCurrent = new Date();
    const dtExpires = new Date(request.session.expires);

    if (dtCurrent >= dtExpires) {
      console.log('BARKBAUD - Token expired');
      try {
        const token = oauth2.accessToken.create(request.session.ticket);
        token.refresh(function (error, ticket) {
          if (!ticket || !ticket.token) {
            return onComplete(false);
          }

          saveTicket(request, ticket.token);
          return onComplete(!error);
        });
      } catch (e) {
        onComplete(false);
      }
    } else {
      onComplete(true);
    }
  } else {
    onComplete(false);
  }
}

module.exports = {
  checkSession,
  getCallback,
  getLogin,
  getLogout,
  getUser
};
