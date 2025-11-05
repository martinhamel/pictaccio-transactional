<?php

App::uses('JsonLocaleExpander', 'Lib');

class LocaleBehavior extends ModelBehavior {
    public function afterFind(Model $model, $results, $primary = false) {
        return JsonLocaleExpander::expandModelSet($results);
    }
}
