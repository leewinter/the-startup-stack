import{z as m}from"./index-BgCZZJbK.js";import{c as f,b as d}from"./components-Bhby6F3L.js";function k(e){function c(t,n){const a=e[n];if(!a)throw new Error(`Unknown client hint: ${typeof n=="string"?n:"Unknown"}`);const s=t.split(";").map(i=>i.trim()).find(i=>i.startsWith(a.cookieName+"="))?.split("=")[1];return s?decodeURIComponent(s):null}function o(t){const n=typeof document<"u"?document.cookie:typeof t<"u"?t.headers.get("Cookie")??"":"";return Object.entries(e).reduce((a,[s,i])=>{const u=s;return"transform"in i?a[u]=i.transform(c(n,u)??i.fallback):a[u]=c(n,u)??i.fallback,a},{})}function r(){return`
// This block of code allows us to check if the client hints have changed and
// force a reload of the page with updated hints if they have so you don't get
// a flash of incorrect content.
function checkClientHints() {
	if (!navigator.cookieEnabled) return;

	// set a short-lived cookie to make sure we can set cookies
	document.cookie = "canSetCookies=1; Max-Age=60; SameSite=Lax";
	const canSetCookies = document.cookie.includes("canSetCookies=1");
	document.cookie = "canSetCookies=; Max-Age=-1; path=/";
	if (!canSetCookies) return;

	const cookies = document.cookie.split(';').map(c => c.trim()).reduce((acc, cur) => {
		const [key, value] = cur.split('=');
		acc[key] = value;
		return acc;
	}, {});

	let cookieChanged = false;
	const hints = [
	${Object.values(e).map(t=>{const n=JSON.stringify(t.cookieName);return`{ name: ${n}, actual: String(${t.getValueCode}), value: cookies[${n}] != null ? cookies[${n}] : encodeURIComponent("${t.fallback}") }`}).join(`,
`)}
	];
	for (const hint of hints) {
		document.cookie = encodeURIComponent(hint.name) + '=' + encodeURIComponent(hint.actual) + '; Max-Age=31536000; path=/';
		if (decodeURIComponent(hint.value) !== hint.actual) {
			cookieChanged = true;
		}
	}
	if (cookieChanged) window.location.reload();
}

checkClientHints();
`}return{getHints:o,getClientHintCheckScript:r}}const h={cookieName:"CH-prefers-color-scheme",getValueCode:"window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'",fallback:"light",transform(e){return e==="dark"?"dark":"light"}};function S(e,c=h.cookieName){const o=window.matchMedia("(prefers-color-scheme: dark)");function r(){const t=o.matches?"dark":"light";document.cookie=`${c}=${t}; Max-Age=31536000; Path=/`,e(t)}return o.addEventListener("change",r),function(){o.removeEventListener("change",r)}}const g={cookieName:"CH-time-zone",getValueCode:"Intl.DateTimeFormat().resolvedOptions().timeZone",fallback:"UTC"};function l(){const e=f("root");if(!e?.requestInfo)throw new Error("No request info found in Root loader.");return e.requestInfo}const I=k({theme:h,timeZone:g});function p(){return l().hints}const C=m.object({theme:m.enum(["system","light","dark"]),redirectTo:m.string().optional()});function y(){const e=p(),c=l(),o=b();return o?o==="system"?e.theme:o:c.userPrefs.theme??e.theme}function b(){const e=d({key:"theme-fetcher"});if(e?.formData){const c=Object.fromEntries(e.formData),{theme:o}=C.parse(c);return o}}export{b as a,l as b,I as h,S as s,y as u};
