<?php

class AlreadyOwnerStudentCodeRightException extends RuntimeException {

}

class StudentCodeRight extends AppModel {
    public function findOwned($credId) {
        return $this->find('all', ['conditions' => [
            'StudentCodeRight.cred_id' => $credId,
            'StudentCodeRight.right' => 'owner'
        ]]);
    }

    public function findRights($code) {
        return $this->find('all', ['conditions' => [
                'StudentCodeRight.code' => $code
            ]]
        );
    }

    public function isOwned($code) {
        return $this->find('count', ['conditions' => [
            'StudentCodeRight.code' => $code,
            'StudentCodeRight.right' => 'owner'
        ]]);
    }

    public function isOwner($credId, $code) {
        return $this->find('count', ['conditions' => [
            'StudentCodeRight.cred_id' => $credId,
            'StudentCodeRight.code' => $code,
            'StudentCodeRight.right' => 'owner'
        ]]);
    }

    public function setOwner($credId, $code) {
        if ($this->isOwner($credId, $code)) {
            throw new AlreadyOwnerStudentCodeRightException();
        }

        $this->save([
            'cred_id' => $credId,
            'code' => $code,
            'right' => 'owner'
        ]);
    }
}
