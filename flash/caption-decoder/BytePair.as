package codebase.worldnow.util.caption 
{
    internal final class BytePair extends Object
    {
		private var _bytePairField:uint;
		private var _firstByteWithParity:uint;
		private var _secondByteWithParity:uint;
		
        public function BytePair(field:int, firstByteWithParity:uint, secondByteWithParity:uint) {
            super();
            this._bytePairField = field;
            this._firstByteWithParity = firstByteWithParity;
            this._secondByteWithParity = secondByteWithParity;
        }

        public function get firstByteWithParity():uint {
            return this._firstByteWithParity;
        }

        public function get secondByteWithParity():uint {
            return this._secondByteWithParity;
        }
		
        public function get firstByte():uint {
            return 127 & this._firstByteWithParity;
        }

        public function get secondByte():uint {
            return 127 & this._secondByteWithParity;
        }

        public function get firstByteIsOddParity():Boolean {
            return isOddParity(this._firstByteWithParity);
        }

        public function get secondByteIsOddParity():Boolean {
            return isOddParity(this._secondByteWithParity);
        }
		
		public function get field():int {
			return this._bytePairField;
		}

        public function toString():String {
			// Using bytes with parity doesn't seem to be right. It requires -128 correction for ascii codes. 
			// Using bytes without parity instead.
			var firstByteHex:String = (firstByte / 16).toString(16) + "" + (firstByte % 16).toString(16);
			var secondByteHex:String = (secondByte / 16).toString(16) + "" + (secondByte % 16).toString(16);
            return "[" + firstByteHex + "," + secondByteHex + "," + _bytePairField + "]";
        }

        static function isOddParity(byte:uint):Boolean {
            var bit:uint = 0;
            while (byte) {
                if (byte & 1) {
                    ++bit;
                }
				byte = byte >> 1;
            }
            return bit % 2 == 1;
        }
    }
}
