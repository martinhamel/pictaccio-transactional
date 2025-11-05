<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

App::uses('AppComponent', 'Controller' . DS . 'Component');

class UserComponent extends Component {
    public $components = ['Cookie', 'CSRF'];

    private $_isAuthenticated = false;

    public function initialize(Controller $controller) {
        parent::initialize($controller);

        $this->Cred = ClassRegistry::init('Cred');
        $this->Right = ClassRegistry::init('Right');

        $this->_validateAuthentication();
    }

    public function authenticateLocal($email, $secret, $postData) {
        $this->CSRF->protect($postData);

        if (!$this->Cred->emailExists($email)) {
            throw new UserNotFoundException(($email));
        }

        $auth = $this->Cred->validateSecret($email, $secret);
        if (!$auth['authSecret']) {
            throw new BadAuthException($email);
        }
        if (!$this->Right->peekPermission(CakeSession::read('Auth.userData.id'), 'login')) {
            throw new AuthException("User '{$email}' does not have login permission");
        }

        $this->_loginSession($auth['userData']);
    }

    public function changeName($name, $postData) {
        $this->expectAuthenticated();
        $this->CSRF->protect($postData);

        $editId = CakeSession::read('Auth.userData.id');
        $userRow = $this->Cred->findId($editId);
        if (empty($userRow)) {
            throw new RuntimeException("UserComponent::changeName: Cannot find user id '{$editId}'");
        }

        $userRow['Cred']['info_json']['name'] = $name;
        $this->Cred->id = $editId;
        $this->Cred->save(['info_json' => json_encode($userRow['Cred']['info_json'])]);

        $this->_reloadUserData();
    }

    public function changeSecret($currentSecret, $newSecret) {
        $this->expectAuthenticated();

        if ($this->Cred->validateSecret($this->getData()['email'], $currentSecret)['authSecret']) {
            $this->Cred->changeSecret($this->getData()['id'], $newSecret);
        }

        $this->logout();
    }

    public function createLocal($name, $email, $secret, $postData) {
        $this->CSRF->protect($postData);

        if ($this->Cred->emailExists($email)) {
            throw new UserExistException($email);
        }
        $this->Cred->createLocal($email, $secret, ['name' => $name]);
    }

    public function expectAuthenticated() {
        if (!$this->isAuthenticated()) {
            throw new RuntimeException('User not authenticated');
        }
    }

    public function getData() {
        $this->expectAuthenticated();

        return CakeSession::read('Auth.userData');
    }

    public function id() {
        $this->expectAuthenticated();

        return $this->getData()['id'];
    }

    public function isAuthenticated() {
        return $this->_isAuthenticated;
    }

    public function logout() {
        CakeSession::delete('Auth');
    }

    public function peekPermission($targetPermission) {
        if ($this->isAuthenticated()) {
            return $this->Right->peekPermission(CakeSession::read('Auth.userData.id'), $targetPermission);
        }

        return false;
    }

    public function requestPermission($targetPermission) {
        if ($this->peekPermission($targetPermission) === false) {
            throw new ForbiddenException();
        }
    }

    /* PRIVATE */
    private function _generateAuthToken() {
        return preg_replace('/[=+\/]/', '', base64_encode(openssl_random_pseudo_bytes(42)));
    }

    private function _loginSession($userData) {
        $authToken = $this->_generateAuthToken();

        CakeSession::delete('Auth');
        CakeSession::write('Auth', [
            'userData' => $userData,
            'originIp' => $_SERVER['REMOTE_ADDR'],
            'authToken' => $authToken
        ]);

        $this->Cookie->write('heo2-auth-token', $authToken, false, '48 hours');
    }

    private function _reloadUserData() {
        $this->_checkAuthenticated();

        $id = CakeSession::read('Auth.userData.id');
        $userData = $this->Cred->findId($id);
        if (empty($userData)) {
            throw new RuntimeException("UserComponent::_reloadUserData: Cannot find user id '{$id}'");
        }

        $userData = $userData['Cred'];
        unset($userData['secret']);
        unset($userData['rev']);
        unset($userData['salt']);
        CakeSession::write('Auth.userData', $userData);
    }

    private function _validateAuthentication() {
        if (CakeSession::check('Auth') && $this->Cookie->read('heo2-auth-token')) {
//            if (CakeSession::read('Auth.originIp') !== $_SERVER['REMOTE_ADDR']) {
//                throw new AuthException('Remote IP mismatch');
//            }

            if (CakeSession::read('Auth.authToken') !== $this->Cookie->read('heo2-auth-token')) {
                throw new AuthException('Auth token mismatch');
            }

            $this->_isAuthenticated = true;
        }
    }
}
