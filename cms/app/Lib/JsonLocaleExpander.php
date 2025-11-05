<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('LanguageFallback', 'Lib');

/**
 * Expand JsonLocale fields (i.e. fields ending in locale_json) from a CakePHP record set
 *
 * CakePHP format:
 *  modelSet:
 *  [
 *   {
 *    ModelName: {see set below},
 *    ...
 *   },
 *   ...
 *  ]
 *
 *  set:
 *  {
 *   ColumnName: value,
 *   ...
 *  }
 */
class JsonLocaleExpander {
    const _LOCALE_JSON_FIELD_POSTFIX = 'locale';

    /**
     * Expand a target from a CakePHP formatted record using locale that is currently set in the session. If an exact match cannot be found in __$locales__, this method fallbacks according to the __LanguageFallback__ rules.
     * @param $locales string The JSON formatted string (e.g. {"en": "Home Page", "fr": "Page d'accueil"})
     * @return string The expanded string, '<MISSING STRING> if nothing is found.
     */
    public static function expand($locales) {
        $langCodes = LanguageFallback::getFallbackPriorityArray();

        if (!is_array($locales)) {
            $locales = json_decode($locales, true);
        }

        $string = '<MISSING STRING>';

        foreach ($langCodes as $langCode) {
            if (!empty($locales[$langCode])) {
                $string = $locales[$langCode];
                break;
            }
        }

        return $string;
    }

    /**
     * Expand all the string in a CakePHP formatted set of models
     * @param $modelSet array The set of models
     * @return array The same set of models with the LocaleJson fields expanded
     */
    public static function expandModelSet($modelSet) {
        $formatFixed = false;
        // TODO: This check looks brittle.. make sure it's fine.
        if (!isset($modelSet[0])) {
            /* Fix input format. This class expect to have [Records][Models][Columns].
             * When the method is called for a single record it may not have this initial array of records.
             * Create a dummy one so we don't have to branch later on.
             * Remember that we did so that we can unwind it later on to match the format that we received.
             */
            $modelSet = [$modelSet];
            $formatFixed = true;
        }

        foreach ($modelSet as &$models) {
            foreach ($models as &$model) {
                if (is_array($model)) {
                    $model = self::expandSet($model);
                }
            }
        }

        return $formatFixed ? $modelSet[0] : $modelSet;
    }

    /**
     * Expand fields in a model
     * @param $fieldSet array The model to expand
     * @return mixed The same model with fields expanded
     */
    public static function expandSet($fieldSet) {
        foreach ($fieldSet as $columnName => &$field) {
            if (substr($columnName, -strlen(self::_LOCALE_JSON_FIELD_POSTFIX)) === self::_LOCALE_JSON_FIELD_POSTFIX) {
                $fieldSet["{$columnName}_original"] = is_array($field) ? $field : json_decode($field, true);
                $field = self::expand($field);
            }
        }

        return $fieldSet;
    }
}
