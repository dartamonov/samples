<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet 
	version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt"
    exclude-result-prefixes="msxsl">

	<xsl:import href="../../shared/debug.xslt"/>
	<xsl:import href="../../shared/helpers.xslt"/>
	<xsl:import href="../../shared/variables.xslt"/>
	<xsl:import href="../../shared/rss/elements.xslt"/>

	<xsl:preserve-space elements=""/>
	<xsl:strip-space elements="*"/>

	<xsl:output 
   		method="text"
		encoding="utf-8"
		indent="no" 
		xmlns:wn="http://www.worldnow.com"
		xmlns:media="http://search.yahoo.com/mrss/"/>

	<xsl:template match="/">
		<!-- Callback -->
		<xsl:variable name="request" select="/DEFAULT/GENERAL/REQUEST/FULLURL"/>
		<xsl:variable name="_callbackFunction" select="substring-after($request, 'callback=')"/>
		<xsl:variable name="callbackFunction">
			<xsl:choose>
				<xsl:when test="contains($_callbackFunction, '&amp;')">
					<xsl:value-of select="substring-before($_callbackFunction, '&amp;')"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="$_callbackFunction"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="_callbackParams" select="substring-after($request, 'callbackparams=')"/>
		<xsl:variable name="callbackParams">
			<xsl:choose>
				<xsl:when test="contains($_callbackParams, '&amp;')">
					<xsl:value-of select="substring-before($_callbackParams, '&amp;')"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="$_callbackParams"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:if test="$callbackFunction != ''">
			<xsl:copy-of select="$callbackFunction"/>
			<xsl:text>(</xsl:text>
			<!-- callbackParams -->
			<xsl:if test="$callbackParams != ''">
				<xsl:text>{"callbackParams":"</xsl:text>
				<xsl:copy-of select="$callbackParams"/>
				<xsl:text>","feed":</xsl:text>
			</xsl:if>
		</xsl:if>

		<!-- Json -->
		<xsl:text>{"@attributes":{"version":"2.0"},</xsl:text>
		<xsl:apply-templates mode="channel" select="/DEFAULT/CURRENT"/>
		<xsl:text>}</xsl:text>

		<xsl:if test="$callbackFunction != ''">
			<xsl:if test="$callbackParams != ''">
				<xsl:text>}</xsl:text>
			</xsl:if>
			<xsl:text>);</xsl:text>
		</xsl:if>
	</xsl:template>

	<xsl:template mode="channel" match="/DEFAULT/CURRENT">
		<xsl:variable name="title">
			<xsl:call-template name="find-and-replace">
				<xsl:with-param name="value">
					<xsl:call-template name="title"/>
				</xsl:with-param>
				<xsl:with-param name="find">"</xsl:with-param>
				<xsl:with-param name="replace">\"</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="description">
			<xsl:call-template name="find-and-replace">
				<xsl:with-param name="value">
					<xsl:apply-templates mode="description" select="ABSTRACT"/>
				</xsl:with-param>
				<xsl:with-param name="find">"</xsl:with-param>
				<xsl:with-param name="replace">\"</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
			<xsl:text>"channel":{</xsl:text>
			<xsl:text>"title":"</xsl:text><xsl:value-of select='$title'/><xsl:text>",</xsl:text>
			<xsl:text>"link":"</xsl:text><xsl:apply-templates mode="link" select="."/><xsl:text>",</xsl:text>
			<xsl:text>"description":"</xsl:text><xsl:value-of select="$description"/><xsl:text>",</xsl:text>
			<xsl:text>"pubDate":"</xsl:text><xsl:value-of select='/DEFAULT/GENERAL/DAYDATE'/><xsl:text>",</xsl:text>
			<xsl:text>"language":"en",</xsl:text>
			<xsl:text>"item":</xsl:text>
			<xsl:choose>
				<xsl:when test="count(/DEFAULT/FEATURES/CLIP[media:group/media:content]) > 0" xmlns:media="http://search.yahoo.com/mrss/">
					<xsl:text>[</xsl:text>
					<xsl:apply-templates mode="clip" select="(.)[media:group/media:content] | /DEFAULT/FEATURES/CLIP[media:group/media:content]" xmlns:media="http://search.yahoo.com/mrss/"/>
					<xsl:text>]</xsl:text>
				</xsl:when>
				<xsl:otherwise>
					<xsl:apply-templates mode="clip" select="(.)[media:group/media:content] | /DEFAULT/FEATURES/CLIP[media:group/media:content]" xmlns:media="http://search.yahoo.com/mrss/"/>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:text>}</xsl:text>
	</xsl:template>

	<xsl:template mode="clip" match="CLIP | CURRENT">
			<xsl:variable name="title">
				<xsl:call-template name="find-and-replace">
					<xsl:with-param name="value">
						<xsl:apply-templates mode="title" select="HEADLINE"/>
					</xsl:with-param>
					<xsl:with-param name="find">"</xsl:with-param>
					<xsl:with-param name="replace">\"</xsl:with-param>
				</xsl:call-template>
			</xsl:variable>
			<xsl:variable name="description">
				<xsl:call-template name="find-and-replace">
					<xsl:with-param name="value">
						<xsl:value-of select="ABSTRACT" />
					</xsl:with-param>
					<xsl:with-param name="find">"</xsl:with-param>
					<xsl:with-param name="replace">\"</xsl:with-param>
				</xsl:call-template>
			</xsl:variable>
			<xsl:variable name="link">
				<xsl:variable name="enablesingleclippage" select="/DEFAULT/GENERAL/FEATURES/VIDEO/site/enablesingleclippage"/>
				<xsl:choose>
					<xsl:when test="$enablesingleclippage = 'True'">
						<xsl:apply-templates mode="link" select="."/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:variable name="landingPage" select="/DEFAULT/GENERAL/FEATURES/VIDEO/landingpage/flash"/>
						<xsl:variable name="combineSymbol">
							<xsl:choose>
								<xsl:when test="contains($landingPage, '?')">
									<xsl:text>&amp;</xsl:text>
								</xsl:when>
								<xsl:otherwise>
									<xsl:text>?</xsl:text>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:variable>
						<xsl:text/><xsl:value-of select="$landingPage"/><xsl:value-of select="$combineSymbol"/>clipId=<xsl:value-of select="ID"/>&amp;autostart=true<xsl:text/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>
			<xsl:variable name="duration">
				<xsl:value-of select="floor(DURATION div 1000)"/>
			</xsl:variable>
			<xsl:text>{</xsl:text>
				<xsl:text>"title":"</xsl:text><xsl:value-of select="$title"/><xsl:text>",</xsl:text>
				<xsl:text>"link":"</xsl:text><xsl:value-of select="$link"/><xsl:text>",</xsl:text>
				<xsl:text>"description":"</xsl:text><xsl:value-of select="$description"/><xsl:text>",</xsl:text>
				<xsl:text>"pubDate":"</xsl:text><xsl:value-of select="lastediteddate"/><xsl:text>",</xsl:text>
				<xsl:text>"guid":"</xsl:text><xsl:value-of select="ID" /><xsl:text>",</xsl:text>
				<xsl:text>"wn-contentclassification":"</xsl:text><xsl:value-of select="TARGETADSTAG"/><xsl:text>",</xsl:text>
				<xsl:text>"wn-ads":{</xsl:text>
				<xsl:apply-templates mode="ads" select="(.)/ADS/AD"/>
				<xsl:text>},</xsl:text>
				<xsl:text>"wn-taxonomy":{</xsl:text>
				<xsl:apply-templates mode="taxonomy" select="TAXONOMY"/>
				<xsl:text>},</xsl:text>
				<xsl:text>"media-group":{</xsl:text>
					<xsl:text>"media-title":"</xsl:text><xsl:value-of select="$title" /><xsl:text>",</xsl:text>
					<xsl:text>"media-description":"</xsl:text><xsl:value-of select="$description" /><xsl:text>",</xsl:text>
					<xsl:text>"media-content":[</xsl:text>
					<xsl:apply-templates mode="media" select="(.)/media:group/media:content[@type = 'video/mp4']" xmlns:media="http://search.yahoo.com/mrss/">
						<xsl:sort select="@bitrate" data-type="number" order="descending" xmlns:media="http://search.yahoo.com/mrss/"/>
						<xsl:with-param name="duration" select="$duration"/>
					</xsl:apply-templates>
					<xsl:if test="(.)/media:group/media:content[@type = 'video/mp4']" xmlns:media="http://search.yahoo.com/mrss/"><xsl:text>,</xsl:text></xsl:if>
					<xsl:apply-templates mode="media" select="(.)/media:group/media:content[@type != 'video/mp4']" xmlns:media="http://search.yahoo.com/mrss/">
						<xsl:sort select="@bitrate" data-type="number" order="descending" xmlns:media="http://search.yahoo.com/mrss/"/>
						<xsl:with-param name="duration" select="$duration"/>
					</xsl:apply-templates>
					<xsl:text>],</xsl:text>
					<xsl:text>"media-subTitle":[</xsl:text>
						<xsl:variable name="ttml-base-utl">
							<xsl:choose>
								<xsl:when test="$g-feature-owner != $g-client-name">
									<xsl:call-template name="find-and-replace">
										<xsl:with-param name="value"><xsl:apply-templates mode="lowercase" select="$g-image-domain"/></xsl:with-param>
										<xsl:with-param name="find"><xsl:value-of select="$g-client-name"/></xsl:with-param>
										<xsl:with-param name="replace"><xsl:apply-templates mode="lowercase" select="$g-feature-owner"/></xsl:with-param>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="$g-image-domain"/>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:variable>
	                        		<xsl:text>{</xsl:text>
                            				<xsl:text>"@attributes":{</xsl:text>
                            				<xsl:text>"type":"application/ttml+xml",</xsl:text>
                            				<xsl:text>"lang":"en-us",</xsl:text>
                            				<xsl:text>"href":"</xsl:text><xsl:value-of select="concat($ttml-base-utl,'/metadata/', ID, '.ttml')"/><xsl:text>"</xsl:text>
                       				<xsl:text>}</xsl:text>
               				<xsl:text>}</xsl:text>
		                        <!--,
		                        {
		                            "@attributes" : {
		                            "type" : "application/ttml+xml",
		                            "lang" : "de",
		                            "href" : "German_track.xml"
		                            }
		                        }-->
					<xsl:text>],</xsl:text>
					<xsl:text>"media-embed":{</xsl:text>
						<xsl:text>"@attributes":{</xsl:text>
							<xsl:text>"url":"</xsl:text><xsl:value-of select="$link"/><xsl:text>",</xsl:text>
							<xsl:text>"width":"</xsl:text><xsl:value-of select="@width"/><xsl:text>",</xsl:text>
							<xsl:text>"height":"</xsl:text><xsl:value-of select="@height"/><xsl:text>"</xsl:text>
						<xsl:text>},</xsl:text>
						<xsl:text>"media-param":{</xsl:text>
							<xsl:text>"@attributes":{</xsl:text>
								<xsl:text>"name":"type"</xsl:text>
							<xsl:text>},</xsl:text>
							<xsl:text>"#text":"text/javascript"</xsl:text>
						<xsl:text>}</xsl:text>
					<xsl:text>},</xsl:text>
					<xsl:text>"media-thumbnail":{</xsl:text>
						<xsl:text>"@attributes":{</xsl:text>
							<xsl:text>"url":"</xsl:text><xsl:value-of select="ABSTRACTIMAGE/FILENAME" /><xsl:text>",</xsl:text>
							<xsl:text>"width":"",</xsl:text>
							<xsl:text>"height":""</xsl:text>
						<xsl:text>}</xsl:text>
					<xsl:text>}</xsl:text>
				<xsl:text>}</xsl:text>
			<xsl:text>}</xsl:text>
			<xsl:if test="position() != last()"><xsl:text>,</xsl:text></xsl:if>
	</xsl:template>

	<xsl:template mode="ads" match="ADS/AD">
		<xsl:text>"</xsl:text><xsl:value-of select="@SZ"/><xsl:text>":{</xsl:text>
			<xsl:text>"owner":"</xsl:text><xsl:value-of select="OWNER"/><xsl:text>",</xsl:text>
			<xsl:text>"splitpct":"</xsl:text><xsl:value-of select="SPLITPCT"/><xsl:text>",</xsl:text>
			<xsl:text>"show":"</xsl:text><xsl:value-of select="SHOW"/><xsl:text>"</xsl:text>
		<xsl:text>}</xsl:text>
		<xsl:if test="position() != last()"><xsl:text>,</xsl:text></xsl:if>
	</xsl:template>

	<xsl:template mode="media" match="media:content" xmlns:media="http://search.yahoo.com/mrss/">
		<xsl:param name="duration"/>
		<xsl:variable name="video_url">
			<xsl:call-template name="decode">
				<xsl:with-param name="str"><xsl:value-of select="@url"/></xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:text>{</xsl:text>
			<xsl:text>"@attributes":{</xsl:text>
				<xsl:text>"url":"</xsl:text><xsl:value-of select="$video_url"/><xsl:text>",</xsl:text>
				<xsl:text>"type":"</xsl:text><xsl:value-of select="@type"/><xsl:text>",</xsl:text>
				<xsl:text>"medium":"video",</xsl:text>
				<xsl:text>"filesize":"</xsl:text><xsl:value-of select="@filesize"/><xsl:text>",</xsl:text>
				<xsl:text>"bitratebits":"</xsl:text><xsl:value-of select="@bitratebits"/><xsl:text>",</xsl:text>
				<xsl:text>"bitrate":"</xsl:text><xsl:value-of select="@bitrate"/><xsl:text>",</xsl:text>
				<xsl:text>"bitratebits":"</xsl:text><xsl:value-of select="@bitratebits"/><xsl:text>",</xsl:text>
				<xsl:text>"width":"</xsl:text><xsl:value-of select="@width"/><xsl:text>",</xsl:text>
				<xsl:text>"height":"</xsl:text><xsl:value-of select="@height"/><xsl:text>",</xsl:text>
				<xsl:text>"duration":"</xsl:text><xsl:value-of select="$duration" /><xsl:text>"</xsl:text>
			<xsl:text>}</xsl:text>
		<xsl:text>}</xsl:text>
		<xsl:if test="position() != last()"><xsl:text>,</xsl:text></xsl:if>
	</xsl:template>

	<xsl:template mode="taxonomy" match="TAXONOMY">
		<xsl:text>"level1":"</xsl:text>
		<xsl:call-template name="find-and-replace">
			<xsl:with-param name="value">
				<xsl:value-of select="./LEVEL1/NAME"/>
			</xsl:with-param>
			<xsl:with-param name="find">"</xsl:with-param>
			<xsl:with-param name="replace">\"</xsl:with-param>
		</xsl:call-template>
                <xsl:text>",</xsl:text>
		<xsl:text>"level2":"</xsl:text>
		<xsl:call-template name="find-and-replace">
			<xsl:with-param name="value">
				<xsl:value-of select="./LEVEL2/NAME"/>
			</xsl:with-param>
			<xsl:with-param name="find">"</xsl:with-param>
			<xsl:with-param name="replace">\"</xsl:with-param>
		</xsl:call-template>
                <xsl:text>",</xsl:text>
		<xsl:text>"level3":"</xsl:text>
		<xsl:call-template name="find-and-replace">
			<xsl:with-param name="value">
				<xsl:value-of select="./LEVEL3/NAME"/>
			</xsl:with-param>
			<xsl:with-param name="find">"</xsl:with-param>
			<xsl:with-param name="replace">\"</xsl:with-param>
		</xsl:call-template>
                <xsl:text>"</xsl:text>
	</xsl:template>
</xsl:stylesheet>