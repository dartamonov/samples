package codebase.worldnow.util.caption 
{
    import codebase.worldnow.com.Observer;
    //import codebase.worldnow.util.caption.WNLog;
    
    import flash.errors.*;
    import flash.events.*;
    import flash.utils.*;
    
    import mx.utils.Base64Decoder;
    
    import org.osmf.captioning.model.Caption;
    
    public final class Decoder extends flash.events.EventDispatcher
    {
		public var decodedString:String = "";
		private static const LINE_BREAK:String = "LINE_BREAK";
		private var buffer:String = "";
		private var no_line_break_counter:uint = 0;
		
        public function Decoder() {
            super();
        }

		public function decode(captionDataBase64:String):void
		{
			var base64Bytes:flash.utils.ByteArray;
			var ccBytesArray:flash.utils.IDataInput;
			var allCaptions:Array;
			var captionBytes:flash.utils.ByteArray;
			var byteArrayLength:uint = 0;
			var resultStr:String = "";
			
			// 1. Decode raw 608 data (base64 encoded) to byte array 
			try {
				var base64Dec:Base64Decoder = new Base64Decoder();
				base64Dec.decode(captionDataBase64);
				base64Bytes = base64Dec.toByteArray();
			} catch (e:Error) {
				trace("Error on getting base64 data. " + e);
			}
			base64Bytes.position = 0;
			ccBytesArray = base64Bytes;
			
			// 2. Decode byte array to string
			try 
			{
				allCaptions = [];
				while (ccBytesArray.bytesAvailable > 0) 
				{
					byteArrayLength = ccBytesArray.readUnsignedInt(); /* Reads first 4 bytes (unsigned integer) as length of the rest of the bytes array.*/ 
					captionBytes = new flash.utils.ByteArray();
					ccBytesArray.readBytes(captionBytes, 0, byteArrayLength); /* reads (byteArrayLength - 4) bytes to the captionBytes bytes array */ 
					allCaptions.push(captionBytes);
				}
				allCaptions.reverse();

				for each (captionBytes in allCaptions) {
					resultStr += decode608Data(captionBytes); /* decode (byteArrayLength - 4) bytes */
				}
			}
			catch (e:flash.errors.EOFError) {
				trace("Error on CC decoding. " + e);
			}
			
			// 3. Decoding complete. If result string is ready, pass it to the UI  
			if (resultStr.indexOf(LINE_BREAK) > -1) {
				var resultArr:Array = resultStr.split(LINE_BREAK);
				for (var i:int = 0; i < resultArr.length -1; i++) {
					buffer += resultArr[i];
					decodedString = buffer;
					buffer = "";
					if (decodedString != "") {
						dispatchEvent(new Event("STRING_DECODED"));					
					}
				}
				buffer += resultArr[resultArr.length -1];

			} else if (resultStr != "") {
				buffer += resultStr;
			}
		}
		
		public function decode608Data(byteArray:flash.utils.ByteArray):String {
			var result:String = "";
			var ccBytesArray:flash.utils.IDataInput;
			var extraBytes:flash.utils.ByteArray;
            var isValid:Boolean;
			var stopDecode:Boolean;
			var byte:uint;
			var bytesAvailable:uint;
			var i:uint;
			var bytePairField:int;
			var captionType:int;
            var captionByte1:uint;
            var captionByte2:uint;

            byte = 0;
            stopDecode = false;
            bytesAvailable = 0;
            i = 0;
            isValid = false;
            captionType = 0;
            captionByte1 = 0;
            captionByte2 = 0;
            bytePairField = 0;
            extraBytes = null;
			ccBytesArray = byteArray;

            try {
                do {
                    byte = ccBytesArray.readUnsignedByte(); /* Reads first byte as number */
                    stopDecode = !((64 & byte) == 0);
                    if (!stopDecode) {
                        break;
                    }
                    bytesAvailable = 31 & byte;
                    ccBytesArray.readByte();
                    if (ccBytesArray.bytesAvailable < bytesAvailable * 3) {
                        break;
                    }
                    i = 0;
                    while (i < bytesAvailable) {
                        byte = ccBytesArray.readUnsignedByte();
                        isValid = !((4 & byte) == 0);
                        captionType = 3 & byte;
                        captionByte1 = ccBytesArray.readUnsignedByte();
                        captionByte2 = ccBytesArray.readUnsignedByte();
                        if (isValid) {
                            if (captionType != 0) {
                                if (captionType != 1) {
                                    break;
                                } else {
                                    bytePairField = 2;
                                }
                            } else {
                                bytePairField = 1;
                            }
							result += decodeBytePair(new BytePair(bytePairField, captionByte1, captionByte2));
                        }
                        ++i;
                    }
                }
                while (false);
                if (ccBytesArray.bytesAvailable) {
                    extraBytes = new flash.utils.ByteArray();
                    ccBytesArray.readBytes(extraBytes, 0, 0);
                }
            }
            catch (e:flash.errors.EOFError) {
				trace("Error on CC decoding. " + e);
            }
			return result;
        }

        private function decodeBytePair(bytePair:BytePair):String {
			if (bytePair.field != 1) {
                return "";
            }
			var result:String = bytePairToString(bytePair);
			return result;
        }
	
		private function bytePairToString(bytePair:BytePair):String
		{
			var result:String = "";
			var byteHexStr1:String = (bytePair.firstByte / 16).toString(16) + "" + (bytePair.firstByte % 16).toString(16);
			var byteHexStr2:String = (bytePair.secondByte / 16).toString(16) + "" + (bytePair.secondByte % 16).toString(16);
			var asciiCode1:int = bytePair.firstByte;
			var asciiCode2:int = bytePair.secondByte;
			
			if (asciiCode1 > 31 && asciiCode1 < 128) { // hex from 20 to 7F 
				result = String.fromCharCode(asciiCode1) + String.fromCharCode(asciiCode2);
			} else { 
			// control codes [are normally transmitted twice in succession to help insure correct reception of the control instructions]
			/* Full list of codes - 15.119 - http://www.gpo.gov/fdsys/pkg/CFR-2007-title47-vol1/pdf/CFR-2007-title47-vol1-sec15-119.pdf */
				if (asciiCode1 == 20) { // hex == 14
					// Command codes (int; hex)
					/*
					37; 25 - Roll-Up Captions–2 Rows
					38; 26 - Roll-Up Captions–3 Rows
					39; 27 - Roll-Up Captions–4 Rows
					29; 41 - Resume Direct Captioning
					43; 2b - Resume Text Display
					44; 2c - Erase Displayed Memory
					45; 2d = Carriage Return
					47; 2f - End of Caption
					
					34; 22 - Reserved (formerly Alarm Off) |
					35; 23 - Reserved (formerly Alarm On)  > looks like these two are used as linebreaks in commercials
					70; 112 - ? commercial linebreak
					*/
					//if (asciiCode2 == 34 || asciiCode2 == 35 ||
					if (asciiCode2 == 112 ||
						asciiCode2 == 37 || asciiCode2 == 38 || asciiCode2 == 39)
					{
						result = LINE_BREAK;
						no_line_break_counter = 0;
					}
					if (asciiCode2 == 44) {
						result = " " + LINE_BREAK;
					}
				} else if (buffer != "" && asciiCode1 == 0 && asciiCode2 == 0){
					no_line_break_counter++;
					if (no_line_break_counter > 100) {
						no_line_break_counter = 0;
						result = LINE_BREAK;
					}
				}/* else if (asciiCode1 == 17) { // hex == 11
					// MID-ROW CODES - Colors and styles	
				} else if (asciiCode1 == 23) { // hex == 17
					// MISCELLANEOUS CONTROL CODES - Tab offset
				}*/ 
			}
			return result;
		}
    }
}
