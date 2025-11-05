<?php

class SimpleXmlParserSource implements XmlParserSourceInterface, XmlParserDocumentInterface, IteratorAggregate {
    private $_xml = null;

    public function __construct($xml = null) {
        if (!empty($xml)) {
            $this->_xml = $xml;
        }
    }

    public function getIterator() {
        return $this->_xml;
    }


    /* ArrayAccess interface */
    public function offsetExists($offset) {
        return isset($this->_xml->{$offset});
    }

    public function offsetGet($offset) {
        return new SimpleXmlParserSource($this->_xml->{$offset});
    }

    public function offsetSet($offset, $value) {
        // Nothing to do
    }

    public function offsetUnset($offset) {
        // Nothing to do
    }


    /* XmlParserSourceInterface interface */
    public function parseXml($xmlString) {
        if ($this->_loadXml($xmlString)) {
            return $this;
        }

        return false;
    }

    /* PRIVATE */

    private function _loadXml($xmlString) {
        libxml_use_internal_errors(true);
        $this->_xml = simplexml_load_string('<root>' . preg_replace('/<\?xml.*\?>/', '', $xmlString) . '</root>');

        $loaded = !empty($this->_xml);
        if ($loaded) {
            CakeLog::write('debug', 'CanadaPostShippingSource: Received a bad XML response from Canada Post\'s servers');
        }

        return $loaded;
    }
}
