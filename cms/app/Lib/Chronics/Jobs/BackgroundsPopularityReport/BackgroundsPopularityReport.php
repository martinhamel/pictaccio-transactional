<?php


App::uses('Path', 'Lib');

class BackgroundsPopularityReport implements ChronicJobInterface {
    public function execute() {
        $this->BackgroundPopularityIndex = ClassRegistry::init('BackgroundPopularityIndex');
        $this->Order = ClassRegistry::init('Order');

        $lastRow = $this->BackgroundPopularityIndex->find('first', [
            'order' => ['BackgroundPopularityIndex.day DESC']
        ]);

        $currentDay = !empty($lastRow) ? $lastRow['BackgroundPopularityIndex']['day'] : null;
        $dayStats = [];
        $conditions = null;
        if ($currentDay !== null) {
            $conditions = ['Order.created >=' => $currentDay];
        }

        foreach ($this->Order->rows($conditions) as $row) {
            $rowDay = date('Y-m-d', strtotime($row['Order']['created']));
            if ($currentDay === null || $rowDay !== $currentDay) {
                if ($currentDay !== null) {
                    $this->BackgroundPopularityIndex->deleteAll(['BackgroundPopularityIndex.day' => $currentDay]);
                    $this->BackgroundPopularityIndex->create();
                    $this->BackgroundPopularityIndex->save([
                        'day' => $currentDay,
                        'stats_json' => json_encode($dayStats)
                    ]);
                }

                $currentDay = $rowDay;
                $dayStats = [];
            }

            foreach ($row['Order']['photo_selection_json'] as $selection) {
                if (!empty($selection['background'])) {
                    if (empty($dayStats[$selection['background']['url']])) {
                        $dayStats[$selection['background']['url']] = 0;
                    }

                    ++$dayStats[$selection['background']['url']];
                }
            }
        }
    }

    public function onBackgroundsPopularityReport($event) {
        $this->execute();
    }


    /* PRIVATE */

}
