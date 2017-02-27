<?php
namespace src;

use Abraham\TwitterOAuth\TwitterOAuth;
use src\Config;

/**
 * Description of Twitter
 *
 * @author Thibault Goehringer
 */

class Twitter {
  private $connection = null;
  private $is64bits = false;

  function __construct () {
    $this->connection = new TwitterOAuth(Config::CONSUMER_KEY,
    Config::CONSUMER_SECRET, Config::ACCESS_TOKEN, Config::ACCESS_TOKEN_SECRET);
    if (PHP_INT_MAX > 2147483647) $this->is64bits = true;
  }

  function getUser ($screenName) {
    $params = ['screen_name' => $screenName];
    $user = $this->connection->get('users/show', $params);

    return [
      'screenName' => $user->screen_name,
      'followersCount' => $user->followers_count,
      'tweetsCount' => $user->statuses_count
    ];
  }

  function getTweetsByHashtag ($screenName, array $hashtagsToMatch = []) {
    $MAX_NB_TWEETS = 3000;
    $NB_TWEETS_BY_REQUEST = 200;

    $hashtags = [];
    $tweetsCount = 0;
    $maxId = null;
    $hashtagsToMatch = array_map('strtolower', $hashtagsToMatch);

    while ($tweetsCount < $MAX_NB_TWEETS) {
      $tweets = $this->getUserTweets($screenName, $NB_TWEETS_BY_REQUEST, $maxId);

      if (!$tweets || empty($tweets)) break;

      $this->getTweetsHashtags($tweets, $hashtags, $hashtagsToMatch);

      $tweetsCount += count($tweets);

      $maxId = $tweets[count($tweets)-1]->id;
      if ($this->is64bits) $maxId--;
    }
    return $hashtags;
  }


  private function getTweetsHashtags (array $tweets, array &$hashtags, array $hashtagsToMatch = []) {
    foreach ($tweets as $tweet) {
      $tweetHashtags = $tweet->entities->hashtags;
      if (!$tweetHashtags || empty($tweetHashtags)) continue;
      foreach ($tweetHashtags as $tweetHashtag)
      {
        $text = strtolower($tweetHashtag->text);
        if (!empty($hashtagsToMatch) && !in_array($text, $hashtagsToMatch, false)) continue;

        if (!array_key_exists($text, $hashtags)) $hashtags[$text] = 0;
        $hashtags[$text]++;
      }
    }
  }

  function getUserTweets ($screenName, $count = null, $maxId = null) {
    $params = ['screen_name' => $screenName, 'trim_user' => 1];
    if ($count) $params['count'] = $count;
    if ($maxId) $params['max_id'] = $maxId;
    return $this->connection->get('statuses/user_timeline', $params);
  }
}
