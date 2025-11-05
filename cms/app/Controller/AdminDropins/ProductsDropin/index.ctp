<script>var assetUploadUrl = '<?= $this->Admin->dropinUrl('7e77a972-a968-4ccb-8bb2-f416cc9623a8', 'upload'); ?>';</script>
<script><?php include 'script.inc.js'; ?></script>
<style type="text/css"><?php include 'style.inc.css'; ?></style>

<section id="admin-products">
    <h2><?= __d('admin-proddrop', 'TITLE'); ?></h2>

    <section id="action-bar" class="action-bar right">
    </section>

    <div class="tab" data-heo2-ui="tab">
        <div>
            <h3><?= __d('admin-proddrop', 'PRODUCT_PRODUCTS'); ?></h3>
            <div class="product-table" data-heo2-ui="db-table" data-heo2-name="product-table"
                 data-heo2-options="url:+=product_dbTable;hide:themes_json,themes_map_json,options_json;edit:true"
                 data-heo2-attach="@add-row:_product_addRow;@edit-row:_product_editRow">
                <script type="application/json"><?= $productTable; ?></script>
                <div class="filters">
                    <div>
                        <label>
                            <?= __d('admin-proddrop', 'PRODUCT_CATEGORY'); ?>
                            <select name="categories">
                                <option></option>
                                <?php foreach ($productCategories as $category): ?>
                                    <option value="<?= $category['ProductCategory']['id']; ?>"><?= $category['ProductCategory']['internal_name']; ?></option>
                                <?php endforeach; ?>
                            </select>
                        </label>

                        <label>
                            <?= __d('admin-proddrop', 'PRODUCT_TAGS'); ?>
                            <div class="product-tags-filter" data-heo2-ui="tags" data-heo2-name="product-tags-filter" data-heo2-options="dropdown:true"></div>
                        </label>
                    </div>
                    <button class="ui-button" data-heo2-attach="@click:_applyFilter_click"><?= __d('admin_proddrop', 'APPLY'); ?></button>
                </div>
            </div>
        </div>

        <div>
            <h3><?= __d('admin-proddrop', 'PRODUCT_GROUPS'); ?></h3>
            <div class="product-group-table" data-heo2-ui="db-table" data-heo2-name="product-group-table"
                 data-heo2-options="url:+=productGroup_dbTable;edit:true"
                 data-heo2-attach="@add-row:_productGroup_addRow;@edit-row:_productGroup_editRow">
                <script type="application/json"><?= $productGroupTable; ?></script>
            </div>
        </div>

        <div>
            <h3><?= __d('admin-proddrop', 'PRODUCT_CATEGORIES'); ?></h3>
            <div class="product-categories-table" data-heo2-ui="db-table" data-heo2-name="product-categories-table"
                 data-heo2-options="url:+=productCategories_dbTable;edit:true"
                 data-heo2-attach="@add-row:_productCategories_addRow;@edit-row:_productCategories_editRow">
                <script type="application/json"><?= $productCategoryTable; ?></script>
            </div>
        </div>
    </div>

    <div id="product-overlay" class="product-overlay overlay overlay-default" data-heo2-ui="overlay" data-heo2-name="product-overlay" data-heo2-options="close:true;group:true">
        <h3 class="group-add"><?= __d('admin-proddrop', 'ADD_PRODUCT'); ?></h3>
        <h3 class="group-edit"><?= __d('admin-proddrop', 'EDIT_PRODUCT'); ?></h3>

        <div class="tab" data-heo2-ui="tab">
            <div>
                <h3><?= __d('admin-proddrop', 'PRODUCT_INFO'); ?></h3>

                <label class="input-group">
                    <?= __d('admin-proddrop', 'PRODUCT_TAGS'); ?>
                    <div data-heo2-ui="tags" data-heo2-name="product-tags" data-heo2-options="create:true"></div>
                </label>

                <label class="input-group">
                    <?= __d('admin-proddrop', 'PRODUCT_CATEGORY'); ?>
                    <select id="product-category" name="product-category" class="product-category"></select>
                </label>

                <label class="input-group">
                    <?= __('GENERIC_NAME_LABEL'); ?>
                    <div class="columns-2">
                        <div>
                            <label for="name-fra" class="sub-label"><?= __('LANG_FRENCH'); ?></label>
                            <input type="text" name="name-fra" autofocus>
                        </div>
                        <div>
                            <label for="name-eng" class="sub-label"><?= __('LANG_ENGLISH'); ?></label>
                            <input type="text" name="name-eng">
                        </div>
                    </div>
                </label>

                <label class="input-group">
                    <?= __('GENERIC_DESCRIPTION_LABEL'); ?>
                    <div class="columns-2">
                        <div>
                            <label for="desc-fra" class="sub-label"><?= __('LANG_FRENCH'); ?></label>
                            <input type="text" name="desc-fra" autofocus>
                        </div>
                        <div>
                            <label for="desc-eng" class="sub-label"><?= __('LANG_ENGLISH'); ?></label>
                            <input type="text" name="desc-eng">
                        </div>
                    </div>
                </label>

                <div class="input-group columns-2">
                    <div>
                        <label for="price"><?= __('GENERIC_PRICE'); ?></label>
                        <input type="text" id="price">
                    </div>
                    <div>
                        <label for="weight"><?= __d('admin-proddrop', 'PRODUCT_WEIGHT'); ?></label>
                        <input type="text" id="weight">
                    </div>
                </div>

                <div class="input-group">
                    <div>
                        <input type="checkbox" id="build-your-own-package" data-heo2-attach="@click:_buildYourOwn_click">
                        <label for="build-your-own-package" class="inline-label"><?= __d('admin-proddrop', 'BUILD_YOUR_OWN_PACKAGE'); ?></label>
                    </div>
                    <div>
                        <label for="build-your-own-package-ref"><?= __d('admin-proddrop', 'BUILD_YOUR_OWN_PACKAGE'); ?></label>
                        <select id="build-your-own-package-ref" disabled></select>
                    </div>
                </div>

                <div class="input-group">
                    <div>
                        <input type="checkbox" id="allow-mix">
                        <label for="allow-mix" class="inline-label"><?= __d('admin-proddrop', 'PRODUCT_CAN_MIX_STUDENTS'); ?></label>
                    </div>
                    <div>
                        <input type="checkbox" id="sliding-price" data-heo2-attach="@click:_slidingPriceCheckbox_click">
                        <label for="sliding-price" class="inline-label"><?= __d('admin-proddrop', 'PRODUCT_SLIDING_PRICE'); ?></label>
                    </div>
                    <div>
                        <input type="checkbox" id="allow-group-picture">
                        <label for="allow-group-picture" class="inline-label"><?= __d('admin-proddrop', 'PRODUCT_ALLOW_GROUP_PICTURE'); ?></label>
                        <span class="only-group-picture">
                            <input type="checkbox" id="only-group-picture">
                            <label for="only-group-picture" class="inline-label"><?= __d('admin-proddrop', 'PRODUCT_ONLY_GROUP_PICTURE'); ?></label>
                        </span>

                    </div>
                    <div>
                        <input type="checkbox" id="digital-image" data-heo2-attach="@click:_digitalImageCheckbox_click">
                        <label for="digital-image" class="with-option inline-label"><?= __d('admin-proddrop', 'PRODUCT_DIGITAL'); ?></label>
                        <label class="surcharge">
                            <?= __d('admin-proddrop', 'PRODUCT_SURCHARGE'); ?>
                            <input type="text" id="digital-image-price" disabled>
                        </label>
                    </div>
                    <div>
                        <input type="checkbox" id="touchups" data-heo2-attach="@click:_touchupsCheckbox_click">
                        <label for="touchups" class="with-option inline-label"><?= __d('admin-proddrop', 'PRODUCT_TOUCHUPS'); ?></label>
                        <label class="surcharge">
                            <?= __d('admin-proddrop', 'PRODUCT_SURCHARGE'); ?>
                            <input type="text" id="touchups-price" disabled>
                        </label>
                    </div>
                </div>

                <div class="product-images-dropzone">
                    <div id="product-img-container">
                        <div class="placeholder"></div>
                    </div>
                    <div class="browse-container">
                        <a id="product-browse-trigger" href="javascript:;"><?= __('GENERIC_BROWSE'); ?></a>
                    </div>
                </div>
            </div>

            <div>
                <h3><?= __d('admin-proddrop', 'PRODUCT_THEMES'); ?></h3>
                <label class="input-group">
                    <div class="align-right">
                        <a href="javascript:;" data-heo2-attach="@click:_themeAdd_click"><i class="fa fa-plus"></i> <?= __('GENERIC_ADD'); ?></a>
                    </div>
                    <?= __d('admin-proddrop', 'PRODUCT_THEME_LIST'); ?><br>
                    <select name="themes" class="theme-list" data-heo2-attach="@click:_themeList_click;@dblclick:_themeList_dblClick" data-valFormat="array" multiple></select>
                </label>
            </div>
        </div>

        <div class="buttons">
            <input type="hidden" name="themes-map">
            <button id="add-product-button" class="ui-button float-right group-add" add><?= __('GENERIC_ADD'); ?></button>
            <button id="edit-product-button" class="ui-button float-right group-edit" edit><?= __('GENERIC_CHANGE'); ?></button>
        </div>
    </div>

    <div id="product-group-overlay" class="product-group-overlay overlay overlay-default" data-heo2-ui="overlay" data-heo2-name="product-group-overlay" data-heo2-options="close:true;group:true">
        <h3 class="group-add"><?= __d('admin-proddrop', 'ADD_PRODUCT_GROUP'); ?></h3>
        <h3 class="group-edit"><?= __d('admin-proddrop', 'EDIT_PRODUCT_GROUP'); ?></h3>

        <label class="input-group">
            <?= __('GENERIC_NAME_LABEL'); ?>
            <div class="columns-2">
                <div>
                    <label for="name-fra" class="sub-label"><?= __('LANG_FRENCH'); ?></label>
                    <input type="text" name="name-fra" autofocus>
                </div>
                <div>
                    <label for="name-eng" class="sub-label"><?= __('LANG_ENGLISH'); ?></label>
                    <input type="text" name="name-eng">
                </div>
            </div>
        </label>
        <label class="products input-group">
            <?= __d('admin-proddrop', 'PRODUCT_PRODUCTS'); ?>
            <div class="columns-2">
                <div>
                    <label><?= __d('admin-proddrop', 'PRODUCT_SELECTED'); ?></label>
                    <div class="drag-hint-wrapper">
                        <div id="drag-hint" class="drag-hint"></div>
                    </div>
                    <select name="products-selected" data-heo2-attach="@dblclick:_productGroupSelected_dblclick" multiple>

                    </select>
                </div>
                <div>
                    <label><?= __d('admin-proddrop', 'PRODUCT_AVAILABLE'); ?></label>
                    <select name="products-available" data-heo2-attach="@dblclick:_productGroupAvailable_dblclick" multiple>

                    </select>
                </div>
            </div>
        </label>
        <div class="buttons">
            <input type="hidden" name="themes-map">
            <button id="add-product-group-button" class="ui-button float-right group-add" add><?= __('GENERIC_ADD'); ?></button>
            <button id="edit-product-group-button" class="ui-button float-right group-edit" edit><?= __('GENERIC_CHANGE'); ?></button>
        </div>
    </div>

    <div id="product-category-overlay" class="product-category-overlay overlay overlay-default" data-heo2-ui="overlay" data-heo2-name="product-category-overlay" data-heo2-options="close:true;group:true">
        <h3 class="group-add"><?= __d('admin-proddrop', 'ADD_PRODUCT_CATEGORY'); ?></h3>
        <h3 class="group-edit"><?= __d('admin-proddrop', 'EDIT_PRODUCT_CATEGORY'); ?></h3>

        <label class="input-group">
            <?= __('GENERIC_INTERNAL_NAME_LABEL'); ?>
            <input type="text" name="internal-name" autofocus>
        </label>

        <label class="input-group">
            <?= __('GENERIC_NAME_LABEL'); ?>
            <div class="columns-2">
                <div>
                    <label for="name-fra" class="sub-label"><?= __('LANG_FRENCH'); ?></label>
                    <input type="text" name="name-fra">
                </div>
                <div>
                    <label for="name-eng" class="sub-label"><?= __('LANG_ENGLISH'); ?></label>
                    <input type="text" name="name-eng">
                </div>
            </div>
        </label>

        <div class="buttons">
            <button id="add-product-category-button" class="ui-button float-right group-add" add><?= __('GENERIC_ADD'); ?></button>
            <button id="edit-product-category-button" class="ui-button float-right group-edit" edit><?= __('GENERIC_CHANGE'); ?></button>
        </div>
    </div>
</section>
