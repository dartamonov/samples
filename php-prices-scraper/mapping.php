<?php 


require_once 'model/DB.php';
require_once 'model/BaseProduct.php';
require_once 'model/Product.php';
require_once 'model/ProductList.php';
require_once 'model/BaseScraper.php';
require_once 'model/MappingScraper.php';
require_once 'model/PricingScraper.php';

$tplVars = array(
    // Number of records per page available in the filter. You can change it as you like.
    'itemsFilter' => array(20, 40, 80)
);

// Filter/pagination values validation and setting
$tplVars['filterVars'] = array(
    'ready' => empty($_GET['ready']) ? 0 : intval($_GET['ready']),
    'checked' => empty($_GET['checked']) ? 0 : intval($_GET['checked']),
    'outdated' => empty($_GET['outdated']) ? 0 : intval($_GET['outdated']),
    'ignored' => empty($_GET['ignored']) ? 0 : intval($_GET['ignored']),
    'vendor' => empty($_GET['vendor']) ? '' : intval($_GET['vendor']),
    'sku' => $_GET['sku'],
    'items' => empty($_GET['items']) ? $tplVars['itemsFilter'][0] : intval($_GET['items']),
    'page' => empty($_GET['page']) ? 1 : intval($_GET['page']),
);

// Delete data
if (!empty($_GET['delete']) && is_array($_GET['delete'])) {
    list($id) = array_keys($_GET['delete']);
    $product = new Product($id);
    $product->delete();
    
    // Redirect to avoid duplicate submission on page refresh
    $queryString = array();
    foreach ($tplVars['filterVars'] as $key => $val)
        $queryString[] = $key . '=' . $val;
    header('Location: http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'] . '?' . implode('&', $queryString));
    exit();
}

// Save data
if (!empty($_GET['save']) && is_array($_GET['save'])) {
    list($id) = array_keys($_GET['save']);
    $product = new Product($id);
    $product->setReady(empty($_GET['setReady'][$id]) ? 0 : 1);
    $product->setChecked(empty($_GET['setChecked'][$id]) ? 0 : 1);
    $product->setIgnored(empty($_GET['setIgnored'][$id]) ? 0 : 1);
    $product->save();
    
    // Redirect to avoid duplicate submission on page refresh
    $queryString = array();
    foreach ($tplVars['filterVars'] as $key => $val)
        $queryString[] = $key . '=' . $val;
    header('Location: http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'] . '?' . implode('&', $queryString));
    exit();
}

// Get products
$productListParams = array(
    'ready' => $tplVars['filterVars']['ready'],
    'checked' => $tplVars['filterVars']['checked'],
    'outdated' => $tplVars['filterVars']['outdated'],
    'ignored' => $tplVars['filterVars']['ignored'],
    'variant' => 0,
    'vendor' => $tplVars['filterVars']['vendor'],
    'sku' => $tplVars['filterVars']['sku'],
    'limit' => $tplVars['filterVars']['items'],
    'offset' => ($tplVars['filterVars']['page'] - 1) * $tplVars['filterVars']['items']
);

$productList = new ProductList($productListParams);
while ($product = $productList->next()) {
    // Don't render size variants individually
    $prdct = $product->getAttributes();
    $tplVars['products'][] = $prdct;
}

// Pagination
unset($productListParams['limit'], $productListParams['offset']);
$totalProductList = new ProductList($productListParams);
$totalProducts = $totalProductList->rowCount();
$pages = $totalProducts / $tplVars['filterVars']['items'];

if ($pages != intval($pages))
    $pages = intval($pages) + 1;


$tplVars['totalPages'] = $pages;
$tplVars['totalProducts'] = $totalProducts;


// Display page
echo process_template('templates/mapping.php', $tplVars);

function process_template($template, $data) {
    ob_start();
    include $template;
    $result = ob_get_contents();
    ob_end_clean();
    
    return $result;
}