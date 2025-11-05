<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

interface XmlParserSourceInterface {
    /**
     * @param $xmlString
     *
     * return Returns an object that implements XMLParserDocumentInterface, false if it cannot parse the Xml
     */
    public function parseXml($xmlString);
}
