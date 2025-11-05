<?php

class GraduateSpecialItem extends SpecialItemBase {
    const _FRIENDLY_NAME = 'Graduates Packages';
    const _NAME = 'graduate-pack';

    private $_template = [
        'item' => [
            'priceScale' => ['type' => 'text'],
            'quantityScale' => ['type' => 'text'],
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
