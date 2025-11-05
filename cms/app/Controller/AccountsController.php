<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

class AccountsController extends AppController {
    public $components = [
        'User'
    ];

    /* LIFECYCLE */
    public function beforeFilter() {
        parent::beforeFilter();
    }

    /* PUBLIC ACTIONS */
    public function index() {
        if (!$this->User->isAuthenticated()) {
            CakeSession::write('Flags.redirectUrl', Router::url(['controller' => 'accounts', 'action' => 'index'], true));
            $this->redirect(['controller' => 'accounts', 'action' => 'login']);
        }

        $this->set('user', $this->User->getData());
    }

    public function claim() {
        if (!$this->User->isAuthenticated()) {
            CakeSession::write('Flags.redirectUrl', Router::url(['controller' => 'accounts', 'action' => 'index'], true));
            $this->redirect(['controller' => 'accounts', 'action' => 'login']);
        }

        $claimObject = $this->_prepareClaimObject();
        $this->set('claimed', $claimObject);
        $this->set('noClaim', count($claimObject) === 0);
    }

    public function create() {
        if ($this->request->is('post')) {
            $this->_expectPost(['name', 'email', 'pass']);

            if ($this->request->data['pass'] !== $this->request->data['confirm-pass']) {
                throw new BadRequestException();
            }

            try {
                $this->User->createLocal($this->request->data['name'], $this->request->data['email'], $this->request->data['pass'], $this->request->data);
                CakeSession::write('Flags.accountCreated', true);
                $this->redirect(['controller' => 'accounts', 'action' => 'login']);
            } catch (UserExistException $e) {
                $this->set('error', __('USER_EXISTS'));
            }
        }
    }

    public function login() {
        if ($this->request->is('post')) {
            $this->_expectPost(['email', 'pass']);

            try {
                $this->User->authenticateLocal($this->request->data['email'], $this->request->data['pass'], $this->request->data);
            } catch (UserNotFoundException $e) {
                die('Not found');
            } catch (BadAuthException $e) {
                die('Bad auth');
            }

            if (CakeSession::check('Flags.redirectUrl')) {
                $this->redirect(CakeSession::read('Flags.redirectUrl'));
                CakeSession::delete('Flags.redirectUrl');
            }
        }

        if (CakeSession::check('Flags.accountCreated')) {
            CakeSession::delete('Flags.accountCreated');
            $this->set('accountCreated', true);
        }
    }

    public function logout() {
        if ($this->User->isAuthenticated()) {
            $this->User->logout();
        }
    }

    public function personal() {
        if (!$this->User->isAuthenticated()) {
            CakeSession::write('Flags.redirectUrl', Router::url(['controller' => 'accounts', 'action' => 'personal'], true));
            $this->redirect(['controller' => 'accounts', 'action' => 'login']);
        }

        if ($this->request->is('post')) {
            $this->_expectPost(['name', 'email']);

            if ($this->request->data['email'] !== $this->User->getData()['email']) {
                throw new BadRequestException();
            }

            if ($this->request->data['name'] !== $this->User->getData()['info_json']['name']) {
                $this->User->changeName($this->request->data['name'], $this->request->data);
            }

            if (!empty($this->request->data['pass'])) {
                $this->_expectPost(['current-pass']);
                $this->User->changeSecret($this->request->data['current-pass'], $this->request->data['pass']);
            }
        }

        $this->set('user', $this->User->getData());
    }


    /* PRIVATE */
    private function _prepareClaimObject() {
        $this->loadModel('StudentCodeRight');
        $this->loadModel('Picture');

        $claimed = $this->StudentCodeRight->findOwned($this->User->id());
        $claimObject = [];

        foreach ($claimed as $studentCode) {
            $picture = $this->Picture->findByCode($studentCode['StudentCodeRight']['code']);

            if (empty($picture)) {
                throw new RuntimeException("AccountsController::_prepareClaimObject: User has student_code_right id '${$studentCode['StudentCodeRight']['id']}' but has no associated picture record");
            }

            $claimObject[] = [
                'code' => $studentCode['StudentCodeRight']['code'],
                'name' => $picture['Picture']['display_name'],
                'hide' => $picture['Picture']['hidden']
            ];
        }

        return $claimObject;
    }
}

