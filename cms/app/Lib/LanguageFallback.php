<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

//App::uses('L10n', 'Cake/I18n');
require_once(CAKE_CORE_INCLUDE_PATH . DS . 'Cake' . DS . 'I18n' . DS . 'L10n.php');

/**
 * Class LanguageFallback
 */
class LanguageFallback {
    private $_langCodes = [];

    public function __construct() {
        $this->_langCodes = self::_makeFallbackArray();
    }

    /**
     * Return an array sorted from most appropriate language to least appropriate for this session
     * @return array
     */
    public static function getFallbackPriorityArray() {
        return self::_makeFallbackArray();
    }

    /*
     * $supportedLangCodes format:
     * [
     *  'xxx', | ex: eng
     *  'xx-xx', | ex: en-ca
     *  'xx_xx' | ex: en_ca
     * ]
     */
    /**
     * Given a list of languages supported by the app, return the most appropriate for this session (instance method version)
     * @param array $requestedLangCodes An array of languages supported by the calling code
     * @return null The most appropriate language code, null if none applies
     */
    public function findAppropriate(array $requestedLangCodes) {
        return self::findAppropriateStatic($requestedLangCodes, $this->_langCodes);
    }

    /**
     * Given a list of languages supported by the app, return the most appropriate for this session
     * @param array $requestedLangCodes An array of languages supported by the calling code
     * @param array $_langCodes An array of desired languages for this session
     * @return null The most appropriate language code, null if none applies
     */
    public static function findAppropriateStatic(array $requestedLangCodes, array $_langCodes = null) {
        if (empty($_langCodes)) {
            $_langCodes = self::_makeFallbackArray();
        }

        $requestedLangCodes = self::_prepareRequestedLangCodeArray($requestedLangCodes);

        $flippedAvailableLangCodes = array_flip($_langCodes);
        foreach ($requestedLangCodes as $langCode) {
            if (isset($flippedAvailableLangCodes[$langCode])) {
                return $langCode;
            }
        }

        return null;
    }

    /* PRIVATE */
    private static function _makeFallbackArray() {
        $langCodes = CakeSession::check('Config.language') ? [CakeSession::read('Config.language')] : [];
        $currentLanguage = Configure::read('Config.language');

        $langCodes[] = $currentLanguage;
        if (strlen($currentLanguage) === 5) {
            $l10n = new L10n();
            $temp = $l10n->catalog($currentLanguage);
            $langCodes[] = $temp['localeFallback'];
        }
        $langCodes = array_merge([], array_unique(array_merge($langCodes, Configure::read('Language.available'))));

        return $langCodes;
    }

    private static function _prepareRequestedLangCodeArray($requestedLangCodes) {
        $l10n = new L10n();
        $requestedLangCodesLength = count($requestedLangCodes);
        for ($i = 0; $i < $requestedLangCodesLength; ++$i) {
            //$requestedLangCodes[$i] = str_replace('-', '_', $requestedLangCodes[$i]);
            $temp = $l10n->catalog(/*str_replace('_', '-', */
                $requestedLangCodes[$i]/*)*/);
            $threeLetterCode = $temp['localeFallback'];
            if ($threeLetterCode !== null && array_search($threeLetterCode, $requestedLangCodes) === false) {
                array_splice($requestedLangCodes, $i + 1, 0, $threeLetterCode);
                ++$i; // Skipping next element
            }
        }

        return $requestedLangCodes;
    }
}
