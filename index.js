const includes = require("lodash/includes");
const some = require("lodash/some");
const flatten = require("lodash/flatten");
const chalk = require("chalk");

module.exports = function(vorpal) {
  vorpal
    .command("slack-links")
    .alias("sll")
    .description("Gather links posted on slack in channels you're in")
    .action(function(args, callback) {
      gatherLinks(vorpal, callback);
    });
};

function gatherLinks(vorpal, callback) {
  const { WebClient } = require("@slack/client");

  const token = vorpal.config.slackLinks.token;

  const client = new WebClient(token);

  getChannelList(client)
    .then(channelList => {
      return Promise.all(
        channelList.channels.map(channel =>
          getChannelMessages(client, channel.id)
        )
      );
    })
    .then(flatten)
    .then(messages => messages.map(getUrlsInMessage))
    .then(flatten)
    .then(urls => urls.filter(shouldKeepUrl(vorpal)))
    .then(urls => {
      const result = urls.map(url => chalk.blue(url)).join("\n");
      callback(result);
    })
    .catch(e => callback("ERROR", e));
}

function getChannelList(client) {
  return client.channels.list();
}

function getChannelMessages(client, channelId) {
  return client.channels
    .history(channelId)
    .then(channelHistory =>
      channelHistory.messages.map(message => message.text)
    );
}

function getUrlsInMessage(message) {
  const regexp = /<http[^>]*>/g;
  const urls = message.match(regexp);
  return urls ? urls.map(url => url.slice(1, -1)) : [];
}

function shouldKeepUrl(vorpal) {
  const textsToExclude = vorpal.config.excludeIfContains;
  return function(url) {
    return !some(textsToExclude, textsToExclude =>
      includes(url, textsToExclude)
    );
  };
}

//Exemple de texte contenant une URL
// {
//   text: "Super lien <http://mashable.france24.com/tech-business/20180213-robots-jeux-olympique-ski-coree-sud?ref=tw_i> et aussi <https://qt-creator.developpez.com/actu/186968/Sortie-de-Qt-Creator-4-6-Beta-avec-un-modele-de-code-Cplusplus-Clang-mis-a-jour-pour-Cplusplus17-et-une-integration-avec-l-analyseur-statique-Clazy/> !!";
// }
