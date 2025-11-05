<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('ImageResizer', 'Lib');
App::uses('Recaptcha', 'Lib');

class PagesController extends AppController {
    /* PUBLIC ACTIONS */
    public function aboutus() {
    }

    public function contact_us() {
        if ($this->request->is('post')) {
            $this->_expectPost(['parent-name', 'child-name', 'email', 'message', 'g-recaptcha-response']);

            if (strpos($this->request->data['email'], '@usa-video.net') !== false ||
                strpos($this->request->data['email'], '@thvid.net') ||
                $this->request->data['group'] === 'BMW')  {
                HeO2Log::spamSpecial("Spam received from: {$_SERVER['REMOTE_ADDR']}");
                HeO2Log::dump('spamSpecial', $this->request->data);

                $this->render('contact_us_sent');
                return;
            }

            if (trim($this->request->data['parent-name']) === '' ||
                trim($this->request->data['child-name']) === '' ||
                trim($this->request->data['email']) === '' ) {
                $this->render('contact_us_not_sent');
                return;
            }

            try {
                if (!Recaptcha::check($this->request->data['g-recaptcha-response'])) {
                    throw new BadRequestException('User did not pass the captcha challenge');
                }

                $email = new CakeEmail('contactUs');
                $email
                    ->subject('Demande d\'information')
                    ->viewVars([
                        'form' => $this->request->data
                    ])
                    ->to(Configure::read('Contacts.email'))
                    ->send();

                $this->render('contact_us_sent');
            } catch (Exception $e) {
                $this->render('contact_us_not_sent');
            }
        }
    }

    public function digitals() {
        $this->loadModel('OrderPublishedPhoto');
        $orderUpload = $this->OrderPublishedPhoto->findByToken($this->request->params['token']);

        if (empty($orderUpload)) {
            throw new NotFoundException();
        }

        $orderUploads = $this->OrderPublishedPhoto->findAllByOrderId($orderUpload['OrderPublishedPhoto']['order_id']);

        $this->set('hasUploads', !empty($orderUpload['OrderPublishedPhoto']['images']));
        $this->set('orderUploads', $orderUploads);
        $this->set('token', $this->request->params['token']);
    }

    public function code_request() {
        if ($this->request->is('post')) {
            $this->_expectPost(['parent-name', 'subject-name', 'gpi', 'email', 'phone', 'school', 'group', 'g-recaptcha-response']);
            $userLang = CakeSession::read('Config.language');

            try {
                if (!Recaptcha::check($this->request->data['g-recaptcha-response'])) {
                    throw new BadRequestException('User did not pass the captcha challenge');
                }

                $this->loadModel('Subject');
                $this->loadModel('Session');

                CakeSession::write('Config.language', Configure::read('Config.default'));

                $subjectSearchResult = $this->Subject->findByGpiInSession($this->request->data['school'], $this->request->data['gpi']);
                $sessionSearchResult = $this->Session->findById($this->request->data['school']);

                if (count($subjectSearchResult) === 1) {
                    $email = new CakeEmail('codeRequestAuto');
                    $email
                        ->subject(__d('emails', 'CODE_REQUEST_TITLE'))
                        ->viewVars([
                            'subjectSearchResult' => $subjectSearchResult[0]['Subject']['code'],
                            'session' => $sessionSearchResult['Session']['name_locale'],
                            'form' => $this->request->data
                        ])
                        ->to($this->request->data['email'])
                        ->send();

                    CakeSession::write('Config.language', $userLang);
                    $this->render('code_request_sent');
                } else {
                    $email = new CakeEmail('codeRequest');
                    $email
                        ->subject(__d('emails', 'CODE_REQUEST_TITLE'))
                        ->viewVars([
                            'session' => $sessionSearchResult['Session']['name_locale'],
                            'form' => $this->request->data
                        ])
                        ->to(Configure::read('Notify.addresses')[0])
                        ->send();

                    CakeSession::write('Config.language', $userLang);
                    $this->render('code_request_sent');
                }
            } catch (Exception $e) {
                $this->render('code_request_not_sent');
            } finally {
                CakeSession::write('Config.language', $userLang);
            }
        } else {
            $this->loadModel('Session');

            $this->set('sessions', $this->Session->findNonExpired());
        }
    }

    public function shutdown() {
        $this->set('message', Configure::read('Config.shutdownMessage'));
    }
}

