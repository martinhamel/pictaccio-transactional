<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

class Cred extends AppModel {
    const _FIXED_SALT = 'UNMVLz5vEPs7gnEWQxY9UbQT';
    const _CURRENT_REV = 1;

    public function changeSecret($id, $secret) {
        $userData = $this->find('first', ['conditions' => ['Cred.id' => $id]]);
        if (empty($userData)) {
            throw new RuntimeException("Can't find cred id '{$id}");
        }

        $salt = hash('sha512', base64_encode(openssl_random_pseudo_bytes(20)));
        switch (self::_CURRENT_REV) {
        case 1:
            $hashedSecret = $this->_hashRev1($secret, $id, $userData['Cred']['email'], $salt);
            break;

        default:
            throw new RuntimeException("Unknown rev");
        }

        $this->id = $id;
        $this->save(['secret' => $hashedSecret, 'salt' => $salt, 'rev' => self::_CURRENT_REV]);
    }

    public function createLocal($email, $secret, $info = []) {
        $salt = hash('sha512', base64_encode(openssl_random_pseudo_bytes(20)));
        $this->save(['email' => $email, 'rev' => self::_CURRENT_REV, 'salt' => $salt, 'info_json' => json_encode($info)]);
        $userId = $this->id;

        $hashedSecret = $this->_hashRev1($secret, $userId, $email, $salt);
        $this->id = $userId;
        $this->save(['secret' => $hashedSecret]);
    }

    public function emailExists($email) {
        return $this->hasAny(['Cred.email' => $email]);
    }

    public function validateSecret($email, $secret) {
        $userData = $this->find('first', ['conditions' => ['Cred.email' => $email]]);
        $authSecret = false;

        switch ($userData['Cred']['rev']) {
        case 1:
            $authSecret = $userData['Cred']['secret'] === $this->_hashRev1($secret, $userData['Cred']['id'], $email, $userData['Cred']['salt']);
            break;

        default:
            throw new RuntimeException("Unknown rev for '{$email}'");
        }

        unset($userData['Cred']['secret']);
        unset($userData['Cred']['secret_rev']);
        unset($userData['Cred']['salt']);
        return [
            'authSecret' => $authSecret,
            'userData' => $userData['Cred']
        ];
    }


    /* PRIVATE */
    private function _hashRev1($secret, $id, $email, $salt) {
        return $this->_hmac_pbkdf2('sha512', $secret, "{$this->_FIXED_SALT}{$id}{$email}{$salt}", 50000);
    }

    private function _hmac_pbkdf2($algorithm, $secret, $salt, $count, $keyLength = 200) {
        $hashLength = strlen(hash($algorithm, "", true));
        $blockCount = ceil($keyLength / $hashLength);

        $output = "";
        for ($i = 1; $i <= $blockCount; ++$i) {
            $last = $salt . pack("N", $i);
            $last = $xorsum = hash_hmac($algorithm, $last, $secret, true);
            for ($j = 1; $j < $count; ++$j) {
                $xorsum ^= ($last = hash_hmac($algorithm, $last, $secret, true));
            }
            $output .= $xorsum;
        }

        return bin2hex(substr($output, 0, $keyLength));
    }
}
