<?php

App::uses('Properties', 'Lib');

class SpecialItemBase extends Properties {
    protected $SpecialItem;

    protected $_enabled = false;
    protected $_id = null;
    protected $_sessionId = null;

    /**
     * @return string Special item name
     */
    public static function friendlyName() {
        throw new NotImplementedException('SpecialItemBase::friendlyName called, check you reference');
    }

    /**
     * @return string Special item name
     */
    public static function name() {
        throw new NotImplementedException('SpecialItemBase::name called, check your reference');
    }

    public function __construct($template) {
        parent::__construct($template);

        $this->SpecialItem = ClassRegistry::init('SpecialItem');
    }

    /**
     * @param $value bool Whether the special item is enabled. If null, returns current value. Defaults to null
     * @return bool If $value is null, returns whether the special item is enabled
     */
    public function enable($value = null) {
        if ($value === null) {
            return $this->_enabled;
        }

        $this->_enabled = $value;
    }


    /**
     * Loads the special item settings
     * @param $sessionId int The session id to load special item settings from
     * @return $this
     */
    public function restore($sessionId) {
        $specialItem = $this->SpecialItem->findBySession($sessionId, $this->name());
        if (!empty($specialItem)) {
            $this->enable($specialItem['SpecialItem']['enabled']);
            $this->fromArray($specialItem['SpecialItem']['options_json']);
            $this->_id = $specialItem['SpecialItem']['id'];
            $this->_sessionId = $sessionId;
        }

        return $this;
    }

    /**
     * Saves the special item settings in the DB
     * @param $sessionId int The session id to save special item settings to
     * @return $this
     */
    public function persist($sessionId) {
        if ($this->_id === null && $sessionId === $this->_sessionId) {
            $specialItem = $this->SpecialItem->findBySession($sessionId, $this->name());
            if (!empty($specialItem)) {
                $this->_id = $specialItem['SpecialItem']['id'];
            }
        }

        if ($this->_id && $sessionId === $this->_sessionId) {
            $this->SpecialItem->id = $this->_id;
        } else{
            $this->SpecialItem->create();
        }

        $this->SpecialItem->save([
            'session_id' => $sessionId,
            'name' => static::name(),
            'enabled' => $this->enable(),
            'options_json' => $this->toJson()
        ]);

        $this->_id = $this->SpecialItem->id;
        $this->_sessionId = $sessionId;

        return $this;
    }
}
