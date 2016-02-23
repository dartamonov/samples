package codebase.worldnow.ad
{
	import codebase.worldnow.com.Observer;
	import codebase.worldnow.util.StringUtil;
	import codebase.worldnow.reuse.General;
	import codebase.worldnow.reuse.Globals;
	import mx.core.FlexGlobals;
	
	import com.google.ads.ima.api.AdError;
	import com.google.ads.ima.api.AdErrorCodes;
	import com.google.ads.ima.api.AdErrorEvent;
	import com.google.ads.ima.api.AdsRenderingSettings;
	import com.google.ads.ima.api.AdsManagerLoadedEvent;
	import com.google.ads.ima.api.CustomContentLoadedEvent;
	import com.google.ads.ima.api.AdsLoader;
	import com.google.ads.ima.api.AdsManager;
	import com.google.ads.ima.api.AdsRequest;
	

	public class AdsLoader_v3
	{
		private static var app:Object = FlexGlobals.topLevelApplication;
		
		public function AdsLoader_v3()
		{
			
		}
		
		public static function FetchAdXMLData(url:String, callbackMiscObj:Object,
											  callbackComplete:Function,
											  callbackSecurityError:Function,
											  callbackIoError:Function,
											  callbackInvalidData:Function):void 
		{
			if(!StringUtil.validateString(url)) {
				callbackInvalidData(callbackMiscObj);
				return;
			}
			trace(" Ad url: " + url);
			trace("Disable Google IMA SDK Ad Call Overwrite: "+ StringUtil.stringToBoolean(Globals.vars.disableGoogleSDKAdCallOverwrite));
			
			var request:AdsRequest = new AdsRequest();
			request.linearAdSlotWidth = app.width;
			request.linearAdSlotHeight = app.height - app._controlBarHeight;
			request.nonLinearAdSlotWidth = app.width;
			request.nonLinearAdSlotHeight = app.height - app._controlBarHeight;
			
			if (StringUtil.stringToBoolean(Globals.vars.disableGoogleSDKAdCallOverwrite) && 
				url.indexOf("ad.doubleclick.net") > -1 && 
				url.indexOf("ad.doubleclick.net/pfadx") < 0 && !callbackMiscObj.isWNVASTRedirect)
			{
				trace("Custom overwrite is not supported any more");
			} else {
				request.adTagUrl = url;
			}
			
			// Prepare the ads loader 
			var adsLoader:AdsLoader = new AdsLoader();
			adsLoader.loadSdk();
			// Add event handlers
			adsLoader.addEventListener(AdsManagerLoadedEvent.ADS_MANAGER_LOADED, onAdsManagerLoaded); // ads are successfully returned
			adsLoader.addEventListener(AdErrorEvent.AD_ERROR, onAdError); // no ads were found for the request
			adsLoader.addEventListener(CustomContentLoadedEvent.CUSTOM_CONTENT_LOADED, onCustomContentLoadedEvent);
			// Request the ads
			adsLoader.requestAds(request, {
				callbackMiscObj:callbackMiscObj,
				callbackComplete:callbackComplete,
				callbackSecurityError:callbackSecurityError,
				callbackIoError:callbackIoError,
				callbackInvalidData:callbackInvalidData
			});
		}
		
		private static function onAdsManagerLoaded(e:AdsManagerLoadedEvent):void
		{
			// Publishers can modify the default preferences through this object.
			var adsRenderingSettings:AdsRenderingSettings = new AdsRenderingSettings();
			// In order to support ad rules playlists, ads manager requires an object that
			// provides current playhead position for the content.
			var contentPlayhead:Object = {};
			contentPlayhead.time = function():Number {
				return app.display._currentTime * 1000;
			};
			// Alternatively, when adRenderingSettings.autoAlign is false, all ads are positioned in the top left (0,0) corner of the adsContainer.
			adsRenderingSettings.autoAlign = false;
			// Maximum bitrate in Kbps. Is not required as maximum limit, but must be specified in order for highest bitrate to be picked by a player
			adsRenderingSettings.bitrate = 10000;
			// Get a reference to the AdsManager object through the event object.
			var adsManager:AdsManager = e.getAdsManager(contentPlayhead, adsRenderingSettings);
			var adContext:Object = e.userRequestContext;
			app.adContainer_v3.ProcessAd(adsManager, adContext.callbackMiscObj);
		}
		
		private static function onCustomContentLoadedEvent(e:CustomContentLoadedEvent):void
		{
			trace("Loaded ad XML isn't VAST. Parsing it as WN xml.");
			trace("XML: " + e.content);
			var adContext:Object = e.userRequestContext;
			General.fetchXml(e.content,
				adContext.callbackMiscObj,
				adContext.callbackComplete,
				adContext.callbackInvalidData);
		}
		
		private static function onAdError(adErrorEvent:AdErrorEvent):void
		{
			/*
			Error codes - https://developers.google.com/interactive-media-ads/docs/sdks/googleflashas3_apis#AdError
			*/
			var adError:AdError = adErrorEvent.error;
			var adContext:Object = adErrorEvent.userRequestContext;
			trace("General.onAdError(): " + adError.errorMessage);
			if (adError.innerError != null) {
				trace("Caused by: " + adError.innerError.message);
			}
			if (adErrorEvent.error.errorCode == 0) {
				General.fetchXml("<NO DATA/>",
					adContext.callbackMiscObj,
					adContext.callbackComplete,
					adContext.callbackInvalidData);
			} else {
				trace("Unsupported error code: " + adErrorEvent.error.errorCode);
				adContext.callbackInvalidData(adContext.callbackMiscObj);
			}
		}
		
	}
}