<?php 

// Base class for managing DB data
class BaseProduct {
    
    // Product-related properties
    protected $id;               // (ro) Scraper internal ID
    protected $name;             // Store Name
    protected $sku;              // Store SKU
    protected $googleName;       // Product name on google.com
    protected $googleUrl;        // Google product page URL
    protected $googleImage;      // Product image URL captured from google.com
    protected $googleSearchUrl;  // Generated URL for automatic/manual product search
    protected $manual;           // (ro) Set to 0 if $googleUrl was scraped automatically, 1 - if set manually
    protected $ready;            // Set to 1 if scrape found to be success by script
    protected $checked;          // Set to 1 if scrape information was reviewed and found correct
    protected $ignored;          // Set to 1 if scrape information was reviewed and found correct
    protected $variant;          // Set to 1 if scrape information was reviewed and found correct
    protected $outdated;          // Set to 1 if scrape information was reviewed and found correct
    protected $checkedOn;        // (ro) Date and time of scrape information approval (server timezone)
    protected $lastSync;         // (ro) Last scrape date and time (server timezone)
    public $debug = false;
    
    // Internal class properties
    private $isNew = 0;           // Set to 0 when fetching existing object, 1 - otherwise
    private $_dirty = array();     // Names of properties that were changed but not yet written to the database
    
    // DB-related properties
    protected $dbh;               // (ro) PDO DB connection handler
    public static $dbTable = 'google_shopping_mapping';  // DB table
    
    protected $roProperties
        = array('id', 'manual', 'checkedOn', 'lastSync', 'dbh', 'imagePath'); // List of read-only properties
    
    protected $dbRelation = array ( // Property-to-DB-field relation data
        		'name'             => 'vm_name',
        		'sku'              => 'vm_sku',
        		'googleName'       => 'gs_name',
        		'googleUrl'        => 'gs_url',
        		'googleImage'      => 'gs_image',
        		'googleSearchUrl'  => 'gs_search_url',
        		'manual'           => 'manual',
        		'ready'            => 'ready',
        		'checked'          => 'checked',
        		'ignored'          => 'ignored',
        		'variant'          => 'variant',
        		'outdated'         => 'outdated',
        		'checkedOn'        => 'checked_on',
        		'lastSync'         => 'last_sync'
        );
    
    public function __construct($id = null) {
        // In Threads arrays are not shared. 
	// $this->dbRelation is NULL when called from Thread class
	// Have to define it here again 
	// Hacky way {
	$this->dbRelation = array ( // Property-to-DB-field relation data
        		'name'             => 'vm_name',
        		'sku'              => 'vm_sku',
        		'googleName'       => 'gs_name',
        		'googleUrl'        => 'gs_url',
        		'googleImage'      => 'gs_image',
        		'googleSearchUrl'  => 'gs_search_url',
        		'manual'           => 'manual',
        		'ready'            => 'ready',
        		'checked'          => 'checked',
        		'ignored'          => 'ignored',
        		'variant'          => 'variant',
        		'outdated'         => 'outdated',
        		'checkedOn'        => 'checked_on',
        		'lastSync'         => 'last_sync'
        );
	// }

    	$this->dbh = DB::getHandler();
        if ($id !== null) {
            $sth = $this->dbh->prepare('SELECT * FROM ' . self::$dbTable . ' WHERE id = ?');
            $sth->execute(array($id));
            if (!$sth->rowCount()) {
                throw new Exception('No mapping data with ID = ' . $id); 
            } else {
            	$this->id = $id;
                $data = $sth->fetch(PDO::FETCH_ASSOC);
                foreach ($this->dbRelation as $property => $dbField) {
                    $this->$property = $data[$dbField];
		}
            }
        } else {
            $this->isNew = 1;
    	}
    }
    
    public static function exists($sku) {
        $sth = DB::getHandler()->prepare('SELECT id FROM ' . self::$dbTable . ' WHERE vm_sku = ?');
        
        if (!$sth->execute(array($sku))) {
            $errorInfo = $sth->errorInfo();
            throw new Exception('Error #' . $sth->errorCode() . ': ' . $errorInfo[2]);
        };
        
        if (!$sth->rowCount())
        	return false;
        
        return true;
    }

    public static function getIdbySku($sku) {
        $sth = DB::getHandler()->prepare('SELECT id FROM ' . self::$dbTable . ' WHERE vm_sku = ?');
        
        if (!$sth->execute(array($sku))) {
            $errorInfo = $sth->errorInfo();
            throw new Exception('Error #' . $sth->errorCode() . ': ' . $errorInfo[2]);
        };
        
        if (!$sth->rowCount())
        	return "";

	$data = $sth->fetch(PDO::FETCH_ASSOC);
	return $data['id'];
    }
 
    public function save() {
        if ($this->isNew) {
            $fields = $placeholders = $values = array();
            foreach ($this->dbRelation as $param => $field) {
                if ($this->$param === null) continue; 
            	$fields[] = $field;
                $placeholders[] = ':' . $param;
                $values[':' . $param] = $this->$param;
            }
            $stmt = 'INSERT INTO ' . self::$dbTable . ' (' . implode(', ', $fields) . ')
                     VALUES (' . implode(',', $placeholders) . ')';
            $sth = $this->dbh->prepare($stmt);
            
            if (!$sth->execute($values)) {
                $errorInfo = $sth->errorInfo();
                throw new Exception('Error #' . $sth->errorCode() . ': ' . $errorInfo[2]);
            }
            
            $this->id = $this->dbh->lastInsertId();
            $this->isNew = 0;
        } else {
        	if (count($this->_dirty) > 0) {
                if (!$this->id || intval($this->id) != $this->id)
                    throw new Exception ('Invalid ID: ' . $this->id);
                
                $fields = $values = array();
                foreach (array_keys($this->_dirty) as $param) {
                    if ($this->$param === null) continue;
                    $fields[] = $this->dbRelation[$param] . ' = :' . $param;
                    $values[':' . $param] = $this->$param;
                }
                
                $stmt = 'UPDATE ' . self::$dbTable . ' SET ' . implode(', ', $fields) . ' WHERE id = :id';
                $sth = $this->dbh->prepare($stmt);
                $values[':id'] = $this->id;
                if (!$sth->execute($values)) {
                    $errorInfo = $sth->errorInfo();
                    throw new Exception('Error #' . $sth->errorCode() . ': ' . $errorInfo[2]);
                }
            }
            $this->_dirty = array();
        }
    }

    public function delete() {
               if (!$this->id || intval($this->id) != $this->id)
                    throw new Exception ('Invalid ID: ' . $this->id);

                $stmt = 'DELETE FROM ' . self::$dbTable . ' WHERE id = :id';
                $sth = $this->dbh->prepare($stmt);
                $values[':id'] = $this->id;
                if (!$sth->execute($values)) {
                    $errorInfo = $sth->errorInfo();
                    throw new Exception('Error #' . $sth->errorCode() . ': ' . $errorInfo[2]);
                }
    }
    
    public function map($force = false) {
        if (!$this->googleSearchUrl)
            throw new Exception('Set googleSearchUrl first in order to map a product');
        
        if ($this->checked && !$force)
            throw new Exception('Use forced map to re-map already checked product');

        $scraper = new MappingScraper();
        if ($result = $scraper->scrape($this->googleSearchUrl, $this->sku)) {
            $this->setGoogleUrl($result['url']);
            if ($result['name']) {
                $this->setGoogleName($result['name']);
                $this->setReady(1);
            }
            
            if ($result['image'])
                $this->setGoogleImage($result['image']);
            
            $this->lastSync = date('Y-m-d H:i:s');
            $this->_dirty['lastSync'] = 1;
            $this->save();

            return true;
        }
        
        return false;
    }

    public function manual_map($force = false) {
        if (!$this->googleUrl)
            throw new Exception('Set googleUrl first in order to map a product');
        
        if ($this->checked && !$force)
            throw new Exception('Use forced map to re-map already checked product');
        
        $scraper = new DirectMappingScraper();
        if ($result = $scraper->scrape($this->googleUrl, $this->sku)) {
            $this->setGoogleName($result['name']);
            $this->setGoogleImage($result['image']);
            $this->setGoogleSearchUrl("");
            $this->setReady(1);

            $this->manual = 1;
            $this->lastSync = date('Y-m-d H:i:s');
            $this->_dirty['manual'] = 1;
            $this->_dirty['lastSync'] = 1;
            
            $this->save();
            return true;
        }
        
        return false;
    }
    
    public function __call($methodName, array $params) {
        $call = substr($methodName, 0, 3);
        $property = lcfirst(substr($methodName, 3));
    
        if ($call === 'get' && property_exists($this, $property)) {
            return $this->$property;
        }
        
        if ($call === 'set' && property_exists($this, $property)) {
            if (isset($this->roProperties) && in_array($property, $this->roProperties))
                throw new Exception('Property "' . $property . '" is read-only');
            
            $value = array_shift($params);
            
            if ($this->$property !== $value) {
                $this->$property = $value;
                
                $this->_dirty[$property] = 1;
                if ($property == 'checked') {
                    $this->checkedOn = date('Y-m-d H:i:s');
                }
            }
            return $this;
        }
        
        throw new Exception('Undefined method ' . $methodName);
    }
}
