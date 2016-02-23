<?php 

require_once 'common.php';
define ('THREADS_NUM', 5);

$productList = new ProductList(array('ready' => 0, 'checked' => 0, 'ignored' => 1));
$ids = $productList->getProductIds();
$products_num = count($ids);
if ($products_num <= THREADS_NUM) {
	$ids_chunks = array_chunk($ids, 1, true);
	$poos_size = $products_num;
} else {
	$chunk_size = ceil ($products_num / THREADS_NUM);
	$ids_chunks = array_chunk($ids, $chunk_size, true);
	$poos_size = THREADS_NUM;
}
// Create threads pool
$pool = array();
for ($i = 0; $i < $poos_size; $i++) {
	$pool[] = new MapperThread($ids_chunks[$i]);
}


write_log('Starting to map ' . $products_num . ' products');
$all_start = microtime(true);
// Start download
foreach($pool as $worker){
    $worker->start();
}
// Wait for each thread to complete
foreach($pool as $worker){
    $worker->join();
}
$all_finish = microtime(true);
echo "Total downloading time: ".round($all_finish - $all_start)." sec\n";
echo "Processed ".$products_num."\n";


?>