<?php
// Challenge 15 - The only winning move is not to play
// by Pedro Ladaria <pedro.ladaria@gmail.com>

function out($s) { echo "$s\n"; }

// Original cookie
$oc = 'Tzo0OiJnYW1lIjozOntzOjExOiIAZ2FtZQBib2FyZCI7Tzo1OiJib2FyZCI6Mzp7czox'.
'MjoiAGJvYXJkAGJvYXJkIjthOjM6e2k6MDthOjM6e2k6MDtiOjA7aToxO2I6MDtpOjI7YjowO31pO'.
'jE7YTozOntpOjA7YjowO2k6MTtiOjA7aToyO2I6MDt9aToyO2E6Mzp7aTowO2I6MDtpOjE7YjowO2'.
'k6MjtiOjA7fX1zOjEzOiIAYm9hcmQAd2lubmVyIjtiOjA7czoxNDoiAGJvYXJkAHdpbkxpbmUiO3M'.
'6MDoiIjt9czoxNToiAGdhbWUAbmV4dFBpZWNlIjtzOjE6IlgiO3M6MTE6InZlcnNpb25GaWxlIjtz'.
'OjM1OiIvaG9tZS90dHQvZGF0YS9tZXNzYWdlcy92ZXJzaW9uLnR4dCI7fQ==';
$ocd = base64_decode($oc);

class board {}
class game {}

// Secret grabbed from the temporary php files created by Kate
// example: foobar.com/index.php~
// looking at sources, we find the secret key creation
$md5 = '';
while ('31ddc88afb7ed70460d2839908d8349c' !== $md5) {
    $secret = 'TUENTI';
    $secret = str_split($secret);
    shuffle($secret);
    $secret = array_slice($secret, 0, 4);
    $secret = implode($secret, '');
    $md5 = md5($oc.$secret);
    //out($secret.' - '.$md5);
}

$game = unserialize($ocd);

//print_r($game);
// /home/ttt/data/messages/version.txt
// ../data/keys.json
$game->versionFile = '/home/ttt/data/keys/8f6b39b5650a3d12248d6979c47ff809b3e068ef';
//print_r($game);

$game = base64_encode(serialize($game));
$md5 = md5($game.$secret);

$cookie = urlencode($game.'|'.$md5);

$ch = curl_init ("http://ttt.contest.tuenti.net/");
curl_setopt ($ch, CURLOPT_COOKIEJAR, '');
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch,CURLOPT_COOKIE, 'game='.$cookie.'; expires=Mon, 13-May-2014 12:03:07 GMT');
curl_setopt($ch, CURLOPT_HEADER, 1);
$output = explode("X-Tuenti-Powered-By=", curl_exec($ch));
$output = explode(";", $output[1]);

//out($cookie);
out($output[0]);
