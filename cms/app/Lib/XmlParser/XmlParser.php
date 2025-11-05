<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

require_once 'XmlParserSourceInterface.php';
require_once 'XmlParserDocumentInterface.php';
App::uses('SimpleXmlParserSource', 'Lib' . DS . 'XmlParser' . DS . 'XmlParserSource');

class XmlParser {
    public static function create(array $params) {
        // TODO: Make this an actual factory
        $simple = new SimpleXmlParserSource();
        $simple->parseXml($params['xmlString']);
        return $simple;
    }
}
