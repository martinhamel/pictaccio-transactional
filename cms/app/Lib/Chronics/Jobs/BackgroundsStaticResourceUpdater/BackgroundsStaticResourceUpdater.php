<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('Path', 'Lib');

class BackgroundsStaticResourceUpdater implements ChronicJobInterface {
    public function execute() {
        $this->_loadBackgroundModels();
        $this->_updateStaticResource(
            $this->_prepareStaticJson()
        );
    }

    public function onBackgroundsUpdate($event) {
        $this->execute();
    }


    /* PRIVATE */
    private function _loadBackgroundModels() {
        $this->Background = ClassRegistry::init('Background');
        $this->BackgroundCategory = ClassRegistry::init('BackgroundCategory');
    }

    private function _prepareStaticJson() {
        $backgroundsJson = [];
        $featured = [];

        $backgroundCategories = $this->BackgroundCategory->find('all');
        $backgrounds = $this->Background->find('all');
        foreach ($backgrounds as $background) {
            $info = [
                'id' => $background['Background']['id'],
                'productionIdentifier' => $background['Background']['production_identifier'],
                'url' => $background['Background']['image'],
                'locales' => $background['Background']['name_locale'],
                'featured' => $background['Background']['featured']
            ];

            if (!empty($background['Background']['categories'])) {
                foreach ($background['Background']['categories'] as $tag) {
                    $backgroundsJson[$tag][] = $info;
                }

                if ($background['Background']['featured']) {
                    $featured[] = $info;
                }
            }
        }

        return [
                'backgrounds' => $backgroundsJson,
                'featured' => $featured,
                'categories' => array_reduce($backgroundCategories,
                    function($acc, $row) {
                        $acc[$row['BackgroundCategory']['id']] =
                            [
                                'en' => $row['BackgroundCategory']['name_locale']['en'],
                                'fr' => $row['BackgroundCategory']['name_locale']['fr']
                            ];
                        return $acc;
                    }, [])
            ];
    }

    private function _updateStaticResource($json) {
        $staticPath = Path::join(Configure::read('Directories.static'), 'backgrounds.json');
        file_put_contents($staticPath, json_encode($json));
    }
}
