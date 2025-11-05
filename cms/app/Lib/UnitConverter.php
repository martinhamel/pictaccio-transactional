<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class UnitConverter {
    private static $_instance = null;

    public static function convert($measure, array $options = null) {
        if (empty(self::$_instance)) {
            self::$_instance = new UnitConverterImpl();
        }
        return self::$_instance->convert($measure, $options);
    }

    public static function isMeasurement($str) {
        if (empty(self::$_instance)) {
            self::$_instance = new UnitConverterImpl();
        }
        return self::$_instance->isMeasurement($str);
    }
}

class UnitConverterImpl {
    const _MEASURE_STRING_TOKEN_REGEX = '![\d+\.]+|[a-zA-Z"\' ]+!';

    private $_TABLES = [
        'metric' => [
            'length' => [
                'toOther' => 3.28084,
                'units' => [
                    'Tm' => [
                        'sign' => ['Tm'],
                        'base' => 1000000000000
                    ],
                    'Gm' => [
                        'sign' => ['Gm'],
                        'base' => 1000000000
                    ],
                    'Mm' => [
                        'sign' => ['Mm'],
                        'base' => 1000000
                    ],
                    'km' => [
                        'sign' => ['km'],
                        'base' => 1000
                    ],
                    'hm' => [
                        'sign' => ['hm'],
                        'base' => 100
                    ],
                    'dam' => [
                        'sign' => ['dam'],
                        'base' => 10
                    ],
                    'm' => [
                        'sign' => ['m'],
                        'base' => 1
                    ],
                    'dm' => [
                        'sign' => ['dm'],
                        'base' => .1
                    ],
                    'cm' => [
                        'sign' => ['cm'],
                        'base' => .01
                    ],
                    'mm' => [
                        'sign' => ['mm'],
                        'base' => .001
                    ],
                    'μm' => [
                        'sign' => ['μm'],
                        'base' => .000001
                    ],
                    'nm' => [
                        'sign' => ['nm'],
                        'base' => .000000001
                    ],
                    'pm' => [
                        'sign' => ['pm'],
                        'base' => .0000000001
                    ]
                ]
            ],
            'weight' => [
                'toOther' => 0.00220462,
                'units' => [
                    'Tm' => [
                        'sign' => ['Yg'],
                        'base' => 1000000000000000000000000
                    ],
                    'Zg' => [
                        'sign' => ['Zg'],
                        'base' => 1000000000000000000000
                    ],
                    'Eg' => [
                        'sign' => ['Eg'],
                        'base' => 1000000000000000000
                    ],
                    'Pg' => [
                        'sign' => ['Pg'],
                        'base' => 1000000000000000
                    ],
                    'Tg' => [
                        'sign' => ['Tg'],
                        'base' => 1000000000000
                    ],
                    'Gg' => [
                        'sign' => ['Gg'],
                        'base' => 1000000000
                    ],
                    'Mg' => [
                        'sign' => ['Mg'],
                        'base' => 1000000
                    ],
                    'kg' => [
                        'sign' => ['kg'],
                        'base' => 1000,
                    ],
                    'hg' => [
                        'sign' => ['hg'],
                        'base' => 100
                    ],
                    'dag' => [
                        'sign' => ['dag'],
                        'base' => 10
                    ],
                    'g' => [
                        'sign' => ['g'],
                        'base' => 1
                    ],
                    'dg' => [
                        'sign' => ['dg'],
                        'base' => 0.1
                    ],
                    'cg' => [
                        'sign' => ['cg'],
                        'base' => 0.01
                    ],
                    'mg' => [
                        'sign' => ['mg'],
                        'base' => 0.001
                    ],
                    'µg' => [
                        'sign' => ['µg'],
                        'base' => 0.000001
                    ],
                    'ng' => [
                        'sign' => ['ng'],
                        'base' => 0.000000001
                    ],
                    'pg' => [
                        'sign' => ['pg'],
                        'base' => 0.000000000001
                    ],
                    'fg' => [
                        'sign' => ['fg'],
                        'base' => 0.0000000000000001
                    ],
                    'ag' => [
                        'sign' => ['ag'],
                        'base' => 0.000000000000000001
                    ],
                    'zg' => [
                        'sign' => ['zg'],
                        'base' => 0.000000000000000000001
                    ],
                    'yg' => [
                        'sign' => ['yg'],
                        'base' => 0.000000000000000000000001
                    ]
                ]
            ],
            'volume' => [
                'toOther' => 1.75975,
                'units' => [
                    'Yl' => [
                        'sign' => ['Yl', 'YL'],
                        'base' => 1000000000000000000000000
                    ],
                    'Zl' => [
                        'sign' => ['Zl', 'ZL'],
                        'base' => 1000000000000000000000
                    ],
                    'El' => [
                        'sign' => ['El', 'EL'],
                        'base' => 1000000000000000000
                    ],
                    'Pl' => [
                        'sign' => ['Pl', 'PL'],
                        'base' => 1000000000000000
                    ],
                    'Tl' => [
                        'sign' => ['Tl', 'TL'],
                        'base' => 1000000000000
                    ],
                    'Gl' => [
                        'sign' => ['Gl', 'GL'],
                        'base' => 1000000000
                    ],
                    'Ml' => [
                        'sign' => ['Ml', 'ML'],
                        'base' => 1000000
                    ],
                    'kl' => [
                        'sign' => ['kl', 'kL'],
                        'base' => 1000
                    ],
                    'hl' => [
                        'sign' => ['hl', 'hL'],
                        'base' => 100
                    ],
                    'dal' => [
                        'sign' => ['dal', 'daL'],
                        'base' => 10
                    ],
                    'l' => [
                        'sign' => ['l', 'L'],
                        'base' => 1
                    ],
                    'dl' => [
                        'sign' => ['dl', 'dL'],
                        'base' => 0.1
                    ],
                    'cl' => [
                        'sign' => ['cl', 'cL'],
                        'base' => 0.01
                    ],
                    'ml' => [
                        'sign' => ['ml', 'mL'],
                        'base' => 0.001
                    ],
                    'µl' => [
                        'sign' => ['µl', 'µL'],
                        'base' => 0.000001
                    ],
                    'nl' => [
                        'sign' => ['nl', 'nL'],
                        'base' => 0.000000001
                    ],
                    'pl' => [
                        'sign' => ['pl', 'pL'],
                        'base' => 0.000000000001
                    ],
                    'fl' => [
                        'sign' => ['fl', 'fL'],
                        'base' => 0.000000000000001
                    ],
                    'al' => [
                        'sign' => ['al', 'aL'],
                        'base' => 0.000000000000000001
                    ],
                    'zl' => [
                        'sign' => ['zl', 'zL'],
                        'base' => 0.000000000000000000001
                    ],
                    'yl' => [
                        'sign' => ['yl', 'yL'],
                        'base' => 0.000000000000000000000001
                    ]
                ]
            ]
        ],
        'imperial' => [
            'length' => [
                'toOther' => 0.3048,
                'units' => [
                    'lea' => [
                        'sign' => ['lea'],
                        'base' => 15840
                    ],
                    'mi' => [
                        'sign' => ['mi'],
                        'base' => 5280
                    ],
                    'fur' => [
                        'sign' => ['fur'],
                        'base' => 660
                    ],
                    'ch' => [
                        'sign' => ['ch'],
                        'base' => 66
                    ],
                    'yd' => [
                        'sign' => ['yd'],
                        'base' => 3
                    ],
                    'ft' => [
                        'sign' => ['\'', 'ft'],
                        'base' => 1
                    ],
                    'in' => [
                        'sign' => ['"', 'in'],
                        'base' => '1/12'
                    ],
                    'th' => [
                        'sign' => ['th', 'mil'],
                        'base' => '1/12000'
                    ]
                ]
            ],
            'weight' => [
                'toOther' => 453.59237,
                'units' => [
                    't' => [
                        'sign' => ['t'],
                        'base' => 2240
                    ],
                    'cwt' => [
                        'sign' => ['cwt'],
                        'base' => 112
                    ],
                    'qtr' => [
                        'sign' => ['qtr'],
                        'base' => 28
                    ],
                    'st' => [
                        'sign' => ['st'],
                        'base' => 14
                    ],
                    'lbs' => [
                        'sign' => ['lbs', 'lb'],
                        'base' => 1
                    ],
                    'oz' => [
                        'sign' => ['oz'],
                        'base' => 0.0625
                    ],
                    'dr' => [
                        'sign' => ['dr'],
                        'base' => 0.00390625
                    ],
                    'gr' => [
                        'sign' => ['gr'],
                        'base' => 0.000142857
                    ]
                ]
            ],
            'volume' => [
                'toOther' => 0.56826125,
                'units' => [
                    'gal' => [
                        'sign' => ['gal'],
                        'base' => 8
                    ],
                    'qtr' => [
                        'sign' => ['qtr'],
                        'base' => 2
                    ],
                    'pt' => [
                        'sign' => ['pt'],
                        'base' => 1
                    ],
                    'gi' => [
                        'sign' => ['gi'],
                        'base' => 0.25
                    ],
                    'fl oz' => [
                        'sign' => ['fl oz'],
                        'base' => 0.05
                    ]
                ]
            ]
        ]
    ];

    private $_options = [
        'toUnit' => null,
        'system' => null
    ];

    private $_base = null;
    private $_baseUnit = null;
    private $_isMeasureRegEx = '![\d+\.]+|%s!';
    private $_measure = null;
    private $_system = null;
    private $_tokens = [];
    private $_type = null;

    public function __construct() {
        $unitPortionRegEx = '';

        foreach ($this->_TABLES as $system) {
            foreach ($system as $type) {
                foreach ($type['units'] as $unit) {
                    foreach ($unit['sign'] as $sign) {
                        $unitPortionRegEx .= '' . $sign . '+?|';
                    }
                }
            }
        }

        $this->_isMeasureRegEx = sprintf($this->_isMeasureRegEx, rtrim($unitPortionRegEx, '|'));
    }

    public function convert($measure, array $options = null) {
        $this->_measure = $measure;
        $this->_options = $options;

        $this->_tokenize();
        $this->_parseMeasure();
        $measure = $this->_convert();

        // TODO: Options handling could be improved. Don't like the all over the place smell of this :(
        return
            !empty($this->_options['numberOnly']) ?
                preg_replace('![^\d+]!', '', $measure) :
                $measure;
    }

    public function isMeasurement($str) {
        return preg_match_all($this->_isMeasureRegEx, $str, $test) === 2;
    }

    /* CONVERTERS */
    protected function _convert_imperial_length() {
        $toUnit = $this->_findAppropriateImperialLength();
        $valueStr = '';
        $value = $this->_base;

        foreach ($toUnit as $to) {
            if (!empty($value)) {
                $base = $this->_getCoefficient($to['base']);
                $valueStr .= round($value / $base, 0, PHP_ROUND_HALF_DOWN) .
                    (ctype_alpha($to['sign'][0]) ? ' ' : '') .
                    $to['sign'][0];

                $value = bccomp($value, $base, 5) === 0 ? 0 : fmod($value, $base) / $base;
            }
        }

        if (!empty($value)) {
            $valueStr .= ' ' . $this->_toFraction($value);
        }

        return $valueStr;
    }

    protected function _convert_imperial_volume() {
        $toUnit = $this->_findAppropriateImperialVolume();
        return $this->_base / $this->_getCoefficient($toUnit['base']) . ' ' . $toUnit['sign'][0];
    }

    protected function _convert_imperial_weight() {
        $toUnit = $this->_findAppropriateImperialWeight();
        return $this->_base / $this->_getCoefficient($toUnit['base']) . ' ' . $toUnit['sign'][0];
    }

    protected function _convert_metric_length() {
        $toUnit = $this->_findAppropriateMetricLength();
        return $this->_base / $this->_getCoefficient($toUnit['base']) . ' ' . $toUnit['sign'][0];
    }

    protected function _convert_metric_volume() {
        $toUnit = $this->_findAppropriateMetricVolume();
        return $this->_base / $this->_getCoefficient($toUnit['base']) . ' ' . $toUnit['sign'][0];
    }

    protected function _convert_metric_weight() {
        $toUnit = $this->_findAppropriateMetricWeight();
        return $this->_base / $this->_getCoefficient($toUnit['base']) . ' ' . $toUnit['sign'][0];
    }

    /* PRIVATE */
    private function _convert() {
        if (!empty($this->_options['system'])) {
            $this->_convertSystem($this->_options['system']);
        }

        return $this->{'_convert_' . $this->_system . '_' . $this->_type}();
    }

    private function _convertSystem($system) {
        if ($system !== $this->_system) {
            $this->_base *= $this->_TABLES[$this->_system][$this->_type]['toOther'];
            $this->_system = $system;
        }
    }

    private function _findAppropriateImperialLength() {
        if (!empty($this->_options['unit']) && isset($this->_TABLES['imperial']['length']['units'][$this->_options['unit']])) {
            return [$this->_TABLES['imperial']['length']['units'][$this->_options['unit']]];
        }

        if ($this->_base >= 5280) {
            return [$this->_TABLES['imperial']['length']['units']['mi']];
        } else{
            return [
                $this->_TABLES['imperial']['length']['units']['ft'],
                $this->_TABLES['imperial']['length']['units']['in']
            ];
        }
    }

    private function _findAppropriateImperialVolume() {
        if (!empty($this->_options['unit']) && isset($this->_TABLES['imperial']['volume']['units'][$this->_options['unit']])) {
            return $this->_TABLES['imperial']['volume']['units'][$this->_options['unit']];
        }

        return $this->_TABLES['imperial']['volume']['units']['fl oz'];
    }

    private function _findAppropriateImperialWeight() {
        if (!empty($this->_options['unit']) && isset($this->_TABLES['imperial']['weight']['units'][$this->_options['unit']])) {
            return $this->_TABLES['imperial']['weight']['units'][$this->_options['unit']];
        }

        return $this->_TABLES['imperial']['weight']['units']['oz'];
    }

    private function _findAppropriateMetricLength() {
        if (!empty($this->_options['unit']) && isset($this->_TABLES['metric']['length']['units'][$this->_options['unit']])) {
            return $this->_TABLES['metric']['length']['units'][$this->_options['unit']];
        }

        if ($this->_base >= 1000) {
            return $this->_TABLES['metric']['length']['units']['km'];
        } else if ($this->_base >= 1) {
            return $this->_TABLES['metric']['length']['units']['m'];
        } else{
            return $this->_TABLES['metric']['length']['units']['mm'];
        }
    }

    private function _findAppropriateMetricVolume() {
        if (!empty($this->_options['unit']) && isset($this->_TABLES['metric']['volume']['units'][$this->_options['unit']])) {
            return $this->_TABLES['metric']['volume']['units'][$this->_options['unit']];
        }

        if ($this->_base >= 1) {
            return $this->_TABLES['metric']['volume']['units']['l'];
        } else{
            return $this->_TABLES['metric']['volume']['units']['ml'];
        }
    }

    private function _findAppropriateMetricWeight() {
        if (!empty($this->_options['unit']) && isset($this->_TABLES['metric']['weight']['units'][$this->_options['unit']])) {
            return $this->_TABLES['metric']['weight']['units'][$this->_options['unit']];
        }

        if ($this->_base >= 1000) {
            return $this->_TABLES['metric']['weight']['units']['kg'];
        } else if ($this->_base >= 1) {
            return $this->_TABLES['metric']['weight']['units']['g'];
        } else{
            return $this->_TABLES['metric']['weight']['units']['mg'];
        }
    }

    private function _getCoefficient($coefficient) {
        if (is_string($coefficient)) {
            $coefficient = eval('return ' . $coefficient . ';');
        }

        return $coefficient;
    }

    private function _toFraction($number) {
        if (bccomp($number, .5, 1) === 0) {
            return '1/2';
        } else if (bccomp(fmod($number, .25), 2) === 0) {
            return $number / .25 . '/4';
        } else if (bccomp(fmod($number, .125), 3) === 0) {
            return $number / .2 . '/8';
        }

        return '';
    }

    private function _tokenize() {
        $matches = null;
        preg_match_all(self::_MEASURE_STRING_TOKEN_REGEX, $this->_measure, $matches);
        $this->_tokens['value'] = trim($matches[0][0]);
        $this->_tokens['unit'] = trim($matches[0][1]);
    }

    private function _parseMeasure() {
        foreach ($this->_TABLES as $system => $types) {
            foreach ($types as $typeKey => $type) {
                foreach ($type['units'] as $unit) {
                    foreach ($unit['sign'] as $sign) {
                        if ($sign === $this->_tokens['unit']) {
                            $this->_base = $this->_tokens['value'] * $this->_getCoefficient($unit['base']);
                            $this->_baseUnit = $unit;
                            $this->_system = $system;
                            $this->_type = $typeKey;
                            return;
                        }
                    }
                }
            }
        }
    }
}
