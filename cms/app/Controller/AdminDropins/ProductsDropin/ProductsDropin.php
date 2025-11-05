<?php


App::uses('DbTable', 'Lib');

class ProductsDropin extends AdminDropin {
    public function index() {
        $this->_loadModel('Product');
        $this->_loadModel('ProductGroup');
        $this->_loadModel('ProductCategory');
        $this->_set('productTable', json_encode($this->Product->findDbTable('all')));
        $this->_set('productGroupTable', json_encode($this->ProductGroup->findDbTable('all')));
        $this->_set('productCategoryTable', json_encode($this->ProductCategory->findDbTable('all')));
        $this->_set('productCategories', $this->ProductCategory->find('all'));
    }

    public function product_dbTable() {
        if ($this->_request->is('post')) {
            $this->_loadModel('Product');
            $dbTable = new DbTable($this->Product);

            try {
                $results = $dbTable->process($this->_request->data);
                $this->_host->renderJson(['status' => empty($results) ? 'failed' : 'ok', 'results' => $results]);
            } catch (RuntimeException $e) {
                $this->_host->renderJson(['status' => 'failed', 'message' => $e->getMessage()]);
            }
        } else {
            throw new BadRequestException();
        }
    }

    public function productGroup_dbTable() {
        if ($this->_request->is('post')) {
            $this->_loadModel('ProductGroup');
            $dbTable = new DbTable($this->ProductGroup);
            $results = $dbTable->process($this->_request->data);

            $this->_host->renderJson(['status' => empty($results) ? 'failed' : 'ok', 'results' => $results]);
        } else{
            throw new BadRequestException();
        }
    }

    public function productCategories_dbTable() {
        if ($this->_request->is('post')) {
            $this->_loadModel('ProductCategories');
            $dbTable = new DbTable($this->ProductCategories);
            $results = $dbTable->process($this->_request->data);

            $this->_host->renderJson(['status' => empty($results) ? 'failed' : 'ok', 'results' => $results]);
        } else{
            throw new BadRequestException();
        }
    }

    public function listBYOPInternalNames() {
        $this->_loadModel('ProductBuildYourOwn');

        $this->_host->renderJson(['status' => 'ok', 'results' => $this->ProductBuildYourOwn->listInternalNames()]);
    }

    public function listCategoryInternalNames() {
        $this->_loadModel('ProductCategory');

        $this->_host->renderJson(['status' => 'ok', 'results' => $this->ProductCategory->listInternalNames()]);
    }


    /* PRIVATE */
    private function _splitPrefixedIds($prefix, array $ids) {
        return array_reduce($ids, function ($accumulator, $value) use ($prefix) {
            if (substr($value, 0, strlen($prefix)) === $prefix) {
                $accumulator[] = $value;
            }

            return $accumulator;
        }, []);
    }
}
