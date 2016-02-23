package codebase.worldnow.reuse
{
	import codebase.worldnow.com.Observer;
	import codebase.worldnow.util.StringUtil;
	import codebase.worldnow.util.WNHttpLoader;
	import com.google.ads.ima.api.AdError;
	import com.google.ads.ima.api.AdErrorCodes;
	import com.google.ads.ima.api.AdErrorEvent;
	import com.google.ads.ima.api.AdsRenderingSettings;
	import com.google.ads.ima.api.AdsManagerLoadedEvent;
	import com.google.ads.ima.api.CustomContentLoadedEvent;
	import com.google.ads.ima.api.AdsLoader;
	import com.google.ads.ima.api.AdsManager;
	import com.google.ads.ima.api.AdsRequest;

	import flash.display.Loader;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.SecurityErrorEvent;
	import flash.external.*;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.net.URLRequestMethod;
	
	import memorphic.xpath.XPathQuery;
	import mx.core.FlexGlobals;
	
	import org.osmf.elements.ProxyElement;
	import org.osmf.elements.SerialElement;
	import org.osmf.events.LoaderEvent;
	import org.osmf.media.DefaultMediaFactory;
	import org.osmf.media.MediaElement;
	import org.osmf.media.URLResource;
	import org.osmf.traits.LoadState;
	import org.osmf.utils.HTTPLoader;


		
	public class General
	{
		public static const MAX_NUMBER_REDIRECTS:int = 5;
		private static var serialElement:SerialElement = new SerialElement();
		private static var playInMediaPlayer:MediaElement = null;
		private static var app:Object = FlexGlobals.topLevelApplication;
		
		public function General()
		{
			
		}
		
		public static function fetchXml(data:String, 
										 callbackMiscObj:Object,
										 callbackComplete:Function,
										 callbackInvalidData:Function):void {
			trace("fetchXml(). XML: " + data);
			if(data == "<NO DATA/>") {
				trace("Event.COMPLETE BUT NO DATA");
				callbackInvalidData(callbackMiscObj);
				return;
			}
			try {
				var xmlData:XML = new XML(data);
				callbackComplete(xmlData, callbackMiscObj);
			}
			catch(err:Error){
				trace("Event.COMPLETE BUT INVALID XML");
				trace(err);
				trace(data);
				callbackInvalidData(callbackMiscObj);	
			}
		}
		
		public static function FetchXmlData(url:String, callbackMiscObj:Object,
											callbackComplete:Function,
											callbackSecurityError:Function,
											callbackIoError:Function,
											callbackInvalidData:Function):void 
		{
			trace(".. General.FetchXmlData() {");
			if(!StringUtil.validateString(url)) {
				callbackInvalidData(callbackMiscObj);
				return;
			}
			trace(" Url: " + url);
			var request:URLRequest = new URLRequest();
			request.method = URLRequestMethod.POST;
			request.contentType = "application/xml";
			request.url = url;
			var xmlLoader:URLLoader = new URLLoader();
			xmlLoader.load(request);
			
			xmlLoader.addEventListener(Event.COMPLETE, function(e:Event):void
			{	
				if(e.currentTarget.data == "<NO DATA/>") {
					trace("Event.COMPLETE BUT NO DATA");
					callbackInvalidData(callbackMiscObj);
					return;
				}
				try {
					var xmlData:XML = new XML(e.currentTarget.data);
					callbackComplete(xmlData, callbackMiscObj);
				}
				catch(err:Error){
					trace("Event.COMPLETE BUT INVALID XML");
					trace(err);
					trace(e.currentTarget.data);
					callbackInvalidData(callbackMiscObj);	
				}
			});
			xmlLoader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, function(e:SecurityErrorEvent):void
			{
				trace("SecurityErrorEvent.SECURITY_ERROR");
				callbackSecurityError(e);
			});
			xmlLoader.addEventListener(IOErrorEvent.IO_ERROR, function(e:IOErrorEvent):void
			{
				trace("IOErrorEvent.IO_ERROR");
				callbackIoError(e);
			});
			trace(".. } // General.FetchXmlData()");
		}
		
		public static function FetchClip(clipId:Number, affiliateNumber:Number, callbackMiscObj:Object,
											callbackComplete:Function,
											callbackSecurityError:Function,
											callbackIoError:Function,
											callbackInvalidData:Function):void
		{
			trace(".. General.FetchClip() {");
			var rndNum:Number = Helper.GetRandomNumber();
			var path:String = Globals.buildPath + "?buildtype=buildfeaturexmlrequest&featureType=Clip&featureid=" + clipId + "&affiliateno=" + affiliateNumber + "&clientgroupid=1&rnd=" + rndNum;
			
			General.FetchXmlData(path, callbackMiscObj,
								callbackComplete,
								callbackSecurityError,
								callbackIoError,
								callbackInvalidData);
			trace(".. } //General.FetchClip()");
		}
		
		public static function BlankRequest(url:String):void
		{
			var loader:Loader = new Loader();
			loader.contentLoaderInfo.addEventListener(Event.COMPLETE, function(e:Event):void {
				trace("++++++++++++++ BlankRequest - Event.COMPLETE");
			});
			loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, function(e:Event):void {
				trace("++++++++++++++ BlankRequest - IOErrorEvent.IO_ERROR");
			});
			loader.load(new URLRequest(url));
		}
		
		public static function FetchGallery(galleryId:Number, affiliateNumber:Number, callbackMiscObj:Object,
										 callbackComplete:Function,
										 callbackError:Function):void
		{
			trace(".. General.FetchGallery() {");
			var rndNum:Number = Helper.GetRandomNumber();
			var categoryXMLPath:String = "";
			if (isNaN(galleryId) == false && galleryId > 0) {
				if (callbackMiscObj.isStory) {
					// story by id
					categoryXMLPath = Globals.buildPath + "?buildtype=buildpagexmlrequest&featureType=S&featureid=" + galleryId + "&affiliateno=" + affiliateNumber + "&clientgroupid=1&rnd=" + rndNum;
				} else {
					// category by id
					categoryXMLPath = Globals.buildPath + "?buildtype=buildpagexmlrequest&featureType=C&featureid=" + galleryId + "&affiliateno=" + affiliateNumber + "&clientgroupid=1&rnd=" + rndNum;
				}
			} else if (!callbackMiscObj.isStory) {
				// default top category 
				categoryXMLPath = Globals.buildPath + "?buildtype=buildpagexmlrequest&cliengroupid=1&root=pop_video_top&affiliateno=" + affiliateNumber + "&rnd=" + rndNum;
			}

			if (categoryXMLPath != "") General.FetchGalleryXml(categoryXMLPath, callbackMiscObj,
				callbackComplete,
				callbackError);
			trace(".. } //General.FetchGallery()");
		}
		
		public static function FetchGalleryXml(url:String, callbackMiscObj:Object,
											callbackComplete:Function,
											callbackError:Function):void 
		{
			trace(".. General.FetchGalleryXml() {");
			if(!StringUtil.validateString(url)) {
				trace("Error: invalid url")
				callbackError(callbackMiscObj);
				return;
			}
			trace(" Url: " + url);
			var request:URLRequest = new URLRequest();
			request.method = URLRequestMethod.POST;
			request.contentType = "application/xml";
			request.url = url;
			var xmlLoader:URLLoader = new URLLoader();
			xmlLoader.load(request);
			
			xmlLoader.addEventListener(Event.COMPLETE, function(e:Event):void
			{	
				if(e.currentTarget.data == "<NO DATA/>") {
					trace("embeddedGallery - Event.COMPLETE BUT NO DATA");
					callbackError(callbackMiscObj);
					return;
				}
				try {
					var xmlData:XML = new XML(e.currentTarget.data);
					callbackComplete(xmlData, callbackMiscObj);
				}
				catch(err:Error){
					trace("embeddedGallery - Event.COMPLETE BUT INVALID XML");
					trace(err);
					trace(e.currentTarget.data);
					callbackError(callbackMiscObj);	
				}
			});
			xmlLoader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, function(e:SecurityErrorEvent):void
			{
				trace("embeddedGallery - SecurityErrorEvent.SECURITY_ERROR");
				callbackError(e);
			});
			xmlLoader.addEventListener(IOErrorEvent.IO_ERROR, function(e:IOErrorEvent):void
			{
				trace("embeddedGallery - IOErrorEvent.IO_ERROR");
				callbackError(e);
			});
			trace(".. } // General.FetchGalleryXml()");
		}
	}
}