<?php 

class MapperThread extends Thread {
	private $ids = array();
	
	public function __construct($ids) {
		$this->ids = $ids;
	}
	
	public function run() {
		foreach ($this->ids as $id) {
			$product = new Product($id);
    			$log = $product->getSku();
			//echo Thread::getCurrentThreadId() . ": ";
        		$start = microtime(true);
			if ($product->map()) {
				$log .= " + ";
			} else {
				$log .= " - ";
			}
        		$finish = microtime(true);
	        	$log .= round($finish - $start);
			echo $log."\n";
		}
	}

}

