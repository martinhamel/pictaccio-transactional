<?php

class Pack6SpecialItem extends SpecialItemBase {
    const _FRIENDLY_NAME = 'Package #6';
    const _NAME = 'pack6';

    private $_template = [
        'item' => [
            'price' => ['type' => 'number'],
            'weight' => ['type' => 'number', 'default' => 20]
        ]
    ];

    /**
     * @inheritDoc
     */
    public static function friendlyName() {
        return self::_FRIENDLY_NAME;
    }

    /**
     * @inheritDoc
     */
    public static function name() {
        return self::_NAME;
    }

    public function __construct() {
        parent::__construct($this->_template);
    }
}
