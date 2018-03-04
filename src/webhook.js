'use strict';

const crypto = require('crypto');
const { forwardRouteError } = require('./utils');

function verifyHeaders(req, secret) {
  const event = req.header('X-GitHub-Event');
  const guid = req.header('X-GitHub-Delivery');
  const signature = req.header('X-Hub-Signature');

  if (!event || !guid) {
    return { error: 'missing headers' };
  }

  if (!signature && secret) {
    return { error: 'missing signature' };
  } else if (signature) {
    return { error: 'missing secret' };
  } else if (signature && secret) {
    const data = JSON.stringify(req.body);
    const hash = crypto
      .createHmac('sha1', secret)
      .update(data)
      .digest('hex');
    if (signature !== `sha1=${hash}`) {
      return { error: 'wrong signature' };
    }
  }

  return { event, guid };
}

module.exports = function webhook(options) {
  return forwardRouteError(async (req, res) => {
    const data = req.body;
    const repo = data && data.repository && data.repository.full_name;
    if (!repo) {
      return res.status(400).send({ error: 'missing repo' });
    }

    if (!options[repo]) {
      return res.status(400).send({ error: 'missing options for repo' });
    }

    const { error, event, guid } = verifyHeaders(req, options.secret);
    if (error) {
      return res.status(400).send({ error });
    }

    // TODO: implement
    // processHooks(options, data, event, guid, repo);

    return res.send({ success: true });
  });
};
