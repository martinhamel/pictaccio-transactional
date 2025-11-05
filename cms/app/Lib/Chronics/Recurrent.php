<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class Recurrent {
    private $_occurrences = [];

    public function nextOccurrence() {
        $next = $this->_occurrences[0];
        unset($this->_occurrences[0]);
        $this->_sort();
        return $next;
    }

    public function peekOccurrence() {
        return $this->_occurrences[0];
    }

    public function singleOccurrence($dateTimeOrEpoch, $replace = false) {
        if (method_exists($dateTimeOrEpoch, 'getTimestamp')) {
            $dateTimeOrEpoch = $dateTimeOrEpoch->getTimestamp();
        }

        if ($replace) {
            $this->_occurrences = [];
        }

        $this->_occurrences[] = $dateTimeOrEpoch;
        $this->_sort();

        return $this;
    }


    /* PRIVATE */
    private function _sort() {
        sort($this->_occurrences);
    }
}
