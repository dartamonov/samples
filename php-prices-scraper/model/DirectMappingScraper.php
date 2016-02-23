<?php 
/*
Creates mapping by product page url. loads product page directly
*/

class DirectMappingScraper extends BaseScraper {
    private $name_xpath = '//h1[ @id="product-name"]';
    private $image_xpath = '//td[ @id="alt-image-cont"]/div/img[ @class="_ioe"]/@src';

    protected function parse($pid) {
	error_reporting(E_ALL ^ E_WARNING ^ E_DEPRECATED);

	$dom = new DOMDocument();
	$dom->loadHTML($this->data);
	$this->xpath_obj = new DOMXPath($dom);

	$name = $this->getXpathValue($this->name_xpath);
	$image = $this->getXpathValue($this->image_xpath);
	if ($name != "" && $image != "") {
		$result['name'] = $name;
		$result['image'] = $image;
        	file_put_contents('../googlepages/mapping/positive/' . $pid . '.html', $this->data);

	        return $result;
        } else {
        	file_put_contents('../googlepages/mapping/negative/' . $pid . '.html', $this->data);
        }
    
        return false;
    }
}