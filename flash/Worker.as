package codebase.worldnow.com
{
	import codebase.worldnow.ad.IVideoAd;
	import codebase.worldnow.ad.SimpleVideoAd;
	import codebase.worldnow.ad.VideoAdHandler;
	import codebase.worldnow.reuse.General;
	import codebase.worldnow.reuse.Globals;
	import codebase.worldnow.util.DataUtil;
	import codebase.worldnow.util.MRSSVideoFeed;
	import codebase.worldnow.util.StringUtil;
	
	import flash.events.ErrorEvent;
	import flash.events.TimerEvent;
	import flash.external.*;
	import flash.utils.Timer;
	
	import mx.collections.ArrayCollection;
	import mx.core.FlexGlobals;

	public class Worker
	{
		private static var _simpleVideoAd:SimpleVideoAd;
		
		public function Worker() {}
		
////////////////////////////////////////////////////////////////////////////////////////////////////////
// ========================= CONTENT CLIP =========================
////////////////////////////////////////////////////////////////////////////////////////////////////////
		public static function GetContentClipSuccess(data:XML, misc:Object):void
		{
			trace(".. Worker.GetContentClipSuccess() {");
			var dataUtil:DataUtil = new DataUtil();
			var clipObj:Object 	= dataUtil.GetClipFromXML(data);
			if (misc.isLiveStream) clipObj.isLiveStream = true;
			if (misc.playgalleryclip != undefined) clipObj.playgalleryclip = misc.playgalleryclip;
			Observer.Notify("LOAD_CONTENT_CLIP", clipObj, false);
			Observer.Notify("NewClip", clipObj, true);
			trace(".. } // Worker.GetContentClipSuccess");
		}
		public static function GetContentClipFailure(error:ErrorEvent):void
		{
			Observer.Notify("NoMedia", {}, true);
		}
		public static function GetContentClipInvalid(misc:Object):void
		{
			Observer.Notify("INVALID_CLIP_DATA", {}, false);
		}
		
////////////////////////////////////////////////////////////////////////////////////////////////////////
// ========================= MRSS =========================
////////////////////////////////////////////////////////////////////////////////////////////////////////
		public static function GetMrssSuccess(data:XML, misc:Object):void
		{
			var mrss:MRSSVideoFeed = new MRSSVideoFeed();
			var clips:Array = mrss.GetClipsArray(data);
			var clipObj:Object = clips[0];
			if(clipObj == null) {
				Worker.GetMrssInvalid(misc);
				return;
			}		
			Observer.Notify("LOAD_CONTENT_CLIP", clipObj, false);
			Observer.Notify("NewClip", clipObj, true);
		}
		public static function GetMrssFailure(error:ErrorEvent, misc:Object):void
		{
			Observer.Notify("NoMedia", {}, true);
		}
		public static function GetMrssInvalid(misc:Object):void
		{
			Observer.Notify("INVALID_CLIP_DATA", {}, false);
		}
		
////////////////////////////////////////////////////////////////////////////////////////////////////////
// ========================= Embedded Gallery =========================
////////////////////////////////////////////////////////////////////////////////////////////////////////		
		public static function GetGallerySuccess(data:XML, misc:Object):void
		{
			var dataUtil:DataUtil = new DataUtil();
			var array:Array = dataUtil.GetClipsArrayFromXML(data, misc);
			if (misc.excludeId > 0) {
				var app:Object = FlexGlobals.topLevelApplication;
				var display:Object = app.display;
				array.unshift(display.currentContentClip);
			}
			var clipList:ArrayCollection = new ArrayCollection(array);
			Observer.Notify("ON_GALLERY_DATA", {clipList:clipList}, false);
		}
		
		public static function GetGalleryFailure(misc:Object):void
		{
			trace("Error on Gallery.getData() execution.");
		}

////////////////////////////////////////////////////////////////////////////////////////////////////////
// ========================= ADS =========================
////////////////////////////////////////////////////////////////////////////////////////////////////////
		public static function GetRedirectSuccess(data:XML, misc:Object):void
		{
			trace("GetRedirectSuccess()");
			var handler:VideoAdHandler = new VideoAdHandler();
			var ad:IVideoAd = handler.GetVideoAd(data, misc);
			trace('ad["_provider"] = ' + ad["_provider"]);
		
			// if worldnow ad
			if (ad["_provider"] == "worldnow") {
				trace("worldnow ad");
				var simpleVideoAd:SimpleVideoAd = ad as SimpleVideoAd;
				_simpleVideoAd = simpleVideoAd; 
				
				if (StringUtil.validateString(simpleVideoAd._thirdpartyassetpath) && 
					isNaN(Number(simpleVideoAd._wnclipid)) &&
					simpleVideoAd._wnclipid != "") 
				{ // isThirdPartyAsset
					trace("isThirdPartyAsset = true");
					var clipObj:Object = {
						domain : "http://" + Globals.vars.hostDomain,
						contentType : "", //adPosition
						clickUrl : simpleVideoAd._wnclickthroughurl,
						wnclickthroughurl : simpleVideoAd._wnclickthroughurl,
						isAd : true,
						isThirdPartyAd : true,						
						headline : StringUtil.clean(simpleVideoAd._thirdpartyassettitle),
						summary : "",
						mainHeadline : StringUtil.clean(simpleVideoAd._thirdpartyassettitle),
						contentSource : "4",
						graphic : "",
						thumb : "",
						HasGraphic : false,
						HasThumb : false, 
						id : "",
						domId : Globals.vars.domId,
						flvUri : unescape(simpleVideoAd._thirdpartyassetpath),
						flvBitrate : 0,
						duration : 0,
						isMilliseconds : true,
						wmvUri : "",
						wmvBitrate : 0,
						isMilliseconds  : true,
						vt : "v",
						ordinance : "0",
						beacons : simpleVideoAd._beacons
					};
					
					Observer.Notify("LOAD_AD_CLIP", clipObj, false);
				} else {
					var id:Number = Number(simpleVideoAd._wnclipid);
					var aff:Number = Number(simpleVideoAd._affiliateno);
					
					General.FetchClip(id, aff, simpleVideoAd._beacons,
						Worker.GetAdClipSuccess,
						Worker.GetAdClipFailure,
						Worker.GetAdClipFailure,
						Worker.GetAdClipInvalid);					
				}
				SetUAFCompanions(misc.adPosition, misc.adProps, misc.clipObj);
				
			// if 3rd party ad 
			} else {
				//trace("!!!!!!!!! 3rd party ad !!!!!!!!");
				ad.Init();
			}
		}
		public static function GetRedirectFailure(error:ErrorEvent, misc:Object):void
		{
			trace("GetRedirectFailure(). misc = " + misc);
			//trace("SetUAFCompanions("+misc.adPosition+", "+misc.adProps+", "+misc.clipObj+")");
			SetUAFCompanions(misc.adPosition, misc.adProps, misc.clipObj);
			Observer.Notify("NoMedia", {}, true);
		}
		public static function GetRedirectInvalid(misc:Object):void
		{
			trace("GetRedirectInvalid(). misc = " + misc);
			//trace("SetUAFCompanions("+misc.adPosition+", "+misc.adProps+", "+misc.clipObj+")");
			SetUAFCompanions(misc.adPosition, misc.adProps, misc.clipObj);
			Observer.Notify("INVALID_CLIP_DATA", {}, false);
		}	

		public static function GetAdClipSuccess(data:XML, misc:Object):void
		{
			trace(".. Worker.GetAdClipSuccess() {");
			var dataUtil:DataUtil = new DataUtil();
			var clipObj:Object 	= dataUtil.GetClipFromXML(data);
			clipObj.beacons = misc;
			clipObj.isad = true;
			clipObj.wnclickthroughurl = _simpleVideoAd._wnclickthroughurl;
			Observer.Notify("LOAD_AD_CLIP", clipObj, false);
			trace(".. } // Worker.GetAdClipSuccess");
		}
		public static function GetAdClipFailure(error:ErrorEvent, misc:Object):void
		{
			trace("> GetAdClipFailure");
			SetUAFCompanions(misc.adPosition, misc.adProps, misc.clipObj);
			Observer.Notify("NoMedia", {}, true);
		}	
		public static function GetAdClipInvalid(misc:Object):void
		{
			trace("> GetAdClipInvalid");
			SetUAFCompanions(misc.adPosition, misc.adProps, misc.clipObj);
			Observer.Notify("INVALID_CLIP_DATA", {}, false);
		}

		public static function SetUAFCompanions(adPosition:PlaybackClipTypeEnum, adProps:Object, clipObj:Object):void
		{
			trace(".. Worker.SetUAFCompanions() {");
			// UAF2 refresh companion ads
			if (Globals.vars.usePrerollMaster.toLowerCase() == "true" && adPosition == PlaybackClipTypeEnum.PLAYBACKCLIP_PRE_ROLL_AD)
			{
				// Platform ads
				ExternalInterface.call("wnVideoReloadCompanionAds", adProps, clipObj);
				// Ad Widgets
				Observer.Notify("UAFLoadCompanions", {objClip:clipObj, adProps:adProps}, true);
			}
			trace(".. } // Worker.SetUAFCompanions");
		}
	}
}