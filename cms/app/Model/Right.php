<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

class Right extends AppModel {
    public function peekPermission($credId, $targetPermission) {
        $permissions = $this->_flattenPermissions($credId);
        $denied = false;
        $hasPermission = false;

        foreach ($permissions as $permission) {
            if (!$hasPermission) {
                if ($permission['value'] === $targetPermission) {
                    $hasPermission = true;
                }
            }

            if ($permission['value'] === $targetPermission && $permission['deny'] === true) {
                $denied |= true;
            }
        }

        return $hasPermission && !$denied;
    }


    /* PRIVATE */
    private function _flattenPermissions($credId) {
        $permissions = [];
        $queue = [['user', $credId]];

        while (list($type, $id) = current($queue)) {
            $conditions = [];
            switch ($type) {
            case 'user':
                $conditions = ['Right.cred_id' => $id];
                break;

            case 'id':
                $conditions = ['Right.id' => $id];
                break;

            default:
                throw new RuntimeException('Right: Unknown queue type');
            }

            $unflatten = $this->find('all', ['conditions' => $conditions]);
            foreach ($unflatten as $row) {
                if ($row['Right']['leaf'] === false) {
                    $queue[] = ['id', $row['Right']['rel_id']];
                } else {
                    $permissions[] = $row['Right'];
                }
            }

            next($queue);
        }

        return $permissions;
    }
}
