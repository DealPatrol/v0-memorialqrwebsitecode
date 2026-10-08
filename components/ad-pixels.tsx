"use client"

import Script from "next/script"
import { googleAdsSendTo, type AdConfig } from "@/lib/ad-config"

export function AdPixels({ config }: { config: AdConfig }) {
  const sendTo = googleAdsSendTo(config)
  const gtagId = config.ga4Id || config.googleAdsId
  const gtagConfig = [config.ga4Id, config.googleAdsId].filter((id): id is string => Boolean(id))

  return (
    <>
      {config.metaPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${config.metaPixelId}');fbq('track','PageView');`}
        </Script>
      ) : null}
      {gtagId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());${gtagConfig.map((id) => `gtag('config','${id}');`).join("")}window.__MQR_ADS_SEND_TO=${sendTo ? `'${sendTo}'` : "null"};`}
          </Script>
        </>
      ) : null}
      {config.pinterestTagId ? (
        <Script id="pinterest-tag" strategy="afterInteractive">
          {`!function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");t.async=!0;t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");pintrk('load','${config.pinterestTagId}');pintrk('page');`}
        </Script>
      ) : null}
    </>
  )
}
