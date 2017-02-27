<?php

require "twitteroauth/autoload.php";
require "src/Config.php";
require "src/Twitter.php";

use src\Twitter;

// $content = Twitter::getInfos();

$twitter = new Twitter();
$user = $twitter->getUser('twitterdev');

$hashtagsToMatch = ['Marine2017', 'AuNomDuPeuple', 'Laïcité', 'JeunesAvecMarine', 'JeSoutiensLaPolice', 'ChassonsLesIslamistes'];
$response = $twitter->getTweetsByHashtag('G_IDENTITAIRE', $hashtagsToMatch);

header('Content-type: application/json');
echo json_encode($response);
