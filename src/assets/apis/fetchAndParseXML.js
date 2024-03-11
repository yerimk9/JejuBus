export default async function fetchAndParseXML(PROXY_URL, API_URL) {
  const response = await fetch(`${PROXY_URL}${API_URL}`);

  if (!response.ok) {
    throw new Error(`서버 응답 오류 : ${response.status}`);
  }

  const xmlText = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");

  return xmlDoc;
}
