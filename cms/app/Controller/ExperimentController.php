<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

if (Configure::read('debug') !== 0) {
    class ExperimentController extends AppController {
        private $_whitelist = ['exception', 'error', 'warning', 'on', 'off', 'fra', 'eng', 'setvalue'];

        public function beforeFilter() {
            parent::beforeFilter();

            if (!empty($this->request['pass'][0])) {
                if (array_search($this->request['pass'][0], $this->_whitelist) === false) {
                    throw new BadRequestException();
                }
            }

            $this->autoLayout = false;
            $this->autoRender = false;
        }

        public function afterFilter() {
            echo 'The experiment <strong>' . $this->request['action'] . '</strong> is now set to <strong>' . (!empty($this->request['pass'][0]) ? $this->request['pass'][0] : '{undefined}') . '</strong> for this session';
        }

        public function debugBorders($switch) {
            CakeSession::write('Experiment.debugBorders', $switch);
        }

        public function destroyCache() {
            Cache::clear();
        }

        public function destroySession() {
            CakeSession::destroy();
        }

        public function lang($langCode) {
            //var_dump(CakeSession::read('Config'));
            CakeSession::write('Config.language', $langCode);
            //var_dump(CakeSession::read('Config'));
        }

        public function runPhp() {
            if ($this->request->is('post')) {
                try {
                    eval($this->request->data['php']);
                } catch (Exception $e) {
                    var_dump($e);
                }
            }
            ?>

            <form method="post">
				<textarea name="php" cols="80"
                          rows="30"><?php echo $this->request->data['php']; ?></textarea><br/>
                <input type="submit" value="Run!"/>
            </form>

            <?php
            die();
        }

        public function smtpFail($switch) {
            CakeSession::write('Experiment.smtpFail', $switch);
        }

        public function smtpTest($dummy, $emailAddress) {
            $email = new CakeEmail('value');
            $email->subject('SMTP Test');
            $email->viewVars([
                'value' => 'This is a test email'
            ]);
            $email->to($emailAddress);
            $email->send();
        }
    }
}
